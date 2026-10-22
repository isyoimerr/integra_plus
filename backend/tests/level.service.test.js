import { describe, it, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { setTestEnv, createPrisma, cleanDatabase, seedBaseData } from './helpers/db.js';

setTestEnv();

let prisma;

before(async () => {
  prisma = createPrisma();
  await prisma.$connect();
  await cleanDatabase(prisma);
  await seedBaseData(prisma);
});

after(async () => {
  await cleanDatabase(prisma);
  await prisma.$disconnect();
});

function importLevelService() {
  return import('../src/services/level.service.js').then(m => m.levelService);
}

describe('levelService', { concurrency: false }, () => {
  describe('getAll', () => {
    it('debe retornar niveles ordenados por modulo e id', async () => {
      const { levelService: ls } = await import('../src/services/level.service.js');
      const levels = await ls.getAll();

      assert.ok(Array.isArray(levels));
      assert.equal(levels.length, 3);
      assert.equal(levels[0].modulo, 0);
      assert.equal(levels[1].modulo, 1);
      assert.equal(levels[2].modulo, 2);
    });

    it('debe deduplicar niveles por modulo (solo el primero)', async () => {
      await prisma.nivel.create({
        data: { nivId: 10, nivNombre: 'Duplicado M0', nivModulo: 0, nivDificultad: 1, nivColor: '#000' },
      });

      const { levelService: ls } = await import('../src/services/level.service.js');
      const levels = await ls.getAll();
      const mod0 = levels.filter(l => l.modulo === 0);
      assert.equal(mod0.length, 1, 'Solo debe retornar un nivel por modulo');
      assert.equal(mod0[0].id, 1, 'Debe retornar el primero (id=1), no el duplicado (id=10)');

      await prisma.nivel.delete({ where: { nivId: 10 } });
    });

    it('debe mapear los campos correctamente', async () => {
      const { levelService: ls } = await import('../src/services/level.service.js');
      const [level] = await ls.getAll();

      assert.ok(level.id != null);
      assert.ok(level.nombre != null);
      assert.ok(typeof level.modulo === 'number');
      assert.ok(typeof level.dificultad === 'number');
      assert.ok(typeof level.desbloqueado === 'boolean');
      assert.ok(level.color != null);
    });
  });

  describe('getProgress', () => {
    it('debe retornar array vacio si estudianteId es null/undefined', async () => {
      const { levelService: ls } = await import('../src/services/level.service.js');
      const p1 = await ls.getProgress(null);
      const p2 = await ls.getProgress(undefined);
      assert.deepEqual(p1, []);
      assert.deepEqual(p2, []);
    });

    it('debe retornar array vacio si no hay progreso', async () => {
      const { levelService: ls } = await import('../src/services/level.service.js');
      const progress = await ls.getProgress(999);
      assert.ok(Array.isArray(progress));
      assert.equal(progress.length, 0);
    });

    it('debe retornar progreso con datos del nivel anidado', async () => {
      await prisma.progreso.create({
        data: {
          proEstId: 1,
          proNivId: 1,
          proPorcentaje: 100,
          proCompletado: true,
          proIntentos: 3,
          proErrores: 1,
          proPuntos: 30,
        },
      });

      const { levelService: ls } = await import('../src/services/level.service.js');
      const progress = await ls.getProgress(1);

      assert.equal(progress.length, 1);
      assert.equal(progress[0].estudianteId, 1);
      assert.equal(progress[0].nivelId, 1);
      assert.equal(progress[0].porcentaje, 100);
      assert.equal(progress[0].completado, true);
      assert.equal(progress[0].intentos, 3);
      assert.equal(progress[0].errores, 1);
      assert.equal(progress[0].puntos, 30);
      assert.ok(progress[0].nivel);
      assert.equal(progress[0].nivel.id, 1);

      await prisma.progreso.deleteMany({ where: { proEstId: 1 } });
    });
  });

  describe('complete', () => {
    beforeEach(async () => {
      await prisma.estudiante.update({ where: { estId: 1 }, data: { estPuntaje: 0 } });
      await prisma.progreso.deleteMany({ where: { proEstId: 1 } });
    });

    it('debe rechazar si estudianteId es null', async () => {
      const { levelService: ls } = await import('../src/services/level.service.js');
      await assert.rejects(
        () => ls.complete(null, 1),
        { message: 'Sin identificador de estudiante' },
      );
    });

    it('debe rechazar si el nivel no existe', async () => {
      const { levelService: ls } = await import('../src/services/level.service.js');
      await assert.rejects(
        () => ls.complete(1, 999),
        { message: 'Nivel no encontrado' },
      );
    });

    it('debe rechazar si el prerequisito no esta completado', async () => {
      const { levelService: ls } = await import('../src/services/level.service.js');
      await assert.rejects(
        () => ls.complete(1, 2),
        { message: 'Este nivel está bloqueado. Completa el nivel anterior primero.' },
      );
    });

    it('debe completar nivel, crear progreso y otorgar XP', async () => {
      await prisma.progreso.create({
        data: { proEstId: 1, proNivId: 1, proPorcentaje: 100, proCompletado: true, proErrores: 0, proPuntos: 20 },
      });

      const { levelService: ls } = await import('../src/services/level.service.js');
      const result = await ls.complete(1, 2, 1);

      assert.equal(result.completado, true);
      assert.equal(result.xpGanado, 15);
      assert.equal(result.stars, 2);
      assert.equal(result.ejerciciosTotal, 1);

      const progress = await prisma.progreso.findUnique({
        where: { proEstId_proNivId: { proEstId: 1, proNivId: 2 } },
      });
      assert.ok(progress);
      assert.equal(progress.proCompletado, true);
      assert.equal(progress.proPorcentaje, 100);
      assert.equal(progress.proErrores, 1);
      assert.equal(progress.proPuntos, 15);

      const student = await prisma.estudiante.findUnique({ where: { estId: 1 } });
      assert.equal(student.estPuntaje, 15);

      await prisma.progreso.deleteMany({ where: { proEstId: 1, proNivId: 2 } });
    });

    it('debe retornar 3 estrellas con 0 errores', async () => {
      const { levelService: ls } = await import('../src/services/level.service.js');
      const result = await ls.complete(1, 1, 0);
      assert.equal(result.stars, 3);
    });

    it('debe retornar 1 estrella con 3+ errores', async () => {
      const { levelService: ls } = await import('../src/services/level.service.js');
      const result = await ls.complete(1, 1, 5);
      assert.equal(result.stars, 1);
    });

    it('debe actualizar progreso existente en lugar de crear duplicado', async () => {
      await prisma.progreso.create({
        data: { proEstId: 1, proNivId: 1, proPorcentaje: 50, proCompletado: false, proErrores: 2, proPuntos: 5 },
      });

      const { levelService: ls } = await import('../src/services/level.service.js');
      await ls.complete(1, 1, 0);

      const progress = await prisma.progreso.findUnique({
        where: { proEstId_proNivId: { proEstId: 1, proNivId: 1 } },
      });
      assert.equal(progress.proPorcentaje, 100);
      assert.equal(progress.proCompletado, true);
      assert.equal(progress.proErrores, 0);
      assert.equal(progress.proPuntos, 20);

      const all = await prisma.progreso.findMany({ where: { proEstId: 1, proNivId: 1 } });
      assert.equal(all.length, 1, 'No debe haber duplicados');
    });
  });
});
