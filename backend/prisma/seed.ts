import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─── Helper: fecha normalizada a UTC medianoche ────────────────────────────────
const fecha = (offsetDias: number): Date => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offsetDias);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

/**
 * Calcula el lunes de la semana actual y le aplica un offset en semanas.
 * offset = 0  → lunes de esta semana
 * offset = -1 → lunes de la semana pasada
 * offset = -2 → lunes de hace 2 semanas
 * offset = +1 → lunes de la semana que viene
 */
const lunesDeReferencia = (offsetSemanas: number = 0): Date => {
  const hoy = new Date();
  const diaActual = hoy.getUTCDay(); // 0=Dom, 1=Lun...
  // Días hasta el lunes de esta semana (hacia atrás, 0 si hoy es lunes)
  const diasDesdeEstaSemanasLunes = diaActual === 0 ? 6 : diaActual - 1;
  const d = new Date(hoy);
  d.setUTCDate(hoy.getUTCDate() - diasDesdeEstaSemanasLunes + offsetSemanas * 7);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};


async function main() {
  console.log('🌱 Iniciando seed completo de la base de datos...\n');

  // ══════════════════════════════════════════════════════════════════════════
  // 0. LIMPIEZA — orden inverso de dependencias
  // ══════════════════════════════════════════════════════════════════════════
  console.log('🧹 Limpiando tablas existentes...');
  await prisma.rutaDetalle.deleteMany();
  await prisma.rutaEntrega.deleteMany();
  await prisma.pago.deleteMany();
  await prisma.pedidoDetalle.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.menuReceta.deleteMany();
  await prisma.menuSemanal.deleteMany();
  await prisma.recetaIngrediente.deleteMany();
  await prisma.receta.deleteMany();
  await prisma.ingrediente.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.usuario.deleteMany();
  console.log('✅ Base de datos limpia.\n');

  // ══════════════════════════════════════════════════════════════════════════
  // 1. USUARIOS
  // ══════════════════════════════════════════════════════════════════════════
  console.log('👤 Creando usuarios...');
  await prisma.usuario.createMany({
    data: [
      { email: 'admin@maitri.com',   password: 'admin123',   nombre: 'Administrador Maitri', rol: 'ADMIN' },
      { email: 'vendedor@maitri.com', password: 'vendedor123', nombre: 'Laura Vendedora',      rol: 'VENDEDOR' },
      { email: 'cadete@maitri.com',  password: 'cadete123',  nombre: 'Marcos Cadete',         rol: 'CADETE' },
    ],
  });
  console.log('   ✅ 3 usuarios creados');

  // ══════════════════════════════════════════════════════════════════════════
  // 2. CLIENTES (10 clientes — mix de zonas, entregas y estados)
  // ══════════════════════════════════════════════════════════════════════════
  console.log('👥 Creando clientes...');
  await prisma.cliente.createMany({
    data: [
      {
        nombre: 'Juan',      apellido: 'Pérez',      email: 'juan.perez@mail.com',
        telefono: '3476110001', direccion: 'Urquiza 1234, San Lorenzo',
        zona: 'SAN_LORENZO', preferenciaEntrega: 'DOMICILIO', estado: 'ACTIVO',
      },
      {
        nombre: 'María',     apellido: 'García',     email: 'maria.garcia@mail.com',
        telefono: '3476110002', direccion: 'Belgrano 456, San Lorenzo',
        zona: 'SAN_LORENZO', preferenciaEntrega: 'DOMICILIO', estado: 'ACTIVO',
        restriccionesMedicas: 'Sin gluten',
      },
      {
        nombre: 'Carlos',    apellido: 'López',
        telefono: '3476110003', direccion: 'San Martín 789, San Lorenzo',
        zona: 'SAN_LORENZO', preferenciaEntrega: 'RETIRO', estado: 'ACTIVO',
      },
      {
        nombre: 'Ana',       apellido: 'Martínez',   email: 'ana.martinez@mail.com',
        telefono: '3476110004', direccion: 'Rivadavia 321, San Lorenzo',
        zona: 'SAN_LORENZO', preferenciaEntrega: 'DOMICILIO', estado: 'ACTIVO',
        restriccionesMedicas: 'Diabetes tipo 2 — bajo en azúcar',
      },
      {
        nombre: 'Roberto',   apellido: 'Fernández',
        telefono: '3476110005', direccion: 'Mitre 654, San Lorenzo',
        zona: 'SAN_LORENZO', preferenciaEntrega: 'DOMICILIO', estado: 'INACTIVO',
      },
      {
        nombre: 'Sofía',     apellido: 'Torres',     email: 'sofia.torres@mail.com',
        telefono: '3476110006', direccion: 'Pellegrini 147, Totoras',
        zona: 'IRIONDO', preferenciaEntrega: 'RETIRO', estado: 'ACTIVO',
      },
      {
        nombre: 'Diego',     apellido: 'Ramírez',    email: 'diego.ramirez@mail.com',
        telefono: '3476110007', direccion: 'Alvear 258, Totoras',
        zona: 'IRIONDO', preferenciaEntrega: 'DOMICILIO', estado: 'ACTIVO',
      },
      {
        nombre: 'Lucía',     apellido: 'Sánchez',
        telefono: '3476110008', direccion: 'Independencia 369, Totoras',
        zona: 'IRIONDO', preferenciaEntrega: 'DOMICILIO', estado: 'ACTIVO',
        restriccionesMedicas: 'Vegetariana estricta',
      },
      {
        nombre: 'Martín',    apellido: 'Gómez',      email: 'martin.gomez@mail.com',
        telefono: '3476110009', direccion: 'Córdoba 741, Totoras',
        zona: 'IRIONDO', preferenciaEntrega: 'RETIRO', estado: 'ACTIVO',
      },
      {
        nombre: 'Valentina', apellido: 'Ruiz',       email: 'vale.ruiz@mail.com',
        telefono: '3476110010', direccion: 'Moreno 852, Totoras',
        zona: 'IRIONDO', preferenciaEntrega: 'DOMICILIO', estado: 'ACTIVO',
      },
    ],
  });
  console.log('   ✅ 10 clientes creados');

  // ══════════════════════════════════════════════════════════════════════════
  // 3. INGREDIENTES (14 ingredientes — todas las categorías)
  // ══════════════════════════════════════════════════════════════════════════
  console.log('🧂 Creando ingredientes...');
  const [
    pechuPollo, carneVacuna, salmón, lentejas, garbanzos,
    arrozIntegral, quinoa, zapallo, espinaca, zanahoria,
    tomate, aceiteOliva, ajo, caldo
  ] = await Promise.all([
    prisma.ingrediente.create({ data: { nombre: 'Pechuga de Pollo',    categoria: 'PROTEINA',   unidadMedida: 'kg',  costoUnitario: 5200 } }),
    prisma.ingrediente.create({ data: { nombre: 'Carne Vacuna Magra',  categoria: 'PROTEINA',   unidadMedida: 'kg',  costoUnitario: 7500 } }),
    prisma.ingrediente.create({ data: { nombre: 'Salmón Rosado',       categoria: 'PROTEINA',   unidadMedida: 'kg',  costoUnitario: 12000 } }),
    prisma.ingrediente.create({ data: { nombre: 'Lentejas',            categoria: 'PROTEINA',   unidadMedida: 'kg',  costoUnitario: 1400 } }),
    prisma.ingrediente.create({ data: { nombre: 'Garbanzos',           categoria: 'PROTEINA',   unidadMedida: 'kg',  costoUnitario: 1600 } }),
    prisma.ingrediente.create({ data: { nombre: 'Arroz Integral',      categoria: 'CEREAL',     unidadMedida: 'kg',  costoUnitario: 1100 } }),
    prisma.ingrediente.create({ data: { nombre: 'Quinoa',              categoria: 'CEREAL',     unidadMedida: 'kg',  costoUnitario: 2800 } }),
    prisma.ingrediente.create({ data: { nombre: 'Zapallo',             categoria: 'VEGETAL',    unidadMedida: 'kg',  costoUnitario: 600 } }),
    prisma.ingrediente.create({ data: { nombre: 'Espinaca',            categoria: 'VEGETAL',    unidadMedida: 'kg',  costoUnitario: 900 } }),
    prisma.ingrediente.create({ data: { nombre: 'Zanahoria',           categoria: 'VEGETAL',    unidadMedida: 'kg',  costoUnitario: 500 } }),
    prisma.ingrediente.create({ data: { nombre: 'Tomate Perita',       categoria: 'VEGETAL',    unidadMedida: 'kg',  costoUnitario: 800 } }),
    prisma.ingrediente.create({ data: { nombre: 'Aceite de Oliva',     categoria: 'CONDIMENTO', unidadMedida: 'lt',  costoUnitario: 4500 } }),
    prisma.ingrediente.create({ data: { nombre: 'Ajo',                 categoria: 'CONDIMENTO', unidadMedida: 'kg',  costoUnitario: 3000 } }),
    prisma.ingrediente.create({ data: { nombre: 'Caldo de Verduras',   categoria: 'OTRO',       unidadMedida: 'lt',  costoUnitario: 800 } }),
  ]);
  console.log('   ✅ 14 ingredientes creados');

  // ══════════════════════════════════════════════════════════════════════════
  // 4. RECETAS (8 recetas — 5 carnívoras, 3 vegetarianas)
  // ══════════════════════════════════════════════════════════════════════════
  console.log('🍽️  Creando recetas...');
  const [r1, r2, r3, r4, r5, r6, r7, r8] = await Promise.all([
    prisma.receta.create({
      data: {
        nombrePlato: 'Pollo en Salsa Criolla',
        descripcion: 'Pechuga de pollo en salsa criolla casera con arroz integral.',
        tipo: 'CARNIVORO', calorias: 480,
        ingredientes: { createMany: { data: [
          { ingredienteId: pechuPollo.id, cantidad: 0.20, unidadMedida: 'kg' },
          { ingredienteId: arrozIntegral.id, cantidad: 0.10, unidadMedida: 'kg' },
          { ingredienteId: tomate.id, cantidad: 0.15, unidadMedida: 'kg' },
          { ingredienteId: ajo.id, cantidad: 0.01, unidadMedida: 'kg' },
          { ingredienteId: aceiteOliva.id, cantidad: 0.02, unidadMedida: 'lt' },
        ]}},
      },
    }),
    prisma.receta.create({
      data: {
        nombrePlato: 'Milanesa de Carne con Puré de Zapallo',
        descripcion: 'Milanesa de carne vacuna al horno con puré de zapallo.',
        tipo: 'CARNIVORO', calorias: 560,
        ingredientes: { createMany: { data: [
          { ingredienteId: carneVacuna.id, cantidad: 0.22, unidadMedida: 'kg' },
          { ingredienteId: zapallo.id, cantidad: 0.25, unidadMedida: 'kg' },
          { ingredienteId: aceiteOliva.id, cantidad: 0.02, unidadMedida: 'lt' },
        ]}},
      },
    }),
    prisma.receta.create({
      data: {
        nombrePlato: 'Salmón al Limón con Quinoa y Espinaca',
        descripcion: 'Salmón a la plancha con quinoa y salteado de espinaca.',
        tipo: 'CARNIVORO', calorias: 520,
        ingredientes: { createMany: { data: [
          { ingredienteId: salmón.id, cantidad: 0.18, unidadMedida: 'kg' },
          { ingredienteId: quinoa.id, cantidad: 0.08, unidadMedida: 'kg' },
          { ingredienteId: espinaca.id, cantidad: 0.10, unidadMedida: 'kg' },
          { ingredienteId: aceiteOliva.id, cantidad: 0.02, unidadMedida: 'lt' },
        ]}},
      },
    }),
    prisma.receta.create({
      data: {
        nombrePlato: 'Pollo al Curry con Zanahoria',
        descripcion: 'Trozos de pollo en salsa de curry suave con zanahoria y arroz.',
        tipo: 'CARNIVORO', calorias: 490,
        ingredientes: { createMany: { data: [
          { ingredienteId: pechuPollo.id, cantidad: 0.20, unidadMedida: 'kg' },
          { ingredienteId: zanahoria.id, cantidad: 0.15, unidadMedida: 'kg' },
          { ingredienteId: arrozIntegral.id, cantidad: 0.10, unidadMedida: 'kg' },
          { ingredienteId: ajo.id, cantidad: 0.01, unidadMedida: 'kg' },
        ]}},
      },
    }),
    prisma.receta.create({
      data: {
        nombrePlato: 'Carne Estofada con Vegetales',
        descripcion: 'Carne vacuna estofada lentamente con zapallo y zanahoria.',
        tipo: 'CARNIVORO', calorias: 530,
        ingredientes: { createMany: { data: [
          { ingredienteId: carneVacuna.id, cantidad: 0.22, unidadMedida: 'kg' },
          { ingredienteId: zanahoria.id, cantidad: 0.10, unidadMedida: 'kg' },
          { ingredienteId: zapallo.id, cantidad: 0.15, unidadMedida: 'kg' },
          { ingredienteId: caldo.id, cantidad: 0.20, unidadMedida: 'lt' },
        ]}},
      },
    }),
    prisma.receta.create({
      data: {
        nombrePlato: 'Guiso de Lentejas',
        descripcion: 'Guiso casero de lentejas con tomate y especias mediterráneas.',
        tipo: 'VEGETARIANO', calorias: 390,
        ingredientes: { createMany: { data: [
          { ingredienteId: lentejas.id, cantidad: 0.15, unidadMedida: 'kg' },
          { ingredienteId: tomate.id, cantidad: 0.15, unidadMedida: 'kg' },
          { ingredienteId: zanahoria.id, cantidad: 0.10, unidadMedida: 'kg' },
          { ingredienteId: ajo.id, cantidad: 0.01, unidadMedida: 'kg' },
          { ingredienteId: caldo.id, cantidad: 0.20, unidadMedida: 'lt' },
        ]}},
      },
    }),
    prisma.receta.create({
      data: {
        nombrePlato: 'Bowl de Garbanzos Rostizados',
        descripcion: 'Garbanzos al horno con pimentón, quinoa y vegetales frescos.',
        tipo: 'VEGETARIANO', calorias: 420,
        ingredientes: { createMany: { data: [
          { ingredienteId: garbanzos.id, cantidad: 0.15, unidadMedida: 'kg' },
          { ingredienteId: quinoa.id, cantidad: 0.08, unidadMedida: 'kg' },
          { ingredienteId: espinaca.id, cantidad: 0.10, unidadMedida: 'kg' },
          { ingredienteId: aceiteOliva.id, cantidad: 0.02, unidadMedida: 'lt' },
        ]}},
      },
    }),
    prisma.receta.create({
      data: {
        nombrePlato: 'Budín de Espinaca con Queso',
        descripcion: 'Budín horneado de espinaca fresca con queso derretido.',
        tipo: 'VEGETARIANO', calorias: 360,
        ingredientes: { createMany: { data: [
          { ingredienteId: espinaca.id, cantidad: 0.20, unidadMedida: 'kg' },
          { ingredienteId: ajo.id, cantidad: 0.01, unidadMedida: 'kg' },
          { ingredienteId: aceiteOliva.id, cantidad: 0.02, unidadMedida: 'lt' },
        ]}},
      },
    }),
  ]);
  console.log('   ✅ 8 recetas creadas (5 carnívoras, 3 vegetarianas)');

  // ══════════════════════════════════════════════════════════════════════════
  // 5. MENÚS SEMANALES (4 semanas: -2 cerrada, -1 cerrada, actual borrador, próxima publicada)
  // ══════════════════════════════════════════════════════════════════════════
  console.log('📅 Creando menús semanales...');

  // Semana -2: CERRADA
  const semana2 = await prisma.menuSemanal.create({
    data: {
      fechaInicioSemana: lunesDeReferencia(-2),
      fechaCierrePedidos: fecha(-16),
      estado: 'CERRADO',
      precioBase: 4800,
      costoEnvio: 600,
      fechaPublicacion: fecha(-20),
    },
  });

  // Semana -1: CERRADA
  const semana1 = await prisma.menuSemanal.create({
    data: {
      fechaInicioSemana: lunesDeReferencia(-1),
      fechaCierrePedidos: fecha(-9),
      estado: 'CERRADO',
      precioBase: 5000,
      costoEnvio: 600,
      fechaPublicacion: fecha(-13),
    },
  });

  // Semana actual: BORRADOR (para que la puedan usar en pruebas)
  const semanaActual = await prisma.menuSemanal.create({
    data: {
      fechaInicioSemana: lunesDeReferencia(0),
      fechaCierrePedidos: fecha(-3),
      estado: 'BORRADOR',
      precioBase: 5200,
      costoEnvio: 650,
    },
  });

  // Próxima semana: PUBLICADA
  const semanaSiguiente = await prisma.menuSemanal.create({
    data: {
      fechaInicioSemana: lunesDeReferencia(1),
      fechaCierrePedidos: fecha(3),
      estado: 'PUBLICADO',
      precioBase: 5400,
      costoEnvio: 650,
      fechaPublicacion: new Date(),
    },
  });

  console.log('   ✅ 4 menús semanales creados');

  // ══════════════════════════════════════════════════════════════════════════
  // 6. ASIGNACIÓN DE RECETAS A MENÚS (7 días por menú)
  // ══════════════════════════════════════════════════════════════════════════
  console.log('🗓️  Asignando recetas a menús...');

  await prisma.menuReceta.createMany({
    data: [
      // Semana -2
      { menuId: semana2.id, recetaId: r1.id, diaSemana: 'LUNES' },
      { menuId: semana2.id, recetaId: r6.id, diaSemana: 'MARTES' },
      { menuId: semana2.id, recetaId: r2.id, diaSemana: 'MIERCOLES' },
      { menuId: semana2.id, recetaId: r7.id, diaSemana: 'JUEVES' },
      { menuId: semana2.id, recetaId: r3.id, diaSemana: 'VIERNES' },
      { menuId: semana2.id, recetaId: r6.id, diaSemana: 'SABADO' },
      { menuId: semana2.id, recetaId: r8.id, diaSemana: 'DOMINGO' },
      // Semana -1
      { menuId: semana1.id, recetaId: r4.id, diaSemana: 'LUNES' },
      { menuId: semana1.id, recetaId: r7.id, diaSemana: 'MARTES' },
      { menuId: semana1.id, recetaId: r5.id, diaSemana: 'MIERCOLES' },
      { menuId: semana1.id, recetaId: r8.id, diaSemana: 'JUEVES' },
      { menuId: semana1.id, recetaId: r1.id, diaSemana: 'VIERNES' },
      { menuId: semana1.id, recetaId: r6.id, diaSemana: 'SABADO' },
      { menuId: semana1.id, recetaId: r7.id, diaSemana: 'DOMINGO' },
      // Semana actual (borrador — solo 5 días asignados para probar el aviso)
      { menuId: semanaActual.id, recetaId: r3.id, diaSemana: 'LUNES' },
      { menuId: semanaActual.id, recetaId: r6.id, diaSemana: 'MARTES' },
      { menuId: semanaActual.id, recetaId: r4.id, diaSemana: 'MIERCOLES' },
      { menuId: semanaActual.id, recetaId: r8.id, diaSemana: 'JUEVES' },
      { menuId: semanaActual.id, recetaId: r2.id, diaSemana: 'VIERNES' },
      // Próxima semana (publicada — todo completo)
      { menuId: semanaSiguiente.id, recetaId: r5.id, diaSemana: 'LUNES' },
      { menuId: semanaSiguiente.id, recetaId: r7.id, diaSemana: 'MARTES' },
      { menuId: semanaSiguiente.id, recetaId: r1.id, diaSemana: 'MIERCOLES' },
      { menuId: semanaSiguiente.id, recetaId: r6.id, diaSemana: 'JUEVES' },
      { menuId: semanaSiguiente.id, recetaId: r3.id, diaSemana: 'VIERNES' },
      { menuId: semanaSiguiente.id, recetaId: r8.id, diaSemana: 'SABADO' },
      { menuId: semanaSiguiente.id, recetaId: r7.id, diaSemana: 'DOMINGO' },
    ],
  });
  console.log('   ✅ Recetas asignadas a los 4 menús');

  // ══════════════════════════════════════════════════════════════════════════
  // 7. CLIENTES (referencia para pedidos)
  // ══════════════════════════════════════════════════════════════════════════
  const clientes = await prisma.cliente.findMany({ orderBy: { id: 'asc' } });
  const [c1, c2, c3, c4, , c6, c7, c8, c9, c10] = clientes;

  // ══════════════════════════════════════════════════════════════════════════
  // 8. PEDIDOS (8 pedidos con distintos estados)
  // ══════════════════════════════════════════════════════════════════════════
  console.log('📦 Creando pedidos...');

  const pedido1 = await prisma.pedido.create({
    data: {
      numeroPedido: 'PED-001',
      clienteId: c1.id,
      menuId: semana1.id,
      fechaEntrega: lunesDeReferencia(-1),
      tipoEntrega: 'DOMICILIO',
      direccionEntrega: c1.direccion,
      costoEnvio: 600,
      total: 5600,
      estado: 'ENTREGADO',
      detalles: { createMany: { data: [
        { recetaId: r4.id, diaSemana: 'LUNES' },
        { recetaId: r7.id, diaSemana: 'MARTES' },
        { recetaId: r5.id, diaSemana: 'MIERCOLES' },
      ]}},
    },
  });

  const pedido2 = await prisma.pedido.create({
    data: {
      numeroPedido: 'PED-002',
      clienteId: c2.id,
      menuId: semana1.id,
      fechaEntrega: lunesDeReferencia(-1),
      tipoEntrega: 'DOMICILIO',
      direccionEntrega: c2.direccion,
      costoEnvio: 600,
      total: 5600,
      estado: 'ENTREGADO',
      detalles: { createMany: { data: [
        { recetaId: r4.id, diaSemana: 'LUNES' },
        { recetaId: r8.id, diaSemana: 'MARTES' },
        { recetaId: r1.id, diaSemana: 'MIERCOLES' },
      ]}},
    },
  });

  const pedido3 = await prisma.pedido.create({
    data: {
      numeroPedido: 'PED-003',
      clienteId: c3.id,
      menuId: semana1.id,
      fechaEntrega: lunesDeReferencia(-1),
      tipoEntrega: 'RETIRO',
      costoEnvio: 0,
      total: 5000,
      estado: 'ENTREGADO',
      detalles: { createMany: { data: [
        { recetaId: r7.id, diaSemana: 'LUNES' },
        { recetaId: r8.id, diaSemana: 'MARTES' },
      ]}},
    },
  });

  // Pedidos de la semana siguiente (actual abierta para pedidos)
  const pedido4 = await prisma.pedido.create({
    data: {
      numeroPedido: 'PED-004',
      clienteId: c4.id,
      menuId: semanaSiguiente.id,
      fechaEntrega: lunesDeReferencia(1),
      tipoEntrega: 'DOMICILIO',
      direccionEntrega: c4.direccion,
      costoEnvio: 650,
      total: 6050,
      estado: 'CONFIRMADO',
      notasAdicionales: 'Tocar el timbre al llegar',
      detalles: { createMany: { data: [
        { recetaId: r5.id, diaSemana: 'LUNES' },
        { recetaId: r7.id, diaSemana: 'MARTES' },
        { recetaId: r1.id, diaSemana: 'MIERCOLES' },
      ]}},
    },
  });

  const pedido5 = await prisma.pedido.create({
    data: {
      numeroPedido: 'PED-005',
      clienteId: c6.id,
      menuId: semanaSiguiente.id,
      fechaEntrega: lunesDeReferencia(1),
      tipoEntrega: 'RETIRO',
      costoEnvio: 0,
      total: 5400,
      estado: 'PENDIENTE',
      detalles: { createMany: { data: [
        { recetaId: r7.id, diaSemana: 'LUNES' },
        { recetaId: r6.id, diaSemana: 'MARTES' },
      ]}},
    },
  });

  const pedido6 = await prisma.pedido.create({
    data: {
      numeroPedido: 'PED-006',
      clienteId: c7.id,
      menuId: semanaSiguiente.id,
      fechaEntrega: lunesDeReferencia(1),
      tipoEntrega: 'DOMICILIO',
      direccionEntrega: c7.direccion,
      costoEnvio: 650,
      total: 6050,
      estado: 'CONFIRMADO',
      detalles: { createMany: { data: [
        { recetaId: r5.id, diaSemana: 'LUNES' },
        { recetaId: r7.id, diaSemana: 'MARTES' },
        { recetaId: r6.id, diaSemana: 'MIERCOLES' },
        { recetaId: r8.id, diaSemana: 'JUEVES' },
      ]}},
    },
  });

  const pedido7 = await prisma.pedido.create({
    data: {
      numeroPedido: 'PED-007',
      clienteId: c8.id,
      menuId: semanaSiguiente.id,
      fechaEntrega: lunesDeReferencia(1),
      tipoEntrega: 'DOMICILIO',
      direccionEntrega: c8.direccion,
      costoEnvio: 650,
      total: 6050,
      estado: 'PREPARADO',
      notasAdicionales: 'Cliente veggie estricta — solo recetas vegetarianas',
      detalles: { createMany: { data: [
        { recetaId: r7.id, diaSemana: 'LUNES' },
        { recetaId: r6.id, diaSemana: 'MARTES' },
        { recetaId: r8.id, diaSemana: 'MIERCOLES' },
      ]}},
    },
  });

  const pedido8 = await prisma.pedido.create({
    data: {
      numeroPedido: 'PED-008',
      clienteId: c9.id,
      menuId: semanaSiguiente.id,
      fechaEntrega: lunesDeReferencia(1),
      tipoEntrega: 'RETIRO',
      costoEnvio: 0,
      total: 5400,
      estado: 'CANCELADO',
      notasAdicionales: 'Cancelado por el cliente',
      detalles: { createMany: { data: [
        { recetaId: r5.id, diaSemana: 'LUNES' },
      ]}},
    },
  });

  console.log('   ✅ 8 pedidos creados (varios estados)');

  // ══════════════════════════════════════════════════════════════════════════
  // 9. PAGOS
  // ══════════════════════════════════════════════════════════════════════════
  console.log('💰 Creando pagos...');
  await prisma.pago.createMany({
    data: [
      {
        pedidoId: pedido1.id, monto: 5600, metodoPago: 'TRANSFERENCIA',
        estado: 'VERIFICADO', referencia: 'MP-20240401-001',
        fechaPago: lunesDeReferencia(-1), notas: 'Transferencia confirmada',
      },
      {
        pedidoId: pedido2.id, monto: 5600, metodoPago: 'EFECTIVO',
        estado: 'VERIFICADO', fechaPago: lunesDeReferencia(-1),
      },
      {
        pedidoId: pedido3.id, monto: 5000, metodoPago: 'TRANSFERENCIA',
        estado: 'VERIFICADO', referencia: 'MP-20240401-003',
        fechaPago: lunesDeReferencia(-1),
      },
      {
        pedidoId: pedido4.id, monto: 6050, metodoPago: 'TRANSFERENCIA',
        estado: 'PAGADO', referencia: 'MP-20240408-004', fechaPago: fecha(-1),
      },
      {
        pedidoId: pedido5.id, monto: 5400, metodoPago: 'EFECTIVO',
        estado: 'PENDIENTE',
      },
      {
        pedidoId: pedido6.id, monto: 6050, metodoPago: 'TRANSFERENCIA',
        estado: 'PAGADO', referencia: 'MP-20240408-006', fechaPago: fecha(-2),
      },
      {
        pedidoId: pedido7.id, monto: 6050, metodoPago: 'TRANSFERENCIA',
        estado: 'VERIFICADO', referencia: 'MP-20240408-007', fechaPago: fecha(-3),
      },
    ],
  });
  console.log('   ✅ 7 pagos creados (distintos estados y métodos)');

  // ══════════════════════════════════════════════════════════════════════════
  // 10. RUTA DE ENTREGA (para la próxima semana)
  // ══════════════════════════════════════════════════════════════════════════
  console.log('🚚 Creando rutas de entrega...');

  const ruta = await prisma.rutaEntrega.create({
    data: {
      fechaEntrega: lunesDeReferencia(1),
      estado: 'PLANIFICADA',
      notas: 'Ruta San Lorenzo + Totoras — semana del ' + lunesDeReferencia(1).toLocaleDateString('es-AR'),
    },
  });

  await prisma.rutaDetalle.createMany({
    data: [
      { rutaId: ruta.id, pedidoId: pedido4.id, ordenEntrega: 1, horaEstimada: (() => { const d = lunesDeReferencia(1); d.setUTCHours(9, 0, 0, 0); return d; })() },
      { rutaId: ruta.id, pedidoId: pedido6.id, ordenEntrega: 2, horaEstimada: (() => { const d = lunesDeReferencia(1); d.setUTCHours(10, 0, 0, 0); return d; })() },
      { rutaId: ruta.id, pedidoId: pedido7.id, ordenEntrega: 3, horaEstimada: (() => { const d = lunesDeReferencia(1); d.setUTCHours(11, 0, 0, 0); return d; })() },
    ],
  });
  console.log('   ✅ 1 ruta de entrega con 3 paradas creada');

  // ══════════════════════════════════════════════════════════════════════════
  // RESUMEN FINAL
  // ══════════════════════════════════════════════════════════════════════════
  console.log('\n' + '═'.repeat(55));
  console.log('🎉 SEED COMPLETADO EXITOSAMENTE');
  console.log('═'.repeat(55));
  console.log('\n📋 Datos cargados:\n');
  console.log('   👤  Usuarios:     3  (admin, vendedor, cadete)');
  console.log('   👥  Clientes:    10  (San Lorenzo + Iriondo)');
  console.log('   🧂  Ingredientes: 14  (todas las categorías)');
  console.log('   🍽️   Recetas:      8  (5 carnívoras + 3 vegetarianas)');
  console.log('   📅  Menús:        4  (cerrado×2, borrador, publicado)');
  console.log('   📦  Pedidos:      8  (varios estados)');
  console.log('   💰  Pagos:        7  (efectivo + transfer)');
  console.log('   🚚  Rutas:        1  (planificada, 3 paradas)');
  console.log('\n🔑 Credenciales:');
  console.log('   admin@maitri.com    /  admin123');
  console.log('   vendedor@maitri.com /  vendedor123');
  console.log('   cadete@maitri.com   /  cadete123');
  console.log('\n');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
