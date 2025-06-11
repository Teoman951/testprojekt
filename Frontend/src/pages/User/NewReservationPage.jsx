import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const API_BASE_URL = 'http://localhost:3001';

function NewReservationPage() {
  // 1) ID aus der URL holen
  const { id: carId } = useParams();

  // 2) Auth-Hook: Token aus dem LocalStorage
  const { token } = useAuth();
  const navigate = useNavigate();

  // 3) Formulardaten
  const [startTime, setStartTime] = useState('');
  const [endTime,   setEndTime]   = useState('');
  const [error,     setError]     = useState('');

  /* Redirect, falls kein Token vorhanden               */
  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  if (!token) return null; // während Redirect nichts rendern

  /* Submit-Handler                                     */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Einfache Validierung
    if (!startTime || !endTime) {
      setError('Bitte Start- und Endzeit ausfüllen.');
      return;
    }
    if (new Date(endTime) <= new Date(startTime)) {
      setError('Endzeit muss nach der Startzeit liegen.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ carId, startTime, endTime }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Reservierung erfolgreich!');      // nur Demo
        navigate('/reservations');               // zu deinen Reservierungen
      } else {
        setError(data.message || 'Reservierung fehlgeschlagen.');
      }
    } catch (err) {
      console.error('Reservation error:', err);
      setError('Netzwerkfehler: Server derzeit nicht erreichbar.');
    }
  };

  /* UI                                                 */
  return (
    <div className="content-container">
      <h2>Neue Reservierung</h2>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Auto-ID anzeigen (optional) */}
        <p><strong>Fahrzeug-ID:</strong> {carId}</p>

        <div className="form-group">
          <label htmlFor="start">Startzeit</label>
          <input
            type="datetime-local"
            id="start"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="end">Endzeit</label>
          <input
            type="datetime-local"
            id="end"
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
