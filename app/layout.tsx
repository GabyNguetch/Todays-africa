import type { Metadata } from "next";
import "./globals.css";
import "./google-translate.css";
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
      <head>
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                new google.translate.TranslateElement(
                  {
                    pageLanguage: 'fr',
                    includedLanguages: 'fr,en,es,ru,ar',
                    layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                    autoDisplay: false
                  },
                  'google_translate_element'
                );
              }
            `,
          }}
        />
        <script
          type="text/javascript"
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          async
        />
      </head>
      <body className="antialiased">
        <div id="google_translate_element" style={{ display: 'none' }}></div>
        <AuthProvider>
          <CacheManager />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
