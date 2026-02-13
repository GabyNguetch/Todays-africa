import { 
  Globe, 
  TrendingUp, 
  Landmark, 
  Scale, 
  Sprout, 
  GraduationCap, 
  ShieldPlus, 
  Cpu 
} from "lucide-react";



export const APP_CONFIG = {
  name: "TODAY'S AFRICA INTERCULTURAL CONSULTING GROUP",
  year: 2025,
  // ✅ CORRECTION : Utilisation du proxy local Next.js
  
  apiUrl: "api/proxy",
  backendUrl: "https://totayafrica.onrender.com/api/v1", 
  mediaBaseUrl: "https://totayafrica.onrender.com/api/v1/media/", 
};

// types/partner.ts
export interface Partner {
  id: string;
  name: string;
  logo: string;
  description: string;
  website: string;
  category?: string;
}

export const PARTNERS_DATA: Partner[] = [
  {
    id: "scdp",
    name: "SCDP",
    logo: "/partners/scdp-logo.png",
    description: "Société Camerounaise de Distribution et de Production - Leader dans la distribution et la logistique en Afrique Centrale.",
    website: "https://www.scdp.cm",
    category: "Distribution & Logistique"
  },
  {
    id: "prestige-hotel",
    name: "Prestige Hotel Yaoundé",
    logo: "/partners/prestige-hotel-logo.png",
    description: "Hôtel de luxe situé au cœur de Yaoundé, offrant des services haut de gamme et un cadre exceptionnel pour vos séjours d'affaires et de loisirs.",
    website: "https://www.prestigehotel-yaounde.com",
    category: "Hôtellerie"
  },
  {
    id: "afriland-firstbank",
    name: "Afriland First Bank",
    logo: "/partners/afriland-logo.png",
    description: "Première banque panafricaine, Afriland First Bank accompagne le développement économique du continent avec des solutions financières innovantes.",
    website: "https://www.afrilandfirstbank.com",
    category: "Finance & Banque"
  },
  {
    id: "orange-cameroun",
    name: "Orange Cameroun",
    logo: "/partners/orange-logo.png",
    description: "Opérateur de télécommunications leader au Cameroun, Orange propose des services mobiles, internet et digitaux de qualité.",
    website: "https://www.orange.cm",
    category: "Télécommunications"
  },
  {
    id: "camtel",
    name: "CAMTEL",
    logo: "/partners/camtel-logo.png",
    description: "Cameroon Telecommunications - Opérateur historique des télécommunications au Cameroun, CAMTEL déploie des infrastructures modernes à travers le pays.",
    website: "https://www.camtel.cm",
    category: "Télécommunications"
  },
  {
    id: "total-energies",
    name: "TotalEnergies Cameroun",
    logo: "/partners/total-logo.png",
    description: "Acteur majeur de l'énergie au Cameroun, TotalEnergies fournit des produits pétroliers et développe des solutions énergétiques durables.",
    website: "https://www.totalenergies.cm",
    category: "Énergie"
  },
  {
    id: "douala-port",
    name: "Port Autonome de Douala",
    logo: "/partners/pad-logo.png",
    description: "Principal port maritime du Cameroun et de la sous-région CEMAC, le PAD est une plateforme logistique stratégique pour le commerce international.",
    website: "https://www.pad-douala.org",
    category: "Transport & Logistique"
  }
];

export const COLORS = {
  primaryLight: "#13EC13",
  primaryDK: "#3E7B52",
  backgroundBeige: "#F9F9F7",
  textDark: "#111111",
  textGray: "#666666",
};

export const LOGIN_TEXT = {
  header: {
    logoAlt: "Logo Today's Africa",
    leftTitle: "Bienvenue sur l'espace contributeur",
    leftSubtitle: "Votre voix est essentielle pour éclairer, informer et façonner l'avenir de l'Afrique.",
    footer: `© ${APP_CONFIG.year} ${APP_CONFIG.name}. Tous droits réservés.`,
  },
  form: {
    title: "Accès Rédacteurs & Admin",
    subtitle: "Connectez-vous ou créez votre compte",
    tabLogin: "Connexion",
    tabRegister: "Inscription",
    emailLabel: "Adresse e-mail",
    emailPlaceholder: "exemple@todaysafrica.com",
    passwordLabel: "Mot de passe",
    passwordPlaceholder: "Entrez votre mot de passe",
    forgotPassword: "Mot de passe oublié ?",
    submitButton: "Se connecter",
    separator: "OU",
    googleButton: "S'inscrire avec Google",
  },
};

