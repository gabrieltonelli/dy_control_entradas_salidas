import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from "./msal";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const { instance, accounts } = useMsal();
    const isMsAuthenticated = useIsAuthenticated();

    const [googleUser, setGoogleUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

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
        } else if (googleUser) {
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
        }
    }, [isMsAuthenticated, accounts, googleUser]);

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
            loginMicrosoft,
            loginGoogle,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
