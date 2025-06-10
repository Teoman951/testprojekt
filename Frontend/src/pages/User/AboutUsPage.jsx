import React from 'react';
import './AboutUs.css'; // eigene CSS-Datei

function AboutUs() {
    return (
        <div className="content-container">
            <h2>Über Uns</h2>
            <p>
                Wir sind MoveSmart, ein Carsharing-Anbieter mit der Vision, urbane Mobilität neu zu denken.
                Unsere Mission: Weniger Autos, mehr Lebensqualität.
                Statt jedes Auto einzeln zu besitzen, teilen wir Ressourcen: fair, einfach und umweltfreundlich.
            </p>
            <p>
                Gegründet in 2025 aus dem Wunsch heraus, Mobilität zugänglicher und nachhaltiger zu machen,
                sind wir heute in über 3 Städten in Deutschland vertreten
            </p>


            <h3>Unsere Werte</h3>
            <ul>
                <li>✔️ Kundenzufriedenheit an erster Stelle</li>
                <li>✔️ Transparente Preisgestaltung</li>
                <li>✔️ Moderne, gepflegte Fahrzeuge</li>
            </ul>

            <h3>Unser Team</h3>

            <p>
            Wir sind ein junges, engagiertes Team mit dem Ziel, die Autovermietung
            so einfach und kundenfreundlich wie möglich zu gestalten.
            </p>

            <div className="team-grid">
                <div className="team-card">
                    <img src="/team/jane.jpg" alt="Ich"/>
                    <h4>bla bla bla</h4>
                    <p>Geschäftsführerin</p>
                </div>
                <div className="team-card">
                    <img src="/team/jpg" alt="???%"/>
                    <h4>bla bla bla</h4>
                    <p>Geschäftsführer</p>
                </div>
                {/* Weitere Teammitglieder hier */}
            </div>
            <p>

            </p>
        </div>
    );
}

export default AboutUs;