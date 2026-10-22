import Joi from 'joi';

const email    = Joi.string().email().lowercase().trim().required();
const password = Joi.string().min(8).pattern(/[A-Z]/).pattern(/[0-9]/).required()
  .messages({
    'string.pattern.base': 'La contraseña debe tener al menos una mayúscula y un número',
    'string.min': 'La contraseña debe tener al menos 8 caracteres',
  });

export const schemas = {
  register: Joi.object({
    email,
    nombre:      Joi.string().min(2).max(100).trim().required(),
    password,
    rol:         Joi.string().valid('estudiante', 'docente').default('estudiante'),
    teacherCode: Joi.string().when('rol', { is: 'docente', then: Joi.required(), otherwise: Joi.optional() }),
  }),

  login: Joi.object({
    email,
    password: Joi.string().required(),
  }),

  sendOtp: Joi.object({ email }),

  verifyOtp: Joi.object({
    email,
    code: Joi.string().length(4).pattern(/^\d+$/).required(),
  }),

  solicitarRecuperacion: Joi.object({ email }),

  verificarCodigo: Joi.object({
    email,
    codigo: Joi.string().length(6).pattern(/^\d+$/).required(),
  }),

  resetearContrasena: Joi.object({
    email,
    tempToken:   Joi.string().required(),
    newPassword: password,
  }),

  verifyExercise: Joi.object({
    exerciseId: Joi.number().integer().positive().required(),
    userAnswer: Joi.string().trim().required(),
  }),

  completeLevel: Joi.object({
    nivelId: Joi.number().integer().positive().required(),
    errores: Joi.number().integer().min(0).default(0),
  }),
};
