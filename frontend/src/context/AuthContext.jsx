import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const email = localStorage.getItem('email');
        const userId = localStorage.getItem('userId');
        const isVerified = localStorage.getItem('isVerified');

        if (token && role && email) {
            setUser({ email, role, userId, isVerified });
        }
        setLoading(false);
    }, []);

    const login = (token, email, role, userId, isVerified) => {
        localStorage.setItem('token', token);
        localStorage.setItem('email', email);
        localStorage.setItem('role', role);
        localStorage.setItem('userId', userId);
        if (isVerified) {
            localStorage.setItem('isVerified', isVerified);
        }
        setUser({ email, role, userId, isVerified });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        localStorage.removeItem('isVerified');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}