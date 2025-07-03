import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from './RegisterContext.jsx';

export default function StepPayment() {
  const { data } = useRegister();
  const nav  = useNavigate();
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const finish = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new FormData();
      Object.entries(data).forEach(([k, v]) => form.append(k, v));
      /* 👉 API-Route ggf. anpassen */
      const res = await fetch('/api/auth/register', { method: 'POST', body: form });
      if (!res.ok) throw new Error(await res.text());
      alert('Registrierung erfolgreich – bitte einloggen.');
      nav('/login', { replace: true });
    } catch (err) {
      setErr(err.message || 'Serverfehler');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Schritt 4 / 4 – Zahlung & Abschluss</h2>
      {err && <p className="text-red-600 mb-2">{err}</p>}
      <form onSubmit={finish} className="space-y-4">
        <select value={data.payType}
                onChange={(e)=>update({payType:e.target.value})}
                className="w-full border p-2 rounded">
          <option value="card">Kreditkarte</option>
          <option value="sepa">SEPA-Lastschrift</option>
        </select>

        {data.payType === 'card' && (
          <>
            <input placeholder="Kartennummer"
                   value={data.cardNo}
                   onChange={(e)=>update({cardNo:e.target.value})}
                   className="w-full border p-2 rounded" />
            <input placeholder="MM/YY"
                   value={data.cardExp}
                   onChange={(e)=>update({cardExp:e.target.value})}
                   className="w-full border p-2 rounded" />
            <input placeholder="CVC"
                   value={data.cardCvc}
                   onChange={(e)=>update({cardCvc:e.target.value})}
                   className="w-full border p-2 rounded" />
          </>
        )}

        {data.payType === 'sepa' && (
          <input placeholder="IBAN"
                 value={data.iban}
                 onChange={(e)=>update({iban:e.target.value})}
                 className="w-full border p-2 rounded" />
        )}

        <div className="flex justify-between gap-4">
          <button type="button"
                  onClick={()=>nav(-1)}
                  className="flex-1 bg-gray-300 py-2 rounded">
            Zurück
          </button>
          <button disabled={loading}
                  className="flex-1 bg-green-600 text-white py-2 rounded">
            {loading ? 'Sende…' : 'Registrieren'}
          </button>
        </div>
      </form>
    </>
  );
}
