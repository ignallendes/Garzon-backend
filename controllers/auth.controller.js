import { registrarUsuario, login } from '../services/auth.service.js';

export const registrarController = async (req, res) => {
  try {
    const resultado = await registrarUsuario(req.body);

    if (resultado.error) {
      return res.status(400).json({ message: resultado.error });
    }

    return res.status(201).json(resultado);
  } catch (error) {
    return { message: `Error en el servidor: ${error.message}` };
  }
};

export const loginController = async (req, res) => {
  try {
    const { username, password } = req.body;
    const resultado = await login(username, password);

    if (resultado.error) {
      return res.status(401).json({ message: resultado.error });
    }

    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({ message: `Error en el servidor: ${error.message}` });
  }
};