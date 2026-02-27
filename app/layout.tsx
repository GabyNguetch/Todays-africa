import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CacheManager } from "@/components/CacheManager";

export const metadata: Metadata = {
  title: "TODAYS Africa",
  description: "Bienvenue sur l'espace contributeur, votre voix est essentielle pour éclairer, informer et façonner l'avenir de l'Afrique.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <CacheManager />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
