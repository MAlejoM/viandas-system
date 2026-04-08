import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface IMenuReceta {
  id: number;
  menuId: number;
  recetaId: number;
  diaSemana: string;
  menu?: any;
  receta?: any;
}

export class MenuRecetaService {
  async asignarRecetaAlMenu(menuId: number, recetaId: number, diaSemana: string): Promise<IMenuReceta> {
    return await prisma.menuReceta.create({
      data: {
        menuId,
        recetaId,
        diaSemana: diaSemana as any,
      },
      include: { menu: true, receta: { include: { ingredientes: true } } },
    }) as IMenuReceta;
  }

  async obtenerRecetasDelMenu(menuId: number): Promise<IMenuReceta[]> {
    return await prisma.menuReceta.findMany({
      where: { menuId },
      include: { receta: { include: { ingredientes: true } } },
      orderBy: { diaSemana: 'asc' },
    }) as IMenuReceta[];
  }

  async obtenerRecetasDelMenuPorDia(menuId: number, diaSemana: string): Promise<IMenuReceta[]> {
    const diasValidos = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];
    if (!diasValidos.includes(diaSemana.toUpperCase())) {
      return [];
    }
    return await prisma.menuReceta.findMany({
      where: { menuId, diaSemana: diaSemana.toUpperCase() as any },
      include: { receta: { include: { ingredientes: true } } },
    }) as IMenuReceta[];
  }

  async removerRecetaDelMenu(menuId: number, recetaId: number): Promise<void> {
    await prisma.menuReceta.deleteMany({
      where: { menuId, recetaId },
    });
  }

  async actualizarDiaReceta(menuId: number, recetaId: number, diaSemana: string): Promise<IMenuReceta> {
    return await prisma.menuReceta.updateMany({
      where: { menuId, recetaId },
      data: { diaSemana: diaSemana as any },
    }).then(async () => {
      const result = await prisma.menuReceta.findFirst({
        where: { menuId, recetaId },
        include: { menu: true, receta: { include: { ingredientes: true } } },
      });
      return result as IMenuReceta;
    });
  }
}
