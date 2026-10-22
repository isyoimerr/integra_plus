-- Warning: column statistics not supported by the server.
-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: integra_plus
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `codigos_recuperacion`
--

DROP TABLE IF EXISTS `codigos_recuperacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `codigos_recuperacion` (
  `rec_id` int(11) NOT NULL AUTO_INCREMENT,
  `rec_usu_id` int(11) NOT NULL,
  `rec_codigo` varchar(6) NOT NULL,
  `rec_expiracion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `rec_usado` tinyint(1) DEFAULT 0,
  `rec_fecha_cre` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`rec_id`),
  KEY `idx_recuperacion_usu_usado` (`rec_usu_id`,`rec_usado`),
  CONSTRAINT `codigos_recuperacion_ibfk_1` FOREIGN KEY (`rec_usu_id`) REFERENCES `usuarios` (`usu_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `codigos_recuperacion`
--

LOCK TABLES `codigos_recuperacion` WRITE;
/*!40000 ALTER TABLE `codigos_recuperacion` DISABLE KEYS */;
INSERT INTO `codigos_recuperacion` VALUES (1,1,'766983','2026-05-04 04:18:46',0,'2026-05-04 04:08:46'),(2,1,'396882','2026-05-04 04:19:48',0,'2026-05-04 04:09:48'),(3,3,'406651','2026-05-04 03:56:45',1,'2026-05-04 08:55:05'),(4,3,'437715','2026-05-14 12:56:57',1,'2026-05-14 17:56:21');
/*!40000 ALTER TABLE `codigos_recuperacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doc_estudiante`
--

DROP TABLE IF EXISTS `doc_estudiante`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doc_estudiante` (
  `de_id` int(11) NOT NULL AUTO_INCREMENT,
  `de_doc_id` int(11) NOT NULL,
  `de_est_id` int(11) NOT NULL,
  `de_fecha_asig` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`de_id`),
  KEY `de_doc_id` (`de_doc_id`),
  KEY `de_est_id` (`de_est_id`),
  CONSTRAINT `doc_estudiante_ibfk_1` FOREIGN KEY (`de_doc_id`) REFERENCES `docentes` (`doc_id`) ON DELETE CASCADE,
  CONSTRAINT `doc_estudiante_ibfk_2` FOREIGN KEY (`de_est_id`) REFERENCES `estudiantes` (`est_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doc_estudiante`
--

LOCK TABLES `doc_estudiante` WRITE;
/*!40000 ALTER TABLE `doc_estudiante` DISABLE KEYS */;
/*!40000 ALTER TABLE `doc_estudiante` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `docentes`
--

DROP TABLE IF EXISTS `docentes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `docentes` (
  `doc_id` int(11) NOT NULL AUTO_INCREMENT,
  `doc_usu_id` int(11) NOT NULL,
  `doc_departamento` varchar(100) DEFAULT NULL,
  `doc_codigo` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`doc_id`),
  UNIQUE KEY `doc_usu_id` (`doc_usu_id`),
  UNIQUE KEY `doc_codigo` (`doc_codigo`),
  CONSTRAINT `docentes_ibfk_1` FOREIGN KEY (`doc_usu_id`) REFERENCES `usuarios` (`usu_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `docentes`
--

LOCK TABLES `docentes` WRITE;
/*!40000 ALTER TABLE `docentes` DISABLE KEYS */;
INSERT INTO `docentes` VALUES (1,2,NULL,'DOCENTE2024');
/*!40000 ALTER TABLE `docentes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ejercicios`
--

DROP TABLE IF EXISTS `ejercicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ejercicios` (
  `ej_id` int(11) NOT NULL AUTO_INCREMENT,
  `ej_niv_id` int(11) NOT NULL,
  `ej_enunciado` text NOT NULL,
  `ej_formula` text DEFAULT NULL,
  `ej_tipo` enum('multiple_choice','abierto','verdadero_falso') NOT NULL DEFAULT 'multiple_choice',
  `ej_opciones` text DEFAULT NULL,
  `ej_respuesta` text NOT NULL,
  `ej_pista` text DEFAULT NULL,
  `ej_explicacion` text DEFAULT NULL,
  `ej_xp_recompensa` int(11) NOT NULL DEFAULT 15,
  `ej_dificultad` int(11) DEFAULT 1,
  `ej_orden` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`ej_id`),
  KEY `idx_ejercicios_niv_orden` (`ej_niv_id`,`ej_orden`),
  CONSTRAINT `ejercicios_ibfk_1` FOREIGN KEY (`ej_niv_id`) REFERENCES `niveles` (`niv_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ejercicios`
--

LOCK TABLES `ejercicios` WRITE;
/*!40000 ALTER TABLE `ejercicios` DISABLE KEYS */;
INSERT INTO `ejercicios` VALUES (1,1,'¿Cuánto es 2/3 + 1/4?','\\dfrac{2}{3}+\\dfrac{1}{4}=?','multiple_choice','[\"5/7\",\"11/12\",\"6/7\"]','11/12','Busca el MCM de 3 y 4.','MCM(3,4)=12 → 8/12 + 3/12 = 11/12',15,1,1),(2,1,'¿Cuánto es 2/3 ÷ 1/4?','\\dfrac{2}{3}\\div\\dfrac{1}{4}=?','multiple_choice','[\"2/12\",\"1/6\",\"8/3\"]','8/3','Invertir y multiplicar: 2/3 × 4/1','2/3 × 4 = 8/3',15,1,2),(3,1,'¿Cuánto es (x²)³?','(x^2)^3=x^{?}','multiple_choice','[\"x⁵\",\"x⁶\",\"x⁸\"]','x⁶','Potencia de potencia: multiplica exponentes.','(x²)³ = x^(2×3) = x⁶',15,1,3),(4,1,'Simplifica 1/√x','\\dfrac{1}{\\sqrt{x}}=?','multiple_choice','[\"x^(1/2)\",\"x^(-2)\",\"x^(-1/2)\"]','x^(-1/2)','√x = x^(1/2). Pasarlo al denominador: signo −','1/x^(1/2) = x^(-1/2)',15,1,4),(5,1,'¿Cuánto es d/dx[x³]?','\\dfrac{d}{dx}[x^3]=?','multiple_choice','[\"x²\",\"3x\",\"3x²\"]','3x²','Regla de potencia: baja el 3 y resta 1.','d/dx[x³] = 3x²',15,1,5),(6,1,'¿Cuánto es d/dx[x²·sin(x)]?','\\dfrac{d}{dx}[x^2\\cdot\\sin(x)]=?','multiple_choice','[\"2x·cos(x)\",\"2x·sin(x)+x²·cos(x)\",\"x²·cos(x)\"]','2x·sin(x)+x²·cos(x)','Regla del producto: (uv)\'=u\'v+uv\'','u=x², v=sin(x) → 2x·sin(x)+x²·cos(x)',15,1,6),(7,2,'Resuelve la integral indefinida','\\displaystyle\\int x^5\\,dx=?','multiple_choice','[\"x⁶ + C\",\"x⁶/6 + C\",\"5x⁴ + C\"]','x⁶/6 + C','El exponente sube de 5 a 6. Divides entre 6.','∫ x⁵ dx = x⁶/6 + C',15,1,1),(8,2,'Resuelve la integral indefinida','\\displaystyle\\int e^x\\,dx=?','multiple_choice','[\"eˣ⁺¹ + C\",\"eˣ/x + C\",\"eˣ + C\"]','eˣ + C','eˣ es su propia antiderivada.','∫ eˣ dx = eˣ + C',15,1,2),(9,2,'Integra término a término','\\displaystyle\\int(2x^3+5)\\,dx=?','multiple_choice','[\"(1/2)x⁴+5x+C\",\"6x²+C\",\"2x⁴+5x+C\"]','(1/2)x⁴+5x+C','Integra cada término por separado.','∫2x³dx + ∫5dx = x⁴/2 + 5x + C',15,1,3),(10,2,'Integral trigonométrica','\\displaystyle\\int\\cos(x)\\,dx=?','multiple_choice','[\"−sin(x)+C\",\"sin(x)+C\",\"tan(x)+C\"]','sin(x)+C','¿Qué función al derivar da cos(x)?','d/dx[sin(x)]=cos(x) → ∫cos(x)dx=sin(x)+C',15,1,4),(11,3,'Aplica el Teorema Fundamental','\\displaystyle\\int_0^2 x\\,dx=?','multiple_choice','[\"1\",\"2\",\"4\"]','2','Antiderivada de x es x²/2. Evalúa en 2 y en 0.','F(x)=x²/2 → F(2)−F(0) = 2',15,1,1),(12,3,'Aplica el Teorema Fundamental','\\displaystyle\\int_1^3 2x\\,dx=?','multiple_choice','[\"6\",\"8\",\"4\"]','8','Antiderivada de 2x es x². F(3)−F(1).','F(x)=x² → 9−1 = 8',15,1,2),(13,3,'Integra y evalúa en los límites','\\displaystyle\\int_0^1(x^2+1)\\,dx=?','multiple_choice','[\"4/3\",\"2/3\",\"1\"]','4/3','F(x)=x³/3+x. En 1: 1/3+1=4/3.','F(1)−F(0) = 4/3',15,1,3),(14,3,'Calcula la integral definida','\\displaystyle\\int_0^{\\pi}\\sin(x)\\,dx=?','multiple_choice','[\"0\",\"1\",\"2\"]','2','F(x)=−cos(x). −cos(π)+cos(0)=1+1.','F(π)−F(0) = 2',15,1,4),(43,4,'Resuelve usando sustitución simple:','\\int 2x \\cdot \\sqrt{x^2 + 1} \\, dx','multiple_choice','[\"\\\\frac{2}{3}(x^2+1)^{3/2} + C\", \"\\\\frac{1}{3}(x^2+1)^{3/2} + C\", \"(x^2+1)^{3/2} + C\", \"\\\\frac{2}{3}(x^2+1)^{1/2} + C\"]','\\frac{2}{3}(x^2+1)^{3/2} + C','Haz u = x² + 1, entonces du = 2x dx.','∫2x·√(x²+1) dx = ∫√u du = ∫u^(1/2) du = (2/3)u^(3/2) + C = (2/3)(x²+1)^(3/2) + C.',15,1,1),(44,4,'Resuelve la integral por partes:','\\int x \\cdot e^x \\, dx','multiple_choice','[\"x e^x + C\", \"e^x(x - 1) + C\", \"x e^x - e^x + C\", \"e^x + C\"]','x e^x - e^x + C','Usa integración por partes con u = x, dv = e^x dx.','∫x e^x dx = x e^x - ∫e^x dx = x e^x - e^x + C = e^x(x - 1) + C.',15,1,2),(45,4,'Aplica sustitución trigonométrica:','\\int \\dfrac{dx}{\\sqrt{1 - x^2}}','multiple_choice','[\"\\\\arcsin(x) + C\", \"\\\\arccos(x) + C\", \"\\\\arctan(x) + C\", \"\\\\sec^{-1}(x) + C\"]','\\arcsin(x) + C','Recuerda que d/dx[arcsin(x)] = 1/√(1-x²).','∫ dx/√(1-x²) = arcsin(x) + C. Es una integral inmediata.',15,1,3),(46,4,'Resuelve por fracciones parciales:','\\int \\dfrac{1}{x^2 - 1} \\, dx','multiple_choice','[\"\\\\ln|x^2-1| + C\", \"\\\\frac{1}{2}\\\\ln\\\\left|\\\\frac{x-1}{x+1}\\\\right| + C\", \"\\\\frac{1}{2}\\\\ln(x^2-1) + C\", \"\\\\ln\\\\left|\\\\frac{x+1}{x-1}\\\\right| + C\"]','\\frac{1}{2}\\ln\\left|\\frac{x-1}{x+1}\\right| + C','Factoriza x²-1 = (x-1)(x+1) y descompón en fracciones parciales.','1/(x²-1) = 1/2·[1/(x-1) - 1/(x+1)]. Integrando: (1/2)ln|x-1| - (1/2)ln|x+1| + C = (1/2)ln|(x-1)/(x+1)| + C.',15,2,4),(47,4,'Integra usando sustitución u = ln(x):','\\int \\dfrac{1}{x \\ln(x)} \\, dx','multiple_choice','[\"\\\\ln|x| + C\", \"\\\\ln|\\\\ln(x)| + C\", \"\\\\frac{1}{\\\\ln(x)} + C\", \"\\\\ln(\\\\ln|x|) + C\"]','\\ln|\\ln(x)| + C','Haz u = ln(x), entonces du = (1/x) dx.','∫ 1/(x ln x) dx = ∫ 1/u du = ln|u| + C = ln|ln x| + C.',15,1,5),(48,4,'Aplica integración por partes dos veces:','\\int e^x \\cdot \\sin(x) \\, dx','multiple_choice','[\"e^x(\\\\sin(x) - \\\\cos(x))/2 + C\", \"e^x(\\\\sin(x) + \\\\cos(x))/2 + C\", \"e^x \\\\sin(x) + C\", \"-e^x \\\\cos(x) + C\"]','e^x(\\sin(x) - \\cos(x))/2 + C','Integra por partes dos veces y despeja la integral original.','Aplicando integración por partes dos veces se obtiene: ∫e^x sin(x) dx = e^x(sin(x) - cos(x))/2 + C.',15,2,6),(49,5,'Calcula el área entre las curvas:','y = x^2 \\text{ y } y = x \\text{ en } [0,1]','multiple_choice','[\"1/2\", \"1/6\", \"1/3\", \"1/4\"]','1/6','El área entre curvas es ∫(superior - inferior) dx.','Área = ∫₀¹ (x - x²) dx = [x²/2 - x³/3]₀¹ = 1/2 - 1/3 = 1/6.',15,1,1),(50,5,'Calcula el volumen de un sólido de revolución alrededor del eje x:','y = \\sqrt{x}, \\, x \\in [0, 4]','multiple_choice','[\"4\\\\pi\", \"8\\\\pi\", \"16\\\\pi\", \"2\\\\pi\"]','8\\pi','Usa el método de discos: V = π∫[f(x)]² dx.','V = π∫₀⁴ (√x)² dx = π∫₀⁴ x dx = π[x²/2]₀⁴ = π(16/2 - 0) = 8π.',15,1,2),(51,5,'Calcula el trabajo realizado por una fuerza variable:','F(x) = 2x \\text{ N desde } x=0 \\text{ hasta } x=5 \\text{ m}','multiple_choice','[\"10 J\", \"25 J\", \"50 J\", \"20 J\"]','25 J','Trabajo = ∫F(x) dx en el intervalo.','W = ∫₀⁵ 2x dx = [x²]₀⁵ = 25 - 0 = 25 J.',15,1,3),(52,5,'Halla la longitud de arco de la curva:','y = \\frac{2}{3}x^{3/2}, \\, x \\in [0, 3]','multiple_choice','[\"6\", \"\\\\frac{14}{3}\", \"8\", \"\\\\frac{2}{3}(10^{3/2} - 1)\"]','\\frac{14}{3}','Longitud = ∫√(1 + (dy/dx)²) dx. dy/dx = x^(1/2).','L = ∫₀³ √(1 + x) dx = [(2/3)(1+x)^(3/2)]₀³ = (2/3)(8 - 1) = 14/3.',15,2,4),(53,5,'Calcula el valor promedio de la función:','f(x) = x^2 \\text{ en } [0, 3]','multiple_choice','[\"3\", \"4\", \"9\", \"6\"]','3','Valor promedio = (1/(b-a))∫_a^b f(x) dx.','V_prom = (1/3)∫₀³ x² dx = (1/3)[x³/3]₀³ = (1/3)(27/3) = 3.',15,1,5),(54,6,'Determina si la integral impropia converge:','\\int_1^\\infty \\frac{1}{x^2} \\, dx','multiple_choice','[\"Converge a 1\", \"Converge a 2\", \"Diverge\", \"Converge a 0\"]','Converge a 1','Evalúa el límite cuando b→∞: ∫₁^b 1/x² dx.','∫₁^∞ 1/x² dx = lim_{b→∞} [-1/x]₁^b = lim_{b→∞} (-1/b + 1) = 1. Converge a 1.',15,1,1),(55,6,'Evalúa la integral impropia con discontinuidad:','\\int_0^1 \\frac{1}{\\sqrt{x}} \\, dx','multiple_choice','[\"Converge a 2\", \"Converge a 1\", \"Diverge\", \"Converge a 1/2\"]','Converge a 2','La función tiene una discontinuidad en x=0. Toma límite cuando a→0⁺.','∫₀¹ 1/√x dx = lim_{a→0⁺} [2√x]_a¹ = lim(2 - 2√a) = 2. Converge.',15,1,2),(56,6,'Determina convergencia de la integral:','\\int_1^\\infty \\frac{1}{x} \\, dx','multiple_choice','[\"Converge a 1\", \"Converge a e\", \"Diverge\", \"Converge a 0\"]','Diverge','La integral de 1/x diverge porque ln(x) → ∞ cuando x → ∞.','∫₁^∞ 1/x dx = lim_{b→∞} [ln|x|]₁^b = lim_{b→∞} ln(b) = ∞. Diverge.',15,1,3),(57,6,'Compara convergencia usando criterio de comparación:','\\int_1^\\infty \\frac{1}{1 + x^2} \\, dx','multiple_choice','[\"Converge a \\\\pi/4\", \"Converge a \\\\pi/2\", \"Diverge\", \"Converge a 1\"]','Converge a \\pi/4','Completa a la forma de arctan(x).','∫₁^∞ 1/(1+x²) dx = lim_{b→∞} [arctan(x)]₁^b = π/2 - π/4 = π/4. Converge.',15,2,4),(58,6,'Evalúa la integral impropia con ambos límites infinitos:','\\int_{-\\infty}^\\infty \\frac{1}{1 + x^2} \\, dx','multiple_choice','[\"\\\\pi\", \"\\\\pi/2\", \"2\\\\pi\", \"1\"]','\\pi','La integral se evalúa en dos partes: de -∞ a 0 y de 0 a ∞.','∫_{-∞}^∞ 1/(1+x²) dx = [arctan(x)]_{-∞}^∞ = π/2 - (-π/2) = π.',15,1,5),(59,7,'Resuelve la ecuación diferencial de primer orden:','\\frac{dy}{dx} = 2x','multiple_choice','[\"y = x^2 + C\", \"y = 2x + C\", \"y = x^2 + 2x + C\", \"y = x + C\"]','y = x^2 + C','Integra ambos lados con respecto a x.','dy/dx = 2x → y = ∫2x dx = x² + C.',15,1,1),(60,7,'Resuelve por separación de variables:','\\frac{dy}{dx} = \\frac{x}{y}','multiple_choice','[\"y^2 = x^2 + C\", \"y = \\\\sqrt{x^2 + C}\", \"y = x + C\", \"y = \\\\frac{x^2}{2} + C\"]','y = \\sqrt{x^2 + C}','Separa: y dy = x dx, luego integra ambos lados.','y dy = x dx → ∫y dy = ∫x dx → y²/2 = x²/2 + C₁ → y² = x² + C → y = √(x² + C).',15,1,2),(61,7,'Resuelve la ED lineal de primer orden:','\\frac{dy}{dx} + y = e^x','multiple_choice','[\"y = \\\\frac{1}{2}e^x + Ce^{-x}\", \"y = e^x + Ce^{-x}\", \"y = \\\\frac{1}{2}e^x + C\", \"y = Ce^x + e^{-x}\"]','y = \\frac{1}{2}e^x + Ce^{-x}','Encuentra el factor integrante μ(x) = e^(∫1 dx) = e^x.','Multiplica por e^x: e^x dy/dx + e^x y = e^(2x). Luego d/dx(ye^x) = e^(2x). Integra: ye^x = (1/2)e^(2x) + C. Despeja: y = (1/2)e^x + Ce^(-x).',15,2,3),(62,7,'Aplica condición inicial:','\\frac{dy}{dx} = 3y, \\, y(0) = 2','multiple_choice','[\"y = 2e^{3x}\", \"y = e^{3x} + 2\", \"y = 3e^{2x}\", \"y = 2e^{x}\"]','y = 2e^{3x}','Separa variables: dy/y = 3 dx, integra y aplica y(0)=2.','dy/y = 3 dx → ln|y| = 3x + C → y = Ce^(3x). Con y(0)=2: 2 = Ce⁰ = C → y = 2e^(3x).',15,2,4),(63,7,'Resuelve la ED de segundo orden simple:','\\frac{d^2y}{dx^2} = 6x','multiple_choice','[\"y = x^3 + C_1x + C_2\", \"y = 6x + C\", \"y = x^3 + C\", \"y = 3x^2 + C_1x + C_2\"]','y = x^3 + C_1x + C_2','Integra dos veces consecutivas.','dy/dx = ∫6x dx = 3x² + C₁. Luego y = ∫(3x² + C₁) dx = x³ + C₁x + C₂.',15,1,5);
/*!40000 ALTER TABLE `ejercicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estado_sigma`
--

DROP TABLE IF EXISTS `estado_sigma`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estado_sigma` (
  `sig_id` int(11) NOT NULL AUTO_INCREMENT,
  `sig_est_id` int(11) NOT NULL,
  `sig_modo` enum('guia','celebracion','apoyo','alerta','inactivo') NOT NULL DEFAULT 'guia',
  `sig_errores_cons` int(11) DEFAULT 0,
  `sig_t_inactivo` bigint(20) DEFAULT 0,
  `sig_niv_actual` int(11) DEFAULT NULL,
  `sig_ultimo_msg` text DEFAULT NULL,
  PRIMARY KEY (`sig_id`),
  UNIQUE KEY `sig_est_id` (`sig_est_id`),
  KEY `sig_niv_actual` (`sig_niv_actual`),
  CONSTRAINT `estado_sigma_ibfk_1` FOREIGN KEY (`sig_est_id`) REFERENCES `estudiantes` (`est_id`) ON DELETE CASCADE,
  CONSTRAINT `estado_sigma_ibfk_2` FOREIGN KEY (`sig_niv_actual`) REFERENCES `niveles` (`niv_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado_sigma`
--

LOCK TABLES `estado_sigma` WRITE;
/*!40000 ALTER TABLE `estado_sigma` DISABLE KEYS */;
INSERT INTO `estado_sigma` VALUES (1,1,'guia',0,0,NULL,NULL),(2,2,'guia',0,0,NULL,NULL),(3,3,'guia',0,0,NULL,NULL),(4,4,'guia',0,0,NULL,NULL),(5,5,'guia',0,0,NULL,NULL),(6,10,'guia',0,0,6,NULL),(7,11,'apoyo',3,0,4,NULL),(8,12,'guia',3,0,2,NULL),(9,13,'guia',0,0,1,NULL);
/*!40000 ALTER TABLE `estado_sigma` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estudiantes`
--

DROP TABLE IF EXISTS `estudiantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estudiantes` (
  `est_id` int(11) NOT NULL AUTO_INCREMENT,
  `est_usu_id` int(11) NOT NULL,
  `est_puntaje` int(11) NOT NULL DEFAULT 0,
  `est_racha_dias` int(11) NOT NULL DEFAULT 0,
  `est_nivel_actual` int(11) NOT NULL DEFAULT 0,
  `est_ultimo_acc` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`est_id`),
  UNIQUE KEY `est_usu_id` (`est_usu_id`),
  CONSTRAINT `estudiantes_ibfk_1` FOREIGN KEY (`est_usu_id`) REFERENCES `usuarios` (`usu_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estudiantes`
--

LOCK TABLES `estudiantes` WRITE;
/*!40000 ALTER TABLE `estudiantes` DISABLE KEYS */;
INSERT INTO `estudiantes` VALUES (1,1,120,0,0,NULL),(2,3,0,0,0,NULL),(3,4,0,0,0,NULL),(4,5,0,0,0,NULL),(5,10,0,0,0,NULL),(10,15,1265,13,5,'2026-05-17 22:30:20'),(11,16,680,7,3,'2026-05-17 00:33:51'),(12,17,150,3,1,'2026-05-16 23:20:58'),(13,18,0,1,0,'2026-05-17 23:13:44');
/*!40000 ALTER TABLE `estudiantes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `niveles`
--

DROP TABLE IF EXISTS `niveles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `niveles` (
  `niv_id` int(11) NOT NULL AUTO_INCREMENT,
  `niv_nombre` varchar(100) NOT NULL,
  `niv_subtitulo` varchar(100) DEFAULT NULL,
  `niv_modulo` int(11) NOT NULL,
  `niv_dificultad` int(11) DEFAULT 1,
  `niv_prerequisito` int(11) DEFAULT NULL,
  `niv_color` varchar(20) DEFAULT '#2E7D32',
  `niv_msg_sigma` text DEFAULT NULL,
  `niv_desbloqueado` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`niv_id`),
  KEY `niv_prerequisito` (`niv_prerequisito`),
  CONSTRAINT `niveles_ibfk_1` FOREIGN KEY (`niv_prerequisito`) REFERENCES `niveles` (`niv_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `niveles`
--

LOCK TABLES `niveles` WRITE;
/*!40000 ALTER TABLE `niveles` DISABLE KEYS */;
INSERT INTO `niveles` VALUES (1,'Nivel 0','Repaso de Bases',0,1,NULL,'#2E7D32',NULL,1),(2,'Nivel 1','Integral Indefinida',1,2,1,'#1565C0',NULL,0),(3,'Nivel 2','Integral Definida',2,3,2,'#7E57C2',NULL,0),(4,'Nivel 3','Técnicas de Integración',3,3,3,'#E67E22',NULL,0),(5,'Nivel 4','Aplicaciones de la Integral',4,4,4,'#E53935',NULL,0),(6,'Nivel 5','Integrales Impropias',5,5,5,'#00897B',NULL,0),(7,'Nivel 6','Ecuaciones Diferenciales',6,5,6,'#5E35B1',NULL,0);
/*!40000 ALTER TABLE `niveles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `progreso`
--

DROP TABLE IF EXISTS `progreso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `progreso` (
  `pro_id` int(11) NOT NULL AUTO_INCREMENT,
  `pro_est_id` int(11) NOT NULL,
  `pro_niv_id` int(11) NOT NULL,
  `pro_porcentaje` float DEFAULT 0,
  `pro_completado` tinyint(1) DEFAULT 0,
  `pro_intentos` int(11) DEFAULT 0,
  `pro_errores` int(11) DEFAULT 0,
  `pro_puntos` int(11) DEFAULT 0,
  PRIMARY KEY (`pro_id`),
  UNIQUE KEY `uq_progreso` (`pro_est_id`,`pro_niv_id`),
  KEY `idx_progreso_est` (`pro_est_id`),
  KEY `idx_progreso_niv` (`pro_niv_id`),
  CONSTRAINT `progreso_ibfk_1` FOREIGN KEY (`pro_est_id`) REFERENCES `estudiantes` (`est_id`) ON DELETE CASCADE,
  CONSTRAINT `progreso_ibfk_2` FOREIGN KEY (`pro_niv_id`) REFERENCES `niveles` (`niv_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `progreso`
--

LOCK TABLES `progreso` WRITE;
/*!40000 ALTER TABLE `progreso` DISABLE KEYS */;
INSERT INTO `progreso` VALUES (1,1,1,100,1,0,2,90),(8,10,1,100,1,3,2,265),(9,10,2,100,1,3,2,523),(10,10,3,100,1,3,2,784),(11,10,4,100,1,2,1,1001),(12,10,5,100,1,3,2,1253),(13,11,1,100,1,1,0,282),(14,11,2,100,1,3,2,516),(15,11,3,100,1,6,5,782),(16,12,1,100,1,4,3,297);
/*!40000 ALTER TABLE `progreso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resultados`
--

DROP TABLE IF EXISTS `resultados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resultados` (
  `res_id` int(11) NOT NULL AUTO_INCREMENT,
  `res_est_id` int(11) NOT NULL,
  `res_ej_id` int(11) NOT NULL,
  `res_respuesta` text DEFAULT NULL,
  `res_correcto` tinyint(1) NOT NULL,
  `res_tiempo_seg` int(11) DEFAULT 0,
  `res_intento` int(11) DEFAULT 1,
  `res_timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`res_id`),
  KEY `idx_resultados_est` (`res_est_id`),
  KEY `idx_resultados_ej` (`res_ej_id`),
  KEY `idx_resultados_est_ej` (`res_est_id`,`res_ej_id`),
  CONSTRAINT `resultados_ibfk_1` FOREIGN KEY (`res_est_id`) REFERENCES `estudiantes` (`est_id`) ON DELETE CASCADE,
  CONSTRAINT `resultados_ibfk_2` FOREIGN KEY (`res_ej_id`) REFERENCES `ejercicios` (`ej_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resultados`
--

LOCK TABLES `resultados` WRITE;
/*!40000 ALTER TABLE `resultados` DISABLE KEYS */;
INSERT INTO `resultados` VALUES (1,1,1,'11/12',1,0,1,'2026-05-04 02:43:46'),(2,1,1,'11/12',1,0,1,'2026-05-04 02:55:57'),(3,1,2,'2/12',0,0,1,'2026-05-04 02:55:57'),(4,10,1,'11/12',1,109,1,'2026-05-16 13:03:48'),(5,10,2,'respuesta_incorrecta',0,89,1,'2026-05-16 02:01:18'),(6,10,3,'x⁶',1,35,1,'2026-05-12 12:54:05'),(7,10,4,'x^(-1/2)',1,34,1,'2026-05-16 00:52:55'),(8,10,5,'3x²',1,76,1,'2026-05-15 23:32:09'),(9,10,6,'2x·sin(x)+x²·cos(x)',1,118,1,'2026-05-13 10:17:40'),(10,11,1,'respuesta_incorrecta',0,89,1,'2026-05-17 15:17:47'),(11,11,2,'8/3',1,139,1,'2026-05-12 22:42:39'),(12,11,3,'respuesta_incorrecta',0,38,1,'2026-05-17 09:10:46'),(13,11,4,'x^(-1/2)',1,112,1,'2026-05-15 23:22:27'),(14,11,5,'3x²',1,49,1,'2026-05-12 15:14:08'),(15,11,6,'respuesta_incorrecta',0,140,1,'2026-05-16 13:26:15'),(16,10,43,'\\frac{2}{3}(x^2+1)^{3/2} + C',1,0,1,'2026-05-17 23:20:41');
/*!40000 ALTER TABLE `resultados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `usu_id` int(11) NOT NULL AUTO_INCREMENT,
  `usu_nombre` varchar(100) NOT NULL,
  `usu_correo` varchar(150) NOT NULL,
  `usu_contrasena` text NOT NULL,
  `usu_rol` enum('estudiante','docente','admin') NOT NULL DEFAULT 'estudiante',
  `usu_tema` varchar(20) NOT NULL DEFAULT 'light',
  `usu_fecha_reg` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`usu_id`),
  UNIQUE KEY `usu_correo` (`usu_correo`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Ana Demo','estudiante@demo.com','$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','estudiante','light','2026-05-03 21:34:12'),(2,'Prof. Demo','docente@demo.com','$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','docente','light','2026-05-03 21:34:12'),(3,'YOIMER OSPINO','yoimer938@gmail.com','$2a$10$7j8pIAkUf3T/lPnRgg9q3ef1bBgUmq5Cf..tyRhYChqowhGogPhrK','estudiante','light','2026-05-04 07:53:46'),(4,'Alberto Salcedo','msalcedobuitrago@gmail.com','$2a$10$avLBax4ejb5iEFvvK407MuajR0bHF46q1m6BmDB8matcf2sEVba3W','estudiante','light','2026-05-04 17:44:08'),(5,'Mateo Montes','mateomntesneisa@gmail.com','$2a$10$hWnxQznivzkoR7WxcIY10.46qWBsGVqTr4O6ViTMHhPVdsS7CBSye','estudiante','light','2026-05-04 17:50:08'),(10,'valerie carrillo zambrano','zambervalerye@gmail.com','$2a$10$xJcvC71AXvGeKFvoxG8aMexY8GUrrSHxw/5j.xa5dmn2QDg3XS9Jq','estudiante','light','2026-05-05 04:53:11'),(15,'María Avanzado','avanzado@test.com','$2a$10$2r48UW.ptDJP33tFT7svkekHQI7JvuXfqFkGAB/5ehSxJNsdT9Mjy','estudiante','dark','2026-05-17 22:29:25'),(16,'Carlos Medio','intermedio@test.com','$2a$10$2r48UW.ptDJP33tFT7svkekHQI7JvuXfqFkGAB/5ehSxJNsdT9Mjy','estudiante','light','2026-05-17 22:29:25'),(17,'Ana Base','principiante@test.com','$2a$10$2r48UW.ptDJP33tFT7svkekHQI7JvuXfqFkGAB/5ehSxJNsdT9Mjy','estudiante','light','2026-05-17 22:29:25'),(18,'Luis Nuevo','nuevo@test.com','$2a$10$2r48UW.ptDJP33tFT7svkekHQI7JvuXfqFkGAB/5ehSxJNsdT9Mjy','estudiante','light','2026-05-17 22:29:25');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-17 13:28:12
