import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden min-h-[90vh] flex flex-col items-center justify-center text-center px-6">
      {/* Gradient-Hintergrund */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-start via-brand-mid to-brand-end opacity-80" />

      {/* Glas-Card */}
      <div className="backdrop-blur-sm bg-white/10 rounded-3xl p-8 shadow-xl">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-lg">
          MoveSmart&nbsp;<span className="text-cyan-200">.mobil</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg md:text-2xl text-white/90">
          Deine flexible Car-Sharing-Lösung – ohne Stress, ohne Bindung, jederzeit.
        </p>

        {/* ► Buttons ◄ */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          {/* 1. Button → Registrierungs-Wizard */}
          <Link to="/register" className="btn-primary">
            Jetzt registrieren
          </Link>

          {/* 2. Button → Tarif-Seite */}
          <Link to="/rates" className="btn-ghost">
            Unsere Tarife
          </Link>
        </div>
      </div>
    </section>
  );
}