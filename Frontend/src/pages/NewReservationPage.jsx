import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Definiere die Basis-URL hier, am besten außerhalb der Komponente oder in einer Konfigurationsdatei
const API_BASE_URL = 'http://localhost:3001'; // Dein Backend-Server-Port
function NewReservationPage() {
    const [car, setCar] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

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

        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch('/api/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ car, startTime, endTime }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Reservierung erfolgreich erstellt!');
                navigate('/reservations');
            } else {
                setError(data.message || 'Reservierung konnte nicht erstellt werden.');
            }
        } catch (err) {
            setError('Netzwerkfehler beim Erstellen der Reservierung. Server nicht erreichbar?');
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