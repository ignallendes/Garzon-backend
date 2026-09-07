import { Salon } from '../models/salon.model.js';
import { Mesa } from '../models/mesa.model.js';

/**
 * Crea un nuevo salón.
 */
export const crearSalonService = async ({ nombre }) => {
  if (!nombre) {
    throw new Error('NOMBRE_REQUERIDO');
  }

  // Mongoose aplica trim: true automáticamente al nombre,
  // pero verificamos duplicados sin importar mayúsculas/minúsculas.
  const salonExistente = await Salon.findOne({ 
    nombre: { $regex: new RegExp(`^${nombre.trim()}$`, 'i') } 
  });

  if (salonExistente) {
    throw new Error('SALON_YA_EXISTE');
  }

  // Mongoose se encarga del trim y de validar la unicidad
  const nuevoSalon = await Salon.create({ nombre });
  return nuevoSalon;
};

/**
 * Obtiene todos los salones.
 */
export const obtenerSalonesService = async () => {
  return await Salon.find().sort({ nombre: 1 });
};

/**
 * Elimina un salón siempre y cuando no tenga mesas asociadas.
 */
export const eliminarSalonService = async (salonId) => {
  const salon = await Salon.findById(salonId);
  if (!salon) {
    throw new Error('SALON_NOT_FOUND');
  }

  // Regla de Negocio: No se puede eliminar un salón si tiene mesas asociadas
  const mesasAsociadas = await Mesa.countDocuments({ salon: salonId });
  if (mesasAsociadas > 0) {
    throw new Error('SALON_CON_MESAS_NO_ELIMINABLE');
  }

  await Salon.findByIdAndDelete(salonId);
  return { id: salonId };
};