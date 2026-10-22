import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const signToken = (usuario, estudianteId = null) =>
  jwt.sign(
    { userId: usuario.usuId, rol: usuario.usuRol, estudianteId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

const safeUser = (u, estudianteId = null, puntaje = 0, racha = 0, onboardingDone = false) => ({
  id: u.usuId,
  email: u.usuCorreo,
  nombre: u.usuNombre,
  rol: u.usuRol,
  tema: u.usuTema,
  puntos: puntaje,
  racha,
  estudianteId,
  onboardingDone,
});

export const authService = {
  register: async (email, nombre, password, rol = 'estudiante', teacherCode) => {
    const existe = await prisma.usuario.findUnique({ where: { usuCorreo: email } });
    if (existe) throw new Error('El email ya está registrado');

    const hashedPassword = await bcryptjs.hash(password, 10);
    const usuario = await prisma.usuario.create({
      data: { usuNombre: nombre, usuCorreo: email, usuContrasena: hashedPassword, usuRol: rol },
    });

    let estudianteId = null;
    if (rol === 'estudiante') {
      const est = await prisma.estudiante.create({ data: { estUsuId: usuario.usuId } });
      estudianteId = est.estId;
      await prisma.estadoSigma.create({ data: { sigEstId: est.estId } });
    } else if (rol === 'docente') {
      await prisma.docente.create({ data: { docUsuId: usuario.usuId, docCodigo: teacherCode || null } });
    }

    return { usuario: safeUser(usuario, estudianteId), token: signToken(usuario, estudianteId) };
  },

  findByEmail: async (email) => {
    return prisma.usuario.findUnique({ where: { usuCorreo: email } });
  },

  updatePassword: async (email, newPassword) => {
    const hashed = await bcryptjs.hash(newPassword, 10);
    await prisma.usuario.update({
      where: { usuCorreo: email },
      data:  { usuContrasena: hashed },
    });
  },

  login: async (email, password) => {
    const usuario = await prisma.usuario.findUnique({
      where: { usuCorreo: email },
      include: { estudiante: true },
    });
    if (!usuario) throw new Error('Credenciales inválidas');

    const valida = await bcryptjs.compare(password, usuario.usuContrasena);
    if (!valida) throw new Error('Credenciales inválidas');

    const estudianteId = usuario.estudiante?.estId || null;
    const puntaje = usuario.estudiante?.estPuntaje || 0;
    let racha = usuario.estudiante?.estRachaDias || 0;
    const yaAccedio = !!usuario.estudiante?.estUltimoAcc;

    if (estudianteId) {
      const updated = await updateEstudianteStreak(estudianteId, usuario.estudiante.estUltimoAcc);
      racha = updated.estRachaDias;
    }

    return {
      usuario: safeUser(usuario, estudianteId, puntaje, racha, yaAccedio),
      token: signToken(usuario, estudianteId),
    };
  },

  solicitarRecuperacion: async (email) => {
    const usuario = await prisma.usuario.findUnique({ where: { usuCorreo: email } });
    if (!usuario) return null;

    const codigo = String(Math.floor(100000 + Math.random() * 900000));
    const expiracion = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.codigoRecuperacion.create({
      data: {
        recUsuId: usuario.usuId,
        recCodigo: codigo,
        recExpiracion: expiracion,
      },
    });

    return codigo;
  },

  verificarCodigo: async (email, codigo) => {
    const usuario = await prisma.usuario.findUnique({ where: { usuCorreo: email } });
    if (!usuario) throw new Error('Código inválido');

    const registro = await prisma.codigoRecuperacion.findFirst({
      where: {
        recUsuId: usuario.usuId,
        recCodigo: codigo,
        recUsado: false,
        recExpiracion: { gt: new Date() },
      },
      orderBy: { recFechaCre: 'desc' },
    });

    if (!registro) throw new Error('Código inválido o expirado');

    const tempToken = jwt.sign(
      { userId: usuario.usuId, tipo: 'recuperacion' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    return tempToken;
  },

  resetearContrasena: async (email, tempToken, newPassword) => {
    let payload;
    try {
      payload = jwt.verify(tempToken, process.env.JWT_SECRET);
      if (payload.tipo !== 'recuperacion') throw new Error('Token inválido');
    } catch {
      throw new Error('Token inválido o expirado');
    }

    const usuario = await prisma.usuario.findUnique({ where: { usuCorreo: email } });
    if (!usuario || usuario.usuId !== payload.userId) throw new Error('Token inválido');

    const hashed = await bcryptjs.hash(newPassword, 10);
    await prisma.usuario.update({
      where: { usuId: usuario.usuId },
      data: { usuContrasena: hashed },
    });

    await prisma.codigoRecuperacion.updateMany({
      where: { recUsuId: usuario.usuId, recUsado: false },
      data: { recUsado: true },
    });
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
      return { estRachaDias: current.estRachaDias };
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
