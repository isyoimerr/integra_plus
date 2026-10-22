import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

dotenv.config();
const prisma = new PrismaClient();

const DEMO_PASS = await bcryptjs.hash('password', 10);

async function main() {
  console.log('🌱 Sembrando datos de prueba...\n');

  // ── 1. NIVELES ──────────────────────────────────────────────
  console.log('📚 Creando/actualizando niveles...');

  const nivelesData = [
    { id: 1, nombre: 'Nivel 0', subtitulo: 'Repaso de Bases',             modulo: 0, dificultad: 1, color: '#2E7D32', prereq: null },
    { id: 2, nombre: 'Nivel 1', subtitulo: 'Integral Indefinida',          modulo: 1, dificultad: 2, color: '#1565C0', prereq: 1 },
    { id: 3, nombre: 'Nivel 2', subtitulo: 'Integral Definida',            modulo: 2, dificultad: 3, color: '#7E57C2', prereq: 2 },
    { id: 4, nombre: 'Nivel 3', subtitulo: 'Técnicas de Integración',      modulo: 3, dificultad: 3, color: '#E67E22', prereq: 3 },
    { id: 5, nombre: 'Nivel 4', subtitulo: 'Aplicaciones de la Integral',  modulo: 4, dificultad: 4, color: '#E53935', prereq: 4 },
    { id: 6, nombre: 'Nivel 5', subtitulo: 'Integrales Impropias',         modulo: 5, dificultad: 5, color: '#00897B', prereq: 5 },
    { id: 7, nombre: 'Nivel 6', subtitulo: 'Ecuaciones Diferenciales',     modulo: 6, dificultad: 5, color: '#5E35B1', prereq: 6 },
  ];

  for (const n of nivelesData) {
    await prisma.nivel.upsert({
      where: { nivId: n.id },
      update: {
        nivNombre: n.nombre,
        nivSubtitulo: n.subtitulo,
        nivModulo: n.modulo,
        nivDificultad: n.dificultad,
        nivColor: n.color,
        nivPrerequisito: n.prereq,
        nivDesbloqueado: n.prereq === null,
      },
      create: {
        nivId: n.id,
        nivNombre: n.nombre,
        nivSubtitulo: n.subtitulo,
        nivModulo: n.modulo,
        nivDificultad: n.dificultad,
        nivColor: n.color,
        nivPrerequisito: n.prereq,
        nivDesbloqueado: n.prereq === null,
      },
    });
    console.log(`   ✅ ${n.nombre} (ID ${n.id})`);
  }

  // ── 2. USUARIOS DE PRUEBA ──────────────────────────────────
  console.log('\n👤 Creando usuarios de prueba...');

  const testUsers = [
    { email: 'avanzado@test.com',  nombre: 'María Avanzado',  rol: 'estudiante', nivelCompletado: 5, errores: 2, racha: 12, puntaje: 1250 },
    { email: 'intermedio@test.com', nombre: 'Carlos Medio',   rol: 'estudiante', nivelCompletado: 3, errores: 5, racha: 7,  puntaje: 680 },
    { email: 'principiante@test.com', nombre: 'Ana Base',     rol: 'estudiante', nivelCompletado: 1, errores: 3, racha: 3,  puntaje: 150 },
    { email: 'nuevo@test.com',      nombre: 'Luis Nuevo',     rol: 'estudiante', nivelCompletado: 0, errores: 0, racha: 0,  puntaje: 0 },
  ];

  const createdStudents = [];

  for (const u of testUsers) {
    const usuario = await prisma.usuario.upsert({
      where: { usuCorreo: u.email },
      update: { usuNombre: u.nombre, usuRol: u.rol },
      create: {
        usuNombre: u.nombre,
        usuCorreo: u.email,
        usuContrasena: DEMO_PASS,
        usuRol: u.rol,
      },
    });

    const estudiante = await prisma.estudiante.upsert({
      where: { estUsuId: usuario.usuId },
      update: {
        estPuntaje: u.puntaje,
        estRachaDias: u.racha,
        estNivelActual: u.nivelCompletado,
        estUltimoAcc: new Date(Date.now() - Math.floor(Math.random() * 86400000)),
      },
      create: {
        estUsuId: usuario.usuId,
        estPuntaje: u.puntaje,
        estRachaDias: u.racha,
        estNivelActual: u.nivelCompletado,
        estUltimoAcc: new Date(Date.now() - Math.floor(Math.random() * 86400000)),
      },
    });

    await prisma.estadoSigma.upsert({
      where: { sigEstId: estudiante.estId },
      update: {
        sigModo: u.errores > 3 ? 'apoyo' : 'guia',
        sigErroresCons: Math.min(u.errores, 3),
        sigNivActual: Math.min(u.nivelCompletado + 1, 7),
      },
      create: {
        sigEstId: estudiante.estId,
        sigModo: u.errores > 3 ? 'apoyo' : 'guia',
        sigErroresCons: Math.min(u.errores, 3),
        sigNivActual: Math.min(u.nivelCompletado + 1, 7),
      },
    });

    createdStudents.push({ usuario, estudiante, config: u });
    console.log(`   ✅ ${u.nombre} (${u.email}) — ${u.puntaje}pts, racha ${u.racha}d`);
  }

  // ── 3. PROGRESO ─────────────────────────────────────────────
  console.log('\n📊 Creando progreso...');

  for (const { estudiante, config } of createdStudents) {
    for (let nivId = 1; nivId <= config.nivelCompletado; nivId++) {
      const errores = nivId === config.nivelCompletado ? config.errores : Math.floor(Math.random() * 3);
      const puntos = nivId * 250 + Math.floor(Math.random() * 50);

      await prisma.progreso.upsert({
        where: { proEstId_proNivId: { proEstId: estudiante.estId, proNivId: nivId } },
        update: {
          proPorcentaje: 100,
          proCompletado: true,
          proIntentos: 1 + errores,
          proErrores: errores,
          proPuntos: puntos,
        },
        create: {
          proEstId: estudiante.estId,
          proNivId: nivId,
          proPorcentaje: 100,
          proCompletado: true,
          proIntentos: 1 + errores,
          proErrores: errores,
          proPuntos: puntos,
        },
      });
    }
    console.log(`   ✅ ${config.nombre}: ${config.nivelCompletado} niveles completados`);
  }

  // ── 4. RESULTADOS DE EJEMPLO ────────────────────────────────
  console.log('\n📝 Creando resultados de ejemplo...');

  const ejercicios = await prisma.ejercicio.findMany();
  if (ejercicios.length > 0) {
    for (const { estudiante, config } of createdStudents.slice(0, 2)) {
      for (const ej of ejercicios.slice(0, 6)) {
        const correcto = Math.random() > 0.3;
        await prisma.resultado.create({
          data: {
            resEstId: estudiante.estId,
            resEjId: ej.ejId,
            resRespuesta: correcto ? ej.ejRespuesta : 'respuesta_incorrecta',
            resCorrecto: correcto,
            resTiempoSeg: Math.floor(30 + Math.random() * 120),
            resIntento: 1,
            resTimestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 86400000)),
          },
        });
      }
    }
    console.log(`   ✅ Resultados creados para estudiantes avanzados`);
  } else {
    console.log('   ⏭️  No hay ejercicios en DB, saltando resultados');
  }

  console.log('\n──────────────────────────────────────');
  console.log('🌱  Siembra completada exitosamente!');
  console.log('──────────────────────────────────────');
  console.log('\n📧  Credenciales de prueba:');
  console.log('   Todos los usuarios → contraseña: "password"');
  console.log('   ┌──────────────────────────────┬──────────────┐');
  console.log('   │ Email                        │ Perfil       │');
  console.log('   ├──────────────────────────────┼──────────────┤');
  console.log('   │ avanzado@test.com            │ 5 niveles    │');
  console.log('   │ intermedio@test.com            │ 3 niveles    │');
  console.log('   │ principiante@test.com        │ 1 nivel      │');
  console.log('   │ nuevo@test.com               │ 0 niveles    │');
  console.log('   └──────────────────────────────┴──────────────┘');
  console.log(`\n📚  ${nivelesData.length} niveles en DB`);
  console.log(`👤  ${createdStudents.length} estudiantes de prueba`);
}

main()
  .catch((e) => {
    console.error('❌ Error durante siembra:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
