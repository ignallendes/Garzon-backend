import { crearSolicitudService, atenderSolicitudService } from '../services/solicitud.service.js';

export const crearSolicitudController = async (req, res) => {
  try {
    const { mesaId, tipo } = req.body;

    if (!mesaId || !tipo) {
      return res.status(400).json({ message: 'Los campos mesaId y tipo son requeridos.' });
    }

    const resultado = await crearSolicitudService({ mesaId, tipo });

    if (resultado.error) {
      if (resultado.error.includes('no existe')) {
        return res.status(404).json({ message: resultado.error });
      }
      return res.status(400).json({ message: resultado.error });
    }

    // Emisión en tiempo real vía Socket.io a todas las pantallas de Caja/Garzón
    const io = req.app.get('io');
    if (io) {
      io.emit('nueva-solicitud', resultado.solicitud);
    }

    return res.status(201).json(resultado.solicitud);
  } catch (error) {
    return res.status(500).json({ message: `Error interno del servidor: ${error.message}` });
  }
};

export const atenderSolicitudController = async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await atenderSolicitudService(id);

    if (resultado.error) {
      return res.status(400).json({ message: resultado.error });
    }

    // Notificar a las pantallas que la solicitud fue marcada como atendida
    const io = req.app.get('io');
    if (io) {
      io.emit('solicitud-atendida', resultado.solicitud);
    }

    return res.status(200).json(resultado.solicitud);
  } catch (error) {
    return res.status(500).json({ message: `Error interno del servidor: ${error.message}` });
  }
};