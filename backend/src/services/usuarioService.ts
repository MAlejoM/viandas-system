import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { IUsuario } from '../types';

const prisma = new PrismaClient();

export class UsuarioService {
  async crearUsuario(email: string, password: string, nombre: string, rol: string = 'VENDEDOR'): Promise<IUsuario> {
    const passwordHash = await bcrypt.hash(password, 10);
    
    return await prisma.usuario.create({
      data: {
        email,
        password: passwordHash,
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

  async verificarPassword(passwordIngresado: string, passwordHash: string): Promise<boolean> {
    return await bcrypt.compare(passwordIngresado, passwordHash);
  }
}
