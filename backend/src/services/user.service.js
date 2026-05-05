import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const userService = {
  getStats: async (userId) => {
    const usuario = await prisma.usuario.findUnique({
      where: { usuId: userId },
      include: { estudiante: true },
    });
    if (!usuario) throw new Error('Usuario no encontrado');

    const estudiante = usuario.estudiante;
    const progresoList = estudiante
      ? await prisma.progreso.findMany({ where: { proEstId: estudiante.estId } })
      : [];
    const nivelActual = progresoList.filter(p => p.proCompletado).length + 1;
    const nivelesTotales = await prisma.nivel.count();
    const porcentaje = nivelesTotales > 0
      ? Math.round((nivelActual - 1) / nivelesTotales * 100)
      : 0;

    return {
      puntos: estudiante?.estPuntaje || 0,
      racha: estudiante?.estRachaDias || 0,
      nivelActual,
      nivelesTotales,
      porcentajeCompletado: porcentaje,
    };
  },

  updateTema: async (userId, tema) => {
    return prisma.usuario.update({ where: { usuId: userId }, data: { usuTema: tema } });
  },
};
