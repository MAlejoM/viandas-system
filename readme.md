# Sistema de gestion de viandas

Sistema full-stack para gestionar un negocio de viandas semanales saludables.

## Características

- Gestión de menús semanales
- Registro y seguimiento de pedidos
- Cálculo automático de ingredientes
- Gestión de clientes y restricciones alimentarias
- Rutas de entrega optimizadas
- Control de pagos (efectivo/transferencia)

## Tecnologas

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
│   ├── prisma/
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

## Variables de entorno

### Backend (.env)

```
DATABASE_URL="postgresql://user:password@localhost:5432/viandas_db"
PORT=3000
NODE_ENV=development
JWT_SECRET=your_secret_key
```

## Base de datos

```bash
# Crear migración
npx prisma migrate dev --name nombre_migracion

# Abrir Prisma Studio
npx prisma studio

# Regenerar cliente
npx prisma generate
```

## Documentación

- [Documentación de CRUDs](./docs/CRUD.md)
- [Diagrama DER](./docs/DER.md)
- [API Endpoints](./docs/API.md)

Proyecto Maitri - Sistema de viandas
