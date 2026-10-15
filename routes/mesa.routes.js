import { Router } from 'express';
import { proteger, soloRol } from '../middlewares/proteger.js';
import {
  crearMesaController,
  obtenerMesasPorSalonController,
  obtenerMesaPorTokenController,
  cambiarEstadoMesaController,
  editarMesaController,
  eliminarMesaController
} from '../controllers/mesa.controller.js';

const router = Router();

// PÚBLICA: El cliente escanea el QR y obtiene la mesa
router.get('/qr/:qr_token', obtenerMesaPorTokenController);

// PROTEGIDAS: Solo personal autorizado
router.get('/:salonId', proteger, obtenerMesasPorSalonController);
router.post('/', proteger, soloRol('Admin'), crearMesaController);
router.put('/:id', proteger, soloRol('Admin'), editarMesaController);
router.patch('/:id/estado', proteger, soloRol('Admin', 'Caja', 'Garzon'), cambiarEstadoMesaController);
router.delete('/:id', proteger, soloRol('Admin'), eliminarMesaController);

export default router;