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
  Megaphone
} from "lucide-react";
import Image from "next/image"; // <--- CETTE LIGNE ETAIT MANQUANTE
import { Button } from "@/components/ui/Button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Services adaptés à un Groupe Média/Presse & Intelligence
const services = [
  {
    icon: Newspaper,
    title: "Édition & Publication",
    description: "Production d'informations de qualité suivant les standards du journalisme britannique.",
    features: ["Quotidien d'actualité", "Éditoriaux exclusifs", "Dossiers d'investigation"]
  },
  {
    icon: TrendingUp,
    title: "Intelligence Économique",
    description: "Analyse des marchés et veille stratégique pour les décideurs du continent.",
    features: ["Rapports sectoriels", "Analyses boursières", "Veille concurrentielle"]
  },
  {
    icon: Megaphone,
    title: "Communication Stratégique",
    description: "Diffusion de vos messages institutionnels auprès d'une audience qualifiée.",
    features: ["Publireportages", "Relations presse", "Brand Content"]
  },
  {
    icon: Globe,
    title: "Public Affairs & Lobbying",
    description: "Mise en relation et influence auprès des sphères décisionnelles.",
    features: ["Médiation institutionnelle", "Forums d'influence", "Networking"]
  }
];

// L'équipe dirigeante fictive (ou placeholders) pour Today's Africa
const team = [
  {
    name: "Direction de la Rédaction",
    role: "Siège Social",
    location: "Yaoundé, Cameroun",
    description: "Le cœur de notre production éditoriale, garant de l'éthique et de la ligne anglo-saxonne."
  },
  {
    name: "Bureau International",
    role: "Correspondants",
    location: "Londres, Royaume-Uni",
    description: "Assurant le lien stratégique entre l'actualité africaine et la diaspora britannique."
  }
];

// Zones de couverture
const regions = [
  "Cameroun (Siège)",
  "Nigeria", 
  "Ghana",
  "Rwanda",
  "Afrique du Sud"
];

