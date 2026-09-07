import { Mesa } from '../models/mesa.model.js';
import { Solicitud } from '../models/solicitud.model.js';

export const crearSolicitudService = async ({ mesaId, tipo }) => {
  // 1. Buscar la mesa y popular su salón
  const mesa = await Mesa.findById(mesaId).populate('salon');
  
  if (!mesa) {
    return { error: 'La mesa no existe' };
  }

  // 2. Regla de Negocio: Solo mesas ocupadas pueden hacer peticiones
  if (mesa.estado === 'Libre') {
    return { error: 'Solo mesas ocupadas pueden hacer solicitudes' };
  }

  // 3. Crear la solicitud asociando la mesa y el salón
  const nuevaSolicitud = await Solicitud.create({
    mesa: mesa._id,
    salon: mesa.salon._id,
    tipo: tipo,
    fecha_Solicitud: new Date(),
    atendida: false
  });

  // 4. Actualizar el estado de la mesa
  mesa.estado = tipo === 'Cuenta' ? 'Cuenta' : 'Solicitud';
  await mesa.save();

  // Retorna los datos con populate listos para el cliente / socket
  return await nuevaSolicitud.populate(['mesa', 'salon']);
};