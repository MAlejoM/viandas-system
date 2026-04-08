import { PrismaClient } from '@prisma/client';
import { IReceta, IRecetaIngrediente } from '../types';

const prisma = new PrismaClient();

export class RecetaService {
  async crear(datos: Omit<IReceta, 'id' | 'createdAt' | 'updatedAt'>): Promise<IReceta> {
    return await prisma.receta.create({
      data: datos as any,
      include: { ingredientes: true, menus: true },
    }) as IReceta;
  }

  async obtenerPorId(id: number): Promise<IReceta | null> {
    return await prisma.receta.findUnique({
      where: { id },
      include: { ingredientes: true, menus: true },
    }) as IReceta | null;
  }

  async obtenerTodas(): Promise<IReceta[]> {
    return await prisma.receta.findMany({
      include: { ingredientes: true, menus: { include: { menu: true } } },
      orderBy: { nombrePlato: 'asc' },
    }) as IReceta[];
  }

  async obtenerPorTipo(tipo: string): Promise<IReceta[]> {
    return await prisma.receta.findMany({
      where: { tipo: tipo as any },
      include: { ingredientes: true, menus: true },
      orderBy: { nombrePlato: 'asc' },
    }) as IReceta[];
  }

  async obtenerPorDia(dia: string): Promise<IReceta[]> {
    const diasValidos = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];
    if (!diasValidos.includes(dia.toUpperCase())) {
      return [];
    }
    return await prisma.receta.findMany({
      where: { menus: { some: { diaSemana: dia.toUpperCase() as any } } },
      include: { ingredientes: true, menus: { where: { diaSemana: dia.toUpperCase() as any } } },
      orderBy: { nombrePlato: 'asc' },
    }) as IReceta[];
  }

  async obtenerPorMenuYDia(menuId: number, diaSemana: string): Promise<IReceta[]> {
    const diasValidos = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];
    if (!diasValidos.includes(diaSemana.toUpperCase())) {
      return [];
    }
    return await prisma.receta.findMany({
      where: {
        menus: { some: { menuId, diaSemana: diaSemana.toUpperCase() as any } },
      },
      include: { ingredientes: true, menus: { where: { menuId, diaSemana: diaSemana.toUpperCase() as any } } },
      orderBy: { nombrePlato: 'asc' },
    }) as IReceta[];
  }

  async obtenerPorTipoYMenu(menuId: number, tipo: string): Promise<IReceta[]> {
    return await prisma.receta.findMany({
      where: {
        tipo: tipo as any,
        menus: { some: { menuId } },
      },
      include: { ingredientes: true, menus: { where: { menuId } } },
      orderBy: { nombrePlato: 'asc' },
    }) as IReceta[];
  }

  async actualizar(id: number, datos: Partial<IReceta>): Promise<IReceta> {
    return await prisma.receta.update({
      where: { id },
      data: datos,
      include: { ingredientes: true, menus: true },
    }) as IReceta;
  }

  async eliminar(id: number): Promise<IReceta> {
    return await prisma.receta.delete({
      where: { id },
      include: { ingredientes: true, menus: true },
    }) as IReceta;
  }

  async agregarIngrediente(recetaId: number, datos: { ingredienteId: number; cantidad: number; unidadMedida: string }): Promise<IRecetaIngrediente> {
    return await prisma.recetaIngrediente.create({
      data: {
        recetaId,
        ingredienteId: datos.ingredienteId,
        cantidad: datos.cantidad,
        unidadMedida: datos.unidadMedida,
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
