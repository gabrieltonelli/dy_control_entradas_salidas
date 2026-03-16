-- ============================================================
-- Carga Masiva de FAQs - Don Yeyo Manager (CIE)
-- ============================================================
SET NAMES 'utf8mb4';
DELETE FROM soporte_faqs;

INSERT INTO soporte_faqs (pregunta, respuesta, orden, categoria) VALUES
-- CATEGORÍA: GENERAL
('¿Qué es Don Yeyo Manager (CIE)?', 'Es el Sistema de Control de Ingresos y Egresos digitalizado para Don Yeyo S.A. Permite gestionar autorizaciones de personas externas, artículos y documentos de forma ágil, eliminando el uso de planillas de papel.', 1, 'General'),
('¿Desde qué dispositivos puedo acceder?', 'La aplicación es una PWA (Progressive Web App). Podés usarla desde cualquier navegador en PC, o instalarla en tu celular (Android/iOS) usando la opción "Instalar aplicación" o "Agregar a pantalla de inicio" del navegador.', 2, 'General'),
('¿Qué hago si no puedo iniciar sesión?', 'Asegurate de estar usando tu cuenta corporativa de Microsoft o Google autorizada. Si el error persiste, contactá a Sistemas para verificar tus permisos en el Active Directory.', 3, 'General'),
('¿Cómo activo las notificaciones?', 'Al iniciar sesión como autorizador, el sistema te pedirá permiso para enviar notificaciones. Debes pulsar "Permitir". Esto te avisará al instante cuando alguien solicite tu aprobación.', 4, 'General'),

-- CATEGORÍA: SOLICITANTES
('¿Cómo realizo una nueva solicitud?', 'Ingresá al menú "Nueva Solicitud", cargá los datos de la persona o empresa, seleccioná el tipo de movimiento y, lo más importante, elegí al Autorizante correspondiente.', 5, 'Solicitantes'),
('¿Dónde veo mi código QR para entrar?', 'Una vez que tu solicitud sea "Aprobada", aparecerá en la sección "Mis Solicitudes". Al expandir la tarjeta de la solicitud, verás el botón "Ver QR" que debés mostrar en portería.', 6, 'Solicitantes'),
('¿Puedo anular una solicitud que ya envié?', 'Sí. En "Mis Solicitudes", buscá la solicitud pendiente y seleccioná "Anular". Esto evitará que el autorizante pierda tiempo con una gestión que ya no es necesaria.', 7, 'Solicitantes'),
('¿Por qué mi solicitud sigue pendiente?', 'Las solicitudes deben ser aprobadas manualmente por el autorizante que elegiste. Podés ver quién es el responsable en el detalle de tu solicitud en "Mis Solicitudes".', 8, 'Solicitantes'),
('¿Qué hago si me rechazaron una solicitud?', 'En el detalle de la solicitud verás el motivo del rechazo. Deberás crear una nueva solicitud corrigiendo los datos observados por el autorizante.', 9, 'Solicitantes'),

-- CATEGORÍA: AUTORIZANTES
('¿Cómo apruebo una solicitud pendiente?', 'Cuando recibas la notificación (o al entrar a la app), presioná en la sección de notificaciones o buscá en "Mis Solicitudes" las tarjetas que dicen "Requiere tu acción". Allí podrás Aprobar o Rechazar directamente.', 10, 'Autorizantes'),
('¿Puedo ver qué solicitudes aprobé en el pasado?', 'Sí, en la sección "Mis Solicitudes" podés filtrar por historial para ver todas las gestiones que pasaron por tu supervisión.', 11, 'Autorizantes'),
('¿Qué pasa si apruebo algo por error?', 'Una vez aprobada, la solicitud genera un QR válido. Si cometiste un error, debés comunicarte con Portería de inmediato para que anulen el ingreso o buscar la solicitud en tu historial y ver si aún puede ser invalidada.', 12, 'Autorizantes'),

-- CATEGORÍA: PORTERÍA
('¿Cómo busco a alguien si no tiene el QR?', 'En la sección "Pendientes del día", podés usar el buscador por nombre o DNI. No es obligatorio que el usuario tenga el QR, pero agiliza mucho el proceso.', 13, 'Porteria'),
('¿Qué hago si el escáner de QR no abre la cámara?', 'Verificá que le hayas dado permisos de cámara al navegador. Si el problema persiste, recordá que podés realizar el ingreso manual buscando al usuario por el buscador de portería.', 14, 'Porteria'),
('¿Cómo registro una salida?', 'Buscá al usuario en el listado de personas que ya ingresaron (Historial o sección de movimientos activos) y presioná el botón "Registrar Salida". Esto liberará el cupo y cerrará el ciclo del movimiento.', 15, 'Porteria');
