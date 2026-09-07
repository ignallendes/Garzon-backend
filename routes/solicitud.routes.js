import { Router } from 'express';
import {
  crearSolicitudController,
  atenderSolicitudController
} from '../controllers/solicitud.controller.js';

const router = Router();

// Crear solicitud (Llamar garzón / Pedir cuenta desde la mesa)
router.post('/', crearSolicitudController);

// Marcar solicitud como atendida desde el panel
router.patch('/:id/atender', atenderSolicitudController);

export default router;