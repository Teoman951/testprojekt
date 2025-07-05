import { useState } from 'react'; // useEffect ist hier nicht zwingend nötig, da wir den Token im useState initialisieren

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