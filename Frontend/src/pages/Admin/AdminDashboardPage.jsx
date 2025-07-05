import React from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
    return (
        <div className="content-container">
            <h2>Admin Dashboard</h2>
            <p>Willkommen im Administrationsbereich. Wählen Sie eine Option zur Verwaltung:</p>

            <ul style={{ listStyleType: 'none', padding: 0 }}>
                <li style={{ marginBottom: '10px' }}>
                    <Link to="/admin/users" style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>
                        Benutzer verwalten
                    </Link>
                </li>
                <li style={{ marginBottom: '10px' }}>
                    <Link to="/admin/cars" style={{ padding: '10px 15px', backgroundColor: '#28a745', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>
                        Fahrzeuge verwalten
                    </Link>
                </li>
                <li>
                    <Link to="/admin/reservations" style={{ padding: '10px 15px', backgroundColor: '#ffc107', color: 'black', borderRadius: '5px', textDecoration: 'none' }}>
                        Reservierungen verwalten
                    </Link>
                </li>
            </ul>
        </div>
    );
}

export default AdminDashboard;
