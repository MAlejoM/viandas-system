import { PrismaClient } from '@prisma/client';
import { IUsuario } from '../types';

const prisma = new PrismaClient();

export class UsuarioService {
  /**
   * Crea un usuario con la contraseña en texto plano (sin hash).
   * TODO: Activar bcrypt cuando se prepare la versión de producción.
   */
  async crearUsuario(email: string, password: string, nombre: string, rol: string = 'VENDEDOR'): Promise<IUsuario> {
    return await prisma.usuario.create({
      data: {
        email,
        password, // Plain text - sin hash por ahora
        nombre,
        rol: rol as any,
      },
    }) as IUsuario;
  }

  async obtenerPorEmail(email: string): Promise<IUsuario | null> {
    return await prisma.usuario.findUnique({
      where: { email },
    }) as IUsuario | null;
  }

  async obtenerPorId(id: number): Promise<IUsuario | null> {
    return await prisma.usuario.findUnique({
      where: { id },
    }) as IUsuario | null;
  }

  async obtenerTodos(): Promise<IUsuario[]> {
    return await prisma.usuario.findMany() as IUsuario[];
  }

  async actualizarUsuario(id: number, datos: Partial<IUsuario>): Promise<IUsuario> {
    return await prisma.usuario.update({
      where: { id },
      data: datos,
    }) as IUsuario;
  }

  async eliminarUsuario(id: number): Promise<IUsuario> {
    return await prisma.usuario.delete({
      where: { id },
    }) as IUsuario;
  }

  /**
   * Verifica la contraseña en texto plano (sin bcrypt).
   * TODO: Reemplazar por bcrypt.compare() en producción.
   */
  async verificarPassword(passwordIngresado: string, passwordAlmacenado: string): Promise<boolean> {
    return passwordIngresado === passwordAlmacenado;
  }
}
