"use client";

export default function GlassCard({ children, className = "", glow = false }) {
  return (
    <div className={`glass rounded-2xl p-5 ${glow ? "glow" : ""} ${className}`}>
      {children}
    </div>
  );
}
