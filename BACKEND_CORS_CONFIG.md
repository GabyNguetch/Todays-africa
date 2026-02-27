# 🔒 Configuration CORS Backend (Java Spring Boot)

## Problème
Le backend retourne une erreur 403 pour les requêtes OPTIONS (preflight CORS) depuis Vercel.

## Solution : Configuration CORS dans le backend Java

### Fichier : `src/main/java/com/todaysafrica/config/CorsConfig.java`

```java
package com.todaysafrica.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Autoriser les credentials (cookies, headers d'authentification)
        config.setAllowCredentials(true);
        
        // Origines autorisées
        config.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",           // Développement local
            "https://todays-africa.vercel.app", // Production Vercel
            "https://*.vercel.app"              // Tous les déploiements preview Vercel
        ));
        
        // Headers autorisés
        config.setAllowedHeaders(Arrays.asList(
            "Origin",
            "Content-Type",
            "Accept",
            "Authorization",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers"
        ));
        
        // Méthodes HTTP autorisées
        config.setAllowedMethods(Arrays.asList(
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS"
        ));
        
        // Headers exposés au client
        config.setExposedHeaders(Arrays.asList(
            "Authorization",
            "Content-Disposition"
        ));
        
        // Durée de cache du preflight (en secondes)
        config.setMaxAge(3600L);
        
        // Appliquer la configuration à tous les endpoints
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
}
```

### Alternative : Configuration dans `application.properties`

```properties
# CORS Configuration
spring.web.cors.allowed-origins=http://localhost:3000,https://todays-africa.vercel.app,https://*.vercel.app
spring.web.cors.allowed-methods=GET,POST,PUT,PATCH,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true
spring.web.cors.max-age=3600
```

### Vérification après déploiement

```bash
# Test CORS preflight
curl -I -X OPTIONS https://totayafrica.onrender.com/api/v1/public/articles \
  -H "Origin: https://todays-africa.vercel.app" \
  -H "Access-Control-Request-Method: GET"

# Réponse attendue :
# HTTP/2 200
# access-control-allow-origin: https://todays-africa.vercel.app
# access-control-allow-methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
# access-control-allow-credentials: true
```

## Checklist de déploiement

### Backend (Render.com)
- [ ] Ajouter la configuration CORS
- [ ] Redéployer le backend
- [ ] Vérifier les logs pour les erreurs CORS
- [ ] Tester avec curl

### Frontend (Vercel)
- [ ] Ajouter la variable d'environnement `NEXT_PUBLIC_API_URL`
- [ ] Commit et push les changements
- [ ] Vérifier le déploiement automatique
- [ ] Tester les routes dynamiques

## Dépannage

### Erreur : "CORS policy: No 'Access-Control-Allow-Origin' header"
➡️ Le backend n'a pas la configuration CORS ou l'origine n'est pas autorisée

### Erreur : "CORS policy: Response to preflight request doesn't pass"
➡️ Le backend ne répond pas correctement aux requêtes OPTIONS

### Erreur : 404 sur les routes dynamiques
➡️ Vérifier que `NEXT_PUBLIC_API_URL` est bien configuré dans Vercel

### Erreur : Les données ne se chargent pas
➡️ Ouvrir la console du navigateur et vérifier les erreurs réseau
