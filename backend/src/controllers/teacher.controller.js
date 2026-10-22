import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function hoursAgo(date) {
  const diffH = Math.floor((Date.now() - new Date(date).getTime()) / 3600000);
  if (diffH < 1) return 'Ahora';
  if (diffH < 24) return `${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD}d`;
}

export const teacherController = {
  getStudentsAtRisk: async (_req, res, next) => {
    try {
      const estudiantes = await prisma.estudiante.findMany({
        include: {
          usuario: true,
          progreso: { include: { nivel: true } },
        },
        orderBy: { estPuntaje: 'asc' },
      });

      const result = estudiantes.map(est => {
        const progTotal    = est.progreso.reduce((s, p) => s + p.proPorcentaje, 0);
        const pct          = est.progreso.length > 0 ? Math.round(progTotal / est.progreso.length) : 0;
        const erroresTotal = est.progreso.reduce((s, p) => s + p.proErrores, 0);
        return {
          id:           est.estId,
          nombre:       est.usuario.usuNombre,
          email:        est.usuario.usuCorreo,
          puntos:       est.estPuntaje,
          pct,
          erroresTotal,
          riesgo:       pct < 40 || erroresTotal > 5,
        };
      });

      res.json(result);
    } catch (err) { next(err); }
  },

  getStats: async (_req, res, next) => {
    try {
      const totalEstudiantes = await prisma.estudiante.count();
      const progresoAll      = await prisma.progreso.findMany();
      const promedio = progresoAll.length > 0
        ? Math.round(progresoAll.reduce((s, p) => s + p.proPorcentaje, 0) / progresoAll.length)
        : 0;
      const enRiesgo = await prisma.progreso.count({ where: { proPorcentaje: { lt: 40 } } });

      res.json({ totalEstudiantes, promedio, enRiesgo });
    } catch (err) { next(err); }
  },

  getStudents: async (_req, res, next) => {
    try {
      const estudiantes = await prisma.estudiante.findMany({
        include: {
          usuario: true,
          progreso: { include: { nivel: true } },
          resultados: { take: 1, orderBy: { resTimestamp: 'desc' } },
        },
        orderBy: { estPuntaje: 'desc' },
      });

      const result = estudiantes.map(est => {
        const progTotal = est.progreso.reduce((s, p) => s + p.proPorcentaje, 0);
        const pct = est.progreso.length > 0 ? Math.round(progTotal / est.progreso.length) : 0;
        const erroresTotal = est.progreso.reduce((s, p) => s + p.proErrores, 0);
        const nivelActual = est.progreso.filter(p => p.proCompletado).length + 1;
        const ultimoAcc = est.estUltimoAcc
          ? hoursAgo(est.estUltimoAcc)
          : 'Nunca';
        const riesgo = pct < 40 || erroresTotal > 5;
        return {
          id: est.estId,
          nombre: est.usuario.usuNombre,
          email: est.usuario.usuCorreo,
          puntos: est.estPuntaje,
          racha: est.estRachaDias,
          pct,
          erroresTotal,
          nivelActual,
          ultimoAcc,
          riesgo,
          nota: riesgo ? (pct < 40 ? `${100 - pct}% de progreso pendiente` : `${erroresTotal} errores totales`) : null,
        };
      });

      res.json(result);
    } catch (err) { next(err); }
  },

  getStudentProgress: async (req, res, next) => {
    try {
      const estId = parseInt(req.params.id);
      const estudiante = await prisma.estudiante.findUnique({
        where: { estId },
        include: {
          usuario: true,
          progreso: {
            include: { nivel: true },
            orderBy: { proNivId: 'asc' },
          },
          resultados: {
            include: { ejercicio: true },
            orderBy: { resTimestamp: 'desc' },
            take: 20,
          },
        },
      });
      if (!estudiante) return res.status(404).json({ error: 'Estudiante no encontrado' });

      const niveles = estudiante.progreso.map(p => ({
        nivelId: p.proNivId,
        nombre: p.nivel.nivNombre,
        color: p.nivel.nivColor,
        porcentaje: p.proPorcentaje,
        completado: p.proCompletado,
        intentos: p.proIntentos,
        errores: p.proErrores,
        puntos: p.proPuntos,
      }));

      const ultimosResultados = estudiante.resultados.map(r => ({
        id: r.resId,
        ejercicioId: r.resEjId,
        enunciado: r.ejercicio?.ejEnunciado || '',
        correcto: r.resCorrecto,
        timestamp: r.resTimestamp,
      }));

      res.json({
        id: estudiante.estId,
        nombre: estudiante.usuario.usuNombre,
        email: estudiante.usuario.usuCorreo,
        puntos: estudiante.estPuntaje,
        racha: estudiante.estRachaDias,
        nivelActual: estudiante.estNivelActual,
        ultimoAcc: estudiante.estUltimoAcc,
        niveles,
        ultimosResultados,
      });
    } catch (err) { next(err); }
  },
};
