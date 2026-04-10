import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Iniciando seed de la base de datos...');

  const adminEmail = 'admin@viandas.com';

  // Upsert: si existe → actualiza password a plain text; si no → lo crea
  const admin = await prisma.usuario.upsert({
    where: { email: adminEmail },
    update: {
      password: 'admin123', // Resetea a plain text (por si tenía bcrypt)
      nombre: 'Administrador',
    },
    create: {
      email: adminEmail,
      password: 'admin123',
      nombre: 'Administrador',
      rol: 'ADMIN',
    },
  });

  console.log(`✅ Usuario admin listo: ${admin.email} (ID: ${admin.id})`);
  console.log('\n📋 Credenciales de acceso:');
  console.log('   Email:    admin@viandas.com');
  console.log('   Password: admin123');
  console.log('\n¡Seed completado!');
}

seed()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
