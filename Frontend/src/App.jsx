import React from "react";
import { Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom';
import "./App.css"; // Stellt sicher, dass diese Datei existiert oder entfernt den Import

// Imports der ausgelagerten Komponenten - KORRIGIERTE PFADE
import LoginPage from "./pages/Auth/LoginPage"; // Hinzufügen von './'
import RegisterWizard from './pages/Auth/Register/RegisterWizard.jsx'; // Hinzufügen von './'
import HomePage from "./pages/User/HomePage.jsx"; // Hinzufügen von './'
import ProfilePage from "./pages/User/ProfilePage.jsx"; // Hinzufügen von './'
import ReservationsPage from "./pages/User/ReservationsPage.jsx"; // Hinzufügen von './'
import NewReservationPage from "./pages/User/NewReservationPage.jsx"; // Hinzufügen von './'
import AboutUsPage from "./pages/User/AboutUsPage.jsx"; // Hinzufügen von './'
import RatesPage from "./pages/User/RatesPage.jsx"; // Hinzufügen von './'

// Import der PrivateRoute Komponente - KORRIGIERTER PFAD
import PrivateRoute from "./components/PrivateRoute"; // Hinzufügen von './'

// Import des Auth Hooks - KORRIGIERTER PFAD
import useAuth from "./hooks/useAuth";
import AboutUs from "./pages/User/AboutUsPage.jsx"; // Hinzufügen von './'
// --- Hauptkomponente der React-Anwendung ---
function App() {
  const { token, login, logout } = useAuth(); // Nutzung des Custom Hooks

  const navigate = useNavigate();

  return (
    <div className="App">
      <nav className="navbar">
        <NavLink to="/" className="navbar-brand">
          <img
            src="/Logo Carsharing.jpg"
            alt="MoveSmart Logo"
            className="logo-img"
          />
          <span className="logo-text">MoveSmart</span>
        </NavLink>
        <div className="navbar-links">
          {token ? ( // Navigationslinks, wenn der Benutzer angemeldet ist
            <>
              <NavLink to="/home">Home</NavLink>
              <NavLink to="/profile">Profil</NavLink>
              <NavLink to="/reservations">Reservierungen</NavLink>
              <NavLink to="/aboutus">Über Uns</NavLink>
                <NavLink to="/rates">Tarife</NavLink>
              {/* Beim Logout rufen wir logout() vom Hook auf und leiten dann um */}
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="nav-button"
              >
                Logout
              </button>
            </>
          ) : (
            // Navigationslinks, wenn der Benutzer NICHT angemeldet ist
            <>
              <NavLink to="/home">Home</NavLink>
              <NavLink to="/aboutus">Über Uns</NavLink>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Registrieren</NavLink>
            </>
          )}
        </div>
      </nav>

      <main>
        <Routes>
          {/* Routen, die immer erreichbar sind */}
          {/* onLoginSuccess wird nun vom useAuth-Hook bereitgestellt */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/aboutus" element={<AboutUsPage />} />

          <Route path="/login" element={<LoginPage onLoginSuccess={login} />} />
           {/*  Wizard-Hauptroute  */}
          <Route path="/register/*" element={<RegisterWizard />} />
  
          {/* Geschützte Routen (nur zugänglich, wenn ein Token vorhanden ist) */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/reservations"
            element={
              <PrivateRoute>
                <ReservationsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/new-reservation/:id" // :id als URL-Param
            element={
              <PrivateRoute>
                <NewReservationPage />
              </PrivateRoute>
            }
          />
            <Route path="/rates" element={<RatesPage />} />
          {/* Standard-Route für den Start oder unbekannte Pfade */}
          {/* Leitet zur Startseite um, wenn eingeloggt, sonst zur Login-Seite */}
          <Route path="/" element={<HomePage />} />
          <Route
            path="*"
            element={
              <h2 className="content-container">Seite nicht gefunden (404)</h2>
            }
          />
          {/* 404-Fallback */}
          <Route path="*" element={<p>404 – Seite nicht gefunden</p>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
