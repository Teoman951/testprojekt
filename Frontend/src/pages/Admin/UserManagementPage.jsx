import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3001';

function UserManagementPage() {
    const [users, setUsers] = useState([]);
    const [rates, setRates] = useState([]); // NEU: State für alle verfügbaren Tarife (Rates)
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [editUserId, setEditUserId] = useState(null); // ID des Benutzers, der gerade bearbeitet wird
    const [editUsername, setEditUsername] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editRole, setEditRole] = useState('');
    const [editRateId, setEditRateId] = useState(''); // NEU: State für die bearbeitete Tarif-ID

    // States für Erstellungsformular (unverändert)
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newRole, setNewRole] = useState('user');

    const navigate = useNavigate();

    // Funktion zum Abrufen aller Benutzer (inkl. zugewiesener Tarif)
    const fetchUsers = async () => {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/users`, {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();

            if (response.ok) {
                setUsers(data);
            } else {
                setError(data.message || 'Benutzer konnten nicht geladen werden.');
                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('authToken');
                    navigate('/login');
                }
            }
        } catch (err) {
            setError('Netzwerkfehler beim Laden der Benutzer.');
            console.error('Users fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    // NEU: Funktion zum Abrufen aller Tarife (Rates)
    const fetchRates = async () => {
        setError(''); // Setze Fehler zurück
        const token = localStorage.getItem('authToken'); // Benötigt Token, da Routen aktuell nicht öffentlich sind
        if (!token) {
            // Optional: Handle, if rates should be visible to non-logged-in users (FA-9)
            // For now, we assume admin is logged in to fetch rates.
            console.warn('No token found when fetching rates. Rates might not load for non-authenticated users.');
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}/api/rates`, {
                headers: {
                    'x-auth-token': token, // Benötigt Token, da /api/rates standardmäßig geschützt sein könnte
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (response.ok) {
                setRates(data);
            } else {
                setError(data.message || 'Tarife konnten nicht geladen werden.');
                // console.error('Rates fetch error:', data.message);
            }
        } catch (err) {
            setError('Netzwerkfehler beim Laden der Tarife.');
            console.error('Rates fetch error:', err);
        }
    };

    // useEffect zum Initialladen von Benutzern und Tarifen
    useEffect(() => {
        fetchUsers();
        fetchRates(); // Rufe Tarife beim Laden der Komponente ab
    }, [navigate]);

    const handleDelete = async (id) => {
        if (!window.confirm('Möchten Sie diesen Benutzer wirklich löschen?')) {
            return;
        }
        setError('');
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'x-auth-token': token
                }
            });

            if (response.ok) {
                alert('Benutzer erfolgreich gelöscht!');
                fetchUsers(); // Liste neu laden
            } else {
                const data = await response.json();
                setError(data.message || 'Löschen fehlgeschlagen.');
            }
        } catch (err) {
            setError('Netzwerkfehler beim Löschen des Benutzers.');
            console.error('Delete user error:', err);
        }
    };

    const handleEditClick = (user) => {
        setEditUserId(user.id);
        setEditUsername(user.username);
        setEditEmail(user.email);
        setEditRole(user.role);
        // NEU: Setze editRateId basierend auf dem zugewiesenen Tarif des Benutzers
        // Wenn user.AssignedRate existiert, nimm dessen ID, sonst null oder leeren String
        setEditRateId(user.AssignedRate ? user.AssignedRate.id.toString() : '');
    };

    const handleCancelEdit = () => {
        setEditUserId(null);
        setEditUsername('');
        setEditEmail('');
        setEditRole('');
        setEditRateId(''); // Zurücksetzen der bearbeiteten Rate-ID
        setError('');
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/users/${editUserId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                // NEU: rateId an das Backend senden
                body: JSON.stringify({
                    username: editUsername,
                    email: editEmail,
                    role: editRole,
                    rateId: editRateId === '' ? null : parseInt(editRateId) // Sende null, wenn kein Tarif ausgewählt ist
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Benutzer erfolgreich aktualisiert!');
                handleCancelEdit();
                fetchUsers(); // Liste neu laden
            } else {
                setError(data.message || 'Aktualisierung fehlgeschlagen.');
            }
        } catch (err) {
            setError('Netzwerkfehler beim Aktualisieren des Benutzers.');
            console.error('Update user error:', err);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setError('');
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
            return;
        }

        if (!newUsername || !newEmail || !newPassword) {
            setError('Bitte alle Felder für den neuen Benutzer ausfüllen.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: newUsername,
                    email: newEmail,
                    password: newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Neuer Benutzer erfolgreich erstellt (Rolle ist vorerst "user")!');
                setNewUsername('');
                setNewEmail('');
                setNewPassword('');
                setNewRole('user');
                fetchUsers(); // Liste neu laden
            } else {
                setError(data.message || 'Erstellung des Benutzers fehlgeschlagen.');
            }
        } catch (err) {
            setError('Netzwerkfehler beim Erstellen des Benutzers.');
            console.error('Create user error:', err);
        }
    };


    if (loading) return <div className="content-container"><p>Benutzer werden geladen...</p></div>;
    if (error && !editUserId) return <div className="content-container error-message"><h2>Fehler:</h2><p>{error}</p></div>;

    return (
        <div className="content-container">
            <h2>Benutzerverwaltung</h2>
            {error && <p className="error-message">{error}</p>}

            {/* Formular zum Erstellen eines neuen Benutzers */}
            <h3>Neuen Benutzer erstellen</h3>
            <form onSubmit={handleCreateUser} style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
                <div className="form-group">
                    <label htmlFor="newUsername">Benutzername:</label>
                    <input type="text" id="newUsername" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="newEmail">E-Mail:</label>
                    <input type="email" id="newEmail" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="newPassword">Passwort:</label>
                    <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="newRole">Rolle:</label>
                    <select id="newRole" value={newRole} onChange={(e) => setNewRole(e.target.value)} disabled>
                        <option value="user">user</option>
                        {/* Admin-Rolle kann hier nicht direkt gesetzt werden, da die /register-Route dies ignoriert */}
                    </select>
                    <p style={{fontSize: '0.8em', color: '#666'}}>Hinweis: Rolle wird standardmäßig auf "user" gesetzt und kann nachträglich bearbeitet werden.</p>
                </div>
                <button type="submit" style={{ backgroundColor: '#28a745', color: 'white', padding: '10px 15px', borderRadius: '5px', border: 'none' }}>Benutzer erstellen</button>
            </form>

            <h3>Alle Benutzer</h3>
            {users.length === 0 ? (
                <p>Keine Benutzer gefunden.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th style={tableHeaderStyle}>ID</th>
                        <th style={tableHeaderStyle}>Benutzername</th>
                        <th style={tableHeaderStyle}>E-Mail</th>
                        <th style={tableHeaderStyle}>Rolle</th>
                        <th style={tableHeaderStyle}>Tarif</th> {/* NEU: Spalte für Tarif */}
                        <th style={tableHeaderStyle}>Aktionen</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.id} style={{ borderBottom: '1px solid #ddd' }}>
                            {editUserId === user.id ? (
                                // Bearbeitungsmodus
                                <td colSpan="6"> {/* colSpan um 1 erhöht */}
                                    <form onSubmit={handleUpdate} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', padding: '10px 0' }}>
                                        {/* ID ist nicht bearbeitbar, aber hilfreich für Kontext */}
                                        <span style={{...inputStyle, border: 'none'}}>{user.id}</span>
                                        <input type="text" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} required style={inputStyle} placeholder="Benutzername" />
                                        <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} required style={inputStyle} placeholder="E-Mail" />
                                        <select value={editRole} onChange={(e) => setEditRole(e.target.value)} style={selectStyle}>
                                            <option value="user">user</option>
                                            <option value="admin">admin</option>
                                        </select>
                                        {/* NEU: Dropdown für Tarife */}
                                        <select value={editRateId} onChange={(e) => setEditRateId(e.target.value)} style={selectStyle}>
                                            <option value="">Kein Tarif zugewiesen</option> {/* Option für keinen Tarif */}
                                            {rates.map(rate => (
                                                <option key={rate.id} value={rate.id}>{rate.name} ({rate.pricePerHour}€/Std)</option>
                                            ))}
                                        </select>
                                        <button type="submit" style={{ backgroundColor: '#007bff', color: 'white', padding: '8px 12px', borderRadius: '5px', border: 'none' }}>Speichern</button>
                                        <button type="button" onClick={handleCancelEdit} style={{ backgroundColor: '#6c757d', color: 'white', padding: '8px 12px', borderRadius: '5px', border: 'none' }}>Abbrechen</button>
                                    </form>
                                </td>
                            ) : (
                                // Anzeigemodus
                                <>
                                    <td style={tableCellStyle}>{user.id}</td>
                                    <td style={tableCellStyle}>{user.username}</td>
                                    <td style={tableCellStyle}>{user.email}</td>
                                    <td style={tableCellStyle}>{user.role}</td>
                                    <td style={tableCellStyle}>{user.AssignedRate ? user.AssignedRate.name : 'Kein Tarif'}</td> {/* NEU: Anzeige des Tarifnamens */}
                                    <td style={tableCellStyle}>
                                        <button onClick={() => handleEditClick(user)} style={{ backgroundColor: '#ffc107', color: 'black', padding: '5px 10px', borderRadius: '5px', border: 'none', marginRight: '5px' }}>Bearbeiten</button>
                                        <button onClick={() => handleDelete(user.id)} style={{ backgroundColor: '#dc3545', color: 'white', padding: '5px 10px', borderRadius: '5px', border: 'none' }}>Löschen</button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

// Inline-Styles für die Tabelle (könnten auch in CSS-Datei ausgelagert werden)
const tableHeaderStyle = {
    padding: '12px 8px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
};

const tableCellStyle = {
    padding: '8px',
    borderBottom: '1px solid #ddd',
    verticalAlign: 'top',
};

const inputStyle = {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    flex: '1',
    minWidth: '100px', // Damit Felder nicht zu klein werden
};

const selectStyle = { // NEU: Style für Select-Element
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    flex: '0.5',
};

export default UserManagementPage;
