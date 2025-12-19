"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Globe, AlertCircle } from "lucide-react"; // Ajout AlertCircle
import { APP_CONFIG, LOGIN_TEXT } from "@/lib/constant";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Composant SVG Google (inchangé)
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" />
    <path fill="#EA4335" d="M12 4.81c1.6 0 3.03.55 4.15 1.62l3.11-3.11C17.45 1.51 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const router = useRouter();
    // On utilise le context
  const { login } = useAuth(); 
  
  // États formulaire
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Ajout champs pour inscription
  const [firstName, setFirstName] = useState(""); 
  const [lastName, setLastName] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
        if (activeTab === 'login') {
            // ✅ Utilisation du Context Login (gère la redirection interne)
            await login(email, password); 
        } else {
            // Register reste dans le service direct car pas de maj du state User immediat
            await authService.register({
                email,
                motDePasse: password,
                prenom: firstName,
                nom: lastName
            });
            alert("Compte créé avec succès ! Connectez-vous maintenant.");
            setActiveTab("login");
        }
    } catch (err: any) {
        setErrorMessage(err.message || "Une erreur est survenue");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full font-sans bg-white dark:bg-[#0a0a0a]">
      {/* COLONNE GAUCHE (inchangée) */}
      <div className="hidden lg:flex w-[45%] flex-col justify-between px-16 py-12 relative bg-[#F9F9F7] dark:bg-zinc-900 dark:border-r dark:border-zinc-800">
        <div className="flex items-center gap-3 font-bold text-lg tracking-wider text-[#111] dark:text-gray-100">
           <Globe className="w-6 h-6 text-black dark:text-white" strokeWidth={2.5} /> 
           {APP_CONFIG.name}
        </div>
        <div className="flex flex-col gap-6 max-w-lg">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.15]">
            {LOGIN_TEXT.header.leftTitle}
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 font-normal leading-relaxed">
            {LOGIN_TEXT.header.leftSubtitle}
          </p>
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-600 font-medium">
          {LOGIN_TEXT.header.footer}
        </p>
      </div>

      {/* COLONNE DROITE */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-8 bg-white dark:bg-[#0a0a0a]">
        <div className="w-full max-w-[420px] flex flex-col gap-8">
          
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              {activeTab === "login" ? LOGIN_TEXT.form.title : "Créer un compte lecteur"}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-[15px]">
              {LOGIN_TEXT.form.subtitle}
            </p>
          </div>

          {/* Affichage des erreurs */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm flex items-center gap-2 border border-red-100 animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={16} /> {errorMessage}
            </div>
          )}

          <div className="bg-[#F7F7F5] dark:bg-zinc-800 p-1.5 rounded-xl flex gap-1">
            <button
              onClick={() => { setActiveTab("login"); setErrorMessage(null); }}
              className={cn(
                "flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200",
                activeTab === "login"
                  ? "bg-[#3E7B52] text-white shadow-md"
                  : "bg-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              )}
            >
              Connexion
            </button>
            <button
              onClick={() => { setActiveTab("register"); setErrorMessage(null); }}
              className={cn(
                "flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200",
                activeTab === "register"
                  ? "bg-[#3E7B52] text-white shadow-md"
                  : "bg-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              )}
            >
              Inscription
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {activeTab === "register" && (
                <div className="flex gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Input 
                        label="Prénom"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required={activeTab === 'register'}
                        className="dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
                    />
                    <Input 
                        label="Nom"
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required={activeTab === 'register'}
                        className="dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
                    />
                </div>
            )}

            <Input 
              label="Email"
              placeholder={LOGIN_TEXT.form.emailPlaceholder}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
            />
            
            <div className="space-y-4">
              <Input
                label="Mot de passe"
                placeholder={LOGIN_TEXT.form.passwordPlaceholder}
                type={showPassword ? "text" : "password"}
                rightIcon={showPassword ? <EyeOff size={18} className="dark:text-gray-400" /> : <Eye size={18} className="dark:text-gray-400" />}
                onRightIconClick={() => setShowPassword(!showPassword)}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                 className="dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
              />

              {activeTab === "login" && (
                <div className="flex justify-end pt-1">
                  <Link href="#" className="text-xs font-semibold text-[#3E7B52] hover:underline">
                    {LOGIN_TEXT.form.forgotPassword}
                  </Link>
                </div>
              )}
            </div>

            <Button type="submit" disabled={isLoading} className="mt-4 text-[15px]">
              {isLoading ? "Traitement..." : (activeTab === "login" ? "Se connecter" : "S'inscrire")}
            </Button>
          </form>

           {/* Séparateur et Google */}
           <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-100 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-[#0a0a0a] px-3 text-gray-400 font-medium tracking-wide">
                OU
              </span>
            </div>
          </div>
           <Button variant="outline" className="font-semibold text-gray-700 h-[50px] dark:bg-transparent dark:border-zinc-700 dark:text-gray-300">
            <GoogleIcon />
            {activeTab === 'login' ? 'Se connecter avec Google' : 'S\'inscrire avec Google'}
          </Button>

        </div>
      </div>
    </div>
  );
}