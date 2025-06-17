// Backend/controllers/authController.test.js
// Dies ist ein Integrationstest für den authController, der die Interaktion
// mit simulierten User-Modellen, bcrypt und jsonwebtoken überprüft.

import { register, login } from './authController.js'; // Importiere die zu testenden Funktionen
import User from '../models/User.js'; // Importiere das User-Modell
import bcrypt from 'bcryptjs'; // Importiere bcryptjs für Passwort-Hashing
import jwt from 'jsonwebtoken'; // Importiere jsonwebtoken für JWT-Erstellung

// *** NEUE WICHTIGE HINZUFÜGUNG: Mocking von database.js ***
// Wir mocken die gesamte database.js, um zu verhindern, dass Jest versucht, die
// echte Sequelize-Instanz zu initialisieren, die dann sqlite3 laden würde.
jest.mock('../config/database.js', () => ({
    // Simulieren einer Sequelize-Instanz und einer connectDB-Funktion
    sequelize: {
        // Mocke die `define`-Methode, die von den Modellen aufgerufen wird.
        // Sie soll ein Objekt zurückgeben, das die Methoden eines Mock-Modells enthält.
        define: jest.fn((modelName, attributes, options) => {
            // Wenn ein Modell definiert wird, gib ein Mock-Objekt zurück,
            // das die Methoden wie `create`, `findOne` etc. enthält.
            // Diese Methoden werden dann später in den spezifischen Mocks für User.js
            // mit ihrem Verhalten versehen.
            return {
                create: jest.fn(),
                findOne: jest.fn(),
                findByPk: jest.fn(),
                destroy: jest.fn(),
                save: jest.fn(), // Wichtig für Update-Operationen
            };
        }),
        // Auch andere Sequelize-Methoden, die vielleicht direkt verwendet werden könnten, mocken
        sync: jest.fn(),
    },
    // Mocke die connectDB-Funktion, damit sie nichts tut oder einen leeren Promise zurückgibt
    connectDB: jest.fn(async () => { /* do nothing */ }),
}));


// *** Mocking von Abhängigkeiten (wie zuvor) ***
// Wir mocken das User-Modell, bcrypt und jsonwebtoken, um sicherzustellen,
// dass unsere Tests isoliert laufen und nicht von der Datenbank oder
// externen Bibliotheken abhängen, die tatsächliche Operationen durchführen würden.
// HINWEIS: Nach dem Mocken von database.js wird der Import von User.js
// jetzt die gemockte Sequelize-Instanz verwenden, was zu einer saubereren Isolation führt.
jest.mock('../models/User.js', () => {
    // Da sequelize.define gemockt ist, müssen wir hier die spezifischen
    // Methoden für das User-Modell definieren, die der Controller aufruft.
    // Diese Mock-Objekte werden vom Controller direkt verwendet.
    const mockUser = {
        create: jest.fn(),
        findOne: jest.fn(),
        findByPk: jest.fn(),
        destroy: jest.fn(),
        save: jest.fn(), // Für user.save() im updateUser Controller
    };
    return {
        __esModule: true, // Wichtig für ES Module Mocks
        default: mockUser, // Standard-Export für das User-Modell
    };
});

jest.mock('bcryptjs', () => ({
    // Mocke die Hashing- und Vergleichsfunktionen
    hash: jest.fn(),    // Simuliert das Hashen eines Passworts
    compare: jest.fn(), // Simuliert den Vergleich eines Passworts
}));

jest.mock('jsonwebtoken', () => ({
    // Mocke die Signierfunktion für JWTs
    sign: jest.fn(), // Simuliert die Erstellung eines JWT
}));

