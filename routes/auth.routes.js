import { Router } from 'express';
import { registrarController, loginController } from '../controllers/auth.controller.js';

const router = Router();

// Endpoint para autenticación y gestión de usuarios
router.post('/registro', registrarController);
router.post('/login', loginController);

export default router;