"use client";

import React, { useState } from "react";
import { UserPlus, CheckCircle, AlertTriangle } from "lucide-react";
import { authService } from "@/services/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function CreateRedacteur() {
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    motDePasse: ""
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
        await authService.createRedacteur(formData);
        setStatus("success");
        setFormData({ prenom: "", nom: "", email: "", motDePasse: "" }); // Reset form
    } catch (error: any) {
        setStatus("error");
        setErrorMessage(error.message || "Erreur lors de la création.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
                <UserPlus className="text-[#3E7B52] dark:text-[#13EC13]" />
                Créer un Compte Rédacteur
            </h2>
            <p className="text-gray-500 dark:text-zinc-400 text-sm mt-2">
                Ajoutez un membre à votre équipe éditoriale. Un email de confirmation sera envoyé.
            </p>
        </div>

        {status === "success" && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-center gap-2">
                <CheckCircle size={20} /> Compte Rédacteur créé avec succès !
            </div>
        )}

        {status === "error" && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-center gap-2">
                <AlertTriangle size={20} /> {errorMessage}
            </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-8 rounded-xl shadow-sm space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <Input 
                    name="prenom" 
                    label="Prénom" 
                    placeholder="Ex: Amadou" 
                    value={formData.prenom} 
                    onChange={handleChange} 
                    required 
                    className="dark:bg-zinc-950 dark:border-zinc-700 dark:text-white"
                />
                <Input 
                    name="nom" 
                    label="Nom" 
                    placeholder="Ex: Diallo" 
                    value={formData.nom} 
                    onChange={handleChange} 
                    required 
                    className="dark:bg-zinc-950 dark:border-zinc-700 dark:text-white"
                />
            </div>
            
            <Input 
                name="email" 
                type="email" 
                label="Email Professionnel" 
                placeholder="redacteur@todaysafrica.com" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                className="dark:bg-zinc-950 dark:border-zinc-700 dark:text-white"
            />

            <Input 
                name="motDePasse" 
                type="password" 
                label="Mot de passe provisoire" 
                placeholder="••••••••" 
                value={formData.motDePasse} 
                onChange={handleChange} 
                required 
                className="dark:bg-zinc-950 dark:border-zinc-700 dark:text-white"
            />

            <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={status === "loading"} className="w-auto px-8 font-bold bg-[#3E7B52] hover:bg-[#326342]">
                    {status === "loading" ? "Création en cours..." : "Créer le rédacteur"}
                </Button>
            </div>
        </form>
    </div>
  );
}