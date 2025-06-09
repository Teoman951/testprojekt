import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Definiere die Basis-URL hier, am besten außerhalb der Komponente oder in einer Konfigurationsdatei
const API_BASE_URL = 'http://localhost:3001'; // Dein Backend-Server-Port
function ReservationsPage() {
    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReservations = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                const response = await fetch('/api/reservations', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setReservations(data);
                } else {
                    setError(data.message || 'Reservierungen konnten nicht geladen werden.');
                    if (response.status === 401) {
                        localStorage.removeItem('authToken');
                        navigate('/login');
                    }
                }
            } catch (err) {
                setError('Netzwerkfehler beim Laden der Reservierungen. Server nicht erreichbar?');
                console.error('Reservations fetch error:', err);
            }
        };
        fetchReservations();
    }, [navigate]);

    const handleDelete = async (id) => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
            return;
        }
        if (window.confirm('Möchten Sie diese Reservierung wirklich löschen?')) {
            try {
                const response = await fetch(`/api/reservations/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    alert('Reservierung erfolgreich gelöscht!');
                    setReservations(reservations.filter(res => res._id !== id));
                } else {
                    const data = await response.json();
                    setError(data.message || 'Löschen fehlgeschlagen.');
                }
            } catch (err) {
                setError('Netzwerkfehler beim Löschen der Reservierung.');
                console.error('Delete reservation error:', err);
            }
        }
    };

    return (
        <div className="content-container">
            <h2>Meine Reservierungen</h2>
            {error && <p className="error-message">{error}</p>}
            {reservations.length === 0 ? (
                <p>Noch keine Reservierungen vorhanden. <Link to="/new-reservation">Jetzt eine buchen!</Link></p>
            ) : (
                <ul>
                    {reservations.map((res) => (
                        <li key={res._id}>
                            Auto: {res.car} | Von: {new Date(res.startTime).toLocaleString()} | Bis: {new Date(res.endTime).toLocaleString()} | Status: {res.status}
                            <button onClick={() => handleDelete(res._id)} style={{ marginLeft: '10px' }}>Löschen</button>
                        </li>
                    ))}
                </ul>
            )}
            <Link to="/new-reservation" style={{ display: 'block', marginTop: '20px' }}>Neue Reservierung hinzufügen</Link>
        </div>
    );
}

export default ReservationsPage;