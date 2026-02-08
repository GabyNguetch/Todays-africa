"use client";

import React from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Building2, 
  Users, 
  Globe, 
  Target, 
  Newspaper, 
  Mail, 
  Phone, 
  MapPin,
  CheckCircle,
  Briefcase,
  Radio,
  TrendingUp,
  Megaphone,
  Lightbulb,
  Shield,
  Network,
  BookOpen,
  GraduationCap
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Menu complet extrait de l'image
const menuSections = [
  {
    title: "DAILY BRIEFING DE PAYS",
    items: ["Carte postale", "Peuples Et Cultures", "Politique", "Economie", "Sécurité", "Géopolitique", "Opportunités", "Risques", "Menaces", "Alerte", "Leçons-Perspectives"]
  },
  {
    title: "AGENDA OFFICIEL",
    items: ["ARCHIVES", "Intra", "Afrique-Russie", "Afrique-Chine", "Afrique-Europe", "Afrique-Asie", "Afrique-USA", "Afrique-Autres"]
  },
  {
    title: "ACTIVITES",
    items: ["", "Economiques", "Politiques", "Géostratégiques", "Interculturelles", "Post-coloniales"]
  },
  {
    title: "UN PAYS A LA UNE",
    items: ["", "Leaders Politiques", "Export", "Import", "Commerce", "Industrie", "Agriculture", "Carte postale"]
  },
  {
    title: "PROFILS",
    items: ["", "Analyses", "Politiques", "Géostratégiques", "Historiques"]
  },
  {
    title: "RECHERCHE/INNOVATION",
    items: ["", "Avions", "social", "UA", "Armée", "Sciences", "Enseignement supérieur", "Coopération"]
  },
  {
    title: "Nos partenaires",
    items: ["", "Humaines", "Politiques", "Economiques", "Recherches", "Entrepreneurs", "Fortunes", "Jeunes loups"]
  },
  {
    title: "",
    items: ["Cuisine", "Artisanat", "Traditions", "Sagesse", "Exclusivités", "Adresses", "Plages", "Forêts", "Montagnes", "Savanes", "Déserts"]
  }
];

// Services du Cabinet - Version compacte
const services = [
  {
    icon: Lightbulb,
    title: "Intelligence Interculturelle",
    description: "30+ ans de recherche sur la Théorie de l'Intelligence Interculturelle.",
    features: ["Analyse Transculturelle", "Renseignement Interculturel"]
  },
  {
    icon: GraduationCap,
    title: "Conseil & Formation",
    description: "Conférences et formations stratégiques pour l'interculturalité active.",
    features: ["Gouvernance acceptable", "Diplomatie opérationnelle"]
  },
  {
    icon: Shield,
    title: "Sécurité & Coopération",
    description: "Coopérations à forte valeur ajoutée et gestion des risques culturels.",
    features: ["Coopération interculturelle", "Sécurité culturelle"]
  },
  {
    icon: Network,
    title: "Conseil Stratégique",
    description: "Conseil auprès des États, gouvernements et organisations internationales.",
    features: ["Stratégie d'État", "Organisations internationales"]
  }
];

// Domaines d'expertise - Version compacte
const expertiseDomains = [
  { title: "Gouvernance Acceptable", icon: "🏛️" },
  { title: "Diplomatie Opérationnelle", icon: "🤝" },
  { title: "Coopération à Valeur Ajoutée", icon: "💼" },
  { title: "Affaires Durables", icon: "🌱" },
  { title: "Sécurité Interculturelle", icon: "🛡️" },
  { title: "Innovation & Créativité", icon: "💡" }
];

