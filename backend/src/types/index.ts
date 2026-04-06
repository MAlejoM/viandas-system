export interface IUsuario {
  id: number;
  email: string;
  password: string;
  nombre: string;
  rol: 'ADMIN' | 'VENDEDOR' | 'CADETE';
  createdAt: Date;
  updatedAt: Date;
}

export interface ICliente {
  id: number;
  nombre: string;
  apellido: string;
  email?: string;
  telefono: string;
  direccion: string;
  zona: 'SAN_LORENZO' | 'IRIONDO';
  restriccionesMedicas?: string;
  preferenciaEntrega: 'DOMICILIO' | 'RETIRO';
  estado: 'ACTIVO' | 'INACTIVO';
  fechaRegistro: Date;
  updatedAt: Date;
}

export interface IMenuSemanal {
  id: number;
  fechaInicioSemana: Date;
  fechaPublicacion?: Date;
  fechaCierrePedidos: Date;
  estado: 'BORRADOR' | 'PUBLICADO' | 'CERRADO';
  precioBase: number;
  costoEnvio: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReceta {
  id: number;
  nombrePlato: string;
  descripcion?: string;
  tipo: 'CARNIVORO' | 'VEGETARIANO';
  diaSemana: string;
  calorias?: number;
  fotoUrl?: string;
  menuId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPedido {
  id: number;
  numeroPedido: string;
  clienteId: number;
  menuId: number;
  fechaPedido: Date;
  fechaEntrega: Date;
  tipoEntrega: 'DOMICILIO' | 'RETIRO';
  direccionEntrega?: string;
  costoEnvio: number;
  total: number;
  estado: 'PENDIENTE' | 'CONFIRMADO' | 'ENTREGADO' | 'CANCELADO';
  notasAdicionales?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthPayload {
  id: number;
  email: string;
  rol: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}
