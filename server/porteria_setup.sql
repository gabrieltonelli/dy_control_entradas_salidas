-- ============================================================
-- Portería Backoffice - Setup Script
-- Ejecutar UNA SOLA VEZ contra la base de datos Acceso_A_Planta
-- ============================================================

-- 1. Nuevas columnas en movimientos (compatible MySQL 8)
-- ============================================================
DROP PROCEDURE IF EXISTS sp_AddColumnIfNotExists;
DELIMITER $$
CREATE PROCEDURE sp_AddColumnIfNotExists()
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME   = 'movimientos'
      AND COLUMN_NAME  = 'fechaHoraCompletado'
  ) THEN
    ALTER TABLE movimientos ADD COLUMN fechaHoraCompletado DATETIME NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME   = 'movimientos'
      AND COLUMN_NAME  = 'observacionPorteria'
  ) THEN
    ALTER TABLE movimientos ADD COLUMN observacionPorteria TEXT NULL;
  END IF;
END$$
DELIMITER ;
CALL sp_AddColumnIfNotExists();
DROP PROCEDURE IF EXISTS sp_AddColumnIfNotExists;

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
