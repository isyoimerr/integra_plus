import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';

import { auth } from '../src/middleware/auth.middleware.js';
import { extractBearerToken } from '../src/utils/authorization.js';

function makeRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

test('extractBearerToken devuelve el token cuando la cabecera usa Bearer', () => {
  assert.equal(extractBearerToken('Bearer abc123'), 'abc123');
});

test('extractBearerToken devuelve null si no hay cabecera', () => {
  assert.equal(extractBearerToken(undefined), null);
});

test('extractBearerToken devuelve null si el esquema no es Bearer', () => {
  assert.equal(extractBearerToken('Basic abc123'), null);
});

test('auth acepta JWT local en formato Bearer y normaliza el contrato interno', async () => {
  const secret = process.env.JWT_SECRET || 'dev_test_secret';
  const token = jwt.sign({ userId: 42, rol: 'estudiante', estudianteId: 7 }, secret);
  const req = { headers: { authorization: `Bearer ${token}` } };
  const res = makeRes();
  let nextCalled = false;

  await auth(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(req.userId, 42);
  assert.equal(req.userRol, 'estudiante');
  assert.equal(req.estudianteId, 7);
  assert.equal(req.user.userId, 42);
  assert.equal(req.user.rol, 'estudiante');
  assert.equal(req.user.estudianteId, 7);
});

test('auth responde 401 cuando el token es inválido o no existe', async () => {
  const req = { headers: { authorization: 'Bearer token-invalido' } };
  const res = makeRes();
  let nextCalled = false;

  await auth(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 401);
  assert.deepEqual(res.body, { error: 'Token inválido' });
});
