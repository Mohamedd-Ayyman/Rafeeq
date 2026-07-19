"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GlowButton from "@/components/GlowButton";
import { useAuth } from "@/context/AuthContext";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const root = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".aurora-blob", {
        scale: 0.6,
        opacity: 0,
        duration: 2,
        stagger: 0.3,
        ease: "power2.out",
      });
      gsap.utils.toArray(".story").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 80%" },
          y: 60,
          opacity: 0,
          duration: 1,
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={root} className="min-h-screen relative overflow-hidden">
      <div className="aurora absolute inset-0 -z-10" />
      <div className="aurora-blob absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-400/30 blur-3xl" />
      <div className="aurora-blob absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-[#f5c451]/20 blur-3xl" />

      <header className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <div className="text-2xl font-bold tracking-tight">Rafeeq · رفيق</div>
        <div className="flex gap-3">
          {user ? (
            <GlowButton onClick={() => router.push("/journey")}>Open App</GlowButton>
          ) : (
            <>
              <Link href="/login">
                <GlowButton variant="ghost">Login</GlowButton>
              </Link>
              <Link href="/register">
                <GlowButton>Get Started</GlowButton>
              </Link>
            </>
          )}
        </div>
      </header>

      <section className="text-center px-6 pt-16 pb-24 max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-[#f5c451] bg-clip-text text-transparent">
          A faithful companion for your worship
        </h1>
        <p className="mt-6 text-lg opacity-80">
          Track prayers, recite the Qur&apos;an, build dhikr streaks, and grow together with
          buddies — all in one serene space.
        </p>
        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <Link href="/register">
            <GlowButton className="text-lg">Begin your journey</GlowButton>
          </Link>
          <Link href="/login">
            <GlowButton variant="ghost" className="text-lg">I already have an account</GlowButton>
          </Link>
        </div>
      </section>

      <section className="px-6 max-w-5xl mx-auto grid md:grid-cols-3 gap-6 pb-32">
        {[
          { t: "Prayer & Streaks", d: "Log every salah and watch your consistency flame grow." },
          { t: "Qur'an & Dhikr", d: "Track recitation and remembrance with gentle reminders." },
          { t: "Buddies & Challenges", d: "Stay accountable with friends and community goals." },
        ].map((c) => (
          <div key={c.t} className="story glass rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-2">{c.t}</h3>
            <p className="opacity-75">{c.d}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
