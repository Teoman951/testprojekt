import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css'; // Stellt sicher, dass diese Datei existiert oder entfernt den Import

// Imports der ausgelagerten Komponenten - KORRIGIERTE PFADE
import LoginPage from './pages/Auth/LoginPage'; // Hinzufügen von './'
import RegisterPage from './pages/Auth/RegisterPage'; // Hinzufügen von './'
import HomePage from './pages/HomePage'; // Hinzufügen von './'
import ProfilePage from './pages/ProfilePage'; // Hinzufügen von './'
import ReservationsPage from './pages/ReservationsPage'; // Hinzufügen von './'
import NewReservationPage from './pages/NewReservationPage'; // Hinzufügen von './'

// Import der PrivateRoute Komponente - KORRIGIERTER PFAD
import PrivateRoute from './components/PrivateRoute'; // Hinzufügen von './'

// Import des Auth Hooks - KORRIGIERTER PFAD
import useAuth from './hooks/useAuth'; // Hinzufügen von './'
// --- Hauptkomponente der React-Anwendung ---
function App() {
    const { token, login, logout } = useAuth(); // Nutzung des Custom Hooks

    const navigate = useNavigate();

    return (
        <div className="App">
            <nav className="navbar">
                <Link to="/" className="navbar-brand">DriveLink HSB</Link>
                <div className="navbar-links">
                    {token ? ( // Navigationslinks, wenn der Benutzer angemeldet ist
                        <>
                            <Link to="/home">Home</Link>
                            <Link to="/profile">Profil</Link>
                            <Link to="/reservations">Reservierungen</Link>
                            {/* Beim Logout rufen wir logout() vom Hook auf und leiten dann um */}
                            <button onClick={() => { logout(); navigate('/login'); }} className="nav-button">Logout</button>
                        </>
                    ) : ( // Navigationslinks, wenn der Benutzer NICHT angemeldet ist
                        <>
                            <Link to="/home">Home</Link>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Registrieren</Link>
                        </>
                    )}
                </div>
            </nav>

            <main>
                <Routes>
                    {/* Routen, die immer erreichbar sind */}
                    {/* onLoginSuccess wird nun vom useAuth-Hook bereitgestellt */}
                    <Route path="/login" element={<LoginPage onLoginSuccess={login} />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Geschützte Routen (nur zugänglich, wenn ein Token vorhanden ist) */}
                    <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
                    <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                    <Route path="/reservations" element={<PrivateRoute><ReservationsPage /></PrivateRoute>} />
                    <Route path="/new-reservation" element={<PrivateRoute><NewReservationPage /></PrivateRoute>} />

                    {/* Standard-Route für den Start oder unbekannte Pfade */}
                    {/* Leitet zur Startseite um, wenn eingeloggt, sonst zur Login-Seite */}
                    <Route path="/" element={token ? <HomePage /> : <LoginPage onLoginSuccess={login} />} />
                    <Route path="*" element={<h2 className="content-container">Seite nicht gefunden (404)</h2>} />
                </Routes>
            </main>
        </div>
    );
}

export default App;