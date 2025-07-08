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

    // Handler für Dateiänderungen
    const handleFileChange = (e, setter) => {
        setter(e.target.files[0]);
    };

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
        setEditLicenseFront(null);
        setEditLicenseBack(null);
        setError('');
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');
        if (!token) {
            navigate('/login');
            return;
        }

        // Existierenden User anhand der editUserId finden
        const currentUser = users.find(u => u.id === editUserId);
        const alreadyHasFrontFile = currentUser?.licenseFrontPath;
        const alreadyHasBackFile = currentUser?.licenseBackPath;

        // Nur bei 'user' Rolle Pflichtfelder prüfen
        if (editRole === 'user') {
            if (
                !editLicenseNo || !editLicenseIssue || !editLicenseExpiry ||
                (!editLicenseFront && !alreadyHasFrontFile) ||
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

        if (!newUsername || !newEmail || !newPassword) {
            setError('Benutzername, E-Mail und Passwort sind Pflichtfelder.');
            return;
        }

        const formData = new FormData();
        formData.append('username', newUsername);
        formData.append('email', newEmail);
        formData.append('password', newPassword);
        formData.append('role', newRole); // Rolle wird mitgesendet

        if (newRole === 'user') {
            // Validierung für Benutzerrolle
            if (!newLicenseFront) {
                setError('Das vordere Führerscheinfoto ist für Benutzer ein Pflichtfeld.');
                return;
            }
            formData.append('licenseFront', newLicenseFront);
            if (newLicenseBack) {
                formData.append('licenseBack', newLicenseBack);
            }
            // Optionale Felder für Rolle 'user' hinzufügen (gemäß Backend-Logik der allgemeinen Registrierung)
            if (newLicenseNo) formData.append('licenseNo', newLicenseNo);
            if (newLicenseIssue) formData.append('licenseIssue', newLicenseIssue);
            if (newLicenseExpiry) formData.append('licenseExpiry', newLicenseExpiry);

            // Zahlungsdaten für Rolle 'user' - Annahme: Backend erwartet sie, auch wenn optional
            // Wenn diese nicht optional sind, müssen die Felder im Formular als `required` markiert werden
            // oder hier eine Validierung hinzugefügt werden.
            // Fürs Erste senden wir sie, wenn vorhanden.
            if (newPayType) formData.append('payType', newPayType);
            if (newPayType === 'sepa') {
                if (newIban) formData.append('iban', newIban);
                if (newBic) formData.append('bic', newBic);
            } else if (newPayType === 'card') {
                if (newCardNo) formData.append('cardNo', newCardNo);
                if (newCardExp) formData.append('cardExp', newCardExp);
                if (newCardCvc) formData.append('cardCvc', newCardCvc);
            }
        }
        // Für andere Rollen (z.B. 'mitarbeiter', 'admin') sind Lizenz- und Zahlungsdaten nicht erforderlich

        try {
            // Die Route /api/auth/register wird verwendet, da sie FormData und die Erstellung von Benutzern mit Rolle handhabt
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                body: formData, // FormData verwenden, kein JSON.stringify und kein Content-Type Header
            });

            const data = await response.json();

            if (response.ok) {
                alert('Neuer Benutzer erfolgreich erstellt! ID: ' + (data.userId || data.user?.id));
                // Formular zurücksetzen
                setNewUsername('');
                setNewEmail('');
                setNewPassword('');
                setNewRole('user');
                setNewLicenseNo('');
                setNewLicenseIssue('');
                setNewLicenseExpiry('');
                setNewLicenseFront(null); // Dateifeld zurücksetzen
                setNewLicenseBack(null);  // Dateifeld zurücksetzen
                // Ggf. Dateieingabefelder im DOM explizit zurücksetzen, falls nötig:
                // document.getElementById('newLicenseFront').value = null;
                // document.getElementById('newLicenseBack').value = null;
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
    if (error && !editUserId) return <div className="content-container user-management-page error-message"><h2>Fehler:</h2><p>{error}</p></div>; // Klasse hier auch hinzufügen

    return (
        // Die Klasse 'user-management-page' wird hinzugefügt, um das spezifische Styling aus UserManagement.css anzuwenden
        <div className="content-container user-management-page">
            <h2>Benutzerverwaltung</h2>
            {error && <p className="error-message">{error}</p>}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                {/* Zurück-Button zum Dashboard */}
                <button
                    onClick={() => navigate('/admin/dashboard')}
                    style={{
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
                {/* Der Button zur separaten Seite wird entfernt, da die Funktionalität integriert wurde */}
            </div>

            {/* Der folgende Block war fehlerhaft und wurde entfernt.
                 Er war ein Überbleibsel eines früheren Buttons.
            */}
            {/*
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
            */}

            {/* Formular zum Erstellen eines neuen Benutzers (das bereits existierende in dieser Komponente) */}
            <h3>Neuen Benutzer erstellen</h3>
            <form onSubmit={handleCreateUser}
                  style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
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
                {/* Die Rollenauswahl wird entfernt, da über /api/auth/register immer 'user' erstellt wird.
                    Für 'mitarbeiter' gibt es /api/admin/staff/register (CreateStaffPage).
                <div className="form-group">
                    <label htmlFor="newRole">Rolle:</label>
                    <select id="newRole" value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                        <option value="user">user</option>
                        <option value="mitarbeiter">mitarbeiter</option>
                    </select>
                </div>
                */}

                {/* Führerschein - Felder sind optional, außer newLicenseFront */}
                <div className="form-group">
                    <label htmlFor="newLicenseNo">Führerschein Nr. (Optional):</label>
                    <input type="text" id="newLicenseNo" value={newLicenseNo}
                           onChange={(e) => setNewLicenseNo(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="newLicenseIssue">Ausstellungsdatum (Optional):</label>
                    <input type="date" id="newLicenseIssue" value={newLicenseIssue}
                           onChange={(e) => setNewLicenseIssue(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="newLicenseExpiry">Ablaufdatum (Optional):</label>
                    <input type="date" id="newLicenseExpiry" value={newLicenseExpiry}
                           onChange={(e) => setNewLicenseExpiry(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="newLicenseFront">Führerschein Vorderseite (Pflicht):</label>
                    <input type="file" id="newLicenseFront" onChange={(e) => handleFileChange(e, setNewLicenseFront)}
                           accept="image/*" required /> {/* Dieses Feld ist immer Pflicht */}
                </div>
                <div className="form-group">
                    <label htmlFor="newLicenseBack">Führerschein Rückseite (Optional):</label>
                    <input type="file" id="newLicenseBack" onChange={(e) => handleFileChange(e, setNewLicenseBack)}
                           accept="image/*" />
                </div>

                {/* Zahlungsmethode - Felder sind optional */}
                <div className="form-group">
                    <label htmlFor="newPayType">Zahlungsmethode (Optional):</label>
                    <select id="newPayType" value={newPayType} onChange={(e) => setNewPayType(e.target.value)}>
                        <option value="">Bitte wählen...</option> {/* Option für keine Auswahl */}
                        <option value="card">Kreditkarte</option>
                        <option value="sepa">SEPA</option>
                        <option value="paypal">PayPal</option>
                    </select>
                </div>
                {newPayType === 'sepa' && (
                    <>
                        <div className="form-group">
                            <label htmlFor="newIban">IBAN:</label>
                            <input type="text" id="newIban" value={newIban} onChange={(e) => setNewIban(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="newBic">BIC:</label>
                            <input type="text" id="newBic" value={newBic} onChange={(e) => setNewBic(e.target.value)} />
                        </div>
                    </>
                )}
                {newPayType === 'card' && (
                    <>
                        <div className="form-group">
                            <label htmlFor="newCardNo">Kartennummer:</label>
                            <input type="text" id="newCardNo" value={newCardNo}
                                   onChange={(e) => setNewCardNo(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="newCardExp">Kartenablauf:</label>
                            <input type="month" id="newCardExp" value={newCardExp}
                                   onChange={(e) => setNewCardExp(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="newCardCvc">CVC:</label>
                            <input type="text" id="newCardCvc" value={newCardCvc}
                                   onChange={(e) => setNewCardCvc(e.target.value)} />
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
                        <th style={tableHeaderStyle}>Führerschein Nr.</th>
                        <th style={tableHeaderStyle}>Ausstellung</th>
                        <th style={tableHeaderStyle}>Ablauf</th>
                        <th style={tableHeaderStyle}>Führerschein Vorne</th>
                        <th style={tableHeaderStyle}>Führerschein Hinten</th>
                        <th style={tableHeaderStyle}>Zahlungsart</th>
                        <th style={tableHeaderStyle}>IBAN</th>
                        <th style={tableHeaderStyle}>BIC</th>
                        <th style={tableHeaderStyle}>Kartennummer</th>
                        <th style={tableHeaderStyle}>Kartenablauf</th>
                        <th style={tableHeaderStyle}>CVC</th>
                        <th style={tableHeaderStyle}>Aktionen</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.id} style={{ borderBottom: '1px solid #ddd' }}>
                            {editUserId === user.id ? (
                                <>
                                    <td style={tableCellStyle}>{user.id}</td>
                                    <td style={tableCellStyle}>
                                        <input
                                            type="text"
                                            value={editUsername}
                                            onChange={(e) => setEditUsername(e.target.value)}
                                            required
                                            style={inputStyle}
                                        />
                                    </td>
                                    <td style={tableCellStyle}>
                                        <input
                                            type="email"
                                            value={editEmail}
                                            onChange={(e) => setEditEmail(e.target.value)}
                                            required
                                            style={inputStyle}
                                        />
                                    </td>
                                    <td style={tableCellStyle}>
                                        <select
                                            value={editRole}
                                            onChange={(e) => setEditRole(e.target.value)}
                                            style={selectStyle}
                                        >
                                            <option value="user">user</option>
                                            <option value="mitarbeiter">mitarbeiter</option>
                                            <option value="admin">admin</option>
                                        </select>
                                    </td>
                                    <td style={tableCellStyle}>
                                        <input
                                            type="text"
                                            placeholder="Führerschein Nr."
                                            value={editLicenseNo}
                                            onChange={(e) => setEditLicenseNo(e.target.value)}
                                            required={editRole === 'user'}
                                            style={inputStyle}
                                        />
                                    </td>
                                    <td style={tableCellStyle}>
                                        <input
                                            type="date"
                                            placeholder="Ausstellungsdatum"
                                            value={editLicenseIssue}
                                            onChange={(e) => setEditLicenseIssue(e.target.value)}
                                            required={editRole === 'user'}
                                            style={inputStyle}
                                        />
                                    </td>
                                    <td style={tableCellStyle}>
                                        <input
                                            type="date"
                                            placeholder="Ablaufdatum"
                                            value={editLicenseExpiry}
                                            onChange={(e) => setEditLicenseExpiry(e.target.value)}
                                            required={editRole === 'user'}
                                            style={inputStyle}
                                        />
                                    </td>
                                    <td style={tableCellStyle}>
                                        <input
                                            type="file"
                                            onChange={(e) => setEditLicenseFront(e.target.files[0])}
                                            accept="image/*,.pdf"
                                            style={inputStyle}
                                            required={editRole === 'user'}
                                            title="Führerschein Vorderseite"
                                        />
                                    </td>
                                    <td style={tableCellStyle}>
                                        <input
                                            type="file"
                                            onChange={(e) => setEditLicenseBack(e.target.files[0])}
                                            accept="image/*,.pdf"
                                            style={inputStyle}
                                            required={editRole === 'user'}
                                            title="Führerschein Rückseite"
                                        />
                                    </td>
                                    <td style={tableCellStyle}>
                                        <div style={{
                                            display: 'flex',
                                            gap: '8px',
                                            alignItems: 'center',
                                            flexWrap: 'wrap'
                                        }}>
                                            {/* Zahlungsart-Auswahl */}
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

                                            {/* SEPA-Felder */}
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

                                            {/* Kreditkarten-Felder */}
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
                                                        placeholder="Ablauf"
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
                                        </div>
                                    </td>


                                    <td style={tableCellStyle}>
                                        <button type="button" onClick={handleUpdate} style={buttonStyleSave}>
                                            Speichern
                                        </button>
                                        <button type="button" onClick={handleCancelEdit} style={buttonStyleCancel}>
                                            Abbrechen
                                        </button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td style={tableCellStyle}>{user.id}</td>
                                    <td style={tableCellStyle}>{user.username}</td>
                                    <td style={tableCellStyle}>{user.email}</td>
                                    <td style={tableCellStyle}>{user.role}</td>
                                    <td style={tableCellStyle}>{user.licenseNo}</td>
                                    <td style={tableCellStyle}>{user.licenseIssue}</td>
                                    <td style={tableCellStyle}>{user.licenseExpiry}</td>
                                    <td style={tableCellStyle}>
                                        {user.licenseFrontPath ? (
                                            <a
                                                href={`${API_BASE_URL}/uploads/licenses/${user.licenseFrontPath}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Ansehen
                                            </a>
                                        ) : (
                                            '–'
                                        )}
                                    </td>
                                    <td style={tableCellStyle}>
                                        {user.licenseBackPath ? (
                                            <a
                                                href={`${API_BASE_URL}/uploads/licenses/${user.licenseBackPath}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Ansehen
                                            </a>
                                        ) : (
                                            '–'
                                        )}
                                    </td>
                                    <td style={tableCellStyle}>{user.payType}</td>
                                    <td style={tableCellStyle}>{user.iban}</td>
                                    <td style={tableCellStyle}>{user.bic}</td>
                                    <td style={tableCellStyle}>{user.cardNo}</td>
                                    <td style={tableCellStyle}>{user.cardExp}</td>
                                    <td style={tableCellStyle}>{user.cardCvc}</td>
                                    <td style={tableCellStyle}>
                                        {!(user.role === 'admin' && user.id === currentUserId) && (
                                            <button onClick={() => handleEditClick(user)} style={buttonStyleEdit}>
                                                Bearbeiten
                                            </button>
                                        )}
                                        {user.role !== 'admin' && (
                                            <button onClick={() => handleDelete(user.id)} style={buttonStyleDelete}>
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
    )}


// Inline-Styles für die Tabelle (könnten auch in CSS-Datei ausgelagert werden)
const tableHeaderStyle = {
    padding: '12px 8px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
};

const tableCellStyle = {
    padding: '8px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
    minWidth: '10px'
};

const inputStyle = {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    flex: '1',
    minWidth: '10px',
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

