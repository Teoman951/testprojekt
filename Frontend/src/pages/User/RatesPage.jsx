import React from "react";
import "./RatesPage.css";

function RatesPage() {
    const rates = [
        {
            title: "Basis Tarif",
            price: "0,20 € / Minute",
            features: ["Keine Grundgebühr", "Abrechnung pro Minute", "Haftpflicht inkl."]
        },
        {
            title: "Flex Tarif",
            price: "4,99 € / Monat",
            features: ["0,15 € / Minute", "Reservierung bis 30 Min. kostenlos", "24/7 Support"]
        },
        {
            title: "Pro Tarif",
            price: "19,99 € / Monat",
            features: ["0,10 € / Minute", "Bevorzugter Zugang", "Premiumfahrzeuge inkl."]
        }
    ];

    // Neue Funktion für die Tarifauswahl
    const handleSelectRate = (rateTitle) => {
        console.log(`Der Tarif "${rateTitle}" wurde ausgewählt.`);
        // Hier kommt die eigentliche Logik hin
        // Zum Beispiel:
        // - Weiterleitung zu einer Registrierungsseite mit dem ausgewählten Tarif als Parameter
        // - Öffnen eines Bestätigungs-Modals
        // - Speichern des Tarifs im globalen Zustand (z.B. Context API, Redux)
    };

    return (
        <div className="rates-container">
            <h2>Unsere Tarife</h2>
            <div className="rate-cards">
                {rates.map((rate, index) => (
                    <div className="rate-card" key={index}>
                        <h3>{rate.title}</h3>
                        <p className="rate-price">{rate.price}</p>
                        <ul>
                            {rate.features.map((feature, i) => (
                                <li key={i}>✅ {feature}</li>
                            ))}
                        </ul>
                        {/* onClick-Handler zum Button hinzugefügt */}
                        <button
                            className="select-button"
                            onClick={() => handleSelectRate(rate.title)}
                        >
                            Jetzt wählen
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RatesPage;