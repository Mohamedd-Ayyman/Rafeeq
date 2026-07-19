"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";

const NAV = [
  { href: "/journey", label: "Journey" },
  { href: "/prayer", label: "Prayer" },
  { href: "/quran", label: "Quran" },
  { href: "/dhikr", label: "Dhikr" },
  { href: "/assistant", label: "Assistant" },
  { href: "/wheel", label: "Wheel" },
  { href: "/challenges", label: "Challenges" },
  { href: "/buddy", label: "Buddy" },
  { href: "/achievements", label: "Achievements" },
  { href: "/statistics", label: "Stats" },
  { href: "/profile", label: "Profile" },
  { href: "/settings", label: "Settings" },
];

export default function FloatingNav() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { notify } = useNotification();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    notify("Logged out", "info");
    router.replace("/login");
  };

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 glass rounded-full px-2 py-2 flex gap-1 overflow-x-auto max-w-[95vw] glow">
      {NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`px-3 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
            pathname === item.href
              ? "bg-emerald-500 text-white"
              : "hover:bg-white/10"
          }`}
        >
          {item.label}
        </Link>
      ))}
      <button
        onClick={handleLogout}
        className="px-3 py-2 rounded-full text-sm whitespace-nowrap hover:bg-red-500/20 text-red-300"
      >
        Exit
      </button>
    </nav>
  );
}
