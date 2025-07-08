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

                if (!response.ok) {
                    let errorData;
                    try {
                        errorData = await response.json();
                    } catch (jsonError) {
                        setError(`Fehler beim Laden der Reservierungen (Status: ${response.status}). Serverantwort nicht lesbar.`);
                        console.error('Server error response not JSON:', response);
                        return;
                    }
                    setError(errorData.message || `Reservierungen konnten nicht geladen werden (Status: ${response.status}).`);
                    if (response.status === 401) {
                        localStorage.removeItem('authToken');
                        navigate('/login');
                    }
                    return;
                }

                const data = await response.json(); // Sicher, da response.ok
                setReservations(data);

            } catch (err) {
                setError('Netzwerkfehler beim Laden der Reservierungen. Server nicht erreichbar? Bitte Serververbindung prüfen.');
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
                            Kosten: {res.totalCost ? `${res.totalCost.toFixed(2)} €` : 'N/A'} |
                            Abgabeort: {res.dropOffLocation || (res.Car ? res.Car.location : 'Wie Abholort')} {/* Zeige dropOffLocation oder Standard */}
                            <div style={{ marginTop: '5px' }}>
                                <button
                                    onClick={() => navigate(`/edit-reservation/${res.id}`)}
                                    style={{ marginLeft: '0px', marginRight: '10px', backgroundColor: '#ffc107', color: 'black', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
                                >
                                    Bearbeiten
                                </button>
                                <button
                                    onClick={() => handleDelete(res.id)}
                                    style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
                                >
                                    Löschen
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {/* Der Link zu /new-reservation ist hier vielleicht nicht mehr ideal, da man von der HomePage startet.
                Könnte entfernt oder beibehalten werden, je nach gewünschtem User Flow. Ich lasse ihn vorerst. */}
            <Link to="/home" style={{ display: 'block', marginTop: '20px' }}>Zur Fahrzeugauswahl</Link>
        </div>
    );
}

export default ReservationsPage;
