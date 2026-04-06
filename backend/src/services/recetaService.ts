import { PrismaClient } from '@prisma/client';
import { IReceta, IRecetaIngrediente } from '../types';

const prisma = new PrismaClient();

export class RecetaService {
  async crear(datos: Omit<IReceta, 'id' | 'createdAt' | 'updatedAt'>): Promise<IReceta> {
    return await prisma.receta.create({
      data: datos as any,
      include: { ingredientes: true },
    }) as IReceta;
  }

  async obtenerPorId(id: number): Promise<IReceta | null> {
    return await prisma.receta.findUnique({
      where: { id },
      include: { ingredientes: true },
    }) as IReceta | null;
  }

  async obtenerPorMenu(menuId: number): Promise<IReceta[]> {
    return await prisma.receta.findMany({
      where: { menuId },
      include: { ingredientes: true },
    }) as IReceta[];
  }

  async obtenerTodas(): Promise<IReceta[]> {
    return await prisma.receta.findMany({
      include: { ingredientes: true },
    }) as IReceta[];
  }

  async actualizar(id: number, datos: Partial<IReceta>): Promise<IReceta> {
    return await prisma.receta.update({
      where: { id },
      data: datos,
      include: { ingredientes: true },
    }) as IReceta;
  }

  async eliminar(id: number): Promise<IReceta> {
    return await prisma.receta.delete({
      where: { id },
      include: { ingredientes: true },
    }) as IReceta;
  }

  async agregarIngrediente(recetaId: number, datos: { ingredienteId: number; cantidad: number }): Promise<IRecetaIngrediente> {
    return await prisma.recetaIngrediente.create({
      data: {
        recetaId,
        ingredienteId: datos.ingredienteId,
        cantidad: datos.cantidad,
      },
    }) as IRecetaIngrediente;
  }

  async eliminarIngrediente(recetaId: number, ingredienteId: number): Promise<void> {
    await prisma.recetaIngrediente.delete({
      where: {
        recetaId_ingredienteId: { recetaId, ingredienteId },
      },
    });
  }

  async obtenerIngredientes(recetaId: number): Promise<IRecetaIngrediente[]> {
    return await prisma.recetaIngrediente.findMany({
      where: { recetaId },
    }) as IRecetaIngrediente[];
  }
}
