import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Definiere die Basis-URL hier
const API_BASE_URL = 'http://localhost:3001'; // Dein Backend-Server-Port

function NewReservationPage() {
    const [car, setCar] = useState(''); // Beachten: Dies sollte später carId sein, wenn Autos aus DB gewählt werden
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Frontend-Validierung
        if (!car || !startTime || !endTime) {
            setError('Bitte alle Felder ausfüllen.');
            return;
        }
        const start = new Date(startTime);
        const end = new Date(endTime);
        if (start >= end) {
            setError('Endzeit muss nach der Startzeit liegen.');
            return;
        }
        if (start < new Date()) {
            setError('Startzeit muss in der Zukunft liegen.');
            return;
        }

        // Token aus dem Local Storage abrufen
        const token = localStorage.getItem('authToken');
        if (!token) {
            // Wenn kein Token vorhanden ist, zur Login-Seite umleiten
            navigate('/login');
            return;
        }

        try {
            // HIER DIE KORREKTUR: Verwende API_BASE_URL im fetch-Aufruf
            const response = await fetch(`${API_BASE_URL}/api/reservations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // JWT Token im Authorization-Header senden (wie vom Backend erwartet)
                    'x-auth-token': token // Dein Backend erwartet 'x-auth-token'
                    // Falls dein Backend 'Authorization: Bearer <token>' erwarten würde:
                    // 'Authorization': `Bearer ${token}`
                },
                // Daten im JSON-Format senden
                body: JSON.stringify({ car, startTime, endTime }),
            });

            const data = await response.json(); // Versuche, die Antwort als JSON zu parsen

            if (response.ok) {
                // Erfolgreiche Reservierung
                alert('Reservierung erfolgreich erstellt!'); // Temporäre Erfolgsmeldung
                navigate('/reservations'); // Zurück zur Reservierungsübersicht navigieren
            } else {
                // Fehlgeschlagene Reservierung (z.B. Validierungsfehler vom Backend)
                setError(data.message || 'Reservierung konnte nicht erstellt werden. Unbekannter Fehler.');
            }
        } catch (err) {
            // Fehler bei der Netzwerkverbindung oder beim Parsen der Antwort
            setError('Netzwerkfehler beim Erstellen der Reservierung. Server nicht erreichbar oder unerwartete Antwort.');
            console.error('New reservation error:', err);
        }
    };

    return (
        <div className="content-container">
            <h2>Neue Reservierung</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="car">Gewähltes Auto (z.B. Audi A3):</label>
                    <input
                        type="text"
                        id="car"
                        value={car}
                        onChange={(e) => setCar(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="startTime">Startzeit:</label>
                    <input
                        type="datetime-local"
                        id="startTime"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="endTime">Endzeit:</label>
                    <input
                        type="datetime-local"
                        id="endTime"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Reservieren</button>
            </form>
        </div>
    );
}

export default NewReservationPage;
