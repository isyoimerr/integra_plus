import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Sembrando base de datos...');

  // Limpiar en orden correcto (FK constraints)
  await prisma.estadoSigma.deleteMany();
  await prisma.resultado.deleteMany();
  await prisma.progreso.deleteMany();
  await prisma.docEstudiante.deleteMany();
  await prisma.ejercicio.deleteMany();
  await prisma.nivel.deleteMany();
  await prisma.docente.deleteMany();
  await prisma.estudiante.deleteMany();
  await prisma.usuario.deleteMany();

  // Niveles
  await prisma.nivel.createMany({
    data: [
      { nivId: 1, nivNombre: 'Nivel 0', nivSubtitulo: 'Repaso de Bases',     nivModulo: 0, nivDificultad: 1, nivColor: '#2E7D32', nivDesbloqueado: true },
      { nivId: 2, nivNombre: 'Nivel 1', nivSubtitulo: 'Integral Indefinida', nivModulo: 1, nivDificultad: 2, nivColor: '#1565C0', nivPrerequisito: 1, nivDesbloqueado: false },
      { nivId: 3, nivNombre: 'Nivel 2', nivSubtitulo: 'Integral Definida',   nivModulo: 2, nivDificultad: 3, nivColor: '#7E57C2', nivPrerequisito: 2, nivDesbloqueado: false },
    ],
  });

  // Ejercicios Nivel 0
  await prisma.ejercicio.createMany({
    data: [
      { ejNivId: 1, ejEnunciado: '¿Cuánto es 2/3 + 1/4?',        ejFormula: '\\dfrac{2}{3}+\\dfrac{1}{4}=?',          ejOpciones: '["5/7","11/12","6/7"]',                                ejRespuesta: '11/12',                    ejPista: 'Busca el MCM de 3 y 4.',                            ejExplicacion: 'MCM(3,4)=12 → 8/12 + 3/12 = 11/12',         ejXpRecompensa: 15, ejOrden: 1 },
      { ejNivId: 1, ejEnunciado: '¿Cuánto es 2/3 ÷ 1/4?',        ejFormula: '\\dfrac{2}{3}\\div\\dfrac{1}{4}=?',       ejOpciones: '["2/12","1/6","8/3"]',                                 ejRespuesta: '8/3',                      ejPista: 'Invertir y multiplicar: 2/3 × 4/1',                 ejExplicacion: '2/3 × 4 = 8/3',                              ejXpRecompensa: 15, ejOrden: 2 },
      { ejNivId: 1, ejEnunciado: '¿Cuánto es (x²)³?',             ejFormula: '(x^2)^3=x^{?}',                          ejOpciones: '["x⁵","x⁶","x⁸"]',                                    ejRespuesta: 'x⁶',                       ejPista: 'Potencia de potencia: multiplica exponentes.',       ejExplicacion: '(x²)³ = x^(2×3) = x⁶',                      ejXpRecompensa: 15, ejOrden: 3 },
      { ejNivId: 1, ejEnunciado: 'Simplifica 1/√x',               ejFormula: '\\dfrac{1}{\\sqrt{x}}=?',                ejOpciones: '["x^(1/2)","x^(-2)","x^(-1/2)"]',                     ejRespuesta: 'x^(-1/2)',                 ejPista: '√x = x^(1/2). Pasarlo al denominador: signo −',     ejExplicacion: '1/x^(1/2) = x^(-1/2)',                       ejXpRecompensa: 15, ejOrden: 4 },
      { ejNivId: 1, ejEnunciado: '¿Cuánto es d/dx[x³]?',          ejFormula: '\\dfrac{d}{dx}[x^3]=?',                  ejOpciones: '["x²","3x","3x²"]',                                    ejRespuesta: '3x²',                      ejPista: 'Regla de potencia: baja el 3 y resta 1.',           ejExplicacion: 'd/dx[x³] = 3x²',                             ejXpRecompensa: 15, ejOrden: 5 },
      { ejNivId: 1, ejEnunciado: '¿Cuánto es d/dx[x²·sin(x)]?',   ejFormula: '\\dfrac{d}{dx}[x^2\\cdot\\sin(x)]=?',   ejOpciones: '["2x·cos(x)","2x·sin(x)+x²·cos(x)","x²·cos(x)"]',    ejRespuesta: '2x·sin(x)+x²·cos(x)',      ejPista: 'Regla del producto: (uv)\'=u\'v+uv\'',              ejExplicacion: 'u=x², v=sin(x) → 2x·sin(x)+x²·cos(x)',      ejXpRecompensa: 15, ejOrden: 6 },
    ],
  });

  // Ejercicios Nivel 1
  await prisma.ejercicio.createMany({
    data: [
      { ejNivId: 2, ejEnunciado: 'Resuelve la integral indefinida', ejFormula: '\\displaystyle\\int x^5\\,dx=?',               ejOpciones: '["x⁶ + C","x⁶/6 + C","5x⁴ + C"]',     ejRespuesta: 'x⁶/6 + C',      ejPista: 'El exponente sube de 5 a 6. Divides entre 6.',  ejExplicacion: '∫ x⁵ dx = x⁶/6 + C',               ejXpRecompensa: 15, ejOrden: 1 },
      { ejNivId: 2, ejEnunciado: 'Resuelve la integral indefinida', ejFormula: '\\displaystyle\\int e^x\\,dx=?',               ejOpciones: '["eˣ⁺¹ + C","eˣ/x + C","eˣ + C"]',     ejRespuesta: 'eˣ + C',         ejPista: 'eˣ es su propia antiderivada.',                  ejExplicacion: '∫ eˣ dx = eˣ + C',                  ejXpRecompensa: 15, ejOrden: 2 },
      { ejNivId: 2, ejEnunciado: 'Integra término a término',       ejFormula: '\\displaystyle\\int(2x^3+5)\\,dx=?',           ejOpciones: '["(1/2)x⁴+5x+C","6x²+C","2x⁴+5x+C"]', ejRespuesta: '(1/2)x⁴+5x+C',  ejPista: 'Integra cada término por separado.',            ejExplicacion: '∫2x³dx + ∫5dx = x⁴/2 + 5x + C',    ejXpRecompensa: 15, ejOrden: 3 },
      { ejNivId: 2, ejEnunciado: 'Integral trigonométrica',         ejFormula: '\\displaystyle\\int\\cos(x)\\,dx=?',            ejOpciones: '["−sin(x)+C","sin(x)+C","tan(x)+C"]',   ejRespuesta: 'sin(x)+C',       ejPista: '¿Qué función al derivar da cos(x)?',            ejExplicacion: 'd/dx[sin(x)]=cos(x) → ∫cos(x)dx=sin(x)+C', ejXpRecompensa: 15, ejOrden: 4 },
    ],
  });

  // Ejercicios Nivel 2
  await prisma.ejercicio.createMany({
    data: [
      { ejNivId: 3, ejEnunciado: 'Aplica el Teorema Fundamental', ejFormula: '\\displaystyle\\int_0^2 x\\,dx=?',              ejOpciones: '["1","2","4"]',    ejRespuesta: '2',   ejPista: 'Antiderivada de x es x²/2. Evalúa en 2 y en 0.',  ejExplicacion: 'F(x)=x²/2 → F(2)−F(0) = 2',   ejXpRecompensa: 15, ejOrden: 1 },
      { ejNivId: 3, ejEnunciado: 'Aplica el Teorema Fundamental', ejFormula: '\\displaystyle\\int_1^3 2x\\,dx=?',             ejOpciones: '["6","8","4"]',    ejRespuesta: '8',   ejPista: 'Antiderivada de 2x es x². F(3)−F(1).',            ejExplicacion: 'F(x)=x² → 9−1 = 8',           ejXpRecompensa: 15, ejOrden: 2 },
      { ejNivId: 3, ejEnunciado: 'Integra y evalúa',              ejFormula: '\\displaystyle\\int_0^1(x^2+1)\\,dx=?',        ejOpciones: '["4/3","2/3","1"]', ejRespuesta: '4/3', ejPista: 'F(x)=x³/3+x. En 1: 1/3+1=4/3.',                  ejExplicacion: 'F(1)−F(0) = 4/3',             ejXpRecompensa: 15, ejOrden: 3 },
      { ejNivId: 3, ejEnunciado: 'Calcula la integral definida',  ejFormula: '\\displaystyle\\int_0^{\\pi}\\sin(x)\\,dx=?', ejOpciones: '["0","1","2"]',    ejRespuesta: '2',   ejPista: 'F(x)=−cos(x). −cos(π)+cos(0)=1+1.',               ejExplicacion: 'F(π)−F(0) = 2',               ejXpRecompensa: 15, ejOrden: 4 },
    ],
  });

  // Usuarios demo
  const pass = await bcryptjs.hash('password', 10);

  const usrEst = await prisma.usuario.create({
    data: { usuNombre: 'Ana Demo', usuCorreo: 'estudiante@demo.com', usuContrasena: pass, usuRol: 'estudiante' },
  });
  const est = await prisma.estudiante.create({ data: { estUsuId: usrEst.usuId } });
  await prisma.estadoSigma.create({ data: { sigEstId: est.estId } });

  const usrDoc = await prisma.usuario.create({
    data: { usuNombre: 'Prof. Demo', usuCorreo: 'docente@demo.com', usuContrasena: pass, usuRol: 'docente' },
  });
  await prisma.docente.create({ data: { docUsuId: usrDoc.usuId, docCodigo: 'DOCENTE2024' } });

  console.log('✅ Seed completado');
}

main().catch(console.error).finally(() => prisma.$disconnect());
