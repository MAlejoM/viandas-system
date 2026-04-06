import { PrismaClient } from '@prisma/client';
import { IIngrediente } from '../types';

const prisma = new PrismaClient();

export class IngredienteService {
  async crear(datos: Omit<IIngrediente, 'id' | 'createdAt' | 'updatedAt'>): Promise<IIngrediente> {
    return await prisma.ingrediente.create({
      data: datos as any,
    }) as IIngrediente;
  }

  async obtenerPorId(id: number): Promise<IIngrediente | null> {
    return await prisma.ingrediente.findUnique({
      where: { id },
    }) as IIngrediente | null;
  }

  async obtenerTodos(): Promise<IIngrediente[]> {
    return await prisma.ingrediente.findMany({
      orderBy: { nombre: 'asc' },
    }) as IIngrediente[];
  }

  async obtenerPorCategoria(categoria: string): Promise<IIngrediente[]> {
    return await prisma.ingrediente.findMany({
      where: { categoria: categoria as any },
      orderBy: { nombre: 'asc' },
    }) as IIngrediente[];
  }

  async actualizar(id: number, datos: Partial<IIngrediente>): Promise<IIngrediente> {
    return await prisma.ingrediente.update({
      where: { id },
      data: datos,
    }) as IIngrediente;
  }

  async eliminar(id: number): Promise<IIngrediente> {
    return await prisma.ingrediente.delete({
      where: { id },
    }) as IIngrediente;
  }
}
