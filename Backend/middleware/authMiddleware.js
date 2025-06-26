import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    // Token aus dem Header holen
    const token = req.header('x-auth-token');

    // Prüfen, ob Token existiert
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Token verifizieren
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Benutzerinformationen aus dem Token in den Request legen
        req.user = decoded.user;
        next(); // Gehe zum nächsten Middleware/Controller
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Middleware für Rollenprüfung
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: You do not have the necessary permissions.' });
        }
        next();
    };

};


export default authMiddleware;