export default function TodaysAfricaPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans selection:bg-[#3E7B52] selection:text-white flex flex-col">
      <Navbar />

      <main className="max-w-[1400px] mx-auto w-full px-6 md:px-12 py-12 space-y-20">
        
        {/* ================================================================
            1. HERO SECTION (Journal Britannique)
           ================================================================ */}
        <section className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-[#051F10] dark:to-zinc-900 p-8 md:p-16 rounded-3xl border border-green-100 dark:border-zinc-800 relative overflow-hidden">
          {/* Décoration d'arrière-plan */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#13EC13]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#3E7B52]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                
                {/* Badge Haut */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-[#3E7B52] text-white p-3 rounded-xl shadow-lg shadow-green-900/10">
                    <Newspaper size={32} />
                  </div>
                  <span className="text-[#3E7B52] dark:text-[#13EC13] font-bold tracking-widest text-sm uppercase">
                    The Voice of Authority
                  </span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-extrabold text-gray-900 dark:text-white leading-[1.1]">
                  <span className="text-[#3E7B52]">TODAY'S</span>
                  <br />AFRICA
                </h1>
                
                <h2 className="text-xl font-medium text-gray-500 dark:text-gray-400 border-l-4 border-[#13EC13] pl-4 italic">
                  "Excellence journalistique britannique, au cœur du Cameroun."
                </h2>
                
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-md">
                  Premier groupe média et cabinet d'intelligence basé à Yaoundé. Nous offrons une perspective anglo-saxonne sur les enjeux économiques et politiques qui façonnent le continent.
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <Button className="h-12 px-8 bg-[#3E7B52] hover:bg-[#2d5c3d] text-white font-bold shadow-xl shadow-[#3E7B52]/20">
                    Découvrir nos Analyses
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                  <Button variant="outline" className="h-12 px-8 border-green-200 dark:border-green-800 text-[#3E7B52] dark:text-[#13EC13] hover:bg-green-50 dark:hover:bg-zinc-800 font-bold">
                    Abonnements Corporate
                  </Button>
                </div>
              </div>

              {/* Card Droit : Info Siège */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#3E7B52] to-[#13EC13] rounded-2xl blur opacity-20 dark:opacity-40"></div>
                <div className="relative bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-800">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Siège Editorial
                        </h3>
                        <p className="text-sm text-gray-500">Headquarters</p>
                    </div>
                    <Radio className="text-[#13EC13] animate-pulse" size={24}/>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg">
                      <div className="bg-white dark:bg-zinc-800 p-2 rounded-full border border-gray-100 dark:border-zinc-700">
                         <MapPin className="text-[#3E7B52]" size={20} />
                      </div>
                      <div>
                          <p className="text-xs text-gray-500 uppercase font-bold">Localisation</p>
                          <span className="text-gray-800 dark:text-gray-200 font-semibold">Yaoundé, Cameroun</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg">
                       <div className="bg-white dark:bg-zinc-800 p-2 rounded-full border border-gray-100 dark:border-zinc-700">
                          <Building2 className="text-[#3E7B52]" size={20} />
                       </div>
                       <div>
                          <p className="text-xs text-gray-500 uppercase font-bold">Standard</p>
                          <span className="text-gray-800 dark:text-gray-200 font-semibold">Anglo-Saxon Standard</span>
                       </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg">
                       <div className="bg-white dark:bg-zinc-800 p-2 rounded-full border border-gray-100 dark:border-zinc-700">
                          <Target className="text-[#3E7B52]" size={20} />
                       </div>
                       <div>
                          <p className="text-xs text-gray-500 uppercase font-bold">Expertise</p>
                          <span className="text-gray-800 dark:text-gray-200 font-semibold">Politique & Économie</span>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            2. SERVICES (Intelligence & Média)
           ================================================================ */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <span className="text-[#3E7B52] dark:text-[#13EC13] font-bold tracking-widest text-xs uppercase bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full">
              Nos Piliers
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
              Information & Intelligence Stratégique
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              Au-delà de l'actualité, nous fournissons les clés de lecture pour naviguer l'environnement complexe de l'Afrique Centrale.
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
        </section>

        {/* ================================================================
            3. ÉQUIPE & COUVERTURE
           ================================================================ */}
        <section className="bg-gray-50 dark:bg-zinc-900/50 rounded-3xl p-8 md:p-16 space-y-12 border border-gray-100 dark:border-zinc-800">
          <div className="grid lg:grid-cols-2 gap-16">
            
            {/* Colonne Equipe */}
            <div className="space-y-8">
                <div>
                    <span className="text-[#3E7B52] dark:text-[#13EC13] font-bold tracking-widest text-xs uppercase mb-2 block">
                    Leadership
                    </span>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6">
                    Structure Editoriale
                    </h2>
                </div>

                <div className="space-y-6">
                    {team.map((member, index) => (
                    <div key={index} className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm flex gap-4 items-center">
                        <div className="w-16 h-16 bg-[#3E7B52]/10 rounded-full flex items-center justify-center shrink-0">
                             <Users size={24} className="text-[#3E7B52]" />
                        </div>
                        <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {member.name}
                        </h3>
                        <p className="text-[#3E7B52] dark:text-[#13EC13] font-bold text-sm">
                            {member.role}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <MapPin size={12}/> {member.location}
                        </p>
                        </div>
                    </div>
                    ))}
                </div>
            </div>

            {/* Colonne Couverture (Map Vibes) */}
            <div className="bg-[#3E7B52] rounded-3xl p-8 md:p-10 text-white relative overflow-hidden flex flex-col justify-center">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <Globe className="text-[#13EC13]/20 absolute -right-12 -bottom-12 w-64 h-64 animate-spin-slow" />
                
                <h3 className="text-2xl font-bold mb-6 relative z-10">Couverture Pan-Africaine</h3>
                <p className="text-green-100 mb-8 relative z-10">
                    Depuis Yaoundé, Today's Africa étend son influence à travers le Commonwealth et la Francophonie.
                </p>

                <div className="grid grid-cols-2 gap-3 relative z-10">
                    {regions.map((region, idx) => (
                        <div key={idx} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2 text-sm font-semibold flex items-center gap-2 hover:bg-white/20 transition-colors cursor-default">
                             <div className="w-2 h-2 rounded-full bg-[#13EC13]"></div>
                             {region}
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            4. CONTACT (NEWSROOM)
           ================================================================ */}
        <section className="bg-gradient-to-r from-gray-900 to-black rounded-3xl p-8 md:p-16 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
             <Image src="/images/noise.png" alt="texture" fill className="object-cover opacity-10" />
          </div>
          {/* Accent Line Top */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#3E7B52] to-[#13EC13]"></div>

          <div className="relative z-10 max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-3xl md:text-4xl font-black text-white">
                  Contacter la Rédaction
                </h3>
                <p className="text-gray-400 text-lg">
                  Vous souhaitez soumettre une tribune, devenir annonceur ou solliciter une analyse stratégique ?
                </p>
                
                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-[#3E7B52]/20 flex items-center justify-center group-hover:bg-[#13EC13] transition-colors">
                        <Mail size={18} className="text-[#13EC13] group-hover:text-black" />
                    </div>
                    <span className="font-mono text-gray-300">newsroom@todaysafrica.com</span>
                  </div>
                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-[#3E7B52]/20 flex items-center justify-center group-hover:bg-[#13EC13] transition-colors">
                        <Phone size={18} className="text-[#13EC13] group-hover:text-black" />
                    </div>
                    <span className="font-mono text-gray-300">+237 (Service Abonnement)</span>
                  </div>
                </div>
              </div>

              {/* Mini Form */}
              <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl">
                <h4 className="text-xl font-bold mb-6 text-white">Formulaire de contact</h4>
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
                  <select className="w-full h-11 px-4 rounded-lg bg-black/40 border border-white/10 text-gray-400 focus:border-[#13EC13] outline-none text-sm">
                      <option>Sujet de la demande</option>
                      <option>Proposer un Article</option>
                      <option>Service Commercial / Publicité</option>
                      <option>Conseil & Intelligence</option>
                  </select>
                  
                  <Button className="w-full h-12 bg-[#3E7B52] hover:bg-[#2d5c3d] text-white font-bold mt-2">
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