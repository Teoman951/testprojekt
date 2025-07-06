import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3001';

function StaffRatesPage() {
    const [rates, setRates] = useState([]);
    const [form, setForm] = useState({ name: '', price: '', duration: '' });
    const [error, setError] = useState('');

    const token = localStorage.getItem('authToken');

    const fetchRates = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/rates`, {
                headers: { 'x-auth-token': token },
            });
            if (res.ok) {
                const data = await res.json();
                setRates(data);
            } else {
                setError('Fehler beim Laden der Tarife');
            }
        } catch {
            setError('Netzwerkfehler');
        }
    };

    useEffect(() => {
        fetchRates();
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const addRate = async () => {
        setError('');
        try {
            const res = await fetch(`${API_BASE_URL}/api/staff/rates`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setForm({ name: '', price: '', duration: '' });
                fetchRates();
            } else {
                const data = await res.json();
                setError(data.message || 'Fehler beim Hinzufügen');
            }
        } catch {
            setError('Netzwerkfehler');
        }
    };

    const deleteRate = async (id) => {
        if (!window.confirm('Tarif löschen?')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/staff/rates/${id}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token },
            });
            if (res.ok) {
                setRates((r) => r.filter((rate) => rate._id !== id));
            } else {
                alert('Fehler beim Löschen');
            }
        } catch {
            alert('Netzwerkfehler');
        }
    };

    return (
        <div className="content-container">
            <h2>Tarife verwalten</h2>
            {error && <p className="error-message">{error}</p>}
            <div>
                <input
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
                <input
                    name="price"
                    type="number"
                    placeholder="Preis"
                    value={form.price}
                    onChange={handleChange}
                    required
                />
                <input
                    name="duration"
                    placeholder="Dauer (z.B. 1 Stunde)"
                    value={form.duration}
                    onChange={handleChange}
                    required
                />
                <button onClick={addRate}>Tarif hinzufügen</button>
            </div>
            <ul>
                {rates.map((rate) => (
                    <li key={rate._id}>
                        {rate.name} - {rate.price}€ - {rate.duration}{' '}
                        <button onClick={() => deleteRate(rate._id)}>Löschen</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default StaffRatesPage;
