import crypto from 'crypto';
import { Mesa } from '../models/mesa.model.js';
import { Salon } from '../models/salon.model.js';

export const crearMesaService = async (numero, salonId) => {
    if (!numero || !salonId) {
        return { error: 'El número de mesa y el salón son obligatorios' };
    }

    // Verificar que el salón existe
    const salonExiste = await Salon.findById(salonId);
    if (!salonExiste) {
        return { error: 'El salón no existe' };
    }

    // Verificar que no exista una mesa con el mismo número en el mismo salón
    const mesaExistente = await Mesa.findOne({ numero, salon: salonId });
    if (mesaExistente) {
        return { error: 'Ya existe una mesa con ese número en este salón' };
    }

    // Generar un token único para el código QR
    const qr_token = crypto.randomBytes(16).toString('hex');

    const nuevaMesa = await Mesa.create({
        numero,
        salon: salonId,
        qr_token,
        estado: 'Libre'
    });

    const mesaCreada = await nuevaMesa.populate('salon');
    return { mesa: mesaCreada };
};

export const obtenerMesasPorSalonService = async (salonId) => {
    const salonExiste = await Salon.findById(salonId);
    if (!salonExiste) {
        return { error: 'El salón no existe' };
    }

    const mesas = await Mesa.find({ salon: salonId })
        .populate('salon')
        .sort({ numero: 1 });

    return { mesas };
};

export const obtenerMesaPorTokenService = async (qr_token) => {
    if (!qr_token) {
        return { error: 'Se requiere el token del código QR' };
    }

    const mesa = await Mesa.findOne({ qr_token }).populate('salon');
    if (!mesa) {
        return { error: 'El código QR es inválido o no corresponde a una mesa' };
    }

    return { mesa };
};

export const cambiarEstadoMesaService = async (mesaId, nuevoEstado) => {
    const estadosValidos = ['Libre', 'Ocupada', 'Solicitud', 'Cuenta'];
    if (!estadosValidos.includes(nuevoEstado)) {
        return { error: 'El estado ingresado no es válido' };
    }

    const mesa = await Mesa.findById(mesaId);
    if (!mesa) {
        return { error: 'La mesa no existe' };
    }

    await Mesa.updateOne({ _id: mesaId }, { estado: nuevoEstado });
    const mesaActualizada = await Mesa.findById(mesaId).populate('salon');

    return { mesa: mesaActualizada };
};

export const editarMesaService = async (id, datos) => {
    const mesa = await Mesa.findById(id);
    if (!mesa) {
        return { error: 'La mesa no existe' };
    }

    await Mesa.updateOne({ _id: id }, datos);
    const mesaEditada = await Mesa.findById(id).populate('salon');

    return { mesa: mesaEditada };
};

export const eliminarMesaService = async (mesaId) => {
    const mesa = await Mesa.findById(mesaId);
    if (!mesa) {
        return { error: 'La mesa no existe' };
    }

    await Mesa.findByIdAndDelete(mesaId);
    return { eliminado: mesa };
};
