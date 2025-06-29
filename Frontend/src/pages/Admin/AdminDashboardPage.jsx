import React from 'react';
import { Link } from 'react-router-dom';
import "./AdminDashboardPage.css";

function AdminDashboard() {
    return (
        <div className="content-container admin-dashboard">
            <h2>Admin Dashboard</h2>
            <p>Willkommen im Administrationsbereich. Wählen Sie eine Option zur Verwaltung:</p>

            <ul className="dashboard-cards">
                <li className="dashboard-card">
                    <Link to="/admin/users" className="dashboard-link user-link">
                        Benutzer verwalten
                    </Link>
                </li>
                <li className="dashboard-card">
                    <Link to="/admin/cars" className="dashboard-link car-link">
                        Fahrzeuge verwalten
                    </Link>
                </li>
                <li className="dashboard-card">
                    <Link to="/admin/reservations" className="dashboard-link reservation-link">
                        Reservierungen verwalten
                    </Link>
                </li>
            </ul>
        </div>
    );
}

export default AdminDashboard;
