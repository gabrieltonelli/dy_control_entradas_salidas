import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from "./msal";
import { checkPorteria } from "../services/porteriaService";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const { instance, accounts } = useMsal();
    const isMsAuthenticated = useIsAuthenticated();

    const [googleUser, setGoogleUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [porteria, setPorteria] = useState(null);
    const [esPortero, setEsPortero] = useState(null);

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
        } else {
            setEsPortero(null);
            setPorteria(null);
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

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user,
            porteria,
            esPortero,
            loginMicrosoft,
            loginGoogle,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
