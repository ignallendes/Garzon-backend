import { Router } from 'express';
import {
  crearSolicitudController,
  crearSolicitudClienteController,
  obtenerSolicitudesPendientesController,
  atenderSolicitudController
} from '../controllers/solicitud.controller.js';

const router = Router();

// Crear solicitud (Llamar garzón / Pedir cuenta desde la mesa)
router.post('/', crearSolicitudController);

// Ruta pública para solicitudes generadas desde el QR de la mesa.
router.post('/cliente', crearSolicitudClienteController);

// Consultar solicitudes activas para reconstruir las alertas al recargar el panel.
router.get('/pendientes', obtenerSolicitudesPendientesController);

// Marcar solicitud como atendida desde el panel
router.patch('/:id/atender', atenderSolicitudController);

export default router;
