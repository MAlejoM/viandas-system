import { PrismaClient } from '@prisma/client';
import { ICliente } from '../types';

const prisma = new PrismaClient();

export class ClienteService {
  async crearCliente(datos: Omit<ICliente, 'id' | 'createdAt' | 'updatedAt'>): Promise<ICliente> {
    return await prisma.cliente.create({
      data: datos as any,
    }) as ICliente;
  }

  async obtenerPorId(id: number): Promise<ICliente | null> {
    return await prisma.cliente.findUnique({
      where: { id },
      include: { pedidos: true },
    }) as ICliente | null;
  }

  async obtenerTodos(): Promise<ICliente[]> {
    return await prisma.cliente.findMany({
      include: { pedidos: true },
    }) as ICliente[];
  }

  async obtenerPorTelefono(telefono: string): Promise<ICliente | null> {
    return await prisma.cliente.findUnique({
      where: { telefono },
    }) as ICliente | null;
  }

  async actualizarCliente(id: number, datos: Partial<ICliente>): Promise<ICliente> {
    return await prisma.cliente.update({
      where: { id },
      data: datos,
    }) as ICliente;
  }

  async eliminarCliente(id: number): Promise<ICliente> {
    return await prisma.cliente.delete({
      where: { id },
      include: { pedidos: true },
    }) as ICliente;
  }

  async obtenerClientesPorZona(zona: string): Promise<ICliente[]> {
    return await prisma.cliente.findMany({
      where: { zona: zona as any },
    }) as ICliente[];
  }
}
