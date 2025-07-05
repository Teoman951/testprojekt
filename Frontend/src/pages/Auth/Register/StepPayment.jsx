/*  ↳  src/pages/Auth/Register/StepPayment.jsx  */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegister } from "./RegisterContext";        // ← dein Context

export default function StepPayment() {
  /* ---------- globaler Wizard-State ---------- */
  const { data, update } = useRegister();      //  !!!  update kommt aus Context
  const nav = useNavigate();

  /* ---------- lokaler UI-State ---------- */
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------- Abschicken ---------- */
  const finish = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      /* Payload bauen – ALLE Wizard-Daten kommen mit */
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => fd.append(k, v));

      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error(await res.text());

      alert("Registrierung erfolgreich – bitte einloggen.");
      nav("/login", { replace: true });
    } catch (e) {
      setErr(e.message || "Serverfehler");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">
        Schritt 4 / 4 – Zahlung&nbsp;&amp;&nbsp;Abschluss
      </h2>

      {err && <p className="text-red-600 mb-2">{err}</p>}

      <form onSubmit={finish} className="space-y-4">
        {/* -------- Zahlungsmethode -------- */}
        <select
          value={data.payType}
          onChange={(e) => update({ payType: e.target.value })}
          className="w-full border p-2 rounded"
        >
          <option value="card">Kreditkarte</option>
          <option value="sepa">SEPA-Lastschrift</option>
          <option value="paypal">PayPal</option>
        </select>

        {/* -------- Kreditkarte -------- */}
        {data.payType === "card" && (
          <>
            <input
              placeholder="Kartennummer"
              value={data.cardNo || ""}
              onChange={(e) => update({ cardNo: e.target.value })}
              className="w-full border p-2 rounded"
              inputMode="numeric"
              maxLength={19}
              required
            />
            <input
              placeholder="MM/YY"
              value={data.cardExp || ""}
              onChange={(e) => update({ cardExp: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
            <input
              placeholder="CVC"
              value={data.cardCvc || ""}
              onChange={(e) => update({ cardCvc: e.target.value })}
              className="w-full border p-2 rounded"
              inputMode="numeric"
              maxLength={4}
              required
            />
          </>
        )}

        {/* -------- SEPA -------- */}
        {data.payType === "sepa" && (
          <>
            <input
              placeholder="IBAN"
              value={data.iban || ""}
              onChange={(e) => update({ iban: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
            <input
              placeholder="BIC"
              value={data.bic || ""}
              onChange={(e) => update({ bic: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
          </>
        )}

        {/* -------- PayPal -------- */}
        {data.payType === "paypal" && (
          <p className="text-sm text-gray-500">
            Nach Klick auf&nbsp;<strong>Registrieren</strong> wirst du zu PayPal
            weitergeleitet.
          </p>
        )}

        {/* -------- Buttons -------- */}
        <div className="flex justify-between gap-4">
          <button
            type="button"
            onClick={() => nav(-1)}
            className="flex-1 bg-gray-300 py-2 rounded"
          >
            Zurück
          </button>

          <button
            disabled={loading}
            className="flex-1 bg-green-600 text-white py-2 rounded"
          >
            {loading ? "Sende …" : "Registrieren"}
          </button>
        </div>
      </form>
    </>
  );
}
