import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3001';

function CreateStaffPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !email || !password) {
            setError('Bitte alle Felder ausfüllen.');
            return;
        }

        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/staff`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Mitarbeiter erfolgreich erstellt!');
                navigate('/admin/users');
            } else {
                setError(data.message || 'Fehler beim Erstellen.');
            }
        } catch (err) {
            setError('Netzwerkfehler beim Erstellen.');
            console.error(err);
        }
    };

    return (
        <div className="content-container">
            <h2>Mitarbeiter erstellen</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="staff-form">
                <div className="form-group">
                    <label>Benutzername:</label>
                    <input value={username} onChange={(e) => setUsername(e.target.value)} required/>
                </div>
                <div className="form-group">
                    <label>E-Mail:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                <div className="form-group">
                    <label>Passwort:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                <button type="submit">Erstellen</button>
            </form>
        </div>
    );
}

export default CreateStaffPage;
