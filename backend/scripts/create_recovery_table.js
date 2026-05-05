import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS codigos_recuperacion (
        rec_id         INT AUTO_INCREMENT PRIMARY KEY,
        rec_usu_id     INT NOT NULL,
        rec_codigo     VARCHAR(6) NOT NULL,
        rec_expiracion TIMESTAMP NOT NULL,
        rec_usado      BOOLEAN DEFAULT FALSE,
        rec_fecha_cre  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (rec_usu_id) REFERENCES usuarios(usu_id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('✓ Tabla codigos_recuperacion creada o ya existente');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
