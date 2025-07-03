import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3001';

function StaffReservationsPage() {
    const [reservations, setReservations] = useState([]);
    const [userId, setUserId] = useState('');
    const [error, setError] = useState('');

    const token = localStorage.getItem('authToken');

    const fetchReservations = async () => {
        if (!userId) return setError('Bitte Benutzer-ID eingeben');
        setError('');
        try {
            const res = await fetch(`${API_BASE_URL}/api/staff/reservations/user/${userId}`, {
                headers: { 'x-auth-token': token },
            });
            if (res.ok) {
                const data = await res.json();
                setReservations(data);
            } else {
                setError('Fehler beim Laden der Reservierungen');
            }
        } catch {
            setError('Netzwerkfehler');
        }
    };

    const cancelReservation = async (id) => {
        if (!window.confirm('Reservierung wirklich stornieren?')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/staff/reservations/${id}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token },
            });
            if (res.ok) {
                setReservations((r) => r.filter((resv) => resv._id !== id));
            } else {
                alert('Fehler beim Stornieren');
            }
        } catch {
            alert('Netzwerkfehler');
        }
    };

    return (
        <div className="content-container">
            <h2>Reservierungen verwalten</h2>
            <input
                placeholder="Benutzer-ID eingeben"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
            />
            <button onClick={fetchReservations}>Reservierungen laden</button>
            {error && <p className="error-message">{error}</p>}
            <ul>
                {reservations.map((r) => (
                    <li key={r._id}>
                        Fahrzeug: {r.car} | Von: {new Date(r.startDate).toLocaleDateString()} | Bis: {new Date(r.endDate).toLocaleDateString()}
                        <button onClick={() => cancelReservation(r._id)}>Stornieren</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default StaffReservationsPage;
