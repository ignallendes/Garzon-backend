import { Router } from 'express';
import {
  crearSalonController,
  obtenerSalonesController,
  eliminarSalonController
} from '../controllers/salon.controller.js';

const router = Router();

router.post('/', crearSalonController);
router.get('/', obtenerSalonesController);
router.delete('/:id', eliminarSalonController);

export default router;