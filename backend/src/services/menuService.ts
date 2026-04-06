import { PrismaClient } from '@prisma/client';
import { IMenuSemanal } from '../types';

const prisma = new PrismaClient();

export class MenuService {
  async crearMenu(datos: Omit<IMenuSemanal, 'id' | 'createdAt' | 'updatedAt'>): Promise<IMenuSemanal> {
    return await prisma.menuSemanal.create({
      data: datos as any,
      include: { recetas: true },
    }) as IMenuSemanal;
  }

  async obtenerPorId(id: number): Promise<IMenuSemanal | null> {
    return await prisma.menuSemanal.findUnique({
      where: { id },
      include: { recetas: true, pedidos: true },
    }) as IMenuSemanal | null;
  }

  async obtenerTodos(): Promise<IMenuSemanal[]> {
    return await prisma.menuSemanal.findMany({
      include: { recetas: true },
    }) as IMenuSemanal[];
  }

  async obtenerActivos(): Promise<IMenuSemanal[]> {
    return await prisma.menuSemanal.findMany({
      where: { estado: 'PUBLICADO' },
      include: { recetas: true },
    }) as IMenuSemanal[];
  }

  async actualizarMenu(id: number, datos: Partial<IMenuSemanal>): Promise<IMenuSemanal> {
    return await prisma.menuSemanal.update({
      where: { id },
      data: datos,
      include: { recetas: true },
    }) as IMenuSemanal;
  }

  async eliminarMenu(id: number): Promise<IMenuSemanal> {
    return await prisma.menuSemanal.delete({
      where: { id },
    }) as IMenuSemanal;
  }
}
