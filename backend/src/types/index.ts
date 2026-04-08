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
  calorias?: number;
  fotoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  menus?: IMenuReceta[];
  ingredientes?: IRecetaIngrediente[];
}

export interface IMenuReceta {
  id: number;
  menuId: number;
  recetaId: number;
  diaSemana: 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO' | 'DOMINGO';
  menu?: IMenuSemanal;
  receta?: IReceta;
}

export interface IIngrediente {
  id: number;
  nombre: string;
  unidadMedida: string;
  costoUnitario: number;
  categoria: 'PROTEINA' | 'VEGETAL' | 'CEREAL' | 'LACTEO' | 'CONDIMENTO' | 'OTRO';
  createdAt: Date;
  updatedAt: Date;
  recetas?: IRecetaIngrediente[];
}

export interface IRecetaIngrediente {
  id: number;
  recetaId: number;
  ingredienteId: number;
  cantidad: number;
  unidadMedida: string;
  receta?: IReceta;
  ingrediente?: IIngrediente;
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
  estado: 'PENDIENTE' | 'CONFIRMADO' | 'PREPARADO' | 'ENTREGADO' | 'CANCELADO';
  notasAdicionales?: string;
  createdAt: Date;
  updatedAt: Date;
  cliente?: ICliente;
  menu?: IMenuSemanal;
  detalles?: IPedidoDetalle[];
}

export interface IPedidoDetalle {
  id: number;
  pedidoId: number;
  recetaId: number;
  diaSemana: 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO' | 'DOMINGO';
  recetaReemplazoId?: number;
  motivo?: string;
  pedido?: IPedido;
  receta?: IReceta;
  recetaReemplazo?: IReceta;
}

export interface IPago {
  id: number;
  pedidoId: number;
  monto: number;
  metodoPago: 'EFECTIVO' | 'TRANSFERENCIA';
  estado: 'PENDIENTE' | 'PAGADO' | 'VERIFICADO';
  comprobanteUrl?: string;
  referencia?: string;
  notas?: string;
  fechaPago?: Date;
  createdAt: Date;
  updatedAt: Date;
  pedido?: IPedido;
}

export interface IRutaEntrega {
  id: number;
  fechaEntrega: Date;
  estado: 'PLANIFICADA' | 'EN_CURSO' | 'COMPLETADA';
  horaInicio?: Date;
  horaFin?: Date;
  notas?: string;
  createdAt: Date;
  updatedAt: Date;
  detalles?: IRutaDetalle[];
}

export interface IRutaDetalle {
  id: number;
  rutaId: number;
  pedidoId: number;
  ordenEntrega: number;
  horaEstimada?: Date;
  horaReal?: Date;
  estado: 'PENDIENTE' | 'ENTREGADO';
  ruta?: IRutaEntrega;
  pedido?: IPedido;
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
