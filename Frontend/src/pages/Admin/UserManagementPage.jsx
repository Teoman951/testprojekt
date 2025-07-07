import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import "./UserManagement.css";

const API_BASE_URL = 'http://localhost:3001';

function UserManagementPage() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [editUserId, setEditUserId] = useState(null);
    const [editUsername, setEditUsername] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editRole, setEditRole] = useState('');
    const [editLicenseNo, setEditLicenseNo] = useState('');
    const [editLicenseIssue, setEditLicenseIssue] = useState('');
    const [editLicenseExpiry, setEditLicenseExpiry] = useState('');
    const [editPayType, setEditPayType] = useState('card');
    const [editIban, setEditIban] = useState('');
    const [editBic, setEditBic] = useState('');
    const [editCardNo, setEditCardNo] = useState('');
    const [editCardExp, setEditCardExp] = useState('');
    const [editCardCvc, setEditCardCvc] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newRole, setNewRole] = useState('user');
    const [newLicenseNo, setNewLicenseNo] = useState('');
    const [newLicenseIssue, setNewLicenseIssue] = useState('');
    const [newLicenseExpiry, setNewLicenseExpiry] = useState('');
    const [newPayType, setNewPayType] = useState('card');
    const [newIban, setNewIban] = useState('');
    const [newBic, setNewBic] = useState('');
    const [newCardNo, setNewCardNo] = useState('');
    const [newCardExp, setNewCardExp] = useState('');
    const [newCardCvc, setNewCardCvc] = useState('');
// Führerschein-Dateien beim Erstellen
    const [newLicenseFront, setNewLicenseFront] = useState(null);
    const [newLicenseBack, setNewLicenseBack] = useState(null);

