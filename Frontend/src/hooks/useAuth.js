import { useState, useEffect } from 'react';
import {jwtDecode} from "jwt-decode";

const useAuth = () => {
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserRole(decoded.user.role); // Achte darauf, dass dein Token die Rolle genau hier drin hat!
            } catch (error) {
                setUserRole(null);
            }
        } else {
            setUserRole(null);
        }
        setLoading(false);
    }, [token]);

    const login = (newToken) => {
        setToken(newToken);
        localStorage.setItem('authToken', newToken);
    };

    const logout = () => {
        setToken(null);
        setUserRole(null);
        localStorage.removeItem('authToken');
    };

    return { token, userRole, loading, login, logout };
};

export default useAuth;