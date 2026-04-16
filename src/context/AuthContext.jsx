import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('authUser');

        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse stored user", e);
                localStorage.removeItem('authToken');
                localStorage.removeItem('authUser');
            }
        }
    }, []);

    const login = (userData) => {
        // Generate a 16-digit hexadecimal token
        const token = [...Array(16)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

        // Store in localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('authUser', JSON.stringify(userData));

        // Update state
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
