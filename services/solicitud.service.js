import { Mesa } from '../models/mesa.model.js';
import { Solicitud } from '../models/solicitud.model.js';

export const crearSolicitudService = async ({ mesaId, tipo }) => {
  try {
    if (!mesaId || !tipo) {
      return { error: 'El ID de la mesa y el tipo de solicitud son obligatorios' };
    }

    const mesa = await Mesa.findById(mesaId).populate('salon');
    if (!mesa) {
      return { error: 'La mesa no existe' };
    }

    if (mesa.estado === 'Libre') {
      return { error: 'Solo mesas ocupadas pueden hacer solicitudes' };
    }

    const nuevaSolicitud = await Solicitud.create({
      mesa: mesa._id,
      salon: mesa.salon._id,
      tipo,
      fecha_Solicitud: new Date(),
      atendida: false
    });

    mesa.estado = tipo === 'Cuenta' ? 'Cuenta' : 'Solicitud';
    await mesa.save();

    const solicitudPoblada = await nuevaSolicitud.populate(['mesa', 'salon']);
    
    // Retorno estandarizado
    return { solicitud: solicitudPoblada };
  } catch (error) {
    return { error: `Error en crearSolicitudService: ${error.message}` };
  }
};

export const atenderSolicitudService = async (solicitudId) => {
  try {
    const solicitud = await Solicitud.findById(solicitudId);
    if (!solicitud) {
      return { error: 'La solicitud no existe' };
    }

    solicitud.atendida = true;
    await solicitud.save();

    // Al atender la solicitud, devolvemos la mesa a estado 'Ocupada'
    await Mesa.findByIdAndUpdate(solicitud.mesa, { estado: 'Ocupada' });

    return { solicitud };
  } catch (error) {
    return { error: `Error en atenderSolicitudService: ${error.message}` };
  }
};