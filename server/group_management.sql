-- =============================================================================
-- group_management.sql
-- Stored Procedures para la gestión consistente de grupos de movimientos encadenados.
-- Ejecutar una sola vez contra la BD Acceso_A_Planta.
--
-- DECISIÓN DE DISEÑO:
-- Los estados de articulos y documentos (objetoEstados) tienen semántica propia
-- (Recibido, Entregado, Devuelto...) y NO se propagan automáticamente desde
-- los estados de movimientos. El control del estado de objetos queda a cargo
-- del flujo específico de recepción/entrega. No se crean triggers.
--
-- Objetos que crea este script:
--   - sp_AnularGrupo(idMovimiento, observacion)
--   - sp_VencerConsecutivos(idMovimiento)
-- =============================================================================

DELIMITER //

-- =============================================================================
-- SP: sp_AnularGrupo
-- Anula todos los movimientos activos del grupo al que pertenece el movimiento
-- indicado. No toca artículos ni documentos.
-- Parámetros:
--   p_idMovimiento : id de cualquier movimiento del grupo (normalmente el representante)
--   p_observacion  : texto libre (puede ser NULL o '')
-- =============================================================================
DROP PROCEDURE IF EXISTS sp_AnularGrupo //
CREATE PROCEDURE sp_AnularGrupo(
    IN p_idMovimiento INT,
    IN p_observacion  VARCHAR(500)
)
BEGIN
    DECLARE v_idGrupo INT DEFAULT 0;
    DECLARE v_obs     VARCHAR(520);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    SELECT idGrupo INTO v_idGrupo
    FROM movimientos
    WHERE id = p_idMovimiento
    FOR UPDATE;

    SET v_obs = CONCAT('[ANULADO] ', COALESCE(p_observacion, ''));

    IF v_idGrupo = 0 THEN
        -- Movimiento sin grupo (singleton): anular solo ese
        UPDATE movimientos
        SET idEstado = 6, observacion = v_obs
        WHERE id = p_idMovimiento
          AND idEstado NOT IN (2, 5, 6);  -- no completado, no rechazado, no ya-anulado
    ELSE
        -- Grupo: anular todos los miembros activos
        UPDATE movimientos
        SET idEstado = 6, observacion = v_obs
        WHERE idGrupo = v_idGrupo
          AND idEstado NOT IN (2, 5, 6);
    END IF;

    COMMIT;
END //


-- =============================================================================
-- SP: sp_VencerConsecutivos
-- Cuando un movimiento de un grupo pasa a Vencido(3), vence todos los movimientos
-- siguientes (mayor ordenGrupo) que todavía estén activos en ese grupo.
-- Los ya completados no se tocan.
-- Llamar desde el proceso/endpoint que marca un movimiento como Vencido.
-- Parámetros:
--   p_idMovimiento : id del movimiento que acaba de vencer
-- =============================================================================
DROP PROCEDURE IF EXISTS sp_VencerConsecutivos //
CREATE PROCEDURE sp_VencerConsecutivos(
    IN p_idMovimiento INT
)
BEGIN
    DECLARE v_idGrupo    INT DEFAULT 0;
    DECLARE v_ordenGrupo INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    SELECT idGrupo, ordenGrupo
    INTO   v_idGrupo, v_ordenGrupo
    FROM   movimientos
    WHERE  id = p_idMovimiento
    FOR UPDATE;

    -- Solo aplica si pertenece a un grupo real
    IF v_idGrupo > 0 THEN
        UPDATE movimientos
        SET idEstado = 3  -- Vencido
        WHERE idGrupo    = v_idGrupo
          AND ordenGrupo  > v_ordenGrupo
          AND idEstado NOT IN (2, 3, 5, 6)  -- no completado/vencido/rechazado/anulado
          AND id != p_idMovimiento;
    END IF;

    COMMIT;
END //

DELIMITER ;
