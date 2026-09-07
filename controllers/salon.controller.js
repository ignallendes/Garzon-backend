import {
  crearSalonService,
  obtenerSalonesService,
  eliminarSalonService
} from '../services/salon.service.js';

export const crearSalonController = async (req, res) => {
  try {
    const { nombre } = req.body;
    const resultado = await crearSalonService({ nombre });

    if (resultado.error) {
      return res.status(400).json({ message: resultado.error });
    }

    return res.status(201).json(resultado.salon);
  } catch (error) {
    return res.status(500).json({ message: `Error en el servidor: ${error.message}` });
  }
};

export const obtenerSalonesController = async (req, res) => {
  try {
    const resultado = await obtenerSalonesService();

    if (resultado.error) {
      return res.status(500).json({ message: resultado.error });
    }

    return res.status(200).json(resultado.salones);
  } catch (error) {
    return res.status(500).json({ message: `Error en el servidor: ${error.message}` });
  }
};

export const eliminarSalonController = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await eliminarSalonService(id);

    if (resultado.error) {
      return res.status(400).json({ message: resultado.error });
    }

    return res.status(200).json({ message: 'Salón eliminado correctamente' });
  } catch (error) {
    return res.status(500).json({ message: `Error en el servidor: ${error.message}` });
  }
};