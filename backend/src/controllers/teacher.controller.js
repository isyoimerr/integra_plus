import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
};
