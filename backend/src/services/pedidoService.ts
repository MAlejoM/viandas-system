import { PrismaClient } from '@prisma/client';
import { IPedido } from '../types';

const prisma = new PrismaClient();

export class PedidoService {
  async crearPedido(datos: Omit<IPedido, 'id' | 'createdAt' | 'updatedAt'>): Promise<IPedido> {
    return await prisma.pedido.create({
      data: datos as any,
      include: { detalles: true, cliente: true, menu: true },
    }) as IPedido;
  }

  async obtenerPorId(id: number): Promise<IPedido | null> {
    return await prisma.pedido.findUnique({
      where: { id },
      include: { detalles: true, cliente: true, menu: true, pago: true },
    }) as IPedido | null;
  }

  async obtenerPorNumeroPedido(numeroPedido: string): Promise<IPedido | null> {
    return await prisma.pedido.findUnique({
      where: { numeroPedido },
      include: { detalles: true, cliente: true },
    }) as IPedido | null;
  }

  async obtenerTodos(): Promise<IPedido[]> {
    return await prisma.pedido.findMany({
      include: { detalles: true, cliente: true, menu: true },
    }) as IPedido[];
  }

  async obtenerPorCliente(clienteId: number): Promise<IPedido[]> {
    return await prisma.pedido.findMany({
      where: { clienteId },
      include: { detalles: true, menu: true },
    }) as IPedido[];
  }

  async obtenerPorEstado(estado: string): Promise<IPedido[]> {
    return await prisma.pedido.findMany({
      where: { estado: estado as any },
      include: { detalles: true, cliente: true },
    }) as IPedido[];
  }

  async actualizarPedido(id: number, datos: Partial<IPedido>): Promise<IPedido> {
    return await prisma.pedido.update({
      where: { id },
      data: datos,
      include: { detalles: true, cliente: true },
    }) as IPedido;
  }

  async eliminarPedido(id: number): Promise<IPedido> {
    return await prisma.pedido.delete({
      where: { id },
      include: { detalles: true },
    }) as IPedido;
  }
}
