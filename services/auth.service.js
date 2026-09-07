import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRA } from '../config/jwt.js';
import { Usuario } from '../models/usuario.model.js';

// ---------------------------------------------------------------------------
// SERVICE — Autenticación de BarMonitor
// ---------------------------------------------------------------------------

export const firmarToken = (id, rol) => {
  const secreto = JWT_SECRET || process.env.JWT_SECRET || 'clave_secreta_fallback_barmonitor_12345';
  return jwt.sign({ id, rol }, secreto, { expiresIn: JWT_EXPIRA || '12h' });
};

/**
 * Registra un nuevo usuario del sistema (Admin, Caja, Garzon)
 */
export const registrarUsuario = async (datos) => {
  try {
    const { username, password, nombre, rol } = datos;

    if (!username || !password || !nombre) {
      return { error: 'Username, password y nombre son obligatorios' };
    }

    const usuarioExiste = await Usuario.findOne({ username: username.trim() });
    if (usuarioExiste) {
      return { error: 'El nombre de usuario ya está registrado' };
    }

    // Hasheo de contraseña 
    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = await Usuario.create({
      username: username.trim(),
      nombre: nombre.trim(),
      password: hashedPassword,
      rol: rol || 'Caja'
    });

    // Sanitización limpiando el campo password 
    const usuarioObj = nuevoUsuario.toObject();
    delete usuarioObj.password;

    const token = firmarToken(nuevoUsuario._id, nuevoUsuario.rol);

    return { token, usuario: usuarioObj };
  } catch (error) {
    return { error: `Error en registrarUsuario: ${error.message}` };
  }
};

/**
 * Inicia sesión para un usuario del bar
 */
export const login = async (username, password) => {
  try {
    if (!username || !password) {
      return { error: 'Debe ingresar usuario y contraseña' };
    }

    const usuario = await Usuario.findOne({ username: username.trim() });
    if (!usuario) {
      return { error: 'Credenciales inválidas' };
    }

    // Validación con bcrypt 
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return { error: 'Credenciales inválidas' };
    }

    const token = firmarToken(usuario._id, usuario.rol);

    const usuarioObj = usuario.toObject();
    delete usuarioObj.password;

    return { token, usuario: usuarioObj };
  } catch (error) {
    return { error: `Error en login: ${error.message}` };
  }
};