export const HOME_DATA = {
   // Correction ici : Tableau d'objets pour les liens, et non de strings simples
  navLinks: [
    { label: "Gouvernance", slug: "gouvernance" },
    { label: "Économie", slug: "economie" },
    { label: "Politique", slug: "politique" },
    { label: "Développement", slug: "developpement" },
    { label: "Technologie", slug: "technologie" }
  ],
  hero: {
    titlePrefix: "Les Histoires les Plus Importantes qui Façonnent l'Afrique en",
    year: "2025",
    description: "Informations vérifiées et analyses approfondies sur l'économie, la politique et le développement à travers le continent.",
    cta: "Lire l'Article Principal",
  },
  latestNews: [
    {
      id: 1,
      category: "ÉCONOMIE",
      title: "Le Forum Économique Fixe de Nouveaux Objectifs pour le Commerce Ouest-Africain",
      date: "10 juin 2025",
      color: "text-green-600",
      image: "https://images.unsplash.com/photo-1526304640152-d46196bfc4c8?q=80&w=2070&auto=format&fit=crop", // Placeholder image chart
    },
    {
      id: 2,
      category: "POLITIQUE NATIONALE",
      title: "Les Élections Nationales se Concluent avec un Taux de Participation Record",
      date: "10 juin 2025",
      color: "text-green-700",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop", // Placeholder election
    },
    {
      id: 3,
      category: "DÉVELOPPEMENT",
      title: "Les Innovations en Agriculture Durable Stimulent les Communautés Locales",
      date: "9 juin 2025",
      color: "text-emerald-600",
      image: "https://images.unsplash.com/photo-1595813430058-20d089c7081c?q=80&w=1955&auto=format&fit=crop", // Placeholder agri
    },
  ],
  categories: [
    { id: 1, label: "Gouvernance", icon: Landmark },
    { id: 2, label: "Économie", icon: TrendingUp },
    { id: 3, label: "Politique Nationale", icon: Scale }, // Icone proche
    { id: 4, label: "Politique Internationale", icon: Globe },
    { id: 5, label: "Développement", icon: Sprout },
    { id: 6, label: "Éducation", icon: GraduationCap },
    { id: 7, label: "Santé", icon: ShieldPlus },
    { id: 8, label: "Technologie", icon: Cpu },
  ],
  footer: {
    description: "Informations vérifiées pour le continent.",
    sections: ["Économie", "Politique", "Gouvernance", "Développement"],
    about: ["Notre Mission", "Contact", "Conditions d'utilisation"],
  }
};

// Types pour TypeScript
export type ArticleCategory = "economie" | "politique" | "gouvernance" | "developpement" | "technologie" | "sante" | "education";

export interface Article {
  id: string;
  title: string;
  category: string;
  categorySlug: ArticleCategory;
  author: string;
  date: string;
  image: string;
  summary: string;
  content: string[]; // Paragraphes simulés
}

