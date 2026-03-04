-- 1. Agregar columna esAutorizador a legajos
ALTER TABLE `legajos` 
ADD COLUMN `esAutorizador` tinyint(1) NOT NULL DEFAULT '0';

-- 2. Agregar nuevos estados de movimientos
INSERT INTO `movimientoEstados` (id, nombre) VALUES 
  (4, 'Solicitado'),
  (5, 'Rechazado'),
  (6, 'Anulado')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

-- 3. Marcar al usuario administrador (legajo 1768 = gabrielt) como autorizador
-- Actualizar según corresponda en producción
UPDATE `legajos` SET `esAutorizador` = 1 WHERE `legajo` = '1768';

-- Verificar
SELECT * FROM movimientoEstados;
SELECT legajo, apellido_nombre, esAutorizador FROM legajos WHERE esAutorizador = 1;
