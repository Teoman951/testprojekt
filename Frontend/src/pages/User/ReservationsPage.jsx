import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Definiere die Basis-URL hier
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
                // HIER DIE KORREKTUR: Verwende API_BASE_URL im fetch-Aufruf
                const response = await fetch(`${API_BASE_URL}/api/reservations`, {
                    headers: {
                        // JWT Token im Authorization-Header senden (angepasst auf 'x-auth-token')
                        'x-auth-token': token
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setReservations(data);
                } else {
                    setError(data.message || 'Reservierungen konnten nicht geladen werden.');
                    if (response.status === 401) {
                        localStorage.removeItem('authToken'); // Token entfernen, wenn nicht autorisiert
                        navigate('/login');
                    }
                }
            } catch (err) {
                setError('Netzwerkfehler beim Laden der Reservierungen. Server nicht erreichbar?');
                console.error('Reservations fetch error:', err);
            }
        };
        fetchReservations();
        // Leere Abhängigkeiten-Array, um sicherzustellen, dass useEffect nur einmal beim Mounten ausgeführt wird.
        // navigate ist eine stabile Funktion, die sich nicht ändert, daher kann sie ignoriert werden oder in den Deps.
    }, [navigate]); // navigate hinzugefügt, um Linter-Warnungen zu vermeiden, obwohl es sich nicht ändert

    const handleDelete = async (id) => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
            return;
        }
        // WICHTIG: Ersetze window.confirm durch ein benutzerdefiniertes Modal in einer echten Anwendung
        if (window.confirm('Möchten Sie diese Reservierung wirklich löschen?')) {
            try {
                // HIER DIE KORREKTUR: Verwende API_BASE_URL im fetch-Aufruf
                const response = await fetch(`${API_BASE_URL}/api/reservations/${id}`, {
                    method: 'DELETE',
                    headers: {
                        // JWT Token im Authorization-Header senden (angepasst auf 'x-auth-token')
                        'x-auth-token': token
                    }
                });
                if (response.ok) {
                    alert('Reservierung erfolgreich gelöscht!'); // Temporäre Erfolgsmeldung
                    // Reservierung aus dem State entfernen, um die UI zu aktualisieren
                    setReservations(reservations.filter(res => res.id !== id)); // ID von _id auf id geändert, da Sequelize 'id' nutzt
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
                        <li key={res.id}> {/* ID von _id auf id geändert */}
                            Auto: {res.car ? res.car.brand + ' ' + res.car.model + ' (' + res.car.licensePlate + ')' : 'N/A'} | {/* Anzeige von Auto-Details mit Null-Check */}
                            Von: {new Date(res.startTime).toLocaleString()} |
                            Bis: {new Date(res.endTime).toLocaleString()} |
                            Status: {res.status} |
                            Kosten: {res.totalCost ? `${res.totalCost.toFixed(2)} €` : 'N/A'}
                            <button onClick={() => handleDelete(res.id)} style={{ marginLeft: '10px' }}>Löschen</button> {/* ID von _id auf id geändert */}
                        </li>
                    ))}
                </ul>
            )}
            <Link to="/new-reservation" style={{ display: 'block', marginTop: '20px' }}>Neue Reservierung hinzufügen</Link>
        </div>
    );
}

export default ReservationsPage;
