# Sistema de gestión de viandas

Sistema full-stack para gestionar un negocio de viandas semanales saludables.

## Características

- Gestión de menús semanales
- **CRUD de Recetas** (carnívoras/vegetarianas) con filtros por tipo y día
- **CRUD de Ingredientes** con búsqueda y categorización
- Asignación flexible de recetas a menús por día
- Cálculo automático de ingredientes (con unidades personalizables)
- Gestión de clientes y restricciones alimentarias
- Rutas de entrega optimizadas
- Control de pagos (efectivo/transferencia)
- Autenticación JWT

## Tecnologías

### Backend

- Node.js + TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication

### Frontend

- React + TypeScript
- Vite
- TailwindCSS
- React Router
- Axios

## Estructura del proyecto

```
viandas-system/
├── backend/          # API REST
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── types/
│   │   └── index.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
├── frontend/         # Aplicación React
│   ├── src/
│   └── package.json
└── README.md
```

## Instalación

### Prerequisitos

- Node.js >= 18
- PostgreSQL >= 14
- npm >= 9
- Docker (opcional)

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Configurar DATABASE_URL en .env
npx prisma migrate dev
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Con Docker

```bash
docker-compose up -d
# El backend en http://localhost:3000
# PostgreSQL en localhost:5432
# PgAdmin en http://localhost:5050
```

## Variables de entorno

### Backend (.env)

```
DATABASE_URL="postgresql://admin:admin123@localhost:5432/viandas_db"
PORT=3000
NODE_ENV=development
JWT_SECRET=your_secret_key_here
```

## API Endpoints

### Health
- `GET /api/health` - Estado del servidor

### Usuarios
- `POST /api/usuarios/registro` - Crear usuario
- `POST /api/usuarios/login` - Autenticarse
- `GET /api/usuarios/perfil` - Mi perfil (auth required)
- `GET /api/usuarios` - Listar usuarios (auth required)

### Clientes
- `POST /api/clientes` - Crear cliente (auth required)
- `GET /api/clientes` - Listar clientes
- `GET /api/clientes/:id` - Obtener cliente
- `GET /api/clientes/zona/:zona` - Clientes por zona
- `PUT /api/clientes/:id` - Actualizar (auth required)
- `DELETE /api/clientes/:id` - Eliminar (auth required)

### Menús
- `POST /api/menus` - Crear menú (auth required)
- `GET /api/menus` - Listar menús
- `GET /api/menus/activos` - Menús activos
- `GET /api/menus/:id` - Obtener menú
- `PUT /api/menus/:id` - Actualizar (auth required)
- `DELETE /api/menus/:id` - Eliminar (auth required)

### Recetas
- `POST /api/recetas` - Crear receta (auth required)
- `GET /api/recetas` - Listar recetas
- `GET /api/recetas/:id` - Obtener receta
- `GET /api/recetas/tipo/:tipo` - Recetas carnívoras/vegetarianas
- `GET /api/recetas/dia/:dia` - Recetas por día (LUNES-DOMINGO)
- `GET /api/recetas/menu/:menuId/dia/:dia` - Recetas de menú por día
- `GET /api/recetas/menu/:menuId/tipo/:tipo` - Recetas de menú por tipo
- `PUT /api/recetas/:id` - Actualizar (auth required)
- `DELETE /api/recetas/:id` - Eliminar (auth required)
- `POST /api/recetas/:recetaId/ingredientes` - Agregar ingrediente (auth required)
- `GET /api/recetas/:recetaId/ingredientes` - Ingredientes de receta
- `DELETE /api/recetas/:recetaId/ingredientes/:ingredienteId` - Remover ingrediente (auth required)

### Ingredientes
- `POST /api/ingredientes` - Crear ingrediente (auth required)
- `GET /api/ingredientes` - Listar ingredientes
- `GET /api/ingredientes/:id` - Obtener ingrediente
- `GET /api/ingredientes/search?nombre=...` - Buscar por nombre
- `GET /api/ingredientes/categoria/:categoria` - Ingredientes por categoría
- `PUT /api/ingredientes/:id` - Actualizar (auth required)
- `DELETE /api/ingredientes/:id` - Eliminar (auth required)

### Menú-Recetas (Asignaciones)
- `POST /api/menus-recetas/:menuId/:recetaId` - Asignar receta a menú (auth required)
- `GET /api/menus-recetas/:menuId` - Recetas de menú
- `GET /api/menus-recetas/:menuId/dia/:diaSemana` - Recetas por día
- `PUT /api/menus-recetas/:menuId/:recetaId/dia` - Cambiar día (auth required)
- `DELETE /api/menus-recetas/:menuId/:recetaId` - Remover (auth required)

### Pedidos
- `POST /api/pedidos` - Crear pedido (auth required)
- `GET /api/pedidos` - Listar pedidos (auth required)
- `GET /api/pedidos/:id` - Obtener pedido (auth required)
- `GET /api/pedidos/cliente/:clienteId` - Pedidos de cliente (auth required)
- `GET /api/pedidos/estado/:estado` - Pedidos por estado (auth required)
- `PUT /api/pedidos/:id` - Actualizar (auth required)
- `DELETE /api/pedidos/:id` - Eliminar (auth required)

## Base de datos

```bash
# Crear migración
npm run prisma:migrate -- --name nombre_migracion

# Sincronizar sin migración
npm run prisma:push

# Abrir Prisma Studio
npm run prisma:studio

# Regenerar cliente
npm run prisma:generate
```

## Scripts disponibles

```bash
# Backend
npm run dev              # Desarrollo con hot-reload
npm run build            # Compilar TypeScript
npm start                # Ejecutar producción
npm run prisma:generate  # Regenerar cliente Prisma
npm run prisma:migrate   # Crear/aplicar migraciones
npm run prisma:push      # Sincronizar BD sin migraciones
npm run prisma:studio    # Abrir Prisma Studio
```

## Documentación

Drive: https://drive.google.com/drive/folders/1IFRApqsO8bIXcfKKKV9QBcZldGKy5x1K?usp=sharing

## Autor

Equipo Maitri Viandas

Proyecto Maitri - Sistema de viandas