// Führerschein-Dateien beim Bearbeiten
    const [editLicenseFront, setEditLicenseFront] = useState(null);
    const [editLicenseBack, setEditLicenseBack] = useState(null);

    const navigate = useNavigate();
    let currentUserId = null;
    const token = localStorage.getItem('authToken');
    if (token) {
        try {
            const decoded = jwtDecode(token);
            currentUserId = decoded.user.id;
        } catch {
            currentUserId = null;
        }
    }

    const fetchUsers = async () => {
        setLoading(true);
        setError('');
        if (!token) return navigate('/login');
        try {
            const response = await fetch(`${API_BASE_URL}/api/users`, {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (response.ok) setUsers(data);
            else {
                setError(data.message || 'Fehler beim Laden.');
                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('authToken');
                    navigate('/login');
                }
            }
        } catch (err) {
            setError('Netzwerkfehler.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, [navigate]);

    const handleDelete = async (id) => {
        const userToDelete = users.find(user => user.id === id);
        if (userToDelete?.role === 'admin') return alert('Admins können nicht gelöscht werden.');
        if (!window.confirm('Wirklich löschen?')) return;
        if (!token) return navigate('/login');
        try {
            const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });
            if (response.ok) fetchUsers();
            else {
                const data = await response.json();
                setError(data.message || 'Löschen fehlgeschlagen.');
            }
        } catch (err) {
            setError('Netzwerkfehler beim Löschen.');
        }
    };

    const handleEditClick = (user) => {
        if (user.role === 'admin' && user.id === currentUserId) return alert('Nicht erlaubt.');
        setEditUserId(user.id);
        setEditUsername(user.username);
        setEditEmail(user.email);
        setEditRole(user.role);
        setEditLicenseNo(user.licenseNo || '');
        setEditLicenseIssue(user.licenseIssue || '');
        setEditLicenseExpiry(user.licenseExpiry || '');
        setEditPayType(user.payType || 'card');
        setEditIban(user.iban || '');
        setEditBic(user.bic || '');
        setEditCardNo(user.cardNo || '');
        setEditCardExp(user.cardExp || '');
        setEditCardCvc(user.cardCvc || '');
    };

    const handleCancelEdit = () => {
        setEditUserId(null);
        setEditUsername('');
        setEditEmail('');
        setEditRole('');
        setEditLicenseNo('');
        setEditLicenseIssue('');
        setEditLicenseExpiry('');
        setEditPayType('card');
        setEditIban('');
        setEditBic('');
        setEditCardNo('');
        setEditCardExp('');
        setEditCardCvc('');
        setEditLicenseFrontFile(null);
        setEditLicenseBackFile(null);
        setError('');
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');
        if (!token) {
            navigate('/login');
            return;
        }

        // Nur bei 'user' Rolle Pflichtfelder prüfen
        if (editRole === 'user') {
            if (
                !editLicenseNo || !editLicenseIssue || !editLicenseExpiry ||
                (!editLicenseFront && !alreadyHasFrontFile) || // hier musst du prüfen, ob bereits was existiert
                (!editLicenseBack && !alreadyHasBackFile) ||
                !editPayType ||
                (editPayType === 'sepa' && (!editIban || !editBic)) ||
                (editPayType === 'card' && (!editCardNo || !editCardExp || !editCardCvc))
            ) {
                setError('Bitte alle erforderlichen Führerschein- und Zahlungsfelder ausfüllen.');
                return;
            }
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/users/${editUserId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({
                    username: editUsername,
                    email: editEmail,
                    role: editRole,
                    licenseNo: editLicenseNo,
                    licenseIssue: editLicenseIssue,
                    licenseExpiry: editLicenseExpiry,
                    payType: editPayType,
                    iban: editIban,
                    bic: editBic,
                    cardNo: editCardNo,
                    cardExp: editCardExp,
                    cardCvc: editCardCvc,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Benutzer erfolgreich aktualisiert!');
                handleCancelEdit();
                fetchUsers();
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
        if (!token) {
            navigate('/login');
            return;
        }

        // Nur bei 'user' Rolle Pflichtfelder prüfen
        if (newRole === 'user') {
            if (
                !newLicenseNo || !newLicenseIssue || !newLicenseExpiry || !newLicenseFront || !newLicenseBack ||
                !newPayType ||
                (newPayType === 'sepa' && (!newIban || !newBic)) ||
                (newPayType === 'card' && (!newCardNo || !newCardExp || !newCardCvc))

            ) {
                setError('Bitte alle erforderlichen Führerschein- und Zahlungsfelder ausfüllen.');
                return;
            }
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
                    role: newRole,
                    licenseNo: newLicenseNo,
                    licenseIssue: newLicenseIssue,
                    licenseExpiry: newLicenseExpiry,
                    payType: newPayType,
                    iban: newIban,
                    bic: newBic,
                    cardNo: newCardNo,
                    cardExp: newCardExp,
                    cardCvc: newCardCvc,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Neuer Benutzer erfolgreich erstellt!');
                setNewUsername('');
                setNewEmail('');
                setNewPassword('');
                setNewRole('user');

                setNewLicenseNo('');
                setNewLicenseIssue('');
                setNewLicenseExpiry('');
                setNewPayType('card');
                setNewIban('');
                setNewBic('');
                setNewCardNo('');
                setNewCardExp('');
                setNewCardCvc('');

                fetchUsers();
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
            <form onSubmit={handleCreateUser}
                  style={{marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px'}}>
                <div className="form-group">
                    <label htmlFor="newUsername">Benutzername:</label>
                    <input type="text" id="newUsername" value={newUsername}
                           onChange={(e) => setNewUsername(e.target.value)} required/>
                </div>
                <div className="form-group">
                    <label htmlFor="newEmail">E-Mail:</label>
                    <input type="email" id="newEmail" value={newEmail} onChange={(e) => setNewEmail(e.target.value)}
                           required/>
                </div>
                <div className="form-group">
                    <label htmlFor="newPassword">Passwort:</label>
                    <input type="password" id="newPassword" value={newPassword}
                           onChange={(e) => setNewPassword(e.target.value)} required/>
                </div>
                <div className="form-group">
                    <label htmlFor="newRole">Rolle:</label>
                    <select id="newRole" value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                        <option value="user">user</option>
                        <option value="mitarbeiter">mitarbeiter</option>
                    </select>
                </div>

                {/* Führerschein */}
                <div className="form-group">
                    <label htmlFor="newLicenseNo">Führerschein Nr.:</label>
                    <input type="text" id="newLicenseNo" value={newLicenseNo}
                           onChange={(e) => setNewLicenseNo(e.target.value)} required={newRole === 'user'}/>
                </div>
                <div className="form-group">
                    <label htmlFor="newLicenseIssue">Ausstellungsdatum:</label>
                    <input type="date" id="newLicenseIssue" value={newLicenseIssue}
                           onChange={(e) => setNewLicenseIssue(e.target.value)} required={newRole === 'user'}/>
                </div>
                <div className="form-group">
                    <label htmlFor="newLicenseExpiry">Ablaufdatum:</label>
                    <input type="date" id="newLicenseExpiry" value={newLicenseExpiry}
                           onChange={(e) => setNewLicenseExpiry(e.target.value)} required={newRole === 'user'}/>
                </div>
                <div className="form-group">
                    <label htmlFor="newLicenseFront">Führerschein Vorderseite:</label>
                    <input type="file" id="newLicenseFront" onChange={(e) => setNewLicenseFront(e.target.files[0])}
                           accept="image/*,.pdf" required={newRole === 'user'}/>
                </div>
                <div className="form-group">
                    <label htmlFor="newLicenseBack">Führerschein Rückseite:</label>
                    <input type="file" id="newLicenseBack" onChange={(e) => setNewLicenseBack(e.target.files[0])}
                           accept="image/*,.pdf" required={newRole === 'user'}/>
                </div>

                {/* Zahlungsmethode */}
                <div className="form-group">
                    <label htmlFor="newPayType">Zahlungsmethode:</label>
                    <select id="newPayType" value={newPayType} onChange={(e) => setNewPayType(e.target.value)} required>
                        <option value="card">Kreditkarte</option>
                        <option value="sepa">SEPA</option>
                        <option value="paypal">PayPal</option>
                    </select>
                </div>
                {newPayType === 'sepa' && (
                    <>
                        <div className="form-group">
                            <label htmlFor="newIban">IBAN:</label>
                            <input type="text" id="newIban" value={newIban} onChange={(e) => setNewIban(e.target.value)}
                                   required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="newBic">BIC:</label>
                            <input type="text" id="newBic" value={newBic} onChange={(e) => setNewBic(e.target.value)}
                                   required/>
                        </div>
                    </>
                )}
                {newPayType === 'card' && (
                    <>
                        <div className="form-group">
                            <label htmlFor="newCardNo">Kartennummer:</label>
                            <input type="text" id="newCardNo" value={newCardNo}
                                   onChange={(e) => setNewCardNo(e.target.value)} required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="newCardExp">Kartenablauf:</label>
                            <input type="month" id="newCardExp" value={newCardExp}
                                   onChange={(e) => setNewCardExp(e.target.value)} required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="newCardCvc">CVC:</label>
                            <input type="text" id="newCardCvc" value={newCardCvc}
                                   onChange={(e) => setNewCardCvc(e.target.value)} required/>
                        </div>
                    </>
                )}

                <button type="submit" style={{
                    backgroundColor: '#28a745',
                    color: 'white',
                    padding: '10px 15px',
                    borderRadius: '5px',
                    border: 'none'
                }}>Benutzer erstellen
                </button>
            </form>

            <h3>Alle Benutzer</h3>
            {users.length === 0 ? (
                <p>Keine Benutzer gefunden.</p>
            ) : (
                <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '20px'}}>
                    <thead>
                    <tr style={{backgroundColor: '#f2f2f2'}}>
                        <th style={tableHeaderStyle}>ID</th>
                        <th style={tableHeaderStyle}>Benutzername</th>
                        <th style={tableHeaderStyle}>E-Mail</th>
                        <th style={tableHeaderStyle}>Rolle</th>
                        <th style={tableHeaderStyle}></th>
                        <th style={tableHeaderStyle}>Aktionen</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.id} style={{ borderBottom: '1px solid #ddd' }}>
                            {editUserId === user.id ? (
                                <td colSpan="5">
                                    <form onSubmit={handleUpdate} style={{
                                        display: 'flex',
                                        gap: '10px',
                                        alignItems: 'center',
                                        padding: '10px 0',
                                        flexWrap: 'wrap'
                                    }}>
                                        <input type="text" value={editUsername}
                                               onChange={(e) => setEditUsername(e.target.value)} required
                                               style={inputStyle}/>
                                        <input type="email" value={editEmail}
                                               onChange={(e) => setEditEmail(e.target.value)} required
                                               style={inputStyle}/>
                                        <select value={editRole} onChange={(e) => setEditRole(e.target.value)}
                                                style={selectStyle}>
                                            <option value="user">user</option>
                                            <option value="mitarbeiter">mitarbeiter</option>
                                            <option value="admin">admin</option>
                                        </select>

                                        {/* Führerschein */}
                                        <input
                                            type="text"
                                            placeholder="Führerschein Nr."
                                            value={editLicenseNo}
                                            onChange={(e) => setEditLicenseNo(e.target.value)}
                                            required={editRole === 'user'}
                                            style={inputStyle}
                                        />
                                        <input
                                            type="date"
                                            placeholder="Ausstellungsdatum"
                                            value={editLicenseIssue}
                                            onChange={(e) => setEditLicenseIssue(e.target.value)}
                                            required={editRole === 'user'}
                                            style={inputStyle}
                                        />
                                        <input
                                            type="date"
                                            placeholder="Ablaufdatum"
                                            value={editLicenseExpiry}
                                            onChange={(e) => setEditLicenseExpiry(e.target.value)}
                                            required={editRole === 'user'}
                                            style={inputStyle}
                                        />
                                        <input
                                            type="file"
                                            onChange={(e) => setEditLicenseFront(e.target.files[0])}
                                            accept="image/*,.pdf"
                                            style={inputStyle}
                                            required={editRole === 'user'}
                                            title="Führerschein Vorderseite"
                                        />
                                        <input
                                            type="file"
                                            onChange={(e) => setEditLicenseBack(e.target.files[0])}
                                            accept="image/*,.pdf"
                                            style={inputStyle}
                                            required={editRole === 'user'}
                                            title="Führerschein Rückseite"
                                        />

                                        {/* Zahlungsmethode */}
                                        <select
                                            value={editPayType}
                                            onChange={(e) => setEditPayType(e.target.value)}
                                            style={selectStyle}
                                            required
                                        >
                                            <option value="card">Kreditkarte</option>
                                            <option value="sepa">SEPA</option>
                                            <option value="paypal">PayPal</option>
                                        </select>

                                        {editPayType === 'sepa' && (
                                            <>
                                                <input
                                                    type="text"
                                                    placeholder="IBAN"
                                                    value={editIban}
                                                    onChange={(e) => setEditIban(e.target.value)}
                                                    required
                                                    style={inputStyle}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="BIC"
                                                    value={editBic}
                                                    onChange={(e) => setEditBic(e.target.value)}
                                                    required
                                                    style={inputStyle}
                                                />
                                            </>
                                        )}
                                        {editPayType === 'card' && (
                                            <>
                                                <input
                                                    type="text"
                                                    placeholder="Kartennummer"
                                                    value={editCardNo}
                                                    onChange={(e) => setEditCardNo(e.target.value)}
                                                    required
                                                    style={inputStyle}
                                                />
                                                <input
                                                    type="month"
                                                    placeholder="Kartenablauf"
                                                    value={editCardExp}
                                                    onChange={(e) => setEditCardExp(e.target.value)}
                                                    required
                                                    style={inputStyle}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="CVC"
                                                    value={editCardCvc}
                                                    onChange={(e) => setEditCardCvc(e.target.value)}
                                                    required
                                                    style={inputStyle}
                                                />
                                            </>
                                        )}

                                        <button type="submit" style={buttonStyleSave}>Speichern</button>
                                        <button type="button" onClick={handleCancelEdit}
                                                style={buttonStyleCancel}>Abbrechen
                                        </button>
                                    </form>
                                </td>
                            ) : (
                                <>
                                    <td style={tableCellStyle}>{user.id}</td>
                                    <td style={tableCellStyle}>{user.username}</td>
                                    <td style={tableCellStyle}>{user.email}</td>
                                    <td style={tableCellStyle}>{user.role}</td>
                                    <td style={tableCellStyle}>
                                        {/* Bearbeiten-Button nur wenn nicht eigener Admin */}
                                        {!(user.role === 'admin' && user.id === currentUserId) && (
                                            <button
                                                onClick={() => handleEditClick(user)}
                                                style={buttonStyleEdit}
                                            >
                                                Bearbeiten
                                            </button>
                                        )}
                                        {user.role !== 'admin' && (
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                style={buttonStyleDelete}
                                            >
                                                Löschen
                                            </button>
                                        )}
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
    minWidth: '150px',
};

const selectStyle = {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    flex: '0.5',
    minWidth: '160px',
};

const buttonStyleEdit = {
    backgroundColor: '#ffc107',
    color: 'black',
    padding: '5px 10px',
    borderRadius: '5px',
    border: 'none',
    marginRight: '5px',
    cursor: 'pointer',
};

const buttonStyleDelete = {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
};

const buttonStyleSave = {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
};

const buttonStyleCancel = {
    backgroundColor: '#6c757d',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    marginLeft: '5px',
};

export default UserManagementPage;
