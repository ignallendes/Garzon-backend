// controllers/mesa.controller.js
import {
  crearMesasMasivasService,
  obtenerMesasPorSalonService,
  obtenerMesaPorTokenService,
  cambiarEstadoMesaService,
  editarMesaService,
  eliminarMesaService
} from '../services/mesa.service.js';

export const crearMesaController = async (req, res) => {
  try {
    const { cantidad, salonId } = req.body;
    
    // Si no especifican cantidad, por defecto crea 1 mesa
    const resultado = await crearMesasMasivasService(cantidad || 1, salonId);

    if (resultado.error) {
      return res.status(400).json({ message: resultado.error });
    }

    return res.status(201).json({
      message: resultado.mensaje,
      mesas: resultado.mesas
    });
  } catch (error) {
    return res.status(500).json({ message: `Error en el servidor: ${error.message}` });
  }
};

export const obtenerMesasPorSalonController = async (req, res) => {
  try {
    const { salonId } = req.params;
    const resultado = await obtenerMesasPorSalonService(salonId);

    if (resultado.error) {
      return res.status(404).json({ message: resultado.error });
    }

    return res.status(200).json({ mesas: resultado.mesas });
  } catch (error) {
    return res.status(500).json({ message: `Error en el servidor: ${error.message}` });
  }
};

export const obtenerMesaPorTokenController = async (req, res) => {
  try {
    const { qr_token } = req.params;
    const resultado = await obtenerMesaPorTokenService(qr_token);

    if (resultado.error) {
      return res.status(404).json({ message: resultado.error });
    }

    return res.status(200).json({ mesa: resultado.mesa });
  } catch (error) {
    return res.status(500).json({ message: `Error en el servidor: ${error.message}` });
  }
};

export const cambiarEstadoMesaController = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const resultado = await cambiarEstadoMesaService(id, estado);

    if (resultado.error) {
      return res.status(400).json({ message: resultado.error });
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('cambio-estado-mesa', resultado.mesa);
    }

    return res.status(200).json({ mesa: resultado.mesa });
  } catch (error) {
    return res.status(500).json({ message: `Error en el servidor: ${error.message}` });
  }
};

export const editarMesaController = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await editarMesaService(id, req.body);

    if (resultado.error) {
      return res.status(400).json({ message: resultado.error });
    }

    return res.status(200).json({ mesa: resultado.mesa });
  } catch (error) {
    return res.status(500).json({ message: `Error en el servidor: ${error.message}` });
  }
};

export const eliminarMesaController = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await eliminarMesaService(id);

    if (resultado.error) {
      return res.status(400).json({ message: resultado.error });
    }

    return res.status(200).json({ message: 'Mesa eliminada con éxito' });
  } catch (error) {
    return res.status(500).json({ message: `Error en el servidor: ${error.message}` });
  }
};