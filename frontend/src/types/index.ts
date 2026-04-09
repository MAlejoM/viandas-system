// ========================================
// ENUMS Y TIPOS
// ========================================

export type Rol = 'ADMIN' | 'VENDEDOR' | 'CADETE';
export type Zona = 'SAN_LORENZO' | 'IRIONDO';
export type TipoEntrega = 'DOMICILIO' | 'RETIRO';
export type EstadoCliente = 'ACTIVO' | 'INACTIVO';
export type EstadoMenu = 'BORRADOR' | 'PUBLICADO' | 'CERRADO';
export type TipoReceta = 'CARNIVORO' | 'VEGETARIANO';
export type DiaSemana = 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO' | 'DOMINGO';
export type CategoriaIngrediente = 'PROTEINA' | 'VEGETAL' | 'CEREAL' | 'LACTEO' | 'CONDIMENTO' | 'OTRO';
export type EstadoPedido = 'PENDIENTE' | 'CONFIRMADO' | 'PREPARADO' | 'ENTREGADO' | 'CANCELADO';

// ========================================
// INTERFACES
// ========================================

export interface IUsuario {
  id: number;
  email: string;
  password?: string;
  nombre: string;
  rol: Rol;
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
  zona: Zona;
  restriccionesMedicas?: string;
  preferenciaEntrega: TipoEntrega;
  estado: EstadoCliente;
  fechaRegistro: Date;
  updatedAt: Date;
}

export interface IMenuSemanal {
  id: number;
  fechaInicioSemana: Date;
  fechaPublicacion?: Date;
  fechaCierrePedidos: Date;
  estado: EstadoMenu;
  precioBase: number;
  costoEnvio: number;
  createdAt: Date;
  updatedAt: Date;
  recetas?: IMenuReceta[];
  pedidos?: IPedido[];
}

export interface IReceta {
  id: number;
  nombrePlato: string;
  descripcion?: string;
  tipo: TipoReceta;
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
  diaSemana: DiaSemana;
  menu?: IMenuSemanal;
  receta?: IReceta;
}

export interface IIngrediente {
  id: number;
  nombre: string;
  unidadMedida: string;
  costoUnitario: number;
  categoria: CategoriaIngrediente;
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
  tipoEntrega: TipoEntrega;
  direccionEntrega?: string;
  costoEnvio: number;
  total: number;
  estado: EstadoPedido;
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
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  recetaReemplazoId?: number;
  pedido?: IPedido;
  receta?: IReceta;
  recetaReemplazo?: IReceta;
}

// ========================================
// TIPOS DE FORMULARIOS
// ========================================

export interface FormaReceta extends Omit<IReceta, 'createdAt' | 'updatedAt' | 'id' | 'menus' | 'ingredientes'> {
  id?: number;
}

export interface FormIngrediente extends Omit<IIngrediente, 'createdAt' | 'updatedAt' | 'id' | 'recetas'> {
  id?: number;
}

export interface FormRecetaIngrediente extends Omit<IRecetaIngrediente, 'id' | 'receta' | 'ingrediente' | 'recetaId'> {
  recetaId?: number;
}

// ========================================
// TIPOS DE RESPUESTAS API
// ========================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
