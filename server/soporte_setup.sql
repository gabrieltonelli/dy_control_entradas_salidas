-- ============================================================
-- Soporte y Feedback
-- ============================================================

-- 1. Tabla de Feedbacks
CREATE TABLE IF NOT EXISTS soporte_feedbacks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL,
    tipo VARCHAR(50) NOT NULL, -- 'Sugerencia', 'Error', 'Elogio', 'Otros'
    comentario TEXT NOT NULL,
    valoracion TINYINT DEFAULT 0, -- 1 a 5
    dispositivo VARCHAR(255),
    version_app VARCHAR(20),
    fecha_registro DATETIME NOT NULL,
    resuelto TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Tabla de FAQs
CREATE TABLE IF NOT EXISTS soporte_faqs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pregunta VARCHAR(255) NOT NULL,
    respuesta TEXT NOT NULL,
    orden INT DEFAULT 0,
    categoria VARCHAR(50) DEFAULT 'General',
    activo TINYINT DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Tabla de Videotutoriales
CREATE TABLE IF NOT EXISTS soporte_videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    url VARCHAR(255) NOT NULL,
    categoria VARCHAR(50) NOT NULL, -- 'General', 'Porteria', 'Autorizantes', 'Solicitantes'
    orden INT DEFAULT 0,
    activo TINYINT DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- Seed Data inicial (Opcional)
-- ============================================================

INSERT IGNORE INTO soporte_faqs (pregunta, respuesta, orden, categoria) VALUES
('¿Cómo pido una autorización?', 'Entrá a "Nueva Solicitud", cargá los datos y seleccioná un autorizante. Si no sos autorizador, la solicitud quedará pendiente de aprobación.', 1, 'Solicitantes'),
('¿Qué hago si el QR no funciona?', 'Asegurate de que el brillo de tu pantalla esté al máximo. Si persiste, el portero puede buscarte manualmente por nombre en la lista de pendientes.', 2, 'General'),
('¿Cómo anulo una solicitud?', 'En "Mis Solicitudes", buscá la tarjeta de la solicitud y presioná el botón "Anular" que aparece al expandirla.', 3, 'General');

INSERT IGNORE INTO soporte_videos (titulo, url, categoria, orden) VALUES
('Introducción al Sistema', 'https://youtube.com/ejemplo1', 'General', 1),
('Guía para Portería: Escaneo de QR', 'https://youtube.com/ejemplo2', 'Porteria', 2),
('Gestión de Autorizaciones', 'https://youtube.com/ejemplo3', 'Autorizantes', 3),
('Cómo cargar artículos y documentos', 'https://youtube.com/ejemplo4', 'Solicitantes', 4);
