import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../services/api'; // Annahme, dass diese Datei existiert und die URL bereitstellt
import useAuth from '../../hooks/useAuth'; // Für den Token

function NewReservationPage() {
    const { id: carId } = useParams(); // carId aus URL Parametern
    const { token } = useAuth();
    const navigate = useNavigate();

    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [dropOffLocation, setDropOffLocation] = useState('');
    const [carDetails, setCarDetails] = useState(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loadingCar, setLoadingCar] = useState(true);

    useEffect(() => {
        const fetchCarDetails = async () => {
            setLoadingCar(true);
            try {
                const response = await fetch(`${API_BASE_URL}/api/cars/${carId}`, {
                    headers: token ? { 'x-auth-token': token } : {},
                });
                if (!response.ok) {
                    const errData = await response.json().catch(() => ({ message: 'Fahrzeugdetails konnten nicht geladen werden.' }));
                    throw new Error(errData.message || 'Fahrzeugdetails konnten nicht geladen werden.');
                }
                const data = await response.json();
                setCarDetails(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoadingCar(false);
            }
        };

        if (carId && token) {
            fetchCarDetails();
        } else if (!token) {
            navigate('/login');
        }
    }, [carId, token, navigate]);


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

        const reservationData = {
            carId: parseInt(carId),
            startTime,
            endTime,
            dropOffLocation: dropOffLocation || null, // Sende null, wenn leer, oder lasse es weg
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/reservations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
                body: JSON.stringify(reservationData),
            });

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (jsonError) {
                    setError(`Fehler beim Erstellen (Status: ${response.status}). Serverantwort nicht lesbar.`);
                    console.error('Server response not JSON for error:', response);
                    return;
                }
                setError(errorData.message || `Fehler beim Erstellen der Reservierung (Status: ${response.status}).`);
                return;
            }

            const data = await response.json(); // Sollte jetzt sicher sein, da response.ok
            setSuccessMessage(data.message || 'Reservierung erfolgreich erstellt!');
            setTimeout(() => navigate('/reservations'), 2000);

        } catch (err) {
            setError('Netzwerkfehler oder Server nicht erreichbar. Bitte Serververbindung prüfen.');
            console.error("Reservation creation error:", err);
        }
    };

    if (!token) {
        // Sollte durch useEffect bereits umgeleitet werden, aber als Fallback
        return <p>Bitte einloggen, um eine Reservierung zu erstellen.</p>;
    }

    if (loadingCar) {
        return <div className="content-container"><p>Fahrzeugdetails werden geladen...</p></div>;
    }

    if (error && !carDetails) { // Wenn Laden der Fahrzeugdetails fehlschlägt
        return <div className="content-container error-message"><h2>Fehler:</h2><p>{error}</p></div>;
    }


    return (
        <div className="content-container new-reservation-page">
            <h2>Neue Reservierung erstellen</h2>
            {carDetails && (
                <div style={{ marginBottom: '20px', padding:'10px', border:'1px solid #eee', borderRadius:'5px' }}>
                    <h3>Fahrzeug: {carDetails.brand} {carDetails.model}</h3>
                    <p>Kennzeichen: {carDetails.licensePlate}</p>
                    <p>Standort: {carDetails.location}</p>
                    <p>Preis pro Tag: {carDetails.dailyRate} €</p>
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
                    <label htmlFor="dropOffLocation">Abgabepunkt:</label>
                    <input
                        id="dropOffLocation"
                        type="text"
                        value={dropOffLocation}
                        onChange={(e) => setDropOffLocation(e.target.value)}
                        placeholder="z.B. Andere Adresse, Flughafen"
                    />
                </div>

                <button type="submit" className="button-primary" disabled={!carDetails || loadingCar}>
                    Reservierung bestätigen
                </button>
            </form>
        </div>
    );
}

export default NewReservationPage;
