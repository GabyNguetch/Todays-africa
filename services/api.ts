// services/api.ts
import axios from 'axios';

// L'URL de base de votre API déployée sur Render (fonctionnel)
const API_BASE_URL = 'https://totayafrica.onrender.com/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use(
  (config) => {
    // S'assure que le code ne s'exécute que côté client
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('tody_token'); // Nous allons stocker le token ici
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;