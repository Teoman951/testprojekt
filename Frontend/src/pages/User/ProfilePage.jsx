import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Definiere die Basis-URL hier
const API_BASE_URL = 'http://localhost:3001'; // Dein Backend-Server-Port

function ProfilePage() {
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState('');
    const [editMode, setEditMode] = useState(false); // Neuer State für den Bearbeitungsmodus
    // States für die bearbeitbaren Felder
    const [editUsername, setEditUsername] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const navigate = useNavigate();

    // Funktion zum Abrufen des Profils
    const fetchProfile = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}/api/users/me`, {
                headers: {
                    'x-auth-token': token // JWT Token im 'x-auth-token' Header senden
                }
            });
            const data = await response.json();

            if (response.ok) {
                setProfileData(data);
                // Initialisiere die Bearbeitungsfelder mit den aktuellen Profildaten
                setEditUsername(data.username);
                setEditEmail(data.email);
            } else {
                setError(data.message || 'Profil konnte nicht geladen werden.');
                if (response.status === 401) { // Token abgelaufen oder ungültig
                    localStorage.removeItem('authToken');
                    navigate('/login');
                }
            }
        } catch (err) {
            setError('Netzwerkfehler beim Laden des Profils. Server nicht erreichbar?');
            console.error('Profile fetch error:', err);
        }
    };

    // useEffect, um das Profil beim Laden der Seite abzurufen
    useEffect(() => {
        fetchProfile();
    }, [navigate]); // navigate hinzugefügt, um Linter-Warnungen zu vermeiden

    // Funktion zum Speichern der Profiländerungen
    const handleUpdateProfile = async (e) => {
        e.preventDefault(); // Verhindert das Neuladen der Seite
        setError('');

        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
            return;
        }

        // Grundlegende Validierung
        if (!editUsername || !editEmail) {
            setError('Benutzername und E-Mail dürfen nicht leer sein.');
            return;
        }
        // Optional: E-Mail-Format validieren (sehr einfach)
        if (!editEmail.includes('@') || !editEmail.includes('.')) {
            setError('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
            return;
        }

        try {
            // Sende die PUT-Anfrage an das Backend mit der Benutzer-ID aus profileData
            // Die ID wird vom Backend im req.params.id erwartet.
            const response = await fetch(`${API_BASE_URL}/api/users/${profileData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ username: editUsername, email: editEmail }), // Sende die aktualisierten Daten
            });

            const data = await response.json();

            if (response.ok) {
                alert('Profil erfolgreich aktualisiert!');
                setProfileData(data.user); // Backend gibt aktualisierten Benutzer zurück
                setEditMode(false); // Bearbeitungsmodus verlassen
                // Aktuelles Profil neu laden, um sicherzustellen, dass die UI synchron ist
                fetchProfile();
            } else {
                setError(data.message || 'Profilaktualisierung fehlgeschlagen.');
            }
        } catch (err) {
            setError('Netzwerkfehler beim Aktualisieren des Profils. Server nicht erreichbar?');
            console.error('Profile update error:', err);
        }
    };

    if (error && !editMode) return <div className="content-container error-message"><h2>Fehler beim Laden des Profils:</h2><p>{error}</p></div>;
    if (!profileData) return <div className="content-container"><p>Profil wird geladen...</p></div>;

    return (
        <div className="content-container">
            <h2>Mein Profil</h2>
            {error && editMode && <p className="error-message">{error}</p>} {/* Fehlermeldung im Bearbeitungsmodus */}

            {!editMode ? (
                // Anzeigemodus
                <>
                    <p>Benutzername: {profileData.username}</p>
                    <p>E-Mail: {profileData.email}</p>
                    <p>Rolle: {profileData.role}</p>
                    <button onClick={() => setEditMode(true)}>Profil bearbeiten</button>
                </>
            ) : (
                // Bearbeitungsmodus
                <form onSubmit={handleUpdateProfile}>
                    <div className="form-group">
                        <label htmlFor="editUsername">Benutzername:</label>
                        <input
                            type="text"
                            id="editUsername"
                            value={editUsername}
                            onChange={(e) => setEditUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="editEmail">E-Mail:</label>
                        <input
                            type="email"
                            id="editEmail"
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Speichern</button>
                    <button type="button" onClick={() => {
                        setEditMode(false);
                        setError(''); // Fehler zurücksetzen beim Abbruch
                        // Felder zurücksetzen, falls Änderungen nicht gespeichert wurden
                        setEditUsername(profileData.username);
                        setEditEmail(profileData.email);
                    }} style={{ marginLeft: '10px' }}>Abbrechen</button>
                </form>
            )}
        </div>
    );
}

export default ProfilePage;
