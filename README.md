# Control de Ingresos y Egresos - Don Yeyo S.A.

Sistema premium para la automatización y registro de movimientos de personal, artículos y documentación en los puestos de Vigilancia (Portería) y Recepción.

## 🚀 Arquitectura y Tecnologías

El proyecto utiliza una arquitectura moderna de **SPA (Single Page Application)** con un backend unificado mediante **Netlify Functions**:

- **Frontend:** React + Vite + MSAL (Microsoft Authentication Library).
- **Backend:** Node.js + Express (adaptado a Serverless con `serverless-http`).
- **Base de Datos:** MySQL 8 (AWS RDS).
- **Estética:** Glassmorphism, animaciones fluidas y diseño responsivo "Mobile-First".

---

## 🔐 Configuración de Azure AD (Autenticación @donyeyo.com.ar)

Para que el login funcione, debe registrar la aplicación en el portal de Azure:

1. Inicie sesión en [Azure Portal](https://portal.azure.com/).
2. Vaya a **Microsoft Entra ID** (antiguo Azure AD) -> **App registrations** -> **New registration**.
3. **Nombre:** `Control Accesos Don Yeyo`.
4. **Supported account types:** `Accounts in this organizational directory only (Single tenant)`.
5. **Redirect URI:** Seleccione `Single-page application (SPA)` y ponga:
   - Para desarrollo: `http://localhost:5173`
   - Para producción: `https://su-app.netlify.app`
6. En **Authentication**, asegúrese de marcar `Access tokens` e `ID tokens`.
7. Copie el **Application (client) ID** y el **Directory (tenant) ID**.
8. En el menú de la izquierda, vaya a **Certificates & secrets** -> **Client secrets** -> **New client secret**.
9. Escriba una descripción (ej: `Secret Control Acceso`) y elija un tiempo de expiración.
10. Al hacer clic en **Add**, copie el **Value** del secreto generado.
   > [!IMPORTANT]
   > Guarde el valor del secreto inmediatamente, ya que Azure no lo volverá a mostrar después de salir de la pantalla.

---

## 📦 Configuración y Ejecución Local

### 1. Variables de Entorno
Cree un archivo `.env` tanto en `/client` como en `/server` basándose en los archivos `.env.template`.

**Server (`/server/.env`):**
```env
DB_HOST=...
DB_USER=...
DB_PASS=...
DB_NAME=Acceso_A_Planta
AZURE_AD_CLIENT_ID=TU_CLIENT_ID
AZURE_AD_TENANT_ID=TU_TENANT_ID
AZURE_AD_CLIENT_SECRET=TU_CLIENT_SECRET
```

**Client (`/client/.env`):**
```env
VITE_AZURE_AD_CLIENT_ID=TU_CLIENT_ID
VITE_AZURE_AD_TENANT_ID=TU_TENANT_ID
```

### 2. Instalación e Inicio
Desde la raíz del proyecto, puede instalar todo e iniciar ambos entornos con un solo comando:

**Primera vez:**
```bash
npm install && npm run install-all
```

**Para desarrollar:**
```bash
npm run dev
```

Esto iniciará el Servidor (Puerto 5000) y el Cliente (Puerto 5173) de forma simultánea.


---

## ☁️ Despliegue en Netlify

El proyecto está configurado para un **despliegue unificado** (Front + Back en el mismo sitio):

1. Sube el código a un repositorio de GitHub/GitLab.
2. En Netlify, crea un "New site from Git".
3. Netlify leerá el archivo `netlify.toml` automáticamente.
4. **Configura las Variables de Entorno** en Netlify (Site Settings -> Env Vars):
   - Agregue todas las de la sección anterior (`DB_HOST`, `DB_USER`, `VITE_...`).
5. Netlify compilará el React y convertirá el Express en una **Netlify Function** accesible bajo `/api`.

---

## 📖 Guía de Uso

### 1. Inicio de Sesión
Al ingresar, el sistema redirigirá al portal de Microsoft. Debe usar su cuenta corporativa `@donyeyo.com.ar`.

### 2. Dashboard
Visualice los movimientos activos. Las tarjetas cambian de color según el estado (Pendiente, Completado) y muestran quién autorizó el movimiento.

### 3. Nueva Solicitud
- Seleccione la persona a autorizar (desde la base de datos de legajos).
- Elija el origen y destino.
- **Artículos/Documentos:** Pulse "Agregar" para vincular herramientas o remitos. Puede marcar artículos como "Sin Retorno" (consumibles).
- **Autorización:** Elija el motivo y quién firma la autorización.

### 4. Auditoría
Todas las acciones (creación, edición, eliminación) se guardan automáticamente en la tabla `auditoria` de la base de datos MySQL mediante triggers configurados en el sistema.

---

## 🛠️ Estructura del Código

- `/client/src/components`: UI Components premium reutilizables.
- `/client/src/pages`: Pantallas principales (Formulario y Dashboard).
- `/server/controllers`: Lógica de transacciones MySQL.
- `/server/routes`: Definición de endpoints API.
- `/docs`: Documentación técnica original y dump de DB.
