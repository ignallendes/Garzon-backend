import {
  obtenerUsuariosService,
  cambiarEstadoUsuarioService
} from '../services/usuario.service.js';

export const obtenerUsuariosController = async (req, res) => {
  try {
    const resultado = await obtenerUsuariosService();

    if (resultado.error) {
      return res.status(400).json({ message: resultado.error });
    }

    return res.json(resultado);
  } catch (error) {
    return res.status(500).json({ message: `Error en el servidor: ${error.message}` });
  }
};

export const cambiarEstadoUsuarioController = async (req, res) => {
  try {
    const { id } = req.params;
    const { activo } = req.body;

    const resultado = await cambiarEstadoUsuarioService(id, activo);

    if (resultado.error) {
      return res.status(400).json({ message: resultado.error });
    }

    return res.json(resultado);
  } catch (error) {
    return res.status(500).json({ message: `Error en el servidor: ${error.message}` });
  }
};