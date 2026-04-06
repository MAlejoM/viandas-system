import { Request, Response } from 'express';
import { UsuarioService } from '../services/usuarioService';
import { generateToken } from '../middleware/auth';

const usuarioService = new UsuarioService();

export class UsuarioController {
  async registro(req: Request, res: Response) {
    try {
      const { email, password, nombre } = req.body;

      if (!email || !password || !nombre) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
      }

      const existe = await usuarioService.obtenerPorEmail(email);
      if (existe) {
        return res.status(400).json({ error: 'El email ya existe' });
      }

      const usuario = await usuarioService.crearUsuario(email, password, nombre);
      const token = generateToken({ id: usuario.id, email: usuario.email, rol: usuario.rol });

      res.status(201).json({ usuario, token });
    } catch (error) {
      res.status(500).json({ error: 'Error al registrar usuario' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const usuario = await usuarioService.obtenerPorEmail(email);
      if (!usuario) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const esValido = await usuarioService.verificarPassword(password, usuario.password);
      if (!esValido) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const token = generateToken({ id: usuario.id, email: usuario.email, rol: usuario.rol });
      res.json({ usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre, rol: usuario.rol }, token });
    } catch (error) {
      res.status(500).json({ error: 'Error al iniciar sesión' });
    }
  }

  async obtenerPerfil(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'No autenticado' });
      }

      const usuario = await usuarioService.obtenerPorId(req.user.id);
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener perfil' });
    }
  }

  async obtenerTodos(req: Request, res: Response) {
    try {
      const usuarios = await usuarioService.obtenerTodos();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  }
}
