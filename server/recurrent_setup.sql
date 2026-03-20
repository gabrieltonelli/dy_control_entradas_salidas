-- ============================================================
-- Autorizaciones Recurrentes
-- ============================================================

-- Agregar columna esRecurrente a movimientos
ALTER TABLE movimientos ADD COLUMN esRecurrente TINYINT(1) NOT NULL DEFAULT 0;
ALTER TABLE movimientos ADD COLUMN vencimientoRecurrencias DATE NULL;
