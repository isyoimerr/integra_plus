import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const mapEjercicio = (e, includeRespuesta = false) => ({
  id:            e.ejId,
  nivelId:       e.ejNivId,
  enunciado:     e.ejEnunciado,
  formula:       e.ejFormula,
  tipo:          e.ejTipo,
  opciones:      JSON.parse(e.ejOpciones || '[]'),
  pista:         e.ejPista,
  explicacion:   e.ejExplicacion,
  xpRecompensa:  e.ejXpRecompensa,
  dificultad:    e.ejDificultad,
  orden:         e.ejOrden,
  ...(includeRespuesta && { respuesta: e.ejRespuesta }),
});

export const exerciseService = {
  getById: async (id) => {
    const ej = await prisma.ejercicio.findUnique({ where: { ejId: id } });
    if (!ej) throw new Error('Ejercicio no encontrado');
    return mapEjercicio(ej);
  },

  getByNivel: async (nivelId) => {
    const ejs = await prisma.ejercicio.findMany({
      where:   { ejNivId: nivelId },
      orderBy: { ejOrden: 'asc' },
    });
    return ejs.map(e => mapEjercicio(e));
  },

  verify: async (estudianteId, exerciseId, userAnswer) => {
    const ej = await prisma.ejercicio.findUnique({ where: { ejId: exerciseId } });
    if (!ej) throw new Error('Ejercicio no encontrado');

    const correcto = userAnswer === ej.ejRespuesta;

    if (estudianteId) {
      await prisma.resultado.create({
        data: {
          resEstId:     estudianteId,
          resEjId:      exerciseId,
          resRespuesta: userAnswer,
          resCorrecto:  correcto,
          resTiempoSeg: 0,
          resIntento:   1,
        },
      });
      if (correcto) {
        await prisma.estudiante.update({
          where: { estId: estudianteId },
          data:  { estPuntaje: { increment: ej.ejXpRecompensa } },
        });
      }
    }

    return {
      correcto,
      xpGanado:         correcto ? ej.ejXpRecompensa : 0,
      respuestaCorrecta: ej.ejRespuesta,
      explicacion:       ej.ejExplicacion,
    };
  },

  create: async (data) => {
    const ej = await prisma.ejercicio.create({
      data: {
        ejNivId:       data.nivelId,
        ejEnunciado:   data.enunciado,
        ejFormula:     data.formula || null,
        ejOpciones:    JSON.stringify(data.opciones || []),
        ejRespuesta:   data.respuesta,
        ejPista:       data.hint || null,
        ejExplicacion: data.explicacion || null,
        ejXpRecompensa: data.xpRecompensa || 15,
        ejOrden:       data.ordenEn || 1,
      },
    });
    return mapEjercicio(ej, true);
  },

  update: async (id, data) => {
    const ej = await prisma.ejercicio.update({
      where: { ejId: id },
      data: {
        ejEnunciado:   data.enunciado,
        ejFormula:     data.formula || null,
        ejOpciones:    JSON.stringify(data.opciones || []),
        ejRespuesta:   data.respuesta,
        ejPista:       data.hint || null,
        ejExplicacion: data.explicacion || null,
        ejXpRecompensa: data.xpRecompensa,
      },
    });
    return mapEjercicio(ej, true);
  },

  delete: async (id) => {
    await prisma.ejercicio.delete({ where: { ejId: id } });
  },
};
