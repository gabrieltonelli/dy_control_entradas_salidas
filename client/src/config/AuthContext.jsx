import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from "./msal";
import { checkPorteria } from "../services/porteriaService";
import { MastersService } from "../services/api";
import { NotificationService } from "../services/notificationService";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const { instance, accounts } = useMsal();
    const isMsAuthenticated = useIsAuthenticated();

    const [googleUser, setGoogleUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [porteria, setPorteria] = useState(null);
    const [esPortero, setEsPortero] = useState(null);
    const [esAutorizador, setEsAutorizador] = useState(false);
    const [legajoInfo, setLegajoInfo] = useState(null);

    useEffect(() => {
        const storedGoogleUser = localStorage.getItem('google_user');
        if (storedGoogleUser) {
            try {
                const parsed = JSON.parse(storedGoogleUser);
                setGoogleUser(parsed);
            } catch (e) {
                localStorage.removeItem('google_user');
            }
        }
    }, []);

    useEffect(() => {
        if (isMsAuthenticated && accounts.length > 0) {
            setIsAuthenticated(true);
            setUser({
                name: accounts[0].name,
                email: accounts[0].username,
                provider: 'microsoft',
                avatar: null // MS Graph would be needed for this
            });
        } else if (googleUser && import.meta.env.VITE_ENABLE_GOOGLE_LOGIN !== 'false') {
            setIsAuthenticated(true);
            setUser({
                name: googleUser.name,
                email: googleUser.email,
                provider: 'google',
                avatar: googleUser.picture
            });
        } else {
            setIsAuthenticated(false);
            setUser(null);
            setPorteria(null);
            setEsPortero(null);
        }
    }, [isMsAuthenticated, accounts, googleUser]);

    useEffect(() => {
        // BYPASS DE AUTENTICACION PARA DESARROLLO LOCAL
        if (import.meta.env.DEV && import.meta.env.VITE_MOCK_AUTH === 'true') {
            const mockEmail = import.meta.env.VITE_MOCK_AUTH_EMAIL;

            if (!mockEmail) {
                alert("⚠️ Error: VITE_MOCK_AUTH está activo pero falta setear VITE_MOCK_AUTH_EMAIL en el archivo .env");
                console.error("VITE_MOCK_AUTH está activo pero falta setear VITE_MOCK_AUTH_EMAIL");
                setIsAuthenticated(false);
                setUser(null);
                return;
            }

            if (!user || user.email !== mockEmail) {
                console.log(`⚠️ MODO MOCK ACTIVADO: Entrando como ${mockEmail}`);
                setIsAuthenticated(true);
                setUser({
                    name: "Usuario Mock",
                    email: mockEmail,
                    provider: 'mock',
                    avatar: null
                });
                // No retornamos aquí para permitir que la lógica de abajo cargue sus permisos reales
                // O podemos retornar y esperar a que el cambio de estado en user.email dispare el efecto de nuevo.
                // Como user.email es dependencia, es más seguro retornar y dejar que el re-render maneje la carga.
                return;
            }
        }

        if (user?.email) {
            checkPorteria(user.email)
                .then(res => {
                    setEsPortero(res.data.esPortero);
                    if (res.data.esPortero) {
                        setPorteria(res.data.porteria);
                    } else {
                        setPorteria(null);
                    }
                })
                .catch(() => {
                    setEsPortero(false);
                    setPorteria(null);
                });

            // Obtener info de legajo para ver si es autorizador
            MastersService.getMe(user.email)
                .then(res => {
                    const info = res.data;
                    setLegajoInfo(info);
                    const isAuth = info.esAutorizador === 1;
                    setEsAutorizador(isAuth);

                    // Intentar suscribir a notificaciones push (para autorizadores y solicitantes)
                    NotificationService.checkSubscription().then(isSubscribed => {
                        if (!isSubscribed) {
                            // Pequeño delay para no abrumar al iniciar sesión
                            setTimeout(() => {
                                NotificationService.subscribeUser(user.email);
                            }, 3000);
                        }
                    });
                })
                .catch(err => {
                    console.error("Error obteniendo info de legajo:", err);
                    setEsAutorizador(false);
                    setLegajoInfo(null);
                });
        } else {
            setEsPortero(null);
            setPorteria(null);
            setEsAutorizador(false);
            setLegajoInfo(null);
        }
    }, [user?.email]);

    const loginMicrosoft = () => {
        instance.loginRedirect(loginRequest).catch(e => console.error(e));
    };

    const loginGoogle = (decoded) => {
        setGoogleUser(decoded);
        localStorage.setItem('google_user', JSON.stringify(decoded));
    };

    const logout = () => {
        if (user?.provider === 'microsoft') {
            instance.logoutRedirect().catch(e => console.error(e));
        } else {
            setGoogleUser(null);
            localStorage.removeItem('google_user');
        }
    };

    // Jerarquía de roles: devuelve true si el rol del usuario es >= al mínimo requerido
    // Roles: 1 (Usuario), 2 (RRHH/Gestor), 100 (Sysadmin)
    const hasRole = useCallback((minRole) => {
        if (!legajoInfo) return false;
        return (legajoInfo.idRol || 1) >= minRole;
    }, [legajoInfo]);

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user,
            porteria,
            esPortero,
            esAutorizador,
            legajoInfo,
            hasRole,
            loginMicrosoft,
            loginGoogle,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
