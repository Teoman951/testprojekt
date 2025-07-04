import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3001';

function EditCarPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState({ model: '', licensePlate: '', status: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCar = async () => {
            const token = localStorage.getItem('authToken');
            const res = await fetch(`${API_BASE_URL}/api/staff/car/${id}`, {
                headers: { 'x-auth-token': token },
            });
            if (res.ok) {
                const data = await res.json();
                setCar(data);
            } else {
                setError('Fahrzeug nicht gefunden');
            }
        };
        fetchCar();
    }, [id]);

    const handleChange = (e) => setCar({ ...car, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const token = localStorage.getItem('authToken');
        try {
            const res = await fetch(`${API_BASE_URL}/api/staff/car/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify(car),
            });
            if (res.ok) {
                alert('Fahrzeug erfolgreich aktualisiert!');
                navigate('/admin/cars');
            } else {
                const data = await res.json();
                setError(data.message || 'Fehler beim Aktualisieren');
            }
        } catch {
            setError('Netzwerkfehler');
        }
    };

    return (
        <div className="content-container">
            <h2>Fahrzeug bearbeiten</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>Modell:</label>
                <input name="model" value={car.model} onChange={handleChange} required />
                <label>Kennzeichen:</label>
                <input name="licensePlate" value={car.licensePlate} onChange={handleChange} required />
                <label>Status:</label>
                <input name="status" value={car.status} onChange={handleChange} required />
                <button type="submit">Speichern</button>
            </form>
        </div>
    );
}

export default EditCarPage;
