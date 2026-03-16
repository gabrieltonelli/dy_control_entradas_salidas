-- ============================================================
-- Carga de Videotutoriales - Don Yeyo Manager (CIE)
-- ============================================================
SET NAMES 'utf8mb4';
DELETE FROM soporte_videos;

INSERT INTO soporte_videos (titulo, descripcion, url, categoria, orden) VALUES
-- GENERALES
('Introducción a CIE', 'Conceptos básicos del nuevo sistema de control de ingresos y egresos.', 'https://youtube.com/watch?v=intro-cie', 'General', 1),
('Cómo instalar la App', 'Guía para agregar Don Yeyo Manager a tu pantalla de inicio en Android e iOS.', 'https://youtube.com/watch?v=install-app', 'General', 2),

-- PORTERÍA
('Escaneo de QR', 'Procedimiento correcto para escanear códigos desde la garita.', 'https://youtube.com/watch?v=scan-qr', 'Porteria', 3),
('Búsqueda Manual e Ingreso', 'Qué hacer cuando un visitante no cuenta con su código QR.', 'https://youtube.com/watch?v=manual-entry', 'Porteria', 4),

-- AUTORIZANTES
('Gestión de Solicitudes', 'Cómo aprobar o rechazar solicitudes pendientes desde el móvil.', 'https://youtube.com/watch?v=admin-approval', 'Autorizantes', 5),
('Configuración de Notificaciones', 'Asegurate de recibir alertas en tiempo real de nuevas solicitudes.', 'https://youtube.com/watch?v=setup-push', 'Autorizantes', 6),

-- SOLICITANTES
('Carga de Solicitud de Terceros', 'Paso a paso para autorizar el ingreso de un proveedor o visita.', 'https://youtube.com/watch?v=new-request', 'Solicitantes', 7),
('Uso del QR Personal', 'Cómo encontrar y presentar tu QR al llegar a planta.', 'https://youtube.com/watch?v=my-qr', 'Solicitantes', 8);
