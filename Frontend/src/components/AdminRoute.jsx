// frontend/src/components/AdminRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; // Pfad zum useAuth-Hook anpassen

// Die AdminRoute-Komponente prüft die Berechtigung für Admin-Seiten.
function AdminRoute() {
    // Ruft den Token, die Benutzerrolle und den Ladezustand vom useAuth-Hook ab.
    const { token, userRole, loading } = useAuth();


    // Zeigt einen Ladezustand an, während der Authentifizierungsstatus geprüft wird.
    if (loading) {
        return <div className="content-container"><p>Lade Berechtigungen...</p></div>;
    }

    // Prüft zuerst, ob der Benutzer überhaupt eingeloggt ist (Token vorhanden).
    if (!token) {
        // Wenn kein Token vorhanden ist, wird zur Login-Seite umgeleitet.
        // `replace` stellt sicher, dass der Benutzer nicht zurück zur Admin-Seite navigieren kann.
        return <Navigate to="/login" replace />;
    }

    // Prüft dann, ob der eingeloggte Benutzer die 'admin'-Rolle hat.
    if (userRole !== 'admin') {
        // Wenn der Benutzer eingeloggt ist, aber keine Admin-Rolle hat,
        // wird er zur Startseite umgeleitet (oder einer "nicht autorisiert"-Seite, falls vorhanden).
        return <Navigate to="/" replace />;
    }

    // Wenn der Token vorhanden ist UND die Rolle 'admin' ist,
    // wird die Kind-Komponente (die eigentliche Admin-Seite) gerendert.
    return <Outlet />;
}

export default AdminRoute;
