import { PrismaClient } from '@prisma/client';
import { ICliente } from '../types';

const prisma = new PrismaClient();

export class ClienteService {
  async crearCliente(datos: Omit<ICliente, 'id' | 'fechaRegistro' | 'updatedAt'>): Promise<ICliente> {
    // Verificar si ya existe un cliente con ese teléfono o email
    const existeTelefono = await prisma.cliente.findUnique({
      where: { telefono: datos.telefono }
    });
    if (existeTelefono) {
      throw new Error('Ya existe un cliente con este número de teléfono');
    }

    if (datos.email) {
      const existeEmail = await prisma.cliente.findUnique({
        where: { email: datos.email }
      });
      if (existeEmail) {
        throw new Error('Ya existe un cliente registrado con este correo electrónico');
      }
    }

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
    // Si se intenta actualizar el teléfono, verificar que no esté en uso por otro cliente
    if (datos.telefono) {
      const existeTelefono = await prisma.cliente.findFirst({
        where: { 
          telefono: datos.telefono,
          id: { not: id }
        }
      });
      if (existeTelefono) {
        throw new Error('Este número de teléfono ya está registrado con otro cliente');
      }
    }

    // Si se intenta actualizar el email, verificar que no esté en uso por otro cliente
    if (datos.email) {
      const existeEmail = await prisma.cliente.findFirst({
        where: { 
          email: datos.email,
          id: { not: id }
        }
      });
      if (existeEmail) {
        throw new Error('Este correo electrónico ya está registrado con otro cliente');
      }
    }

    return await prisma.cliente.update({
      where: { id },
      data: datos,
    }) as ICliente;
  }

  async eliminarCliente(id: number): Promise<ICliente> {
    // Prisma no soporta 'include' en delete.
    // Verificamos primero si tiene pedidos activos para evitar FK constraint error.
    const pedidosActivos = await prisma.pedido.count({
      where: { clienteId: id, estado: { not: 'CANCELADO' } }
    });
    if (pedidosActivos > 0) {
      throw new Error(`No se puede eliminar: el cliente tiene ${pedidosActivos} pedido(s) activo(s)`);
    }
    return await prisma.cliente.delete({
      where: { id },
    }) as ICliente;
  }

  async obtenerClientesPorZona(zona: string): Promise<ICliente[]> {
    return await prisma.cliente.findMany({
      where: { zona: zona as any },
    }) as ICliente[];
  }
}
