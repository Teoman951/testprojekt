import React from 'react';
import './RatesPage.css'; // Deine CSS-Datei

function RatesPage() {
    const tarife = [
        {
            name: "Basis-Tarif",
            preis: "0,25 € / min",
            beschreibung: "Ideal für spontane Fahrten ohne Grundgebühr."
        },
        {
            name: "Komfort-Tarif",
            preis: "0,20 € / min",
            beschreibung: "Für Vielfahrer mit monatlicher Grundgebühr."
        },
        {
            name: "Tages-Tarif",
            preis: "39 € / Tag",
            beschreibung: "Perfekt für Tagesausflüge mit Fixpreis."
        }
    ];

    return (
        <div className="content-container">
            <h2>Unsere Tarife</h2>
            <p>
                Bei MoveSmart bieten wir flexible Preismodelle für jeden Bedarf – ob spontane Kurzfahrt oder Tagesausflug.
            </p>

            <div className="rate-grid">
                {tarife.map((tarif, index) => (
                    <div className="rate-card" key={index}>
                        <h3>{tarif.name}</h3>
                        <p>{tarif.beschreibung}</p>
                        <div className="rate-price">{tarif.preis}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RatesPage;