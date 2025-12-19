// FICHIER: context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, authService } from "@/services/auth";
import { useRouter } from "next/navigation";

// Définition de ce que le contexte expose aux composants
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, mdp: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 1. Restauration de la session au chargement de l'application
  useEffect(() => {
    const initializeAuth = () => {
      console.log("🔄 [AuthContext] Initialisation...");
      const storedUser = authService.getUserFromStorage();
      const token = authService.getToken();

      if (token && storedUser && storedUser.id) {
        console.log(`✅ [AuthContext] Utilisateur restauré: ${storedUser.fullName} (ID: ${storedUser.id})`);
        setUser(storedUser);
      } else {
        console.log("ℹ️ [AuthContext] Pas de session active");
        setUser(null);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // 2. Fonction Login wrappée
  const login = async (email: string, mdp: string) => {
    setIsLoading(true);
    try {
      const userDatas = await authService.login(email, mdp);
      setUser(userDatas); // Met à jour l'état global React
      
      // Redirection selon rôle
      if(['SUPER_ADMIN','ADMIN','REDACTEUR'].includes(userDatas.role)) {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("❌ [AuthContext] Login Failed", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Fonction Logout wrappée
  const logout = () => {
    authService.logout();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour consommer le context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un <AuthProvider>");
  }
  return context;
};