import { Router } from 'express';
import { proteger, soloRol } from '../middlewares/proteger.js';
import {
  obtenerUsuariosController,
  cambiarEstadoUsuarioController
} from '../controllers/usuario.controller.js';

const router = Router();

router.get('/', proteger, soloRol('Admin'), obtenerUsuariosController);
router.patch('/:id/estado', proteger, soloRol('Admin'), cambiarEstadoUsuarioController);

export default router;