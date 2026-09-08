import { Router } from 'express';
import {
  crearSalonController,
  obtenerSalonesController,
  eliminarSalonController
} from '../controllers/salon.controller.js';

const router = Router();

router.get('/', proteger, obtenerSalonesController);
router.post('/', proteger, soloRol('Admin'), crearSalonController);
router.delete('/:id', proteger, soloRol('Admin'), eliminarSalonController);

export default router;