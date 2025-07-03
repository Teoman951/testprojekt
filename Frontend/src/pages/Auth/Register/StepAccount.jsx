// src/pages/Auth/Register/StepAccount.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from './RegisterContext.jsx';

export default function StepAccount() {
  const { data, update } = useRegister();
  const nav = useNavigate();
  const [err, setErr] = useState('');

  const next = (e) => {
    e.preventDefault();
    if (!data.username || !data.email || !data.password) {
      setErr('Bitte alle Pflichtfelder ausfüllen.');
      return;
    }
    nav('../personal');
  };

  return (
    <>
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Schritt <span className="font-bold">1 / 4</span> – Konto-Daten
      </h2>

      {err && <p className="mb-4 text-red-600">{err}</p>}

      <form onSubmit={next} className="space-y-5">
        {/* Benutzername */}
        <div>
          <label className="block text-sm mb-1" htmlFor="username">
            Benutzername <span className="text-red-500">*</span>
          </label>
          <input
            id="username"
            type="text"
            value={data.username ?? ''}
            onChange={(e) => update({ username: e.target.value })}
            className="w-full rounded border-gray-300 focus:ring-2 focus:ring-blue-500 px-3 py-2"
          />
        </div>

        {/* E-Mail */}
        <div>
          <label className="block text-sm mb-1" htmlFor="email">
            E-Mail <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={data.email ?? ''}
            onChange={(e) => update({ email: e.target.value })}
            className="w-full rounded border-gray-300 focus:ring-2 focus:ring-blue-500 px-3 py-2"
          />
        </div>

        {/* Passwort */}
        <div>
          <label className="block text-sm mb-1" htmlFor="password">
            Passwort <span className="text-red-500">*</span>
          </label>
          <input
            id="password"
            type="password"
            minLength={6}
            placeholder="Mind. 6 Zeichen"
            value={data.password ?? ''}
            onChange={(e) => update({ password: e.target.value })}
            className="w-full rounded border-gray-300 focus:ring-2 focus:ring-blue-500 px-3 py-2"
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded transition-colors"
          >
            Weiter
          </button>
        </div>
      </form>
    </>
  );
}
