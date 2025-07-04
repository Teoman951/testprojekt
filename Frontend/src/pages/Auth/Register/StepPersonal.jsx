import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from './RegisterContext.jsx';

export default function StepPersonal() {
  const { data, update } = useRegister();
  const nav   = useNavigate();
  const [err, setErr] = useState('');

  const next = (e) => {
    e.preventDefault();
    if (!data.firstName || !data.lastName || !data.dob) {
      setErr('Bitte alle Pflichtfelder ausfüllen.');
      return;
    }
    nav('../license');
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Schritt 2 / 4 – Persönliche Daten</h2>
      {err && <p className="text-red-600 mb-2">{err}</p>}
      <form onSubmit={next} className="space-y-4">
        <input placeholder="Vorname"
               value={data.firstName}
               onChange={(e)=>update({firstName:e.target.value})}
               className="w-full border p-2 rounded" />
        <input placeholder="Nachname"
               value={data.lastName}
               onChange={(e)=>update({lastName:e.target.value})}
               className="w-full border p-2 rounded" />
        <input type="date" placeholder="Geburtsdatum"
               value={data.dob}
               onChange={(e)=>update({dob:e.target.value})}
               className="w-full border p-2 rounded" />
        <input placeholder="Telefon"
               value={data.phone}
               onChange={(e)=>update({phone:e.target.value})}
               className="w-full border p-2 rounded" />

        {/* Adresse */}
        <input placeholder="Straße & Nr."
               value={data.street}
               onChange={(e)=>update({street:e.target.value})}
               className="w-full border p-2 rounded" />
        <input placeholder="PLZ"
               value={data.zip}
               onChange={(e)=>update({zip:e.target.value})}
               className="w-full border p-2 rounded" />
        <input placeholder="Ort"
               value={data.city}
               onChange={(e)=>update({city:e.target.value})}
               className="w-full border p-2 rounded" />

        <div className="flex justify-between gap-4">
          <button type="button"
                  onClick={()=>nav(-1)}
                  className="flex-1 bg-gray-300 py-2 rounded">
            Zurück
          </button>
          <button className="flex-1 bg-blue-600 text-white py-2 rounded">
            Weiter
          </button>
        </div>
      </form>
    </>
  );
}
