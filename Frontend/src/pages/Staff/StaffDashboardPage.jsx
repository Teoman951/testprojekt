import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

function StaffDashboardPage() {
    const navigate = useNavigate();
    const { userRole } = useAuth();

    return (
        <div className="content-container">
            <h2>Willkommen im Mitarbeiter-Dashboard</h2>
            <p>Rolle: <strong>{userRole}</strong></p>

                <div className="dashboard-buttons">
                    <button onClick={() => navigate('/staff/reservations')}>
                        Reservierungen verwalten
                    </button>

                    <button onClick={() => navigate('/home')} className="secondary">
                        Zurück zur Startseite
                    </button>
                </div>

            </div>
            );
            }

            const buttonStyle = {
            padding: '10px 15px',
            marginRight: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
        };

            export default StaffDashboardPage;
