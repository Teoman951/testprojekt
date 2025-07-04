import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Definiere die Basis-URL hier, am besten außerhalb der Komponente oder in einer Konfigurationsdatei
const API_BASE_URL = 'http://localhost:3001'; // Dein Backend-Server-Port

function LoginPage({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Grundlegende Validierung
        if (!email || !password) {
            setError('Bitte E-Mail und Passwort eingeben.');
            return;
        }

        try {
            // Die fetch-Anfrage verwendet jetzt die definierte API_BASE_URL
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Sende E-Mail und Passwort im Body
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json(); // Versuche, die Antwort als JSON zu parsen

            if (response.ok) {
                // Login erfolgreich: Token speichern und onLoginSuccess aufrufen
                // Backend sollte hier { message: '...', token: '...', user: {...} } zurückgeben
                alert('Login erfolgreich!'); // Temporäre Erfolgsmeldung
                onLoginSuccess(data.token); // Der onLoginSuccess-Callback in App.jsx wird aufgerufen
            } else {
                // Login fehlgeschlagen: Fehlermeldung vom Backend anzeigen
                setError(data.message || 'Login fehlgeschlagen. Bitte versuchen Sie es erneut.');
            }
        } catch (err) {
            // Netzwerkfehler oder unerwartete Antwortstruktur
            setError('Netzwerkfehler: Server nicht erreichbar oder Verbindungsproblem. Oder unerwartete Server-Antwort.');
            console.error('Login Error:', err);
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
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
                        required
                    />
                </div>
                <button type="submit">Einloggen</button>
            </form>
            <p>Noch kein Konto? <Link to="/register">Hier registrieren</Link></p>
        </div>
    );
}

export default LoginPage;