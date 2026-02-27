# 🌍 Système de Traduction - Documentation

## Problème identifié
Le sélecteur de langue dans le header ne fonctionnait pas car il ne faisait que changer l'état local sans implémenter réellement la traduction.

## Solution implémentée

### 1. Intégration de Google Translate
**Fichier**: `app/layout.tsx`
- Ajout du script Google Translate dans le `<head>`
- Configuration pour 5 langues : Français, Anglais, Espagnol, Russe, Arabe
- Element caché pour éviter l'affichage de la barre Google Translate

### 2. Fonction de changement de langue
**Fichier**: `components/layout/Navbar.tsx`

La fonction `handleLanguageChange` fait maintenant :
1. ✅ Change l'état local de la langue
2. ✅ Sauvegarde la langue dans `localStorage`
3. ✅ Active Google Translate pour traduire la page
4. ✅ Fallback : recharge la page avec paramètre `?lang=xx`

### 3. Persistance de la langue
- La langue choisie est sauvegardée dans `localStorage`
- Au rechargement de la page, la langue est restaurée automatiquement

### 4. Styles personnalisés
**Fichier**: `app/google-translate.css`
- Masque la barre Google Translate par défaut
- Masque le logo Google
- Évite le décalage du body

## Langues supportées

| Code | Langue | Drapeau |
|------|--------|---------|
| `fr` | Français | 🇫🇷 |
| `en` | English | 🇬🇧 |
| `es` | Español | 🇪🇸 |
| `ru` | Русский | 🇷🇺 |
| `ar` | العربية | 🇸🇦 |

## Utilisation

### Pour l'utilisateur
1. Cliquer sur le sélecteur de langue dans le header
2. Choisir une langue
3. La page se traduit automatiquement
4. La langue est mémorisée pour les prochaines visites

### Pour le développeur

#### Ajouter une nouvelle langue
1. Modifier `components/layout/Navbar.tsx` :
```typescript
const LANGUAGES: { code: Language; name: string; flag: string }[] = [
  // ... langues existantes
  { code: "pt", name: "Português", flag: "🇵🇹" },
];
```

2. Modifier `app/layout.tsx` :
```javascript
includedLanguages: 'fr,en,es,ru,ar,pt',
```

3. Mettre à jour le type `Language` :
```typescript
type Language = "fr" | "en" | "es" | "ru" | "ar" | "pt";
```

## Limitations de Google Translate

### Avantages
- ✅ Gratuit
- ✅ Supporte 100+ langues
- ✅ Traduction automatique instantanée
- ✅ Pas de configuration backend nécessaire

### Inconvénients
- ⚠️ Qualité de traduction variable
- ⚠️ Peut casser certains styles CSS
- ⚠️ Ajoute des attributs aux éléments HTML
- ⚠️ Nécessite une connexion internet

## Alternative : i18n natif

Pour une meilleure qualité, considérez `next-intl` :

```bash
npm install next-intl
```

### Configuration next-intl
```typescript
// i18n.ts
import {getRequestConfig} from 'next-intl/server';
 
export default getRequestConfig(async ({locale}) => ({
  messages: (await import(`./messages/${locale}.json`)).default
}));
```

### Fichiers de traduction
```json
// messages/fr.json
{
  "home": {
    "title": "Bienvenue sur Today's Africa",
    "description": "L'actualité africaine"
  }
}

// messages/en.json
{
  "home": {
    "title": "Welcome to Today's Africa",
    "description": "African news"
  }
}
```

## Test de la traduction

### En développement
```bash
npm run dev
```
1. Ouvrir http://localhost:3000
2. Cliquer sur le sélecteur de langue
3. Choisir une langue
4. Vérifier que le contenu se traduit

### En production
1. Déployer sur Vercel
2. Tester sur https://todays-africa.vercel.app
3. Vérifier la persistance après rechargement

## Dépannage

### La traduction ne fonctionne pas
1. Vérifier que le script Google Translate est chargé :
```javascript
console.log(window.google?.translate);
```

2. Vérifier la console pour les erreurs

3. Vérifier que l'élément `#google_translate_element` existe

### La barre Google Translate apparaît
Vérifier que `google-translate.css` est bien importé dans `layout.tsx`

### La langue n'est pas sauvegardée
Vérifier le localStorage :
```javascript
localStorage.getItem('preferred_language');
```

## Build Status
✅ Build réussi
✅ Traduction fonctionnelle
✅ Persistance activée

---
**Date**: 27 février 2026
**Status**: ✅ IMPLÉMENTÉ
