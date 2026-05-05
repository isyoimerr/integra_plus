// test-recovery.mjs (ESM)
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const BASE = 'http://localhost:5000';

async function main() {
  const email = 'estudiante@demo.com';
  
  // 1. Solicitar
  console.log('\n1. Solicitar recuperación...');
  const r1 = await fetch(`${BASE}/api/auth/solicitar-recuperacion`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  const j1 = await r1.json();
  console.log('  Respuesta:', j1);

  // Obtener código de BD
  const codeRow = await prisma.codigoRecuperacion.findFirst({
    where: { recUsuId: 1, recUsado: false },
    orderBy: { recFechaCre: 'desc' }
  });
  console.log('  Código en BD:', codeRow?.recCodigo);

  // 2. Verificar
  console.log('\n2. Verificar código...');
  const r2 = await fetch(`${BASE}/api/auth/verificar-codigo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, codigo: codeRow.recCodigo })
  });
  const j2 = await r2.json();
  console.log('  Respuesta:', j2);
  const tempToken = j2.tempToken;

  // 3. Resetear
  console.log('\n3. Resetear contraseña...');
  const r3 = await fetch(`${BASE}/api/auth/resetear-contrasena`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, tempToken, newPassword: 'nuevaPassword123' })
  });
  const j3 = await r3.json();
  console.log('  Respuesta:', j3);

  // 4. Login con nueva contraseña
  console.log('\n4. Login con nueva contraseña...');
  const r4 = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'nuevaPassword123' })
  });
  const j4 = await r4.json();
  console.log('  Login:', j4 ? 'ÉXITO ✓' : 'FALLO ✗');

  // 5. Limpiar - restaurar contraseña original
  console.log('\n5. Restaurando contraseña original...');
  const hashed = await bcryptjs.hash('password', 10);
  await prisma.usuario.update({
    where: { usuCorreo: email },
    data: { usuContrasena: hashed }
  });
  await prisma.codigoRecuperacion.deleteMany({ where: { recUsuId: 1 } });
  console.log('  Listo ✓');

  await prisma.$disconnect();
}

main().catch(async e => {
  console.error('ERROR:', e.message);
  await prisma.$disconnect();
  process.exit(1);
});
