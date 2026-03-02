@echo off
setlocal EnableDelayedExpansion
cls

echo ========================================================
echo   SISTEMA DON YEYO - ACCESO MOVIL (RED LOCAL)
echo ========================================================
echo.
echo Este script NO inicia servidores.
echo Asegurate de haber levantado el cliente y el servidor
echo manualmente antes de continuar.
echo.

:: --------------------------------------------------------
:: PASO 1: Leer el puerto del cliente desde client\.env
:: --------------------------------------------------------
set CLIENT_PORT=5173

if exist "client\.env" (
    for /f "usebackq tokens=1,2 delims==" %%a in ("client\.env") do (
        set KEY=%%a
        set VAL=%%b
        if /i "!KEY!"=="VITE_PORT" (
            if not "!VAL!"=="" set CLIENT_PORT=!VAL!
        )
    )
)

echo [ INFO ] Puerto del cliente detectado: %CLIENT_PORT%

:: --------------------------------------------------------
:: PASO 2: Obtener IP local de la maquina
:: --------------------------------------------------------
for /f "usebackq tokens=*" %%a in (`powershell -NoProfile -Command ^
    "(Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notmatch '^(127\.|169\.254\.)' -and $_.PrefixOrigin -ne 'WellKnown' } | Sort-Object -Property InterfaceMetric | Select-Object -First 1).IPAddress"`) do set IP=%%a

if "%IP%"=="" (
    echo [ERROR] No se pudo detectar una direccion IP local.
    echo         Verificá que estés conectado a una red Wi-Fi o Ethernet.
    pause
    exit /b 1
)

echo [ OK  ] IP de esta maquina: %IP%
echo.

:: --------------------------------------------------------
:: PASO 3: Abrir el firewall para el puerto del cliente
:: --------------------------------------------------------
echo --------------------------------------------------------
echo   CONFIGURANDO FIREWALL...
echo --------------------------------------------------------
echo Se van a habilitar permisos de red para el puerto %CLIENT_PORT%.
echo Si Windows pide confirmacion de administrador, acepta.
echo.

powershell -NoProfile -Command ^
    "Start-Process powershell -ArgumentList '-NoProfile -Command ""netsh advfirewall firewall delete rule name=DonYeyo_Client 2>$null; netsh advfirewall firewall add rule name=\\\"DonYeyo_Client\\\" dir=in action=allow protocol=TCP localport=%CLIENT_PORT%""' -Verb RunAs -Wait" 2>nul

if %ERRORLEVEL% NEQ 0 (
    echo [WARN] No se pudo configurar el firewall automaticamente.
    echo        Podes hacerlo manualmente desde:
    echo        Panel de control - Firewall de Windows - Reglas de entrada
    echo        Agrega una regla para el puerto TCP %CLIENT_PORT%
) else (
    echo [ OK  ] Firewall configurado para el puerto %CLIENT_PORT%
)

echo.
echo ========================================================
echo   ACCESO DESDE DISPOSITIVOS EN LA RED LOCAL
echo ========================================================
echo.
echo   >>> ABRE ESTA URL EN TU CELULAR O TABLET: <<<
echo.
echo        http://%IP%:%CLIENT_PORT%
echo.
echo ========================================================
echo.
echo   INSTRUCCIONES:
echo   1. Asegurate de que tu celular este conectado a la
echo      misma red Wi-Fi que esta computadora.
echo   2. Abre el navegador en el celular (Chrome, Safari...).
echo   3. Ingresa la URL: http://%IP%:%CLIENT_PORT%
echo   4. Si no carga, verificá que el cliente (Vite) este
echo      corriendo en esta maquina con --host activado.
echo      El comando correcto es: npx vite --host
echo.
echo   Para cerrar esta ventana presiona cualquier tecla.
echo ========================================================
echo.

pause
