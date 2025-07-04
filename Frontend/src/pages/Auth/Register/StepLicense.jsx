/*  Step 3 / 4 – Führerschein  */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from './RegisterContext.jsx';

export default function StepLicense() {
  const { data, update } = useRegister();
  const nav = useNavigate();
  const [err, setErr] = useState('');

  /* Date-Helper:  yyyy-mm-dd → Date */
  const toDate = s => (s ? new Date(s) : null);

  /* ---------- weiter  ---------- */
  const next = e => {
    e.preventDefault();

    if (
      !data.licenseNo ||
      !data.licenseIssue ||
      !data.licenseExpiry ||
      !data.licenseFront ||
      !data.licenseBack
    ) {
      setErr('Alle Felder & beide Bilder sind Pflicht.');
      return;
    }
    if (toDate(data.licenseIssue) >= toDate(data.licenseExpiry)) {
      setErr('Ablaufdatum muss nach dem Ausstellungsdatum liegen.');
      return;
    }
    setErr('');
    nav('../payment');
  };

  /* ---------- Zwei Fotos auswählen  ---------- */
  const onFiles = e => {
    const files = Array.from(e.target.files || []);
    if (files.length !== 2) {
      setErr('Bitte Vorder- UND Rückseite wählen.');
      return;
    }
    update({ licenseFront: files[0], licenseBack: files[1] });
    setErr('');
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">
        Schritt 3 / 4 – Führerschein
      </h2>

      {err && <p className="text-red-600 mb-2">{err}</p>}

      <form onSubmit={next} className="space-y-4">
        <input
          placeholder="Führerschein-Nr."
          value={data.licenseNo}
          onChange={e => update({ licenseNo: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />

        <label className="block text-sm">Ausstellungsdatum</label>
        <input
          type="date"
          value={data.licenseIssue}
          onChange={e => update({ licenseIssue: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />

        <label className="block text-sm">Ablaufdatum</label>
        <input
          type="date"
          value={data.licenseExpiry}
          onChange={e => update({ licenseExpiry: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />

        <label className="block text-sm mt-2">
          Vorder- & Rückseite hochladen (jpg/png ≤ 5 MB)
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={onFiles}
          className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2
                     file:text-blue-700 hover:file:bg-blue-100"
        />

        <div className="flex justify-between gap-4">
          <button
            type="button"
            onClick={() => nav(-1)}
            className="flex-1 bg-gray-300 py-2 rounded"
          >
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