// === BASE DE DONNÉES SIMULÉE ===
export const ARTICLES_DATA: Article[] = [
  // --- ÉCONOMIE ---
  {
    id: "eco-1",
    title: "Le Cameroun signe un nouvel accord commercial historique avec l'UE",
    category: "Économie",
    categorySlug: "economie",
    author: "Jean Dupont",
    date: "15 Oct 2025",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
    summary: "Un tournant décisif pour l'exportation des matières premières, promettant une augmentation de 15% des échanges.",
    content: [
      "La capitale camerounaise a vibré ce matin au rythme des signatures officielles. L'accord de partenariat économique, en discussion depuis trois ans, vient d'être ratifié.",
      "Cet accord prévoit la suppression progressive des barrières douanières pour 80% des exportations camerounaises vers le marché européen. Une aubaine pour les producteurs de cacao et de café.",
      "Cependant, des voix s'élèvent au sein de la société civile pour mettre en garde contre la concurrence potentielle des produits manufacturés européens."
    ]
  },
  {
    id: "eco-2",
    title: "Analyse : L'impact de l'inflation sur les marchés ouest-africains",
    category: "Économie",
    categorySlug: "economie",
    author: "Paul Martin",
    date: "14 Oct 2025",
    image: "https://images.unsplash.com/photo-1628126235206-526058b884ce?q=80&w=2070&auto=format&fit=crop",
    summary: "Alors que le Franc CFA subit des fluctuations, le panier de la ménagère à Dakar et Abidjan en ressent les effets.",
    content: ["Le coût de la vie a augmenté de 4% en moyenne...", "Les solutions proposées par la BCEAO..."]
  },
  {
    id: "eco-3",
    title: "Investissements étrangers : tendances et prévisions 2026",
    category: "Économie",
    categorySlug: "economie",
    author: "Fatou N'diaye",
    date: "13 Oct 2025",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1932&auto=format&fit=crop",
    summary: "Les IDE en Afrique subsaharienne devraient croître, portés par le secteur des énergies renouvelables.",
    content: ["Les analystes de la Banque Mondiale sont optimistes...", "La Chine reste le premier partenaire..."]
  },
  {
    id: "eco-4",
    title: "Le rôle des PME dans l'économie locale du Kenya",
    category: "Économie",
    categorySlug: "economie",
    author: "Olivier Dubois",
    date: "12 Oct 2025",
    image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070&auto=format&fit=crop",
    summary: "Comment les micro-entreprises transforment le paysage urbain de Nairobi.",
    content: ["Le secteur informel représente 80% des emplois...", "Digitalisation des paiements..."]
  },
  {
    id: "eco-5",
    title: "Perspectives agricoles pour la prochaine décennie",
    category: "Économie",
    categorySlug: "economie",
    author: "Marie Claire",
    date: "11 Oct 2025",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2069&auto=format&fit=crop",
    summary: "Modernisation, mécanisation et durabilité : le tiercé gagnant.",
    content: ["L'autosuffisance alimentaire est l'objectif numéro un...", "Les drones dans les champs..."]
  },

  // --- TECHNOLOGIE ---
  {
    id: "tech-1",
    title: "La Fintech en Afrique de l'Ouest : une révolution en marche",
    category: "Technologie",
    categorySlug: "technologie",
    author: "Amina Diallo",
    date: "20 Oct 2025",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070&auto=format&fit=crop",
    summary: "Comment le Mobile Money a surpassé le système bancaire traditionnel en taux de pénétration.",
    content: [
      "Il y a dix ans, ouvrir un compte bancaire était un parcours du combattant. Aujourd'hui, un numéro de téléphone suffit.",
      "Le Sénégal et la Côte d'Ivoire mènent la danse avec des startups comme Wave qui bouleversent le marché.",
      "La réglementation tente de suivre cette innovation rapide pour garantir la sécurité des fonds."
    ]
  },
  {
    id: "tech-2",
    title: "Comment la technologie peut-elle améliorer la transparence ?",
    category: "Technologie",
    categorySlug: "technologie",
    author: "Dr. K. Mensah",
    date: "18 Oct 2025",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
    summary: "Blockchain et gouvernance : le duo gagnant pour l'administration publique ?",
    content: ["L'utilisation de la blockchain pour le cadastre...", "Lutter contre la corruption..."]
  },
  {
    id: "tech-3",
    title: "L'intelligence artificielle Made in Africa",
    category: "Technologie",
    categorySlug: "technologie",
    author: "Sarah Connor",
    date: "17 Oct 2025",
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=2006&auto=format&fit=crop",
    summary: "Google ouvre son troisième centre de recherche IA à Accra.",
    content: ["Le focus est mis sur la résolution de problèmes locaux : santé, agriculture..."]
  },
  {
    id: "tech-4",
    title: "Startups : Lagos, la Silicon Valley africaine ?",
    category: "Technologie",
    categorySlug: "technologie",
    author: "John Doe",
    date: "15 Oct 2025",
    image: "https://images.unsplash.com/photo-1599596009890-fb64db335c02?q=80&w=2074&auto=format&fit=crop",
    summary: "Yabacon Valley continue d'attirer les investisseurs internationaux malgré la crise.",
    content: ["Les licornes nigérianes se multiplient..."]
  },
  {
    id: "tech-5",
    title: "Déploiement de la 5G : Où en sommes-nous ?",
    category: "Technologie",
    categorySlug: "technologie",
    author: "Tech Reporter",
    date: "10 Oct 2025",
    image: "https://images.unsplash.com/photo-1535303311164-664fc9ec6532?q=80&w=1974&auto=format&fit=crop",
    summary: "L'Afrique du Sud et le Nigeria en tête, le reste du continent suit le pas.",
    content: ["Les défis de l'infrastructure...", "Le coût des terminaux..."]
  },

  // --- POLITIQUE ---
  {
    id: "pol-1",
    title: "Les nouveaux enjeux de la gouvernance à l'ère du digital",
    category: "Politique",
    categorySlug: "politique",
    author: "Pierre Mvié",
    date: "22 Oct 2025",
    image: "https://images.unsplash.com/photo-1541872703-74c59636a226?q=80&w=2070&auto=format&fit=crop",
    summary: "La participation citoyenne en ligne force les gouvernements à plus de réactivité.",
    content: ["Les réseaux sociaux sont devenus le nouveau parlement...", "Le concept de e-citoyenneté..."]
  },
  {
    id: "pol-2",
    title: "Le Forum Africain pour la Paix : Bilan de la 12ème édition",
    category: "Politique",
    categorySlug: "politique",
    author: "Alice Nguéma",
    date: "21 Oct 2025",
    image: "https://images.unsplash.com/photo-1529104661330-36a8d6dc3e3e?q=80&w=2070&auto=format&fit=crop",
    summary: "Les chefs d'états s'accordent sur une force d'intervention conjointe.",
    content: ["Lutter contre le terrorisme au Sahel...", "Financement autonome de l'UA..."]
  },
  {
    id: "pol-3",
    title: "Élections en RDC : Les observateurs rendent leur rapport",
    category: "Politique",
    categorySlug: "politique",
    author: "Correspondant Kinshasa",
    date: "19 Oct 2025",
    image: "https://images.unsplash.com/photo-1575320181282-9afab399332c?q=80&w=2070&auto=format&fit=crop",
    summary: "Des progrès notés dans la transparence, mais des défis logistiques persistent.",
    content: ["Les machines à voter...", "La participation des jeunes..."]
  },
  {
    id: "pol-4",
    title: "Diplomatie : Le grand retour du Maroc dans les instances de l'UA",
    category: "Politique",
    categorySlug: "politique",
    author: "Hassan B.",
    date: "15 Oct 2025",
    image: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=2076&auto=format&fit=crop",
    summary: "Une stratégie diplomatique payante sur le long terme.",
    content: ["Investissements économiques et soft power..."]
  },
  {
    id: "pol-5",
    title: "Réformes constitutionnelles : Vers la fin des mandats illimités ?",
    category: "Politique",
    categorySlug: "politique",
    author: "Analyse Politique",
    date: "10 Oct 2025",
    image: "https://images.unsplash.com/photo-1589829545331-cb64afb46766?q=80&w=2070&auto=format&fit=crop",
    summary: "Une tendance qui se généralise en Afrique de l'Ouest.",
    content: ["La pression de la CEDEAO...", "La société civile veille au grain..."]
  },
];

