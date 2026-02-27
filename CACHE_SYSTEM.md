# Système de Cache LocalStorage - Today's Africa

## 📋 Vue d'ensemble

Le système de cache optimise les performances en stockant temporairement les données dans le localStorage du navigateur, réduisant ainsi les appels API répétitifs.

## 🎯 Fonctionnalités

### ✅ Ce qui est mis en cache

1. **Rubriques** (10 minutes)
   - Liste complète des catégories
   - Utilisé dans la navigation

2. **Articles par rubrique** (5 minutes)
   - Articles filtrés par catégorie
   - Utilisé dans les pages catégories

3. **Articles tendance** (3 minutes)
   - Articles mis en avant
   - Utilisé sur la page d'accueil

4. **Pages d'articles** (5 minutes)
   - Pagination des articles
   - Utilisé pour le flux principal

5. **Articles individuels** (10 minutes)
   - Détails complets d'un article
   - Utilisé sur les pages article/[id]

### 🔄 Invalidation automatique

Le cache est automatiquement invalidé lors de:
- Création d'un nouvel article
- Modification d'un article existant
- Suppression d'un article
- Publication/dépublication

## 🛠️ Utilisation

### Service de cache direct

```typescript
import { CacheService } from "@/lib/cache";

// Sauvegarder
CacheService.set("ma_cle", donnees, 5 * 60 * 1000); // 5 minutes

// Récupérer
const donnees = CacheService.get("ma_cle");

// Supprimer
CacheService.remove("ma_cle");

// Nettoyer tout
CacheService.clear();
```

### Hook React personnalisé

```typescript
import { useCache } from "@/lib/hooks/useCache";

function MonComposant() {
  const { data, loading, error, refetch } = useCache({
    key: "articles",
    fetcher: () => PublicService.getAllArticles(),
    duration: 5 * 60 * 1000
  });

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error.message}</div>;
  
  return <div>{/* Utiliser data */}</div>;
}
```

### Services publics (automatique)

Les services `PublicService` et `ArticleService` utilisent automatiquement le cache:

```typescript
// Utilise le cache automatiquement
const articles = await PublicService.getAllArticles();
const rubriques = await PublicService.getRubriques();
const article = await PublicService.getById(123);
```

## 📊 Avantages

1. **Performance** ⚡
   - Réduction de 70-90% des appels API
   - Chargement instantané des pages visitées
   - Meilleure expérience utilisateur

2. **Économie de bande passante** 💾
   - Moins de données transférées
   - Réduction de la charge serveur

3. **Mode hors ligne partiel** 🔌
   - Données disponibles même sans connexion
   - Affichage des contenus récemment consultés

## ⚙️ Configuration

### Durées de cache par défaut

```typescript
// lib/cache.ts
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Durées spécifiques
- Rubriques: 10 minutes
- Articles: 5 minutes
- Tendances: 3 minutes
- Article individuel: 10 minutes
```

### Modifier les durées

```typescript
// Dans le service
CacheService.setRubriques(rubriques, 15 * 60 * 1000); // 15 minutes
```

## 🧹 Nettoyage

### Automatique

- Au démarrage de l'application
- Toutes les 5 minutes (nettoyage des entrées expirées)
- Lors de modifications d'articles

### Manuel

```typescript
// Nettoyer tout le cache
CacheService.clear();

// Nettoyer les entrées expirées
CacheService.cleanExpired();

// Invalider un article spécifique
CacheService.invalidateArticle(123);

// Invalider une rubrique
CacheService.invalidateRubrique(456);
```

## 🔍 Débogage

Les logs de cache sont visibles dans la console:

```
💾 [getRubriques] Chargé depuis cache
📡 [getAllArticles] Chargement depuis API...
✅ 12 articles chargés
🧹 Cache nettoyé au démarrage
```

## ⚠️ Limitations

1. **Taille du localStorage**: ~5-10MB selon le navigateur
2. **Données sensibles**: Ne jamais cacher de données sensibles
3. **Navigation privée**: Le cache peut être désactivé
4. **Multi-onglets**: Le cache est partagé entre onglets

## 🚀 Optimisations futures

- [ ] Compression des données en cache
- [ ] Cache IndexedDB pour volumes importants
- [ ] Stratégie de cache stale-while-revalidate
- [ ] Préchargement intelligent des pages
- [ ] Synchronisation multi-onglets

## 📝 Notes techniques

- Préfixe des clés: `todays_africa_`
- Format: JSON stringifié avec métadonnées
- Nettoyage: Automatique et manuel
- Compatibilité: Tous navigateurs modernes
