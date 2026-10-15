import { Usuario } from '../models/usuario.model.js';

export const obtenerUsuariosService = async () => {
  try {
    const usuarios = await Usuario.find({}, '-password').sort({ createdAt: -1 });
    return usuarios;
  } catch (error) {
    return { error: `Error en obtenerUsuariosService: ${error.message}` };
  }
};

export const cambiarEstadoUsuarioService = async (id, activo) => {
  try {
    const usuario = await Usuario.findByIdAndUpdate(
      id,
      { activo },
      { new: true, select: '-password' }
    );

    if (!usuario) {
      return { error: 'Usuario no encontrado' };
    }

    return usuario;
  } catch (error) {
    return { error: `Error en cambiarEstadoUsuarioService: ${error.message}` };
  }
};