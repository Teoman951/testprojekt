import React from 'react';
import { Link } from 'react-router-dom';

function StaffDashboardPage() {
    return (
        <div className="content-container admin-dashboard">
            <h2>Mitarbeiter-Dashboard</h2>

            <ul className="dashboard-cards">
                <li className="dashboard-card">
                    <Link to="/staff/reservations" className="dashboard-link reservation-link">
                        Reservierungen verwalten
                    </Link>
                </li>

                <li className="dashboard-card">
                    <Link to="/staff/rates" className="dashboard-link rates-link">
                        Tarife auswählen
                    </Link>
                </li>

                <li className="dashboard-card">
                    <Link to="/staff/users" className="dashboard-link user-link">
                        Benutzer bearbeiten
                    </Link>
                </li>

                <li className="dashboard-card">
                    <Link to="/staff/cars" className="dashboard-link car-link">
                        Fahrzeuge bearbeiten
                    </Link>
                </li>
            </ul>
        </div>
    );
}

export default StaffDashboardPage;
