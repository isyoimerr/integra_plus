import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const mapNivel = (n) => ({
  id:           n.nivId,
  nombre:       n.nivNombre,
  subtitulo:    n.nivSubtitulo,
  modulo:       n.nivModulo,
  dificultad:   n.nivDificultad,
  color:        n.nivColor,
  prerequisito: n.nivPrerequisito,
  msgSigma:     n.nivMsgSigma,
  desbloqueado: n.nivDesbloqueado,
});

const mapProgreso = (p) => ({
  id:          p.proId,
  estudianteId: p.proEstId,
  nivelId:     p.proNivId,
  porcentaje:  p.proPorcentaje,
  completado:  p.proCompletado,
  intentos:    p.proIntentos,
  errores:     p.proErrores,
  puntos:      p.proPuntos,
  nivel:       p.nivel ? mapNivel(p.nivel) : undefined,
});

export const levelService = {
  getAll: async () => {
    const niveles = await prisma.nivel.findMany({ orderBy: { nivModulo: 'asc' } });
    return niveles.map(mapNivel);
  },

  getProgress: async (estudianteId) => {
    if (!estudianteId) return [];
    const progreso = await prisma.progreso.findMany({
      where: { proEstId: estudianteId },
      include: { nivel: true },
    });
    return progreso.map(mapProgreso);
  },

  complete: async (estudianteId, nivelId, errores = 0) => {
    if (!estudianteId) throw new Error('Sin identificador de estudiante');

    const nivel = await prisma.nivel.findUnique({
      where: { nivId: nivelId },
      include: { ejercicios: true },
    });
    if (!nivel) throw new Error('Nivel no encontrado');

    const total    = nivel.ejercicios.length;
    const xpGanado = nivel.ejercicios.reduce((s, e) => s + e.ejXpRecompensa, 0);

    await prisma.progreso.upsert({
      where:  { proEstId_proNivId: { proEstId: estudianteId, proNivId: nivelId } },
      create: { proEstId: estudianteId, proNivId: nivelId, proPorcentaje: 100, proCompletado: true, proErrores: errores, proPuntos: xpGanado },
      update: { proPorcentaje: 100, proCompletado: true, proErrores: errores, proPuntos: xpGanado },
    });

    await prisma.estudiante.update({
      where: { estId: estudianteId },
      data:  { estPuntaje: { increment: xpGanado } },
    });

    const stars = errores === 0 ? 3 : errores <= 2 ? 2 : 1;
    return { completado: true, xpGanado, stars, ejerciciosTotal: total };
  },
};