// Mapper pour lier les slugs aux titres d'affichage et icônes
export const CATEGORY_MAP = {
  economie: { label: "Économie", icon: TrendingUp },
  politique: { label: "Politique", icon: Scale },
  gouvernance: { label: "Gouvernance", icon: Landmark },
  developpement: { label: "Développement", icon: Sprout },
  technologie: { label: "Technologie", icon: Cpu },
  sante: { label: "Santé", icon: ShieldPlus },
  education: { label: "Éducation", icon: GraduationCap },
  "politique-nationale": { label: "Politique Nationale", icon: Scale },
  "politique-internationale": { label: "Politique Internationale", icon: Globe },
};

// lib/african-countries.ts
export interface AfricanCountry {
  code: string;
  name: string;
  nameEn: string;
  flag: string;
  region: 'North' | 'West' | 'East' | 'Central' | 'South';
}

// lib/languages.ts
export type LanguageCode = "fr" | "en" | "ru" | "zh" | "ar" | "es";

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  direction: "ltr" | "rtl";
}

export const LANGUAGES: Language[] = [
  { 
    code: "fr", 
    name: "French", 
    nativeName: "Français", 
    flag: "🇫🇷",
    direction: "ltr"
  },
  { 
    code: "en", 
    name: "English", 
    nativeName: "English", 
    flag: "🇬🇧",
    direction: "ltr"
  },
  { 
    code: "ru", 
    name: "Russian", 
    nativeName: "Русский", 
    flag: "🇷🇺",
    direction: "ltr"
  },
  { 
    code: "zh", 
    name: "Chinese", 
    nativeName: "中文", 
    flag: "🇨🇳",
    direction: "ltr"
  },
  { 
    code: "ar", 
    name: "Arabic", 
    nativeName: "العربية", 
    flag: "🇸🇦",
    direction: "rtl"
  },
  { 
    code: "es", 
    name: "Spanish", 
    nativeName: "Español", 
    flag: "🇪🇸",
    direction: "ltr"
  },
];

