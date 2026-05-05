-- ============================================================
--  INTEGRA+ — Base de Datos MySQL (XAMPP / MariaDB)
--  Importar en: http://localhost/phpmyadmin/
-- ============================================================

CREATE DATABASE IF NOT EXISTS integra_plus
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE integra_plus;

-- ── 1. USUARIOS (tabla base / padre) ─────────────────────────
CREATE TABLE IF NOT EXISTS usuarios (
  usu_id        INT AUTO_INCREMENT PRIMARY KEY,
  usu_nombre    VARCHAR(100) NOT NULL,
  usu_correo    VARCHAR(150) NOT NULL UNIQUE,
  usu_contrasena TEXT NOT NULL,
  usu_rol       ENUM('estudiante','docente','admin') NOT NULL DEFAULT 'estudiante',
  usu_tema      VARCHAR(20) NOT NULL DEFAULT 'light',
  usu_fecha_reg TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── 2. ESTUDIANTES (hereda de usuarios) ──────────────────────
CREATE TABLE IF NOT EXISTS estudiantes (
  est_id          INT AUTO_INCREMENT PRIMARY KEY,
  est_usu_id      INT NOT NULL UNIQUE,
  est_puntaje     INT NOT NULL DEFAULT 0,
  est_racha_dias  INT NOT NULL DEFAULT 0,
  est_nivel_actual INT NOT NULL DEFAULT 0,
  est_ultimo_acc  TIMESTAMP NULL,
  FOREIGN KEY (est_usu_id) REFERENCES usuarios(usu_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── 3. DOCENTES (hereda de usuarios) ─────────────────────────
CREATE TABLE IF NOT EXISTS docentes (
  doc_id          INT AUTO_INCREMENT PRIMARY KEY,
  doc_usu_id      INT NOT NULL UNIQUE,
  doc_departamento VARCHAR(100),
  doc_codigo      VARCHAR(20) UNIQUE,
  FOREIGN KEY (doc_usu_id) REFERENCES usuarios(usu_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── 4. DOC_ESTUDIANTE (relación docente ↔ estudiante) ────────
CREATE TABLE IF NOT EXISTS doc_estudiante (
  de_id         INT AUTO_INCREMENT PRIMARY KEY,
  de_doc_id     INT NOT NULL,
  de_est_id     INT NOT NULL,
  de_fecha_asig TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (de_doc_id) REFERENCES docentes(doc_id) ON DELETE CASCADE,
  FOREIGN KEY (de_est_id) REFERENCES estudiantes(est_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── 5. NIVELES ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS niveles (
  niv_id           INT AUTO_INCREMENT PRIMARY KEY,
  niv_nombre       VARCHAR(100) NOT NULL,
  niv_subtitulo    VARCHAR(100),
  niv_modulo       INT NOT NULL,
  niv_dificultad   INT DEFAULT 1,
  niv_prerequisito INT,
  niv_color        VARCHAR(20) DEFAULT '#2E7D32',
  niv_msg_sigma    TEXT,
  niv_desbloqueado BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (niv_prerequisito) REFERENCES niveles(niv_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── 6. EJERCICIOS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ejercicios (
  ej_id           INT AUTO_INCREMENT PRIMARY KEY,
  ej_niv_id       INT NOT NULL,
  ej_enunciado    TEXT NOT NULL,
  ej_formula      TEXT,
  ej_tipo         ENUM('multiple_choice','abierto','verdadero_falso') NOT NULL DEFAULT 'multiple_choice',
  ej_opciones     TEXT,
  ej_respuesta    TEXT NOT NULL,
  ej_pista        TEXT,
  ej_explicacion  TEXT,
  ej_xp_recompensa INT NOT NULL DEFAULT 15,
  ej_dificultad   INT DEFAULT 1,
  ej_orden        INT NOT NULL DEFAULT 1,
  FOREIGN KEY (ej_niv_id) REFERENCES niveles(niv_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── 7. PROGRESO ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS progreso (
  pro_id         INT AUTO_INCREMENT PRIMARY KEY,
  pro_est_id     INT NOT NULL,
  pro_niv_id     INT NOT NULL,
  pro_porcentaje FLOAT DEFAULT 0,
  pro_completado BOOLEAN DEFAULT FALSE,
  pro_intentos   INT DEFAULT 0,
  pro_errores    INT DEFAULT 0,
  pro_puntos     INT DEFAULT 0,
  UNIQUE KEY uq_progreso (pro_est_id, pro_niv_id),
  FOREIGN KEY (pro_est_id) REFERENCES estudiantes(est_id) ON DELETE CASCADE,
  FOREIGN KEY (pro_niv_id) REFERENCES niveles(niv_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── 8. RESULTADOS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS resultados (
  res_id        INT AUTO_INCREMENT PRIMARY KEY,
  res_est_id    INT NOT NULL,
  res_ej_id     INT NOT NULL,
  res_respuesta TEXT,
  res_correcto  BOOLEAN NOT NULL,
  res_tiempo_seg INT DEFAULT 0,
  res_intento   INT DEFAULT 1,
  res_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (res_est_id) REFERENCES estudiantes(est_id) ON DELETE CASCADE,
  FOREIGN KEY (res_ej_id)  REFERENCES ejercicios(ej_id)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── 9. ESTADO_SIGMA ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS estado_sigma (
  sig_id          INT AUTO_INCREMENT PRIMARY KEY,
  sig_est_id      INT NOT NULL UNIQUE,
  sig_modo        ENUM('guia','celebracion','apoyo','alerta','inactivo') NOT NULL DEFAULT 'guia',
  sig_errores_cons INT DEFAULT 0,
  sig_t_inactivo  BIGINT DEFAULT 0,
  sig_niv_actual  INT,
  sig_ultimo_msg  TEXT,
  FOREIGN KEY (sig_est_id)    REFERENCES estudiantes(est_id) ON DELETE CASCADE,
  FOREIGN KEY (sig_niv_actual) REFERENCES niveles(niv_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── 10. CÓDIGOS DE RECUPERACIÓN ──────────────────────────────
CREATE TABLE IF NOT EXISTS codigos_recuperacion (
  rec_id         INT AUTO_INCREMENT PRIMARY KEY,
  rec_usu_id     INT NOT NULL,
  rec_codigo     VARCHAR(6) NOT NULL,
  rec_expiracion TIMESTAMP NOT NULL,
  rec_usado      BOOLEAN DEFAULT FALSE,
  rec_fecha_cre  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (rec_usu_id) REFERENCES usuarios(usu_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
--  DATOS INICIALES (SEED)
-- ============================================================

-- Niveles
INSERT INTO niveles (niv_nombre, niv_subtitulo, niv_modulo, niv_dificultad, niv_color, niv_desbloqueado) VALUES
('Nivel 0', 'Repaso de Bases',     0, 1, '#2E7D32', TRUE),
('Nivel 1', 'Integral Indefinida', 1, 2, '#1565C0', FALSE),
('Nivel 2', 'Integral Definida',   2, 3, '#7E57C2', FALSE);

UPDATE niveles SET niv_prerequisito = 1 WHERE niv_nombre = 'Nivel 1';
UPDATE niveles SET niv_prerequisito = 2 WHERE niv_nombre = 'Nivel 2';

-- Ejercicios Nivel 0
INSERT INTO ejercicios (ej_niv_id, ej_enunciado, ej_formula, ej_opciones, ej_respuesta, ej_pista, ej_explicacion, ej_xp_recompensa, ej_orden) VALUES
(1, '¿Cuánto es 2/3 + 1/4?',        '\\dfrac{2}{3}+\\dfrac{1}{4}=?',           '["5/7","11/12","6/7"]',                            '11/12',    'Busca el MCM de 3 y 4.',                           'MCM(3,4)=12 → 8/12 + 3/12 = 11/12', 15, 1),
(1, '¿Cuánto es 2/3 ÷ 1/4?',        '\\dfrac{2}{3}\\div\\dfrac{1}{4}=?',        '["2/12","1/6","8/3"]',                             '8/3',      'Invertir y multiplicar: 2/3 × 4/1',                '2/3 × 4 = 8/3',                      15, 2),
(1, '¿Cuánto es (x²)³?',             '(x^2)^3=x^{?}',                           '["x⁵","x⁶","x⁸"]',                                'x⁶',       'Potencia de potencia: multiplica exponentes.',      '(x²)³ = x^(2×3) = x⁶',              15, 3),
(1, 'Simplifica 1/√x',              '\\dfrac{1}{\\sqrt{x}}=?',                  '["x^(1/2)","x^(-2)","x^(-1/2)"]',                 'x^(-1/2)', '√x = x^(1/2). Pasarlo al denominador: signo −',    '1/x^(1/2) = x^(-1/2)',               15, 4),
(1, '¿Cuánto es d/dx[x³]?',         '\\dfrac{d}{dx}[x^3]=?',                   '["x²","3x","3x²"]',                               '3x²',      'Regla de potencia: baja el 3 y resta 1.',          'd/dx[x³] = 3x²',                     15, 5),
(1, '¿Cuánto es d/dx[x²·sin(x)]?',  '\\dfrac{d}{dx}[x^2\\cdot\\sin(x)]=?',     '["2x·cos(x)","2x·sin(x)+x²·cos(x)","x²·cos(x)"]', '2x·sin(x)+x²·cos(x)', 'Regla del producto: (uv)\'=u\'v+uv\'', 'u=x², v=sin(x) → 2x·sin(x)+x²·cos(x)', 15, 6);

-- Ejercicios Nivel 1
INSERT INTO ejercicios (ej_niv_id, ej_enunciado, ej_formula, ej_opciones, ej_respuesta, ej_pista, ej_explicacion, ej_xp_recompensa, ej_orden) VALUES
(2, 'Resuelve la integral indefinida', '\\displaystyle\\int x^5\\,dx=?',               '["x⁶ + C","x⁶/6 + C","5x⁴ + C"]',      'x⁶/6 + C',   'El exponente sube de 5 a 6. Divides entre 6.',  '∫ x⁵ dx = x⁶/6 + C',                15, 1),
(2, 'Resuelve la integral indefinida', '\\displaystyle\\int e^x\\,dx=?',               '["eˣ⁺¹ + C","eˣ/x + C","eˣ + C"]',      'eˣ + C',     'eˣ es su propia antiderivada.',                  '∫ eˣ dx = eˣ + C',                   15, 2),
(2, 'Integra término a término',       '\\displaystyle\\int(2x^3+5)\\,dx=?',           '["(1/2)x⁴+5x+C","6x²+C","2x⁴+5x+C"]',  '(1/2)x⁴+5x+C','Integra cada término por separado.',           '∫2x³dx + ∫5dx = x⁴/2 + 5x + C',    15, 3),
(2, 'Integral trigonométrica',         '\\displaystyle\\int\\cos(x)\\,dx=?',            '["−sin(x)+C","sin(x)+C","tan(x)+C"]',    'sin(x)+C',   '¿Qué función al derivar da cos(x)?',             'd/dx[sin(x)]=cos(x) → ∫cos(x)dx=sin(x)+C', 15, 4);

-- Ejercicios Nivel 2
INSERT INTO ejercicios (ej_niv_id, ej_enunciado, ej_formula, ej_opciones, ej_respuesta, ej_pista, ej_explicacion, ej_xp_recompensa, ej_orden) VALUES
(3, 'Aplica el Teorema Fundamental',   '\\displaystyle\\int_0^2 x\\,dx=?',             '["1","2","4"]',    '2',   'Antiderivada de x es x²/2. Evalúa en 2 y en 0.',  'F(x)=x²/2 → F(2)−F(0) = 2',        15, 1),
(3, 'Aplica el Teorema Fundamental',   '\\displaystyle\\int_1^3 2x\\,dx=?',            '["6","8","4"]',    '8',   'Antiderivada de 2x es x². F(3)−F(1).',            'F(x)=x² → 9−1 = 8',                15, 2),
(3, 'Integra y evalúa en los límites', '\\displaystyle\\int_0^1(x^2+1)\\,dx=?',       '["4/3","2/3","1"]', '4/3', 'F(x)=x³/3+x. En 1: 1/3+1=4/3.',                 'F(1)−F(0) = 4/3',                   15, 3),
(3, 'Calcula la integral definida',    '\\displaystyle\\int_0^{\\pi}\\sin(x)\\,dx=?', '["0","1","2"]',    '2',   'F(x)=−cos(x). −cos(π)+cos(0)=1+1.',              'F(π)−F(0) = 2',                     15, 4);

-- Usuarios demo
INSERT INTO usuarios (usu_nombre, usu_correo, usu_contrasena, usu_rol) VALUES
('Ana Demo',    'estudiante@demo.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'estudiante'),
('Prof. Demo',  'docente@demo.com',   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'docente');
-- Contraseña de ambos: "password"

INSERT INTO estudiantes (est_usu_id) VALUES (1);
INSERT INTO docentes (doc_usu_id, doc_codigo) VALUES (2, 'DOCENTE2024');

-- Estado SIGMA para el estudiante demo
INSERT INTO estado_sigma (sig_est_id) VALUES (1);
