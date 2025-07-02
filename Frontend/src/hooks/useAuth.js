import { useState } from 'react';

const useAuth = () => {
    const [token, setToken] = useState(localStorage.getItem('authToken'));

    const login = (newToken) => {
        setToken(newToken);
        localStorage.setItem('authToken', newToken);
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('authToken');
    };

    return { token, login, logout };
};

export default useAuth;