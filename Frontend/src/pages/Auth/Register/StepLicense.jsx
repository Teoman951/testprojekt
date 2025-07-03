import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from './RegisterContext.jsx';

export default function StepLicense() {
  const { data, update } = useRegister();
  const nav = useNavigate();
  const [err, setErr] = useState('');

  const onFile = (e) => update({ licenseFile: e.target.files[0] });

  const next = (e) => {
    e.preventDefault();
    if (!data.licenseNo || !data.licenseIssue || !data.licenseExpiry) {
      setErr('Alle Führerscheindaten sind Pflicht.');
      return;
    }
    nav('../payment');
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Schritt 3 / 4 – Führerschein</h2>
      {err && <p className="text-red-600 mb-2">{err}</p>}
      <form onSubmit={next} className="space-y-4">
        <input placeholder="Führerschein-Nr."
               value={data.licenseNo}
               onChange={(e)=>update({licenseNo:e.target.value})}
               className="w-full border p-2 rounded" />
        <label className="block text-sm">Ausstellungs­datum</label>
        <input type="date"
               value={data.licenseIssue}
               onChange={(e)=>update({licenseIssue:e.target.value})}
               className="w-full border p-2 rounded" />
        <label className="block text-sm">Ablauf­datum</label>
        <input type="date"
               value={data.licenseExpiry}
               onChange={(e)=>update({licenseExpiry:e.target.value})}
               className="w-full border p-2 rounded" />

        <label className="block text-sm mt-2">Foto / Scan hochladen (jpg/png ≤ 5 MB)</label>
        <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={onFile} />

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
