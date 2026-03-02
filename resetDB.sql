-- Script para vaciar tablas de movimientos y auditoría y reiniciar contadores
-- ADVERTENCIA: Esta operación es irreversible.

SET FOREIGN_KEY_CHECKS = 0;

-- Vaciar tablas de detalles primero (por si acaso aunque FK checks esten off)
TRUNCATE TABLE articulos;
TRUNCATE TABLE documentos;

-- Vaciar tabla de auditoria
TRUNCATE TABLE auditoria;

-- Vaciar tabla principal de movimientos
TRUNCATE TABLE movimientos;

SET FOREIGN_KEY_CHECKS = 1;

-- Mensaje de confirmación
SELECT 'Base de datos de movimientos reiniciada con éxito' AS Contexto;
