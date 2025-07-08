import { sequelize } from '../config/database.js';
import Car from '../models/Car.js';
// Importiere hier ggf. weitere Modelle, die geseedet werden sollen

const carsData = [
    {
        licensePlate: 'M-BW 123',
        brand: 'BMW',
        model: 'X5',
        year: 2022,
        color: 'Schwarz',
        location: 'München Zentrum',
        dailyRate: 75.50,
        isAvailable: true,
    },
    {
        licensePlate: 'B-AU 456',
        brand: 'Audi',
        model: 'A4',
        year: 2021,
        color: 'Weiß',
        location: 'Berlin Mitte',
        dailyRate: 60.00,
        isAvailable: true,
    },
    {
        licensePlate: 'HH-VW 789',
        brand: 'Volkswagen',
        model: 'Golf 8',
        year: 2023,
        color: 'Blau',
        location: 'Hamburg HafenCity',
        dailyRate: 50.25,
        isAvailable: true,
    },
    {
        licensePlate: 'K-MB 001',
        brand: 'Mercedes-Benz',
        model: 'C-Klasse',
        year: 2022,
        color: 'Silber',
        location: 'Köln Domplatte',
        dailyRate: 70.00,
        isAvailable: false, // Ein Beispiel für ein nicht verfügbares Auto
    },
];

const seedCars = async () => {
    try {
        for (const carData of carsData) {
            const [car, created] = await Car.findOrCreate({
                where: { licensePlate: carData.licensePlate },
                defaults: carData,
            });
            if (created) {
                console.log(`Car created: ${car.brand} ${car.model} (${car.licensePlate})`);
            } else {
                console.log(`Car already exists: ${car.brand} ${car.model} (${car.licensePlate})`);
            }
        }
        console.log('Car seeding finished.');
    } catch (error) {
        console.error('Error seeding cars:', error);
    }
};

const seedDatabase = async () => {
    try {
        // Authentifiziere die DB-Verbindung
        await sequelize.authenticate();
        console.log('Database connection authenticated successfully.');

        // Synchronisiere Modelle (wichtig, falls Tabellen noch nicht existieren oder geändert wurden)
        // { alter: true } oder { force: true } je nach Bedarf. force löscht Tabellen vorher!
        // Für reines Seeden ist alter:true sicherer, wenn die Tabellenstruktur schon steht.
        // Wenn dies im Hauptserver-Start schon passiert, ist es hier ggf. nicht nötig oder sollte konsistent sein.
        // await sequelize.sync({ alter: true });
        // console.log('Models synchronized.');

        console.log('Starting database seeding...');
        await seedCars();
        // Hier könnten weitere Seeding-Funktionen für andere Modelle aufgerufen werden
        // await seedUsers();
        // await seedReservations();
        console.log('Database seeding completed.');

    } catch (error) {
        console.error('Unable to connect to the database or seed data:', error);
    } finally {
        // Schließe die Datenbankverbindung, wenn das Skript eigenständig läuft
        // Wenn es als Teil des Serverstarts oder eines größeren Prozesses läuft, ist dies ggf. nicht nötig.
        // await sequelize.close();
        // console.log('Database connection closed.');
    }
};

// Ermöglicht den direkten Aufruf des Skripts mit `node Backend/seeders/seedDatabase.js`
if (process.argv.includes('seed')) {
    seedDatabase().then(() => {
        // Optional: Prozess explizit beenden, wenn das Seeding abgeschlossen ist
        // und keine weiteren asynchronen Operationen ausstehen.
        // Dies ist nützlich, wenn das Skript nicht von selbst terminiert.
        // Wenn `sequelize.close()` verwendet wird, ist dies oft nicht nötig.
        // process.exit(0);
    }).catch(error => {
        console.error('Seeding failed:', error);
        process.exit(1);
    });
}


// Exportiere die Funktion, falls sie von woanders importiert werden soll
export { seedDatabase, seedCars };
