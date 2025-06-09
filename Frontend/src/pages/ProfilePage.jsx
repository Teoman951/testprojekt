import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Definiere die Basis-URL hier, am besten außerhalb der Komponente oder in einer Konfigurationsdatei
const API_BASE_URL = 'http://localhost:3001'; // Dein Backend-Server-Port
function ProfilePage() {
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                const response = await fetch('/api/members/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();

                if (response.ok) {
                    setProfileData(data);
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
        fetchProfile();
    }, [navigate]);

    if (error) return <div className="content-container error-message"><h2>Fehler beim Laden des Profils:</h2><p>{error}</p></div>;
    if (!profileData) return <div className="content-container"><p>Profil wird geladen...</p></div>;

    return (
        <div className="content-container">
            <h2>Mein Profil</h2>
            <p>Name: {profileData.name}</p>
            <p>E-Mail: {profileData.email}</p>
            <p>Status: {profileData.membershipStatus}</p>
            <button onClick={() => alert('Profil bearbeiten Funktion implementieren!')}>Profil bearbeiten</button>
        </div>
    );
}

export default ProfilePage;