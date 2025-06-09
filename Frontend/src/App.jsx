import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';


// Importe für die Authentifizierungsseiten (jetzt unter 'Auth')
import RegisterPage from './pages/Auth/RegisterPage';
import LoginPage from './pages/Auth/LoginPage';

// Importe für die normalen Benutzerseiten (jetzt unter 'User')
import HomePage from './pages/User/HomePage';
import ProfilePage from './pages/User/ProfilePage';
import ReservationsPage from './pages/User/ReservationsPage';
import NewReservationPage from './pages/User/NewReservationPage';
import AboutUsPage from './pages/User/AboutUs'; // Annahme, dass AboutUs auch eine Seite ist

// Importe für die Admin-Seiten (jetzt unter 'Admin')
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserManagementPage from './pages/Admin/UserManagementPage';
import CarManagementPage from './pages/Admin/CarManagementPage';
import ReservationManagementPage from './pages/Admin/ReservationManagementPage';

// Import der AdminRoute-Komponente zum Schutz von Admin-Routen
import AdminRoute from './components/AdminRoute';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State für den grundlegenden Login-Status

    // Überprüft beim Laden der App, ob ein Authentifizierungstoken vorhanden ist
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            // Hier könnte man auch den Token validieren (z.B. Ablaufdatum prüfen),
            // aber für den Anfang reicht die Anwesenheit des Tokens.
            setIsLoggedIn(true);
        }
    }, []);

    // Callback-Funktion für erfolgreichen Login
    const handleLoginSuccess = (token) => {
        localStorage.setItem('authToken', token); // Speichert den Token im Local Storage
        setIsLoggedIn(true); // Aktualisiert den Login-Status
    };

    // Callback-Funktion für Logout
    const handleLogout = () => {
        localStorage.removeItem('authToken'); // Entfernt den Token aus dem Local Storage
        setIsLoggedIn(false); // Aktualisiert den Login-Status
    };

    return (
        <Router>
            {/* Die Navbar wird immer angezeigt und erhält den Login-Status und die Logout-Funktion */}
            <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />

            {/* Definition der Routen */}
            <Routes>
                {/* Öffentliche Routen (für Gäste und eingeloggte Benutzer sichtbar) */}
                <Route path="/" element={<HomePage />} />
                <Route path="/about-us" element={<AboutUsPage />} /> {/* Beispiel für weitere öffentliche Seite */}
                <Route path="/register" element={<RegisterPage />} />
                {/* LoginPage erhält den onLoginSuccess-Callback */}
                <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />

                {/* Geschützte Routen für eingeloggte Benutzer */}
                {/* Wenn der Benutzer nicht eingeloggt ist (isLoggedIn = false), wird er zur Login-Seite umgeleitet. */}
                {/* Outlet rendert die Child-Route, wenn die Bedingung erfüllt ist. */}
                <Route element={isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />}>
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/reservations" element={<ReservationsPage />} />
                    <Route path="/new-reservation" element={<NewReservationPage />} />
                </Route>

                {/* Geschützte Routen für Admins */}
                {/* Die AdminRoute-Komponente prüft, ob der Benutzer eingeloggt ist UND die Rolle 'admin' hat. */}
                {/* Wenn die Bedingungen nicht erfüllt sind, leitet AdminRoute selbst um. */}
                <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<UserManagementPage />} />
                    <Route path="/admin/cars" element={<CarManagementPage />} />
                    <Route path="/admin/reservations" element={<ReservationManagementPage />} />
                </Route>

                {/* Fallback-Route für alle unbekannten Pfade */}
                {/* Leitet zur Startseite um, wenn keine passende Route gefunden wird. */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
