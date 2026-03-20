-- ============================================================
-- Gestión de Roles y Legajos
-- ============================================================

-- 1. Agregar columna idRol a legajos (1: Usuario, 2: RRHH, 100: Sysadmin)
ALTER TABLE legajos ADD COLUMN idRol INT NOT NULL DEFAULT 1;

-- 2. Asegurar que RRHH y Sysadmin sean autorizantes
-- (Esta lógica se puede aplicar manualmente o mediante triggers, 
-- pero por ahora actualizamos los existentes si los hubiera)
UPDATE legajos SET esAutorizador = 1 WHERE idRol IN (2, 100);

-- 3. Ejemplo de asignación de roles (Opcional, para pruebas)
-- UPDATE legajos SET idRol = 100, esAutorizador = 1 WHERE email = 'tu-email@donyeyo.com.ar';
