// FICHIER: services/auth.ts
import { APP_CONFIG } from "@/lib/constant";

// Clés de stockage
export const STORAGE_KEY_TOKEN = "tody_jwt_token";
export const STORAGE_KEY_USER = "tody_user_details";

// Structure de réponse du Backend (cf. ta spec)
interface LoginResponseBackend {
  token: string;
  userId: number; // Important: Le backend renvoie 'userId'
  email: string;
  nom: string;
  prenom: string;
  role: "SUPER_ADMIN" | "ADMIN" | "REDACTEUR" | "USER";
  actif: boolean;
  message: string;
}

// Structure Utilisateur dans notre App Frontend
export interface User {
  id: number;      // On standardise en 'id'
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "REDACTEUR" | "USER";
  nom: string;
  prenom: string;
  fullName: string;
}

interface RegisterRequest {
  email: string;
  motDePasse: string;
  nom?: string;
  prenom?: string;
}

export const authService = {
  // === INSCRIPTION (USER) ===
  register: async (data: RegisterRequest): Promise<any> => {
    console.log("🔐 [AuthService] Inscription...");
    const response = await fetch(`${APP_CONFIG.apiUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || "Échec de l'inscription");
    }
    return await response.json();
  },

  // === CONNEXION CORRIGÉE ET FIABILISÉE ===
  login: async (email: string, motDePasse: string): Promise<User> => {
    console.group("🔐 [AuthService] Login Request");
    console.log("Credentials:", { email });

    const response = await fetch(`${APP_CONFIG.apiUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, motDePasse }),
    });

    if (!response.ok) {
      console.error("Erreur Backend Login:", response.status);
      console.groupEnd();
      throw new Error("Identifiants incorrects ou compte inactif");
    }

    const data: LoginResponseBackend = await response.json();
    console.log("📥 Payload Backend Reçu:", data);

    // MAPPING Backend -> Frontend
    const user: User = { 
        id: data.userId, // Mapping userId -> id
        email: data.email, 
        role: data.role,
        nom: data.nom,
        prenom: data.prenom,
        fullName: `${data.prenom} ${data.nom}`
    };

    // Persistence immédiate
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_TOKEN, data.token);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      console.log("✅ Token et User stockés en LocalStorage");
    }
    
    console.groupEnd();
    return user;
  },
  
  createRedacteur: async (data: RegisterRequest): Promise<void> => {
    const token = localStorage.getItem(STORAGE_KEY_TOKEN);
    if (!token) throw new Error("Non autorisé");

    const response = await fetch(`${APP_CONFIG.apiUrl}/auth/admin/create-redacteur`, {
      method: "POST",
      headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Erreur création rédacteur");
  },

  logout: () => {
    console.log("🚪 [AuthService] Logout triggered");
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY_TOKEN);
      localStorage.removeItem(STORAGE_KEY_USER);
      // Redirection brute
      window.location.href = "/login";
    }
  },

  // Utilitaires rapides (hors context)
  getToken: (): string | null => {
    if (typeof window !== "undefined") return localStorage.getItem(STORAGE_KEY_TOKEN);
    return null;
  },
  
  getUserFromStorage: (): User | null => {
    if (typeof window !== "undefined") {
      const str = localStorage.getItem(STORAGE_KEY_USER);
      try {
        return str ? JSON.parse(str) : null;
      } catch { return null; }
    }
    return null;
  },
    // 🔥 IMPORTANT: Alias pour la compatibilité avec l'ancien code qui appelle getUser()
  getUser: (): User | null => {
    return authService.getUserFromStorage();
  }
};