import User from './User.js';
import Car from './Car.js';
import Reservation from './Reservation.js';

// Dies stellt sicher, dass Assoziationen aufgerufen werden, wenn der Index importiert wird
// Die Assoziationen sind bereits in den Model-Dateien selbst definiert,
// aber das Importieren hier stellt sicher, dass sie in sequelize registriert werden.
export { User, Car, Reservation };