import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./UserManagement.css";

const API_BASE_URL = 'http://localhost:3001';

function UserManagementPage() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [editUserId, setEditUserId] = useState(null); // ID des Benutzers, der gerade bearbeitet wird
    const [editUsername, setEditUsername] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editRole, setEditRole] = useState('');
    const navigate = useNavigate();

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

    useEffect(() => {
        fetchUsers();
    }, [navigate]);

    const handleDelete = async (id) => {
        const userToDelete = users.find(user => user.id === id);
        if (userToDelete?.role === 'admin') {
            alert('Administratoren können nicht gelöscht werden.');
            return;
        }

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
    };

    const handleCancelEdit = () => {
        setEditUserId(null);
        setEditUsername('');
        setEditEmail('');
        setEditRole('');
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
                body: JSON.stringify({ username: editUsername, email: editEmail, role: editRole }),
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

    // Rudimentäre "Benutzer erstellen" Funktionalität (könnte in eigene Komponente ausgelagert werden)
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newRole, setNewRole] = useState('user'); // Standardrolle 'user'

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
            // Achtung: Hier wird die 'register' Route verwendet, die die Rolle 'user' setzt.
            // Um die Rolle direkt zu setzen, bräuchtest du eine dedizierte Admin-Funktion im Backend
            // oder du passt den register-Controller an, um die Rolle aus dem Body zu akzeptieren,
            // wenn der Request von einem Admin kommt (was aktuell nicht der Fall ist).
            // Für Admin-Erstellung würde man eher einen 'POST /api/users' Endpunkt haben.
            // Die aktuelle register-Route im Backend (authController) setzt die Rolle immer auf 'user'.
            // Für den Test lassen wir es hier aber die Register-Route aufrufen,
            // und danach kann man die Rolle per Update ändern.
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: newUsername,
                    email: newEmail,
                    password: newPassword,
                    // role: newRole // 'register' route ignoriert dies
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

            {/* Zurück-Button zum Dashboard */}
            <button
                onClick={() => navigate('/admin')}
                style={{
                    marginBottom: '15px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                ← Zurück zum Dashboard
            </button>

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
                        <th style={tableHeaderStyle}>Aktionen</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.id} style={{ borderBottom: '1px solid #ddd' }}>
                            {editUserId === user.id ? (
                                // Bearbeitungsmodus
                                <td colSpan="5">
                                    <form onSubmit={handleUpdate} style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '10px 0' }}>
                                        <input type="text" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} required style={inputStyle} />
                                        <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} required style={inputStyle} />
                                        <select value={editRole} onChange={(e) => setEditRole(e.target.value)} style={selectStyle}>
                                            <option value="user">user</option>
                                            <option value="admin">admin</option>
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
};

const inputStyle = {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    flex: '1',
};

const selectStyle = {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    flex: '0.5',
};

export default UserManagementPage;
