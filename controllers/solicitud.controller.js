import { crearSolicitudService } from '../services/solicitud.service.js';

/**
 * Controlador para la creación de una nueva solicitud (Llamar garzón / Pedir cuenta)
 */
export const crearSolicitudController = async (req, res) => {
  try {
    const { mesaId, tipo } = req.body;

    if (!mesaId || !tipo) {
      return res.status(400).json({ message: 'Los campos mesaId y tipo son requeridos.' });
    }

    // El servicio retorna un objeto plano { solicitud } o { error }
    const resultado = await crearSolicitudService({ mesaId, tipo });

    // Evaluación de error devuelto por el servicio (sin usar try/catch para reglas de negocio)
    if (resultado.error) {
      // Mapeo de errores específicos según el mensaje del servicio
      if (resultado.error.includes('Mesa no existe')) {
        return res.status(404).json({ message: 'La mesa solicitada no existe.' });
      }

      if (resultado.error.includes('ocupadas')) {
        return res.status(400).json({ 
          message: 'Debe comunicarse con un garzón para habilitar la mesa antes de hacer peticiones.' 
        });
      }

      return res.status(400).json({ message: resultado.error });
    }

    // Emitir evento por WebSockets si la instancia de io está en app (Opcional según tu setup)
    const io = req.app.get('io');
    if (io && resultado.solicitud?.organizacion) {
      const orgRoom = resultado.solicitud.organizacion.toString();
      io.to(orgRoom).emit('nueva-solicitud', resultado.solicitud);
    }

    // Respuesta exitosa estandarizada segun la constitucion
    return res.status(201).json(resultado.solicitud);

  } catch (error) {
    // El catch solo captura fallos inesperados de infraestructura/código
    return res.status(500).json({ message: `Error interno del servidor: ${error.message}` });
  }
};