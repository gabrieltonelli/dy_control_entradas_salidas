-- Maestro de porteros
CREATE TABLE IF NOT EXISTS porteros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL
);

-- Registros iniciales maestros
INSERT IGNORE INTO porteros (descripcion) VALUES ('Turno Mañana'), ('Turno Tarde'), ('Turno Noche');

-- El campo vigilador ya existe en la tabla movimientos, aseguramos que sea VARCHAR(30)
ALTER TABLE movimientos MODIFY COLUMN IF EXISTS vigilador VARCHAR(30);
