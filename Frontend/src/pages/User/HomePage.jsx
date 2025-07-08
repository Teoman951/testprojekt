import React, { useEffect, useState } from "react";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth"; // hast du schon

const API_BASE_URL = "http://localhost:3001"; // ggf. in config.js auslagern

function HomePage() {
  const { token } = useAuth(); // ← Token verfügbar
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [error, setError] = useState("");

  const handleReserve = (carId) => { // WIEDERHERGESTELLT
    if (token) {
      navigate(`/new-reservation/${carId}`);
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/api/cars`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!response.ok) {
          throw new Error("Fehler beim Abrufen der Fahrzeuge");
        }

        const data = await response.json();
        setCars(data);
      } catch (err) {
        console.error(err.message);
        setError(err.message);
      }
    };

    fetchCars();
  }, []);

  return (
    <div className="content-container">
      <h2>Unsere Fahrzeuge</h2>
      {error && <p className="error-message">{error}</p>}

      <div className="car-grid">
        {cars.map((car) => (
          <div className="car-card" key={car.id}>
            <img
              src={car.image || "/default-car.jpg"}
              alt={car.brand + " " + car.model}
              className="car-image"
            />
            <h3>
              {car.brand} {car.model}
            </h3>
            <p>
              {car.color} · Baujahr {car.year}
            </p>
            <p>
              <strong>{car.dailyRate} €</strong> pro Tag
            </p>
            <p>
              <em>{car.location}</em>
            </p>
            {/* Reservieren-Button wiederhergestellt */}
            <button
              className="reserve-button"
              onClick={() => handleReserve(car.id)}
            >
              Reservieren
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
