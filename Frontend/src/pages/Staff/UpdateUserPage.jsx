import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3001';

function StaffUserPage() {
    const [users, setUsers] = useState([]);
    const [editUserId, setEditUserId] = useState(null);
    const [editUsername, setEditUsername] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editRole, setEditRole] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const fetchUsers = async () => {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/users`, {
                headers: { 'x-auth-token': token }
            });

            const data = await res.json();
            if (res.ok) {
                setUsers(data);
            } else {
                setError(data.message || 'Fehler beim Laden.');
            }
        } catch (err) {
            console.error('Fehler beim Laden:', err);
            setError('Netzwerkfehler beim Laden.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEditClick = (user) => {
        if (user.role === 'admin') {
            alert('Sie können Administratoren nicht bearbeiten.');
            return;
        }
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
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/users/${editUserId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
                body: JSON.stringify({
                    username: editUsername,
                    email: editEmail,
                    role: editRole,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                alert('Benutzer erfolgreich aktualisiert!');
                handleCancelEdit();
                fetchUsers();
            } else {
                setError(data.message || 'Fehler beim Aktualisieren.');
            }
        } catch (err) {
            console.error('Fehler beim Update:', err);
            setError('Netzwerkfehler beim Aktualisieren.');
        }
    };

    return (
        <div className="content-container">
            <h2>Benutzerübersicht</h2>
            {error && <p className="error-message">{error}</p>}

            {loading ? (
                <p>Lade Benutzer...</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th style={headerStyle}>ID</th>
                        <th style={headerStyle}>Benutzername</th>
                        <th style={headerStyle}>E-Mail</th>
                        <th style={headerStyle}>Rolle</th>
                        <th style={headerStyle}>Aktionen</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(user => (
                        <tr key={user.id} style={{ borderBottom: '1px solid #ddd' }}>
                            {editUserId === user.id ? (
                                <td colSpan="5">
                                    <form onSubmit={handleUpdate} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <input
                                            type="text"
                                            value={editUsername}
                                            onChange={(e) => setEditUsername(e.target.value)}
                                            required
                                            style={inputStyle}
                                        />
                                        <input
                                            type="email"
                                            value={editEmail}
                                            onChange={(e) => setEditEmail(e.target.value)}
                                            required
                                            style={inputStyle}
                                        />
                                        <select
                                            value={editRole}
                                            onChange={(e) => setEditRole(e.target.value)}
                                            style={selectStyle}
                                        >
                                            <option value="user">user</option>
                                            <option value="mitarbeiter">mitarbeiter</option>
                                        </select>
                                        <button type="submit" style={saveButtonStyle}>Speichern</button>
                                        <button type="button" onClick={handleCancelEdit} style={cancelButtonStyle}>Abbrechen</button>
                                    </form>
                                </td>
                            ) : (
                                <>
                                    <td style={cellStyle}>{user.id}</td>
                                    <td style={cellStyle}>{user.username}</td>
                                    <td style={cellStyle}>{user.email}</td>
                                    <td style={cellStyle}>{user.role}</td>
                                    <td style={cellStyle}>
                                        <button
                                            onClick={() => handleEditClick(user)}
                                            disabled={user.role === 'admin'}
                                            style={{
                                                ...editButtonStyle,
                                                cursor: user.role === 'admin' ? 'not-allowed' : 'pointer',
                                                opacity: user.role === 'admin' ? 0.5 : 1
                                            }}
                                        >
                                            Bearbeiten
                                        </button>
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

const headerStyle = {
    padding: '12px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
};

const cellStyle = {
    padding: '10px',
};

const inputStyle = {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
};

const selectStyle = {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
};

const saveButtonStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 12px',
};

const cancelButtonStyle = {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 12px',
};

const editButtonStyle = {
    backgroundColor: '#ffc107',
    border: 'none',
    color: 'black',
    padding: '6px 10px',
    borderRadius: '4px',
};

export default StaffUserPage;