export default function TodaysAfricaPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans selection:bg-[#3E7B52] selection:text-white flex flex-col">
      <Navbar />

      <main className="max-w-[1400px] mx-auto w-full px-4 md:px-8 py-6 space-y-12">
        
        {/* ================================================================
            1. HERO SECTION - Compact avec tableau complet
           ================================================================ */}
        <section className="relative bg-gradient-to-br from-slate-50 via-gray-100 to-emerald-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-[#051F10] p-6 md:p-10 rounded-2xl border border-gray-200 dark:border-zinc-700 overflow-hidden">
          {/* Effet de cercle subtil */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border-4 border-[#3E7B52]/20 rounded-full pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] border-2 border-[#3E7B52]/10 rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="text-center space-y-6 mb-8">
              
              {/* Titre principal - Version responsive */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-[1.05] tracking-tight px-4">
                TA INTERCULTURAL<br/>
                <span className="text-[#3E7B52] dark:text-[#13EC13]">INTELLIGENCE CONSULTING</span><br/>
                <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-700 dark:text-gray-300">CABINET</span>
              </h1>
              
              {/* Cercle décoratif centré - Version responsive */}
              <div className="flex justify-center items-center py-4">
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 border-3 sm:border-4 border-[#3E7B52] rounded-full" />
                  <div className="absolute -bottom-4 sm:-bottom-6 left-1/2 -translate-x-1/2 w-1 h-8 sm:h-12 bg-[#3E7B52]" />
                </div>
              </div>
              
              {/* Triple baseline - Version responsive */}
              <div className="space-y-1 text-[10px] sm:text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium px-4">
                <p className="uppercase tracking-wider">AIDER L'AFRIQUE À MIEUX CONNAÎTRE</p>
                <p className="uppercase tracking-wider">AIDER L'AFRIQUE À MIEUX COOPÉRER</p>
                <p className="uppercase tracking-wider">AIDER À MIEUX COOPÉRER AVEC L'AFRIQUE</p>
              </div>

              {/* Bouton Langues */}
              <div className="flex justify-end px-4">
                <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-[#3E7B52] px-3 py-1 border border-gray-300 dark:border-zinc-700 rounded">
                  Langues
                </button>
              </div>
            </div>

            {/* QUI SOMMES-NOUS */}
            <div className="mb-6 px-4">
              <h2 className="text-sm md:text-base font-bold text-gray-700 dark:text-gray-300 mb-3">QUI SOMMES-NOUS ?</h2>
            </div>

            {/* MENU PRINCIPAL - Tableau responsive */}
            <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-gray-300 dark:border-zinc-700 rounded-xl overflow-x-auto mb-6">
              <div className="min-w-[600px] grid grid-cols-5 divide-x divide-gray-300 dark:divide-zinc-700">
                <Link href="#vision" className="px-2 sm:px-3 py-2.5 sm:py-3 text-center text-[10px] sm:text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                  NOTRE VISION
                </Link>
                <Link href="#organisation" className="px-2 sm:px-3 py-2.5 sm:py-3 text-center text-[10px] sm:text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                  NOTRE ORGANISATION
                </Link>
                <Link href="#services" className="px-2 sm:px-3 py-2.5 sm:py-3 text-center text-[10px] sm:text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                  NOS SERVICES
                </Link>
                <Link href="#magazine" className="px-2 sm:px-3 py-2.5 sm:py-3 text-center text-[10px] sm:text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                  APPEL A PARTENAIRES
                </Link>
                <Link href="#contact" className="px-2 sm:px-3 py-2.5 sm:py-3 text-center text-[10px] sm:text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                  NOUS CONTACTER
                </Link>
              </div>
            </div>

            {/* DESCRIPTION - 3 colonnes responsive */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 px-4">
              <div className="bg-white/80 dark:bg-zinc-900/80 border border-gray-300 dark:border-zinc-700 rounded-lg p-4">
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  Après plus de 30 ans de recherches sur la cause première de l'instabilité des actions des hommes, ayant observé les limites de la théorie du développement durable...
                </p>
              </div>
              <div className="bg-white/80 dark:bg-zinc-900/80 border border-gray-300 dark:border-zinc-700 rounded-lg p-4">
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  Nous sommes un Cabinet de conseil auprès des États, des gouvernements, des organisations internationales, des cabinets, des directions générales et des associations.
                </p>
              </div>
              <div className="bg-white/80 dark:bg-zinc-900/80 border border-gray-300 dark:border-zinc-700 rounded-lg p-4">
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  Conférences, Conseil et formation, en stratégie interculturelle par l'Intelligence Interculturelle et le Renseignement Interculturel pour...
                </p>
              </div>
            </div>

            {/* TABLEAU EXHAUSTIF DES RUBRIQUES - Comme dans l'image */}
            <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border-2 border-gray-300 dark:border-zinc-700 rounded-xl overflow-x-auto">
              <div className="min-w-[800px] grid grid-cols-8 divide-x divide-gray-300 dark:divide-zinc-700">
                {menuSections.map((section, idx) => (
                  <div key={idx} className="flex flex-col">
                    {/* En-tête de colonne */}
                    {section.title && (
                      <div className="bg-gray-200 dark:bg-zinc-800 px-3 py-3 border-b border-gray-300 dark:border-zinc-700">
                        <h3 className="text-xs md:text-sm font-bold text-gray-900 dark:text-white text-center leading-tight">
                          {section.title}
                        </h3>
                      </div>
                    )}
                    
                    {/* Items de la colonne */}
                    <div className="flex flex-col divide-y divide-gray-200 dark:divide-zinc-800">
                      {section.items.map((item, itemIdx) => (
                        <Link 
                          key={itemIdx} 
                          href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                          className="px-3 py-2.5 text-xs md:text-sm text-gray-800 dark:text-gray-200 hover:bg-[#3E7B52]/10 dark:hover:bg-[#3E7B52]/20 hover:text-[#3E7B52] dark:hover:text-[#13EC13] transition-colors text-center font-medium"
                        >
                          {item || "\u00A0"}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            2. NOTRE VISION - Version compacte
           ================================================================ */}
        <section id="vision" className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[#3E7B52] dark:text-[#13EC13] font-bold tracking-widest text-xs uppercase bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full">
              Notre Vision
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
              La Théorie de l'Intelligence Interculturelle
            </h2>
          </div>

          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-800 p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-zinc-700 shadow-lg">
            <div className="max-w-4xl mx-auto space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                Après plus de 30 ans de recherches sur la cause première de l'instabilité des actions des hommes...
              </p>
              
              <p className="text-sm">
                Ayant observé les <strong className="text-[#3E7B52] dark:text-[#13EC13]">limites de la théorie du développement durable</strong>, nous avons constaté qu'<strong>aucune organisation ne saurait être crédible et cohérente</strong> sans un état des lieux transcendantal sur les cultures concernées.
              </p>

              <div className="bg-[#3E7B52]/10 dark:bg-[#3E7B52]/20 border-l-4 border-[#3E7B52] p-4 rounded-lg mt-6">
                <p className="font-bold text-gray-900 dark:text-white text-base mb-1">
                  Notre Conviction
                </p>
                <p className="italic text-sm">
                  "Passer du multiculturalisme passif à l'interculturalité active pour l'émulation, l'innovation et la créativité."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            3. NOS SERVICES - Version compacte
           ================================================================ */}
        <section id="services" className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[#3E7B52] dark:text-[#13EC13] font-bold tracking-widest text-xs uppercase bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full">
              Nos Services
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
              Conseil Stratégique & Formation
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {services.map((service, index) => (
              <div key={index} className="bg-white dark:bg-zinc-900 p-4 sm:p-5 rounded-xl border border-gray-100 dark:border-zinc-800 hover:border-[#3E7B52]/50 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-2.5 sm:p-3 rounded-xl group-hover:bg-[#3E7B52] group-hover:text-white transition-colors shrink-0">
                    <service.icon size={20} className="text-[#3E7B52] group-hover:text-white" />
                  </div>
                  <div className="flex-1 space-y-2 min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                      {service.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      {service.description}
                    </p>
                    <ul className="space-y-1.5 pt-1">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <CheckCircle size={12} className="text-[#13EC13] shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Domaines d'expertise - Version responsive */}
          <div className="bg-gray-50 dark:bg-zinc-900/50 p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 mt-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">
              Nos Domaines d'Expertise
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {expertiseDomains.map((domain, idx) => (
                <div key={idx} className="bg-white dark:bg-zinc-900 p-3 rounded-lg border border-gray-100 dark:border-zinc-800 flex items-center gap-3">
                  <span className="text-xl sm:text-2xl shrink-0">{domain.icon}</span>
                  <h4 className="text-xs sm:text-sm font-bold text-[#3E7B52] dark:text-[#13EC13]">
                    {domain.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            4. NOTRE ORGANISATION - Version compacte
           ================================================================ */}
        <section id="organisation" className="bg-gradient-to-br from-[#3E7B52] to-[#2d5c3d] rounded-2xl p-6 md:p-10 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <Globe className="text-[#13EC13]/20 absolute -right-8 -bottom-8 w-32 h-32 sm:w-48 sm:h-48" />
          
          <div className="relative z-10 max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
              
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-black mb-4">Notre Organisation</h2>
                <p className="text-green-100 text-xs sm:text-sm leading-relaxed">
                  Cabinet international basé à <strong>Yaoundé, Cameroun</strong>, avec une expertise reconnue auprès des institutions africaines.
                </p>
                
                <div className="space-y-3">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 flex items-center gap-3">
                    <Building2 className="text-[#13EC13] shrink-0" size={20} />
                    <div className="min-w-0">
                      <p className="font-bold text-xs sm:text-sm truncate">Siège Social</p>
                      <p className="text-xs text-green-200 truncate">Yaoundé, Cameroun</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 flex items-center gap-3">
                    <BookOpen className="text-[#13EC13] shrink-0" size={20} />
                    <div className="min-w-0">
                      <p className="font-bold text-xs sm:text-sm truncate">30+ Années de Recherche</p>
                      <p className="text-xs text-green-200 truncate">Théorie éprouvée</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold mb-4">Zones d'Intervention</h3>
                <div className="grid grid-cols-2 gap-2">
                  {["Afrique Centrale", "Afrique de l'Ouest", "Afrique de l'Est", "Afrique Australe", "BRICS", "Organisations Int."].map((zone, idx) => (
                    <div key={idx} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg px-2 sm:px-3 py-2 text-[10px] sm:text-xs font-semibold flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#13EC13] shrink-0"></div>
                      <span className="truncate">{zone}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            5. NOTRE MAGAZINE - Version responsive
           ================================================================ */}
        <section id="magazine" className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 md:p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#3E7B52] to-[#13EC13]"></div>
          
          <div className="relative z-10 max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div className="space-y-3 sm:space-y-4">
                <Newspaper size={32} className="text-[#13EC13] sm:hidden" />
                <Newspaper size={36} className="text-[#13EC13] hidden sm:block" />
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white">
                  Notre Magazine : Today's Africa
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                  Perspective anglo-saxonne sur les enjeux qui façonnent le continent.
                </p>
                
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-green-100 text-xs">
                    <CheckCircle size={14} className="text-[#13EC13] shrink-0" />
                    <span>Analyses géopolitiques</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-100 text-xs">
                    <CheckCircle size={14} className="text-[#13EC13] shrink-0" />
                    <span>Intelligence de marché</span>
                  </div>
                </div>

                <Link href="/todays-africa-magazine">
                  <Button className="h-9 sm:h-10 px-4 sm:px-6 bg-[#13EC13] hover:bg-[#0fbd0f] text-black font-bold text-xs sm:text-sm mt-4 w-full sm:w-auto">
                    Découvrir
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="bg-white/5 backdrop-blur-md p-4 sm:p-6 rounded-xl border border-white/10">
                <div className="aspect-[3/4] bg-gradient-to-br from-[#3E7B52] to-[#13EC13] rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-2 sm:space-y-3 p-4 sm:p-6">
                    <Newspaper size={40} className="mx-auto text-white sm:hidden" />
                    <Newspaper size={48} className="mx-auto text-white hidden sm:block" />
                    <p className="text-lg sm:text-xl font-black text-white">TODAY'S<br/>AFRICA</p>
                    <p className="text-xs text-white/80">Excellence journalistique</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            6. CONTACT - Version responsive
           ================================================================ */}
        <section id="contact" className="bg-gradient-to-r from-gray-900 to-black rounded-2xl p-6 md:p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#3E7B52] to-[#13EC13]"></div>

          <div className="relative z-10 max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white">
                  Contactez Notre Cabinet
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Pour toute demande de conseil stratégique ou formation.
                </p>
                
                <div className="space-y-2 sm:space-y-3 pt-3">
                  <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#3E7B52]/20 flex items-center justify-center group-hover:bg-[#13EC13] transition-colors shrink-0">
                      <Mail size={14} className="text-[#13EC13] group-hover:text-black" />
                    </div>
                    <span className="font-mono text-gray-300 text-[10px] sm:text-xs break-all">contact@taconsulting.com</span>
                  </div>
                  <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#3E7B52]/20 flex items-center justify-center group-hover:bg-[#13EC13] transition-colors shrink-0">
                      <Phone size={14} className="text-[#13EC13] group-hover:text-black" />
                    </div>
                    <span className="font-mono text-gray-300 text-[10px] sm:text-xs">+237 XXX XXX XXX</span>
                  </div>
                  <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#3E7B52]/20 flex items-center justify-center group-hover:bg-[#13EC13] transition-colors shrink-0">
                      <MapPin size={14} className="text-[#13EC13] group-hover:text-black" />
                    </div>
                    <span className="font-mono text-gray-300 text-[10px] sm:text-xs">Yaoundé, Cameroun</span>
                  </div>
                </div>
              </div>

              {/* Formulaire de contact - Version responsive */}
              <div className="bg-white/5 backdrop-blur-md p-4 sm:p-6 rounded-xl border border-white/10">
                <h4 className="text-sm sm:text-base font-bold mb-3 sm:mb-4 text-white">Demande de Contact</h4>
                <form className="space-y-2.5 sm:space-y-3">
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <input 
                      type="text" 
                      placeholder="Prénom" 
                      className="w-full h-9 px-3 rounded-lg bg-black/40 border border-white/10 text-white focus:border-[#13EC13] outline-none text-xs"
                    />
                    <input 
                      type="text" 
                      placeholder="Nom" 
                      className="w-full h-9 px-3 rounded-lg bg-black/40 border border-white/10 text-white focus:border-[#13EC13] outline-none text-xs"
                    />
                  </div>
                  <input 
                    type="email" 
                    placeholder="Email professionnel" 
                    className="w-full h-9 px-3 rounded-lg bg-black/40 border border-white/10 text-white focus:border-[#13EC13] outline-none text-xs"
                  />
                  <select className="w-full h-9 px-3 rounded-lg bg-black/40 border border-white/10 text-gray-400 focus:border-[#13EC13] outline-none text-xs">
                    <option>Sujet de la demande</option>
                    <option>Conseil Stratégique</option>
                    <option>Formation</option>
                    <option>Partenariat</option>
                  </select>
                  
                  <Button className="w-full h-9 bg-[#3E7B52] hover:bg-[#2d5c3d] text-white font-bold text-xs sm:text-sm">
                    Envoyer
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
}