"use client";

export default function GlowButton({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
}) {
  const base =
    "rounded-xl px-5 py-2.5 font-semibold transition-all duration-300 focus:outline-none disabled:opacity-50";
  const variants = {
    primary:
      "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-[0_0_24px_rgba(16,185,129,0.55)]",
    gold: "bg-gradient-to-r from-[#f5c451] to-amber-400 text-emerald-950 hover:shadow-[0_0_24px_rgba(245,196,81,0.6)]",
    ghost: "bg-white/10 text-current hover:bg-white/20 border border-white/20",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
