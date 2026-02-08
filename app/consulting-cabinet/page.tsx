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

// Services du Cabinet d'Intelligence Interculturelle
const services = [
  {
    icon: Lightbulb,
    title: "Intelligence Interculturelle",
    description: "Expertise unique basée sur 30+ ans de recherche sur la Théorie de l'Intelligence Interculturelle et du Renseignement Interculturel.",
    features: ["Analyse Transculturelle", "Renseignement Interculturel", "État des lieux culturels"]
  },
  {
    icon: GraduationCap,
    title: "Conseil & Formation",
    description: "Conférences et formations stratégiques pour transformer le multiculturalisme passif en interculturalité active.",
    features: ["Gouvernance acceptable", "Diplomatie opérationnelle", "Affaires durables"]
  },
  {
    icon: Shield,
    title: "Sécurité & Coopération",
    description: "Accompagnement des organisations dans la mise en place de coopérations à forte valeur ajoutée.",
    features: ["Coopération interculturelle", "Sécurité culturelle", "Gestion des risques"]
  },
  {
    icon: Network,
    title: "Conseil Stratégique",
    description: "Conseil auprès des États, gouvernements, organisations internationales et cabinets pour des projets cohérents.",
    features: ["Stratégie d'État", "Organisations internationales", "Directions générales"]
  }
];

// Domaines d'expertise du cabinet
const expertiseDomains = [
  {
    title: "Gouvernance Acceptable",
    description: "Accompagnement des États et gouvernements vers une gouvernance culturellement cohérente"
  },
  {
    title: "Diplomatie Opérationnelle",
    description: "Stratégies diplomatiques basées sur l'intelligence interculturelle"
  },
  {
    title: "Coopération à Valeur Ajoutée",
    description: "Maximisation de l'impact des partenariats internationaux"
  },
  {
    title: "Affaires Durables",
    description: "Au-delà du développement durable : intégration de l'intelligence culturelle"
  },
  {
    title: "Sécurité Interculturelle",
    description: "Prévention et gestion des risques liés aux différences culturelles"
  },
  {
    title: "Innovation & Créativité",
    description: "Émulation et innovation par l'encadrement culturel"
  }
];

// Zones d'intervention
const interventionZones = [
  "Afrique Centrale",
  "Afrique de l'Ouest", 
  "Afrique de l'Est",
  "Afrique Australe",
  "BRICS",
  "Organisations Internationales"
];

