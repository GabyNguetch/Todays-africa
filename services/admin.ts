// services/admin.ts
import { APP_CONFIG } from "@/lib/constant";
import { authService } from "./auth";

const API_BASE = APP_CONFIG.apiUrl; // Utilise /api/proxy

export const AdminService = {
   /**
   * RÉCUPÉRER TOUS LES UTILISATEURS (Lecteurs + Staff)
   */
  getAllUsers: async (): Promise<any[]> => {
    const token = authService.getToken();
    const url = `${API_BASE}/utilisateurs/all`;
    
    console.group("🔍 [API REQUEST] AdminService.getAllUsers");
    console.log("URL:", url);
    console.groupEnd();

    try {
      const res = await fetch(url, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
      
      const data = await res.json();
      console.group("✅ [API RESPONSE] AdminService.getAllUsers");
      console.log("Payload:", data);
      console.groupEnd();
      
      return data;
    } catch (e) {
      console.error("❌ [API ERROR] AdminService.getAllUsers", e);
      return [];
    }
  },

  /**
   * RÉCUPÉRER L'ÉQUIPE (REDACTEUR, ADMIN)
   */
  getAllRedacteurs: async (): Promise<any[]> => {
    const token = authService.getToken();
    const url = `${API_BASE}/utilisateurs/redacteurs`;

    console.group("🔍 [API REQUEST] AdminService.getAllRedacteurs");
    console.log("URL:", url);
    console.groupEnd();

    try {
      const res = await fetch(url, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);

      const data = await res.json();
      console.group("✅ [API RESPONSE] AdminService.getAllRedacteurs");
      console.log("Payload:", data);
      console.groupEnd();

      return data;
    } catch (e) {
      console.error("❌ [API ERROR] AdminService.getAllRedacteurs", e);
      return [];
    }
  },

  /**
   * STATISTIQUES RÉELLES D'UN RÉDACTEUR
   * Backend : GET /api/v1/articles/author/{id}/stats
   */
  getAuthorStats: async (authorId: number): Promise<any> => {
    const token = authService.getToken();
    try {
      const res = await fetch(`${API_BASE}/articles/author/${authorId}/stats`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) return null;
      return await res.json();
      // Le backend renvoie souvent : { totalArticles: 10, totalVues: 500, etc. }
    } catch (e) {
      return null;
    }
  }
};