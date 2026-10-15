// services/mesa.service.js
import crypto from 'crypto';
import { Mesa } from '../models/mesa.model.js';
import { Salon } from '../models/salon.model.js';

/**
 * Crea N mesas asociadas a un salón, continuando la numeración GLOBAL.
 */
export const crearMesasMasivasService = async (cantidad, salonId) => {
  try {
    const numMesas = Number(cantidad);
    if (!numMesas || numMesas <= 0) {
      return { error: 'La cantidad de mesas debe ser un número mayor a 0' };
    }

    if (!salonId) {
      return { error: 'El ID del salón es obligatorio' };
    }

    const salonExiste = await Salon.findById(salonId);
    if (!salonExiste) {
      return { error: 'El salón especificado no existe' };
    }

    // Buscar el número de mesa más alto registrado EN TODO EL RESTAURANTE
    const ultimaMesa = await Mesa.findOne().sort({ numero: -1 }).select('numero');
    const ultimoNumero = ultimaMesa ? ultimaMesa.numero : 0;

    const nuevasMesas = [];
    for (let i = 1; i <= numMesas; i++) {
      nuevasMesas.push({
        numero: ultimoNumero + i, // Continúa correlativamente global (ej: 1, 2, 3...)
        salon: salonId,
        qr_token: crypto.randomBytes(16).toString('hex'),
        estado: 'Libre'
      });
    }

    // Inserción masiva optimizada
    const mesasCreadas = await Mesa.insertMany(nuevasMesas);

    return {
      mensaje: `Se crearon ${mesasCreadas.length} mesas exitosamente en ${salonExiste.nombre}.`,
      mesas: mesasCreadas
    };
  } catch (error) {
    if (error.code === 11000) {
      return { error: 'Error de duplicidad: Ya existe una mesa con ese número o token en el restaurante.' };
    }
    return { error: `Error en crearMesasMasivasService: ${error.message}` };
  }
};

export const obtenerMesasPorSalonService = async (salonId) => {
  try {
    const salonExiste = await Salon.findById(salonId);
    if (!salonExiste) {
      return { error: 'El salón no existe' };
    }

    const mesas = await Mesa.find({ salon: salonId })
      .populate('salon', 'nombre')
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

    const mesa = await Mesa.findOne({ qr_token }).populate('salon', 'nombre');
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
    ).populate('salon', 'nombre');

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
    // Si intenta cambiar el número de mesa, verificar que no esté ocupado globalmente por otra
    if (datos.numero) {
      const mesaConNumero = await Mesa.findOne({ numero: datos.numero, _id: { $ne: id } });
      if (mesaConNumero) {
        return { error: `El número de mesa ${datos.numero} ya está registrado en el sistema.` };
      }
    }

    // Si intenta mover la mesa a otro salón, validar que el nuevo salón exista
    if (datos.salon) {
      const salonExiste = await Salon.findById(datos.salon);
      if (!salonExiste) {
        return { error: 'El salón asignado no existe' };
      }
    }

    const mesaEditada = await Mesa.findByIdAndUpdate(
      id,
      datos,
      { new: true, runValidators: true }
    ).populate('salon', 'nombre');

    if (!mesaEditada) {
      return { error: 'La mesa no existe' };
    }

    return { mesa: mesaEditada };
  } catch (error) {
    if (error.code === 11000) {
      return { error: 'Error de duplicidad: El número o token ya está registrado.' };
    }
    return { error: `Error en editarMesaService: ${error.message}` };
  }
};

export const eliminarMesaService = async (mesaId) => {
  try {
    // Regla de seguridad opcional: No eliminar si la mesa está ocupada
    const mesaExistente = await Mesa.findById(mesaId);
    if (!mesaExistente) {
      return { error: 'La mesa no existe' };
    }

    if (mesaExistente.estado !== 'Libre') {
      return { error: `No se puede eliminar la mesa #${mesaExistente.numero} porque su estado es '${mesaExistente.estado}'.` };
    }

    const mesaEliminada = await Mesa.findByIdAndDelete(mesaId);
    return { eliminado: mesaEliminada };
  } catch (error) {
    return { error: `Error en eliminarMesaService: ${error.message}` };
  }
};