export const DEFAULT_LANGUAGE: LanguageCode = "fr";

// Mapping des codes langue pour Google Translate
export const GOOGLE_TRANSLATE_CODES: Record<LanguageCode, string> = {
  fr: "fr",
  en: "en",
  ru: "ru",
  zh: "zh-CN", // Chinois simplifié
  ar: "ar",
  es: "es",
};

export const AFRICAN_COUNTRIES: AfricanCountry[] = [
  // Afrique du Nord (5)
  { code: 'DZ', name: 'Algérie', nameEn: 'Algeria', flag: '🇩🇿', region: 'North' },
  { code: 'EG', name: 'Égypte', nameEn: 'Egypt', flag: '🇪🇬', region: 'North' },
  { code: 'LY', name: 'Libye', nameEn: 'Libya', flag: '🇱🇾', region: 'North' },
  { code: 'MA', name: 'Maroc', nameEn: 'Morocco', flag: '🇲🇦', region: 'North' },
  { code: 'TN', name: 'Tunisie', nameEn: 'Tunisia', flag: '🇹🇳', region: 'North' },

  // Afrique de l'Ouest (16)
  { code: 'BJ', name: 'Bénin', nameEn: 'Benin', flag: '🇧🇯', region: 'West' },
  { code: 'BF', name: 'Burkina Faso', nameEn: 'Burkina Faso', flag: '🇧🇫', region: 'West' },
  { code: 'CV', name: 'Cap-Vert', nameEn: 'Cape Verde', flag: '🇨🇻', region: 'West' },
  { code: 'CI', name: "Côte d'Ivoire", nameEn: "Côte d'Ivoire", flag: '🇨🇮', region: 'West' },
  { code: 'GM', name: 'Gambie', nameEn: 'Gambia', flag: '🇬🇲', region: 'West' },
  { code: 'GH', name: 'Ghana', nameEn: 'Ghana', flag: '🇬🇭', region: 'West' },
  { code: 'GN', name: 'Guinée', nameEn: 'Guinea', flag: '🇬🇳', region: 'West' },
  { code: 'GW', name: 'Guinée-Bissau', nameEn: 'Guinea-Bissau', flag: '🇬🇼', region: 'West' },
  { code: 'LR', name: 'Libéria', nameEn: 'Liberia', flag: '🇱🇷', region: 'West' },
  { code: 'ML', name: 'Mali', nameEn: 'Mali', flag: '🇲🇱', region: 'West' },
  { code: 'MR', name: 'Mauritanie', nameEn: 'Mauritania', flag: '🇲🇷', region: 'West' },
  { code: 'NE', name: 'Niger', nameEn: 'Niger', flag: '🇳🇪', region: 'West' },
  { code: 'NG', name: 'Nigéria', nameEn: 'Nigeria', flag: '🇳🇬', region: 'West' },
  { code: 'SN', name: 'Sénégal', nameEn: 'Senegal', flag: '🇸🇳', region: 'West' },
  { code: 'SL', name: 'Sierra Leone', nameEn: 'Sierra Leone', flag: '🇸🇱', region: 'West' },
  { code: 'TG', name: 'Togo', nameEn: 'Togo', flag: '🇹🇬', region: 'West' },

  // Afrique Centrale (9)
  { code: 'AO', name: 'Angola', nameEn: 'Angola', flag: '🇦🇴', region: 'Central' },
  { code: 'CM', name: 'Cameroun', nameEn: 'Cameroon', flag: '🇨🇲', region: 'Central' },
  { code: 'CF', name: 'République Centrafricaine', nameEn: 'Central African Republic', flag: '🇨🇫', region: 'Central' },
  { code: 'TD', name: 'Tchad', nameEn: 'Chad', flag: '🇹🇩', region: 'Central' },
  { code: 'CG', name: 'Congo', nameEn: 'Congo', flag: '🇨🇬', region: 'Central' },
  { code: 'CD', name: 'RD Congo', nameEn: 'DR Congo', flag: '🇨🇩', region: 'Central' },
  { code: 'GQ', name: 'Guinée Équatoriale', nameEn: 'Equatorial Guinea', flag: '🇬🇶', region: 'Central' },
  { code: 'GA', name: 'Gabon', nameEn: 'Gabon', flag: '🇬🇦', region: 'Central' },
  { code: 'ST', name: 'Sao Tomé-et-Principe', nameEn: 'Sao Tome and Principe', flag: '🇸🇹', region: 'Central' },

  // Afrique de l'Est (14)
  { code: 'BI', name: 'Burundi', nameEn: 'Burundi', flag: '🇧🇮', region: 'East' },
  { code: 'KM', name: 'Comores', nameEn: 'Comoros', flag: '🇰🇲', region: 'East' },
  { code: 'DJ', name: 'Djibouti', nameEn: 'Djibouti', flag: '🇩🇯', region: 'East' },
  { code: 'ER', name: 'Érythrée', nameEn: 'Eritrea', flag: '🇪🇷', region: 'East' },
  { code: 'ET', name: 'Éthiopie', nameEn: 'Ethiopia', flag: '🇪🇹', region: 'East' },
  { code: 'KE', name: 'Kenya', nameEn: 'Kenya', flag: '🇰🇪', region: 'East' },
  { code: 'MG', name: 'Madagascar', nameEn: 'Madagascar', flag: '🇲🇬', region: 'East' },
  { code: 'MW', name: 'Malawi', nameEn: 'Malawi', flag: '🇲🇼', region: 'East' },
  { code: 'MU', name: 'Maurice', nameEn: 'Mauritius', flag: '🇲🇺', region: 'East' },
  { code: 'MZ', name: 'Mozambique', nameEn: 'Mozambique', flag: '🇲🇿', region: 'East' },
  { code: 'RW', name: 'Rwanda', nameEn: 'Rwanda', flag: '🇷🇼', region: 'East' },
  { code: 'SC', name: 'Seychelles', nameEn: 'Seychelles', flag: '🇸🇨', region: 'East' },
  { code: 'SO', name: 'Somalie', nameEn: 'Somalia', flag: '🇸🇴', region: 'East' },
  { code: 'SS', name: 'Soudan du Sud', nameEn: 'South Sudan', flag: '🇸🇸', region: 'East' },
  { code: 'SD', name: 'Soudan', nameEn: 'Sudan', flag: '🇸🇩', region: 'East' },
  { code: 'TZ', name: 'Tanzanie', nameEn: 'Tanzania', flag: '🇹🇿', region: 'East' },
  { code: 'UG', name: 'Ouganda', nameEn: 'Uganda', flag: '🇺🇬', region: 'East' },
  { code: 'ZM', name: 'Zambie', nameEn: 'Zambia', flag: '🇿🇲', region: 'East' },

  // Afrique Australe (10)
  { code: 'BW', name: 'Botswana', nameEn: 'Botswana', flag: '🇧🇼', region: 'South' },
  { code: 'LS', name: 'Lesotho', nameEn: 'Lesotho', flag: '🇱🇸', region: 'South' },
  { code: 'NA', name: 'Namibie', nameEn: 'Namibia', flag: '🇳🇦', region: 'South' },
  { code: 'ZA', name: 'Afrique du Sud', nameEn: 'South Africa', flag: '🇿🇦', region: 'South' },
  { code: 'SZ', name: 'Eswatini', nameEn: 'Eswatini', flag: '🇸🇿', region: 'South' },
  { code: 'ZW', name: 'Zimbabwe', nameEn: 'Zimbabwe', flag: '🇿🇼', region: 'South' },
];

export const AFRICAN_REGIONS = {
  North: 'Afrique du Nord',
  West: 'Afrique de l\'Ouest',
  Central: 'Afrique Centrale',
  East: 'Afrique de l\'Est',
  South: 'Afrique Australe',
} as const;

export const getCountriesByRegion = (region: AfricanCountry['region']) => {
  return AFRICAN_COUNTRIES.filter(country => country.region === region);
};







