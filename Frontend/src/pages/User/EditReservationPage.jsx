import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../services/api';
import useAuth from '../../hooks/useAuth';

function EditReservationPage() {
    const { id: reservationId } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();

    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [dropOffLocation, setDropOffLocation] = useState('');
    const [originalReservation, setOriginalReservation] = useState(null);
    const [carDetails, setCarDetails] = useState(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(true);

    // Helper Funktion um Datum für datetime-local Input zu formatieren
    const formatDateTimeLocal = (isoDateString) => {
        if (!isoDateString) return '';
        const date = new Date(isoDateString);
        // Korrigiere für Zeitzonenoffset, um die lokale Zeit korrekt im Input anzuzeigen
        const offset = date.getTimezoneOffset() * 60000;
        const localDate = new Date(date.getTime() - offset);
        return localDate.toISOString().slice(0, 16);
    };

    useEffect(() => {
        const fetchReservationDetails = async () => {
            setLoading(true);
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                const response = await fetch(`${API_BASE_URL}/api/reservations/${reservationId}`, {
                    headers: { 'x-auth-token': token },
                });
                if (!response.ok) {
                    const errData = await response.json().catch(() => ({ message: 'Reservierungsdetails konnten nicht geladen werden.' }));
                    throw new Error(errData.message || 'Reservierungsdetails konnten nicht geladen werden.');
                }
                const data = await response.json();
                setOriginalReservation(data);
                setStartTime(formatDateTimeLocal(data.startTime));
                setEndTime(formatDateTimeLocal(data.endTime));
                setDropOffLocation(data.dropOffLocation || '');
                if (data.Car) { // Annahme: Car Details sind in der Reservierungsantwort enthalten
                    setCarDetails(data.Car);
                } else if (data.carId) { // Fallback: Car Details separat laden, falls nicht in Reservierung enthalten
                    const carResponse = await fetch(`${API_BASE_URL}/api/cars/${data.carId}`, {
                         headers: { 'x-auth-token': token },
                    });
                    if (carResponse.ok) {
                        setCarDetails(await carResponse.json());
                    }
                }
            } catch (err) {
                setError(err.message);
                console.error("Fetch reservation details error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReservationDetails();
    }, [reservationId, token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!startTime || !endTime) {
            setError('Start- und Endzeit sind Pflichtfelder.');
            return;
        }
        if (new Date(endTime) <= new Date(startTime)) {
            setError('Die Endzeit muss nach der Startzeit liegen.');
            return;
        }

        const updatedData = {
            startTime,
            endTime,
            // Sende dropOffLocation nur, wenn es geändert wurde oder explizit leer ist
            // (Backend sollte 'undefined' ignorieren und 'null' oder '' als Löschen interpretieren)
            dropOffLocation: dropOffLocation === originalReservation?.dropOffLocation ? undefined : (dropOffLocation || null),
        };

        // Entferne undefined Werte, damit nur geänderte Felder gesendet werden (optional, Backend sollte das handhaben)
        Object.keys(updatedData).forEach(key => updatedData[key] === undefined && delete updatedData[key]);


        try {
            const response = await fetch(`${API_BASE_URL}/api/reservations/${reservationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
                body: JSON.stringify(updatedData),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage(data.message || 'Reservierung erfolgreich aktualisiert!');
                setTimeout(() => navigate('/reservations'), 2000);
            } else {
                setError(data.message || 'Fehler beim Aktualisieren der Reservierung.');
            }
        } catch (err) {
            setError('Netzwerkfehler oder Server nicht erreichbar.');
            console.error("Reservation update error:", err);
        }
    };

    if (loading) {
        return <div className="content-container"><p>Reservierungsdetails werden geladen...</p></div>;
    }
    if (error && !originalReservation) { // Wenn initiales Laden fehlschlägt
         return <div className="content-container error-message"><h2>Fehler:</h2><p>{error}</p><button onClick={() => navigate('/reservations')}>Zurück zu meinen Reservierungen</button></div>;
    }
    if (!originalReservation) { // Sollte nicht passieren, wenn loading false und kein error
        return <div className="content-container"><p>Reservierung nicht gefunden.</p><button onClick={() => navigate('/reservations')}>Zurück zu meinen Reservierungen</button></div>;
    }


    return (
        <div className="content-container edit-reservation-page">
            <h2>Reservierung bearbeiten</h2>
            {carDetails && (
                <div style={{ marginBottom: '20px', padding:'10px', border:'1px solid #eee', borderRadius:'5px' }}>
                    <h3>Fahrzeug: {carDetails.brand} {carDetails.model}</h3>
                    <p>Kennzeichen: {carDetails.licensePlate}</p>
                </div>
            )}
            {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p className="success-message" style={{ color: 'green' }}>{successMessage}</p>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="startTime">Startzeit:</label>
                    <input
                        id="startTime"
                        type="datetime-local"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="endTime">Endzeit:</label>
                    <input
                        id="endTime"
                        type="datetime-local"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="dropOffLocation">Abgabepunkt (optional):</label>
                    <input
                        id="dropOffLocation"
                        type="text"
                        value={dropOffLocation}
                        onChange={(e) => setDropOffLocation(e.target.value)}
                        placeholder={originalReservation.Car?.location || "Wie Abholort"}
                    />
                </div>

                <button type="submit" className="button-primary" disabled={loading}>
                    Änderungen speichern
                </button>
                <button type="button" onClick={() => navigate('/reservations')} style={{marginLeft: '10px'}}>
                    Abbrechen
                </button>
            </form>
        </div>
    );
}

export default EditReservationPage;
