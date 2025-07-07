import Hero from "../components/Hero";

export default function LandingPage() {
  return (
    <main className="flex flex-col">
      <Hero />          {/* 1. Sektion – Hero */}
      {/* TODO: <Benefits />, <HowItWorks />, <Pricing />, <Testimonials /> */}
    </main>
  );
}