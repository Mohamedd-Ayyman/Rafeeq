import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Rafeeq · رفيق",
  description:
    "A premium Islamic worship-companion — pray, recite, remember, and grow with a faithful buddy by your side.",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
