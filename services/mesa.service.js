import crypto from 'crypto';
import { Mesa } from '../models/mesa.model.js';
import { Salon } from '../models/salon.model.js';

export const crearMesaService = async (numero, salonId) => {
  try {
    if (!numero || !salonId) {
      return { error: 'El número de mesa y el salón son obligatorios' };
    }

    const salonExiste = await Salon.findById(salonId);
    if (!salonExiste) {
      return { error: 'El salón no existe' };
    }

    const mesaExistente = await Mesa.findOne({ numero, salon: salonId });
    if (mesaExistente) {
      return { error: 'Ya existe una mesa con ese número en este salón' };
    }

    const qr_token = crypto.randomBytes(16).toString('hex');

    const nuevaMesa = await Mesa.create({
      numero,
      salon: salonId,
      qr_token,
      estado: 'Libre'
    });

    const mesaCreada = await nuevaMesa.populate('salon');
    return { mesa: mesaCreada };
  } catch (error) {
    return { error: `Error en crearMesaService: ${error.message}` };
  }
};

export const obtenerMesasPorSalonService = async (salonId) => {
  try {
    const salonExiste = await Salon.findById(salonId);
    if (!salonExiste) {
      return { error: 'El salón no existe' };
    }

    const mesas = await Mesa.find({ salon: salonId })
      .populate('salon')
      .sort({ numero: 1 });

    return { mesas };
  } catch (error) {
    return { error: `Error en obtenerMesasPorSalonService: ${error.message}` };
  }
};

export const obtenerMesaPorTokenService = async (qr_token) => {
  try {
    if (!qr_token) {
      return { error: 'Se requiere el token del código QR' };
    }

    const mesa = await Mesa.findOne({ qr_token }).populate('salon');
    if (!mesa) {
      return { error: 'El código QR es inválido o no corresponde a una mesa' };
    }

    return { mesa };
  } catch (error) {
    return { error: `Error en obtenerMesaPorTokenService: ${error.message}` };
  }
};

export const cambiarEstadoMesaService = async (mesaId, nuevoEstado) => {
  try {
    const estadosValidos = ['Libre', 'Ocupada', 'Solicitud', 'Cuenta'];
    if (!estadosValidos.includes(nuevoEstado)) {
      return { error: 'El estado ingresado no es válido' };
    }

    const mesaActualizada = await Mesa.findByIdAndUpdate(
      mesaId,
      { estado: nuevoEstado },
      { new: true }
    ).populate('salon');

    if (!mesaActualizada) {
      return { error: 'La mesa no existe' };
    }

    return { mesa: mesaActualizada };
  } catch (error) {
    return { error: `Error en cambiarEstadoMesaService: ${error.message}` };
  }
};

export const editarMesaService = async (id, datos) => {
  try {
    const mesaEditada = await Mesa.findByIdAndUpdate(
      id,
      datos,
      { new: true }
    ).populate('salon');

    if (!mesaEditada) {
      return { error: 'La mesa no existe' };
    }

    return { mesa: mesaEditada };
  } catch (error) {
    return { error: `Error en editarMesaService: ${error.message}` };
  }
};

export const eliminarMesaService = async (mesaId) => {
  try {
    const mesa = await Mesa.findByIdAndDelete(mesaId);
    if (!mesa) {
      return { error: 'La mesa no existe' };
    }

    return { eliminado: mesa };
  } catch (error) {
    return { error: `Error en eliminarMesaService: ${error.message}` };
  }
};