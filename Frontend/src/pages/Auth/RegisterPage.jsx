import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!name || !email || !password) {
            setError('Bitte alle Felder ausfüllen.');
            return;
        }
        if (password.length < 6) {
            setError('Passwort muss mindestens 6 Zeichen lang sein.');
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Registrierung erfolgreich! Bitte logge dich jetzt ein.');
                navigate('/login');
            } else {
                setError(data.message || 'Registrierung fehlgeschlagen. Versuchen Sie eine andere E-Mail.');
            }
        } catch (err) {
            setError('Netzwerkfehler: Server nicht erreichbar oder Verbindungsproblem.');
            console.error('Registration Error:', err);
        }
    };

    return (
        <div className="auth-container">
            <h2>Registrieren</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">E-Mail:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Passwort:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mind. 6 Zeichen"
                        required
                    />
                </div>
                <button type="submit">Registrieren</button>
            </form>
            <p>Bereits ein Konto? <Link to="/login">Hier einloggen</Link></p>
        </div>
    );
}

export default RegisterPage;