export default function TodaysAfricaPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans selection:bg-[#3E7B52] selection:text-white flex flex-col">
      <Navbar />

      <main className="max-w-[1400px] mx-auto w-full px-6 md:px-12 py-12 space-y-20">
        
        {/* ================================================================
            1. HERO SECTION - Inspirée de l'image du cabinet
           ================================================================ */}
        <section className="relative bg-gradient-to-br from-slate-50 via-gray-100 to-emerald-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-[#051F10] p-8 md:p-16 rounded-3xl border border-gray-200 dark:border-zinc-700 overflow-hidden">
          {/* Effet de cercle subtil comme dans l'image */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border-4 border-[#3E7B52]/20 rounded-full pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border-2 border-[#3E7B52]/10 rounded-full pointer-events-none" />
          
          {/* Accent décoratif */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#3E7B52]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="text-center space-y-8 mb-12">
              
              {/* Titre principal - style sobre et professionnel */}
              <h1 className="text-4xl sm:text-5xl lg:text-[72px] font-black text-gray-900 dark:text-white leading-[1.05] tracking-tight">
                TA INTERCULTURAL<br/>
                <span className="text-[#3E7B52] dark:text-[#13EC13]">INTELLIGENCE CONSULTING</span><br/>
                <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-700 dark:text-gray-300">CABINET</span>
              </h1>
              
              {/* Cercle décoratif centré avec trait (comme dans l'image) */}
              <div className="flex justify-center items-center py-6">
                <div className="relative">
                  <div className="w-32 h-32 border-4 border-[#3E7B52] rounded-full" />
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-1 h-16 bg-[#3E7B52]" />
                </div>
              </div>
              
              {/* Triple baseline - exactement comme dans l'image */}
              <div className="space-y-2 text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium">
                <p className="uppercase tracking-wider">AIDER L'AFRIQUE À MIEUX CONNAÎTRE</p>
                <p className="uppercase tracking-wider">AIDER L'AFRIQUE À MIEUX COOPÉRER</p>
                <p className="uppercase tracking-wider">AIDER À MIEUX COOPÉRER AVEC L'AFRIQUE</p>
              </div>
            </div>

            {/* Navigation principale du cabinet */}
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-gray-200 dark:border-zinc-700 rounded-2xl p-4 shadow-xl">
              <div className="flex flex-wrap justify-center gap-3 md:gap-6 text-xs md:text-sm font-semibold">
                <Link href="#vision" className="px-4 py-2 hover:bg-[#3E7B52] hover:text-white rounded-lg transition-colors text-gray-700 dark:text-gray-300">
                  NOTRE VISION
                </Link>
                <Link href="#organisation" className="px-4 py-2 hover:bg-[#3E7B52] hover:text-white rounded-lg transition-colors text-gray-700 dark:text-gray-300">
                  NOTRE ORGANISATION
                </Link>
                <Link href="#services" className="px-4 py-2 hover:bg-[#3E7B52] hover:text-white rounded-lg transition-colors text-gray-700 dark:text-gray-300">
                  NOS SERVICES
                </Link>
                <Link href="#magazine" className="px-4 py-2 hover:bg-[#3E7B52] hover:text-white rounded-lg transition-colors text-gray-700 dark:text-gray-300">
                  NOTRE MAGAZINE
                </Link>
                <Link href="#partenaires" className="px-4 py-2 hover:bg-[#3E7B52] hover:text-white rounded-lg transition-colors text-gray-700 dark:text-gray-300">
                  APPEL À PARTENAIRES
                </Link>
                <Link href="#contact" className="px-4 py-2 bg-[#3E7B52] text-white rounded-lg hover:bg-[#2d5c3d] transition-colors">
                  NOUS CONTACTER
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            2. NOTRE VISION (30+ ans de recherche)
           ================================================================ */}
        <section id="vision" className="space-y-12">
          <div className="text-center space-y-4">
            <span className="text-[#3E7B52] dark:text-[#13EC13] font-bold tracking-widest text-xs uppercase bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full">
              Notre Vision
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
              La Théorie de l'Intelligence Interculturelle
            </h2>
          </div>

          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-800 p-8 md:p-12 rounded-3xl border border-gray-200 dark:border-zinc-700 shadow-xl">
            <div className="max-w-4xl mx-auto space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                Après plus de 30 ans de recherches sur la cause première de l'instabilité des actions des hommes...
              </p>
              
              <p>
                Ayant observé les <strong className="text-[#3E7B52] dark:text-[#13EC13]">limites de la théorie du développement durable</strong>, nous, promoteurs de la Théorie de l'Intelligence Interculturelle et du Renseignement Interculturel, avons constaté à partir de cette Théorie qu'<strong>aucune organisation, aucun projet unissant des hommes ne saurait être crédible et cohérent</strong> si avant toute chose, il n'a été procédé à un état des lieux sur les cultures concernées de manière transcendantale.
              </p>

              <p>
                Tout projet perd en valeur ajoutée si <strong className="text-[#3E7B52] dark:text-[#13EC13]">aucun travail formel n'est mené durant la vie de l'organisation</strong> pour partir du multiculturalisme passif à l'interculturalité active, chaque culture étant encadrée pour des besoins au moins d'émulation, sinon d'innovation et de créativité.
              </p>

              <div className="bg-[#3E7B52]/10 dark:bg-[#3E7B52]/20 border-l-4 border-[#3E7B52] p-6 rounded-lg mt-8">
                <p className="font-bold text-gray-900 dark:text-white text-xl mb-2">
                  Notre Conviction
                </p>
                <p className="italic">
                  "L'intelligence interculturelle n'est pas une option, c'est le fondement de toute coopération durable et de toute gouvernance acceptable."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            3. NOS SERVICES
           ================================================================ */}
        <section id="services" className="space-y-12">
          <div className="text-center space-y-4">
            <span className="text-[#3E7B52] dark:text-[#13EC13] font-bold tracking-widest text-xs uppercase bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full">
              Nos Services
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
              Conseil Stratégique & Formation
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-lg">
              Nous sommes un <strong>Cabinet de conseil</strong> auprès des États, des gouvernements, des organisations internationales, des cabinets, des directions générales et des associations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-gray-100 dark:border-zinc-800 hover:border-[#3E7B52]/50 hover:shadow-xl hover:shadow-[#3E7B52]/5 transition-all duration-300 group">
                <div className="flex items-start gap-6">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl group-hover:bg-[#3E7B52] group-hover:text-white transition-colors duration-300">
                    <service.icon size={28} className="text-[#3E7B52] group-hover:text-white" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {service.description}
                    </p>
                    <ul className="space-y-3 pt-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <CheckCircle size={16} className="text-[#13EC13]" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Domaines d'expertise */}
          <div className="bg-gray-50 dark:bg-zinc-900/50 p-8 md:p-12 rounded-3xl border border-gray-200 dark:border-zinc-800 mt-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Nos Domaines d'Expertise
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expertiseDomains.map((domain, idx) => (
                <div key={idx} className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-100 dark:border-zinc-800">
                  <h4 className="font-bold text-[#3E7B52] dark:text-[#13EC13] mb-2">
                    {domain.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {domain.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            4. NOTRE ORGANISATION & ZONES D'INTERVENTION
           ================================================================ */}
        <section id="organisation" className="bg-gradient-to-br from-[#3E7B52] to-[#2d5c3d] rounded-3xl p-8 md:p-16 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <Globe className="text-[#13EC13]/20 absolute -right-12 -bottom-12 w-64 h-64 animate-spin-slow" />
          
          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              
              {/* Colonne Organisation */}
              <div className="space-y-6">
                <h2 className="text-3xl font-black mb-6">Notre Organisation</h2>
                <p className="text-green-100 text-lg leading-relaxed">
                  Cabinet international basé à <strong>Yaoundé, Cameroun</strong>, avec une expertise reconnue auprès des institutions africaines, des organisations internationales et des États.
                </p>
                
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="text-[#13EC13]" size={24} />
                    <div>
                      <p className="font-bold">Siège Social</p>
                      <p className="text-sm text-green-200">Yaoundé, Cameroun</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Users className="text-[#13EC13]" size={24} />
                    <div>
                      <p className="font-bold">Experts Internationaux</p>
                      <p className="text-sm text-green-200">Multidisciplinaires et multiculturels</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <BookOpen className="text-[#13EC13]" size={24} />
                    <div>
                      <p className="font-bold">30+ Années de Recherche</p>
                      <p className="text-sm text-green-200">Théorie éprouvée et validée</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Colonne Zones d'intervention */}
              <div>
                <h3 className="text-2xl font-bold mb-6">Zones d'Intervention</h3>
                <p className="text-green-100 mb-8">
                  Depuis notre siège à Yaoundé, nous intervenons auprès des États, gouvernements et organisations à travers le continent et au-delà.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {interventionZones.map((zone, idx) => (
                    <div key={idx} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-sm font-semibold flex items-center gap-2 hover:bg-white/20 transition-colors cursor-default">
                      <div className="w-2 h-2 rounded-full bg-[#13EC13]"></div>
                      {zone}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            5. NOTRE MAGAZINE (Lien vers Today's Africa)
           ================================================================ */}
        <section id="magazine" className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 md:p-16 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#3E7B52] to-[#13EC13]"></div>
          
          <div className="relative z-10 max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Newspaper size={48} className="text-[#13EC13]" />
                <h3 className="text-3xl md:text-4xl font-black text-white">
                  Notre Magazine : Today's Africa
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Complément éditorial de notre expertise en intelligence interculturelle, <strong className="text-white">Today's Africa</strong> offre une perspective anglo-saxonne sur les enjeux qui façonnent le continent.
                </p>
                
                <div className="space-y-3 pt-4">
                  <div className="flex items-center gap-3 text-green-100">
                    <CheckCircle size={20} className="text-[#13EC13]" />
                    <span>Analyses géopolitiques et économiques</span>
                  </div>
                  <div className="flex items-center gap-3 text-green-100">
                    <CheckCircle size={20} className="text-[#13EC13]" />
                    <span>Intelligence de marché</span>
                  </div>
                  <div className="flex items-center gap-3 text-green-100">
                    <CheckCircle size={20} className="text-[#13EC13]" />
                    <span>Dossiers d'investigation</span>
                  </div>
                </div>

                <Link href="/todays-africa-magazine">
                  <Button className="h-12 px-8 bg-[#13EC13] hover:bg-[#0fbd0f] text-black font-bold mt-6">
                    Découvrir le Magazine
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10">
                <div className="aspect-[3/4] bg-gradient-to-br from-[#3E7B52] to-[#13EC13] rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-4 p-8">
                    <Newspaper size={64} className="mx-auto text-white" />
                    <p className="text-2xl font-black text-white">TODAY'S<br/>AFRICA</p>
                    <p className="text-sm text-white/80">Excellence journalistique britannique</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            6. CONTACT
           ================================================================ */}
        <section id="contact" className="bg-gradient-to-r from-gray-900 to-black rounded-3xl p-8 md:p-16 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#3E7B52] to-[#13EC13]"></div>

          <div className="relative z-10 max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-3xl md:text-4xl font-black text-white">
                  Contactez Notre Cabinet
                </h3>
                <p className="text-gray-400 text-lg">
                  Pour toute demande de conseil stratégique, formation ou partenariat institutionnel.
                </p>
                
                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-[#3E7B52]/20 flex items-center justify-center group-hover:bg-[#13EC13] transition-colors">
                      <Mail size={18} className="text-[#13EC13] group-hover:text-black" />
                    </div>
                    <span className="font-mono text-gray-300">contact@taconsulting.com</span>
                  </div>
                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-[#3E7B52]/20 flex items-center justify-center group-hover:bg-[#13EC13] transition-colors">
                      <Phone size={18} className="text-[#13EC13] group-hover:text-black" />
                    </div>
                    <span className="font-mono text-gray-300">+237 XXX XXX XXX</span>
                  </div>
                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-[#3E7B52]/20 flex items-center justify-center group-hover:bg-[#13EC13] transition-colors">
                      <MapPin size={18} className="text-[#13EC13] group-hover:text-black" />
                    </div>
                    <span className="font-mono text-gray-300">Yaoundé, Cameroun</span>
                  </div>
                </div>
              </div>

              {/* Formulaire de contact */}
              <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl">
                <h4 className="text-xl font-bold mb-6 text-white">Demande de Contact</h4>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="Prénom" 
                      className="w-full h-11 px-4 rounded-lg bg-black/40 border border-white/10 text-white focus:border-[#13EC13] outline-none text-sm"
                    />
                    <input 
                      type="text" 
                      placeholder="Nom" 
                      className="w-full h-11 px-4 rounded-lg bg-black/40 border border-white/10 text-white focus:border-[#13EC13] outline-none text-sm"
                    />
                  </div>
                  <input 
                    type="email" 
                    placeholder="Email professionnel" 
                    className="w-full h-11 px-4 rounded-lg bg-black/40 border border-white/10 text-white focus:border-[#13EC13] outline-none text-sm"
                  />
                  <input 
                    type="text" 
                    placeholder="Organisation" 
                    className="w-full h-11 px-4 rounded-lg bg-black/40 border border-white/10 text-white focus:border-[#13EC13] outline-none text-sm"
                  />
                  <select className="w-full h-11 px-4 rounded-lg bg-black/40 border border-white/10 text-gray-400 focus:border-[#13EC13] outline-none text-sm">
                    <option>Sujet de la demande</option>
                    <option>Conseil Stratégique</option>
                    <option>Formation Interculturelle</option>
                    <option>Partenariat Institutionnel</option>
                    <option>Conférence</option>
                  </select>
                  
                  <Button className="w-full h-12 bg-[#3E7B52] hover:bg-[#2d5c3d] text-white font-bold mt-2">
                    Envoyer la demande
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