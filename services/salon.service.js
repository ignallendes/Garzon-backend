import { Salon } from '../models/salon.model.js';
import { Mesa } from '../models/mesa.model.js';

export const crearSalonService = async ({ nombre }) => {
  try {
    if (!nombre || !nombre.trim()) {
      return { error: 'El nombre del salón es obligatorio' };
    }

    const salonExistente = await Salon.findOne({ 
      nombre: { $regex: new RegExp(`^${nombre.trim()}$`, 'i') } 
    });

    if (salonExistente) {
      return { error: 'Ya existe un salón con ese nombre' };
    }

    const nuevoSalon = await Salon.create({ nombre: nombre.trim() });
    return { salon: nuevoSalon };
  } catch (error) {
    return { error: `Error en crearSalonService: ${error.message}` };
  }
};

export const obtenerSalonesService = async () => {
  try {
    const salones = await Salon.find().sort({ nombre: 1 });
    return { salones };
  } catch (error) {
    return { error: `Error en obtenerSalonesService: ${error.message}` };
  }
};

export const eliminarSalonService = async (salonId) => {
  try {
    const salon = await Salon.findById(salonId);
    if (!salon) {
      return { error: 'El salón no existe' };
    }

    const mesasAsociadas = await Mesa.countDocuments({ salon: salonId });
    if (mesasAsociadas > 0) {
      return { error: `No se puede eliminar el salón porque tiene ${mesasAsociadas} mesa(s) asociada(s)` };
    }

    await Salon.findByIdAndDelete(salonId);
    return { id: salonId };
  } catch (error) {
    return { error: `Error en eliminarSalonService: ${error.message}` };
  }
};