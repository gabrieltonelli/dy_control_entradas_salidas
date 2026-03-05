-- ============================================================
-- Portería Backoffice - Setup Script
-- Ejecutar UNA SOLA VEZ contra la base de datos Acceso_A_Planta
-- ============================================================

-- 1. Nuevas columnas en movimientos
-- ============================================================
ALTER TABLE movimientos
  ADD COLUMN IF NOT EXISTS fechaHoraCompletado DATETIME NULL,
  ADD COLUMN IF NOT EXISTS observacionPorteria TEXT NULL;

-- 2. Tabla porterias
-- ============================================================
CREATE TABLE IF NOT EXISTS porterias (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email  VARCHAR(150) NOT NULL UNIQUE,
  activa TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Tabla porteriaDependencias (portería ↔ lugar)
-- ============================================================
CREATE TABLE IF NOT EXISTS porteriaDependencias (
  idPorteria INT NOT NULL,
  idLugar    INT NOT NULL,
  PRIMARY KEY (idPorteria, idLugar),
  FOREIGN KEY (idPorteria) REFERENCES porterias(id) ON DELETE CASCADE,
  FOREIGN KEY (idLugar)    REFERENCES lugares(id)   ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Seed: porterías (INSERT IGNORE para ser idempotente)
-- ============================================================
INSERT IGNORE INTO porterias (nombre, email) VALUES
  ('Portería Pellegrini',         'vigilancia-pe@donyeyo.com.ar'),
  ('Portería Hipólito Yrigoyen',  'vigilancia-hy@donyeyo.com.ar'),
  ('Portería Elguea Román',       'vigilancia-er@donyeyo.com.ar');

-- 5. Seed: porteriaDependencias
--    Ajustá los nombres de lugares si difieren en tu BD
-- ============================================================
INSERT IGNORE INTO porteriaDependencias (idPorteria, idLugar)
SELECT p.id, l.id
FROM porterias p
JOIN lugares l ON
  (p.email = 'vigilancia-pe@donyeyo.com.ar' AND l.nombre = 'Planta Pellegrini')
  OR (p.email = 'vigilancia-hy@donyeyo.com.ar' AND l.nombre = 'Planta Hipólito Yrigoyen')
  OR (p.email = 'vigilancia-er@donyeyo.com.ar' AND l.nombre = 'Planta Elguea Román');

-- ============================================================
-- FIN DEL SCRIPT
-- Verificar que porteriaDependencias tenga 3 filas:
-- SELECT * FROM porteriaDependencias;
-- ============================================================