// Beschreibt eine Test-Suite für den Auth Controller
describe('Auth Controller', () => {
    let mockReq; // Mock-Objekt für die Express-Anfrage (request)
    let mockRes; // Mock-Objekt für die Express-Antwort (response)
    let next;    // Mock-Funktion für die nächste Middleware (falls benötigt)

    // beforeEach wird vor JEDEM Testfall in dieser Suite ausgeführt
    beforeEach(() => {
        // Setze mockReq und mockRes vor jedem Test zurück, um eine saubere Umgebung zu haben
        mockReq = {
            body: {}, // Der Body der Anfrage
            user: {}  // Für Benutzerdaten, die von Middleware hinzugefügt werden könnten
        };
        mockRes = {
            // Mocke die Methoden von 'res' und erlaube Chaining (z.B. res.status().json())
            status: jest.fn().mockReturnThis(), // Simuliert res.status(CODE)
            json: jest.fn(),                    // Simuliert res.json(DATA)
            send: jest.fn(),                    // Simuliert res.send(DATA)
        };
        next = jest.fn(); // Mock für die 'next' Funktion in Express-Middleware
    });

    // afterEach wird nach JEDEM Testfall in dieser Suite ausgeführt
    afterEach(() => {
        // Setzt alle Mocks zurück, damit die Ergebnisse eines Tests keine anderen beeinflussen
        jest.clearAllMocks();
    });

    // Test-Suite für die 'register'-Funktion
    describe('register', () => {
        // Testfall: Erfolgreiche Registrierung eines neuen Benutzers
        it('should register a new user successfully', async () => {
            // Arrange: Bereite die Anfragedaten vor
            mockReq.body = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
            };

            // Simuliere das Verhalten der gemockten Funktionen
            // user.js ist gemockt und User.findOne/create sind jetzt Jest-Mocks.
            User.findOne.mockResolvedValue(null); // Simuliert, dass Benutzer noch nicht existiert
            bcrypt.hash.mockResolvedValue('hashedPassword123'); // Simuliert das Passwort-Hashing
            User.create.mockResolvedValue({ // Simuliert die Erstellung eines neuen Benutzers in der DB
                id: 1,
                username: 'testuser',
                email: 'test@example.com',
                role: 'user',
            });

            // Act: Führe die zu testende Funktion aus
            await register(mockReq, mockRes);

            // Assert: Überprüfe die Erwartungen
            // Prüfe, ob die Mocks mit den richtigen Argumenten aufgerufen wurden
            expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10); // 10 ist die Salt-Runde in deinem Controller
            expect(User.create).toHaveBeenCalledWith({
                username: 'testuser',
                email: 'test@example.com',
                password: 'hashedPassword123',
                role: 'user', // Die Standardrolle, die im Controller gesetzt wird
            });
            // Prüfe die Antwort des Express-Servers
            expect(mockRes.status).toHaveBeenCalledWith(201); // Erwarteter HTTP-Statuscode
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'User registered successfully!' }); // Erwarteter JSON-Body
        });

        // Testfall: Registrierung schlägt fehl, wenn Benutzer bereits existiert
        it('should return 400 if user already exists', async () => {
            // Arrange
            mockReq.body = {
                username: 'existinguser',
                email: 'existing@example.com',
                password: 'password123',
            };
            // Simuliere, dass der Benutzer bereits existiert
            User.findOne.mockResolvedValue({ email: 'existing@example.com' });

            // Act
            await register(mockReq, mockRes);

            // Assert
            expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'existing@example.com' } });
            expect(User.create).not.toHaveBeenCalled(); // 'create' sollte NICHT aufgerufen werden
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'User already exists' });
        });

        // Testfall: Serverfehler bei der Registrierung
        it('should return 500 on server error', async () => {
            // Arrange
            mockReq.body = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
            };
            // Simuliere einen Fehler bei der Datenbankoperation
            User.findOne.mockRejectedValue(new Error('Database error'));

            // Act
            await register(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith('Server error');
        });
    });

    // Test-Suite für die 'login'-Funktion
    describe('login', () => {
        // Testfall: Erfolgreicher Login und Rückgabe eines Tokens
        it('should login a user successfully and return a token', async () => {
            // Arrange
            mockReq.body = {
                email: 'test@example.com',
                password: 'password123',
            };
            const mockUser = {
                id: 1,
                username: 'testuser',
                email: 'test@example.com',
                password: 'hashedPassword123', // Gehashtes Passwort aus der DB
                role: 'user',
            };

            // Simuliere, dass der Benutzer gefunden wird, das Passwort übereinstimmt und ein Token generiert wird
            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true); // Passwortvergleich erfolgreich
            jwt.sign.mockReturnValue('mockedToken'); // Simuliere einen JWT

            // Act
            await login(mockReq, mockRes);

            // Assert
            expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword123');
            expect(jwt.sign).toHaveBeenCalledWith(
                // Das Payload, das in deinem Token erwartet wird
                { user: { id: mockUser.id, username: mockUser.username, email: mockUser.email, role: mockUser.role } },
                process.env.JWT_SECRET, // Der geheime Schlüssel aus den Umgebungsvariablen
                { expiresIn: '1h' } // Die Ablaufzeit des Tokens
            );
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({ token: 'mockedToken' });
        });

        // Testfall: Ungültige Anmeldeinformationen (Benutzer nicht gefunden oder Passwort falsch)
        it('should return 400 for invalid credentials', async () => {
            // Arrange
            mockReq.body = {
                email: 'test@example.com',
                password: 'wrongpassword',
            };

            // Simuliere, dass entweder der Benutzer nicht gefunden wird oder das Passwort nicht stimmt
            User.findOne.mockResolvedValue(null); // Oder: User.findOne.mockResolvedValue(mockUser); bcrypt.compare.mockResolvedValue(false);

            // Act
            await login(mockReq, mockRes);

            // Assert
            expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid Credentials' });
        });
    });
});
