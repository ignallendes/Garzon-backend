// middlewares/proteger.js
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.js';

export const proteger = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No tienes un token de sesión válido' });
  }

  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.usuario = payload; // Contiene { id, rol }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

export const soloRol = (...rolesPermitidos) => (req, res, next) => {
  if (!req.usuario || !rolesPermitidos.map(r => r.toLowerCase()).includes(req.usuario.rol.toLowerCase())) {
    return res.status(403).json({ message: 'No tienes permisos suficientes para realizar esta acción' });
  }
  next();
};