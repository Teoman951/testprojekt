import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Definiere die Basis-URL hier, am besten außerhalb der Komponente oder in einer Konfigurationsdatei
const API_BASE_URL = 'http://localhost:3001'; // Dein Backend-Server-Port

function RegisterPage() {
    // useState für den Benutzernamen (username)
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Überprüfe, ob alle Felder ausgefüllt sind (jetzt mit username)
        if (!username || !email || !password) {
            setError('Bitte alle Felder ausfüllen.');
            return;
        }
        if (password.length < 6) {
            setError('Passwort muss mindestens 6 Zeichen lang sein.');
            return;
        }

        try {
            // Die fetch-Anfrage verwendet jetzt die definierte API_BASE_URL
            // Sende 'username' im Body, passend zum Backend
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // HIER ist die Korrektur: username statt name im JSON-Body
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Registrierung erfolgreich! Bitte logge dich jetzt ein.');
                navigate('/login');
            } else {
                // Backend-Fehlermeldung anzeigen, falls vorhanden
                setError(data.message || 'Registrierung fehlgeschlagen. Versuchen Sie eine andere E-Mail.');
            }
        } catch (err) {
            // Generischer Fehler für Netzwerkprobleme oder unerwartete Antworten
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
                    <label htmlFor="username">Benutzername:</label> {/* Label auf Benutzername geändert */}
                    <input
                        type="text"
                        id="username" // ID auf Benutzername geändert
                        value={username} // HIER die Korrektur: value an den username State binden
                        onChange={(e) => setUsername(e.target.value)} // HIER die Korrektur: onChange an setUsername binden
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
