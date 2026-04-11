import { PrismaClient } from '@prisma/client';
import { IMenuSemanal } from '../types';

const prisma = new PrismaClient();

// DTO para crear/actualizar un menú (solo campos escalares del MenuSemanal)
export interface DtoMenu {
  fechaInicioSemana: Date | string;
  fechaCierrePedidos: Date | string;
  precioBase: number;
  costoEnvio: number;
  estado?: 'BORRADOR' | 'PUBLICADO' | 'CERRADO';
}

export class MenuService {
  /**
   * Verifica si ya existe un menú para la semana dada.
   * Lanza un Error descriptivo si hay solapamiento.
   */
  private async verificarSolapamiento(
    fechaInicioSemana: Date | string,
    excluirId?: number
  ): Promise<void> {
    const fecha = new Date(fechaInicioSemana);
    // Normalizamos a inicio del día (UTC) para comparación
    fecha.setUTCHours(0, 0, 0, 0);

    const menusEnConflicto = await prisma.menuSemanal.findMany({
      where: {
        fechaInicioSemana: fecha,
        ...(excluirId ? { id: { not: excluirId } } : {}),
      },
    });

    if (menusEnConflicto.length > 0) {
      throw new Error('SOLAPAMIENTO: Ya existe un menú para esa semana');
    }
  }

  async crearMenu(datos: DtoMenu): Promise<IMenuSemanal> {
    await this.verificarSolapamiento(datos.fechaInicioSemana);

    return await prisma.menuSemanal.create({
      data: {
        fechaInicioSemana: new Date(datos.fechaInicioSemana),
        fechaCierrePedidos: new Date(datos.fechaCierrePedidos),
        precioBase: Number(datos.precioBase),
        costoEnvio: Number(datos.costoEnvio),
        estado: datos.estado ?? 'BORRADOR',
      },
      include: { recetas: { include: { receta: true } } },
    }) as unknown as IMenuSemanal;
  }

  async obtenerPorId(id: number): Promise<IMenuSemanal | null> {
    return await prisma.menuSemanal.findUnique({
      where: { id },
      include: {
        recetas: { include: { receta: true } },
        pedidos: true,
      },
    }) as unknown as IMenuSemanal | null;
  }

  async obtenerTodos(): Promise<IMenuSemanal[]> {
    return await prisma.menuSemanal.findMany({
      include: { recetas: { include: { receta: true } } },
      orderBy: { fechaInicioSemana: 'desc' },
    }) as unknown as IMenuSemanal[];
  }

  async obtenerActivos(): Promise<IMenuSemanal[]> {
    return await prisma.menuSemanal.findMany({
      where: { estado: 'PUBLICADO' },
      include: { recetas: { include: { receta: true } } },
      orderBy: { fechaInicioSemana: 'desc' },
    }) as unknown as IMenuSemanal[];
  }

  async actualizarMenu(id: number, datos: Partial<DtoMenu>): Promise<IMenuSemanal> {
    // Validar solapamiento solo si se está cambiando la fecha de inicio
    if (datos.fechaInicioSemana) {
      await this.verificarSolapamiento(datos.fechaInicioSemana, id);
    }

    const dataUpdate: any = { ...datos };
    if (datos.fechaInicioSemana) {
      dataUpdate.fechaInicioSemana = new Date(datos.fechaInicioSemana);
    }
    if (datos.fechaCierrePedidos) {
      dataUpdate.fechaCierrePedidos = new Date(datos.fechaCierrePedidos);
    }
    if (datos.precioBase !== undefined) {
      dataUpdate.precioBase = Number(datos.precioBase);
    }
    if (datos.costoEnvio !== undefined) {
      dataUpdate.costoEnvio = Number(datos.costoEnvio);
    }

    return await prisma.menuSemanal.update({
      where: { id },
      data: dataUpdate,
      include: { recetas: { include: { receta: true } } },
    }) as unknown as IMenuSemanal;
  }

  /**
   * Publica un menú: cambia estado a PUBLICADO y registra la fecha de publicación.
   */
  async publicarMenu(id: number): Promise<IMenuSemanal> {
    return await prisma.menuSemanal.update({
      where: { id },
      data: {
        estado: 'PUBLICADO',
        fechaPublicacion: new Date(),
      },
      include: { recetas: { include: { receta: true } } },
    }) as unknown as IMenuSemanal;
  }

  /**
   * Clona un menú existente hacia una nueva semana.
   * Crea el nuevo MenuSemanal en estado BORRADOR y copia todas las asignaciones de recetas.
   */
  async clonarMenu(menuOrigenId: number, nuevaFechaInicioSemana: Date | string): Promise<IMenuSemanal> {
    // 1. Obtener el menú origen con sus recetas
    const menuOrigen = await prisma.menuSemanal.findUnique({
      where: { id: menuOrigenId },
      include: { recetas: true },
    });

    if (!menuOrigen) {
      throw new Error('Menú origen no encontrado');
    }

    // 2. Validar que no exista un menú para la nueva semana
    await this.verificarSolapamiento(nuevaFechaInicioSemana);

    // 3. Crear el nuevo menú en BORRADOR con los mismos precios
    const nuevoMenu = await prisma.menuSemanal.create({
      data: {
        fechaInicioSemana: new Date(nuevaFechaInicioSemana),
        fechaCierrePedidos: new Date(nuevaFechaInicioSemana), // El admin ajustará en el form
        precioBase: menuOrigen.precioBase,
        costoEnvio: menuOrigen.costoEnvio,
        estado: 'BORRADOR',
      },
    });

    // 4. Copiar las asignaciones de recetas (si las hay) usando createMany para atomicidad
    if (menuOrigen.recetas.length > 0) {
      await prisma.menuReceta.createMany({
        data: menuOrigen.recetas.map((mr) => ({
          menuId: nuevoMenu.id,
          recetaId: mr.recetaId,
          diaSemana: mr.diaSemana,
        })),
        skipDuplicates: true,
      });
    }

    // 5. Retornar el nuevo menú completo con recetas
    return await prisma.menuSemanal.findUnique({
      where: { id: nuevoMenu.id },
      include: { recetas: { include: { receta: true } } },
    }) as unknown as IMenuSemanal;
  }

  async eliminarMenu(id: number): Promise<IMenuSemanal> {
    // Eliminar las recetas asociadas primero (integridad referencial)
    await prisma.menuReceta.deleteMany({ where: { menuId: id } });

    return await prisma.menuSemanal.delete({
      where: { id },
    }) as unknown as IMenuSemanal;
  }
}
