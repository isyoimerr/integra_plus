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

    if (estudiante) {
      const updated = await updateEstudianteStreak(estudiante.estId, estudiante.estUltimoAcc);
      estudiante.estRachaDias = updated.estRachaDias;
      estudiante.estUltimoAcc = updated.estUltimoAcc;
    }

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

  getSigmaState: async (userId) => {
    const usuario = await prisma.usuario.findUnique({
      where: { usuId: userId },
      include: { estudiante: { include: { estadoSigma: { include: { nivelActual: true } } } } },
    });
    if (!usuario?.estudiante?.estadoSigma) return null;
    const s = usuario.estudiante.estadoSigma;
    return {
      modo: s.sigModo,
      erroresConsecutivos: s.sigErroresCons,
      tiempoInactivo: Number(s.sigTInactivo),
      nivelActual: s.sigNivActual,
      nivelActualNombre: s.nivelActual?.nivNombre || null,
      ultimoMensaje: s.sigUltimoMsg,
    };
  },

  updateSigmaState: async (userId, data) => {
    const usuario = await prisma.usuario.findUnique({
      where: { usuId: userId },
      include: { estudiante: true },
    });
    if (!usuario?.estudiante) throw new Error('Solo estudiantes tienen estado SIGMA');
    const updateData = {};
    if (data.modo !== undefined) updateData.sigModo = data.modo;
    if (data.erroresConsecutivos !== undefined) updateData.sigErroresCons = data.erroresConsecutivos;
    if (data.tiempoInactivo !== undefined) updateData.sigTInactivo = BigInt(data.tiempoInactivo);
    if (data.nivelActual !== undefined) updateData.sigNivActual = data.nivelActual;
    if (data.ultimoMensaje !== undefined) updateData.sigUltimoMsg = data.ultimoMensaje;
    return prisma.estadoSigma.update({
      where: { sigEstId: usuario.estudiante.estId },
      data: updateData,
    });
  },

  updateProfile: async (userId, data) => {
    const updateData = {};
    if (data.nombre !== undefined) updateData.usuNombre = data.nombre;
    if (data.foto !== undefined) updateData.usuFoto = data.foto;
    return prisma.usuario.update({ where: { usuId: userId }, data: updateData });
  },
};

async function updateEstudianteStreak(estId, ultimoAcc) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let nuevaRacha = 1;

  if (ultimoAcc) {
    const lastDay = new Date(ultimoAcc.getFullYear(), ultimoAcc.getMonth(), ultimoAcc.getDate());
    const diffDays = Math.floor((today - lastDay) / 86400000);

    if (diffDays === 0) {
      const current = await prisma.estudiante.findUnique({ where: { estId } });
      return { estRachaDias: current.estRachaDias, estUltimoAcc: current.estUltimoAcc };
    } else if (diffDays === 1) {
      const current = await prisma.estudiante.findUnique({ where: { estId } });
      nuevaRacha = current.estRachaDias + 1;
    }
  }

  return prisma.estudiante.update({
    where: { estId },
    data: { estRachaDias: nuevaRacha, estUltimoAcc: now },
  });
}
