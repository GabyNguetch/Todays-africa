"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  Building2, 
  Users, 
  Globe, 
  Target, 
  Award, 
  Mail, 
  Phone, 
  MapPin,
  CheckCircle,
  Star,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { APP_CONFIG } from "@/lib/constant";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const services = [
  {
    icon: Globe,
    title: "Analyse Géopolitique",
    description: "Études approfondies des dynamiques politiques et économiques africaines",
    features: ["Rapports pays", "Analyses sectorielles", "Veille stratégique"]
  },
  {
    icon: Users,
    title: "Conseil Interculturel",
    description: "Accompagnement dans la compréhension des cultures africaines",
    features: ["Formation équipes", "Médiation culturelle", "Stratégies d'adaptation"]
  },
  {
    icon: Target,
    title: "Stratégie d'Implantation",
    description: "Support pour l'expansion et l'investissement en Afrique",
    features: ["Études de marché", "Partenariats locaux", "Conformité réglementaire"]
  },
  {
    icon: Briefcase,
    title: "Due Diligence",
    description: "Évaluation des risques et opportunités d'investissement",
    features: ["Audit réglementaire", "Analyse des risques", "Recommandations stratégiques"]
  }
];

const team = [
  {
    name: "Cécile Mireille BOKALLI",
    role: "Directrice Générale",
    location: "Yaoundé, Cameroun",
    description: "Experte en développement économique africain et relations internationales"
  },
  {
    name: "Ingrida KIM",
    role: "Directrice Filiale Moscou",
    location: "Moscou, Russie",
    description: "Spécialiste des relations Afrique-Russie et marchés émergents"
  }
];

const regions = [
  "Afrique Centrale",
  "Afrique Australe", 
  "Afrique de l'Est",
  "Afrique du Nord",
  "Afrique de l'Ouest"
];

export default function ConsultingCabinet() {
  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans selection:bg-[#7C3AED] selection:text-white flex flex-col">
      <Navbar />

      <main className="max-w-[1400px] mx-auto w-full px-6 md:px-12 py-12 space-y-20">
        
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-800 p-8 md:p-16 rounded-3xl border border-purple-100 dark:border-zinc-700 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-purple-600 text-white p-3 rounded-xl shadow-lg">
                    <Building2 size={32} />
                  </div>
                  <span className="text-purple-600 dark:text-purple-400 font-bold tracking-widest text-sm uppercase">
                    Cabinet de Conseil
                  </span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
                  <span className="text-purple-600 dark:text-purple-400">Intercultural</span>
                  <br />Consulting Cabinet
                </h1>
                
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Votre partenaire stratégique pour comprendre, investir et réussir en Afrique. 
                  Nous accompagnons les entreprises et institutions dans leur développement continental.
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <Button className="h-12 px-8 bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-xl">
                    Nos Services
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                  <Button variant="outline" className="h-12 px-8 border-purple-200 text-purple-600 hover:bg-purple-50 font-bold">
                    Nous Contacter
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-700">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Holding TAC/G
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="text-purple-600" size={20} />
                      <span className="text-gray-600 dark:text-gray-300">Siège: Yaoundé, Cameroun</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="text-purple-600" size={20} />
                      <span className="text-gray-600 dark:text-gray-300">Filiale: Moscou, Russie</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Award className="text-purple-600" size={20} />
                      <span className="text-gray-600 dark:text-gray-300">Expertise continentale</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <span className="text-purple-600 dark:text-purple-400 font-bold tracking-widest text-sm uppercase">
              Nos Expertises
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
              Services de Conseil Stratégique
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              Une approche intégrée pour accompagner votre développement en Afrique
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-gray-100 dark:border-zinc-800 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <service.icon size={24} />
                  </div>
                  <div className="flex-1 space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {service.description}
                    </p>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                          <CheckCircle size={16} className="text-purple-600" />
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

        {/* Team Section */}
        <section className="bg-gray-50 dark:bg-zinc-900 rounded-3xl p-8 md:p-16 space-y-12">
          <div className="text-center space-y-4">
            <span className="text-purple-600 dark:text-purple-400 font-bold tracking-widest text-sm uppercase">
              Notre Équipe
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
              Direction Exécutive
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <div key={index} className="bg-white dark:bg-zinc-800 p-8 rounded-2xl border border-gray-100 dark:border-zinc-700 text-center space-y-4">
                <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto">
                  <Users size={32} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {member.name}
                  </h3>
                  <p className="text-purple-600 dark:text-purple-400 font-semibold">
                    {member.role}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 flex items-center justify-center gap-1 mt-1">
                    <MapPin size={14} />
                    {member.location}
                  </p>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Coverage Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <span className="text-purple-600 dark:text-purple-400 font-bold tracking-widest text-sm uppercase">
              Couverture Géographique
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
              Présence Continentale
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {regions.map((region, index) => (
              <div key={index} className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-100 dark:border-zinc-800 text-center hover:shadow-lg transition-shadow">
                <Globe className="text-purple-600 mx-auto mb-3" size={24} />
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  {region}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 md:p-16 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-3xl md:text-4xl font-black">
                  Démarrons votre projet ensemble
                </h3>
                <p className="text-purple-100 text-lg">
                  Contactez-nous pour discuter de vos objectifs en Afrique et découvrir comment nous pouvons vous accompagner.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail size={20} className="text-purple-200" />
                    <span>contact@todaysafrica.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={20} className="text-purple-200" />
                    <span>+237 XXX XXX XXX</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin size={20} className="text-purple-200" />
                    <span>Yaoundé, Cameroun</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                <h4 className="text-xl font-bold mb-6">Demande de Contact</h4>
                <form className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Nom complet" 
                    className="w-full h-12 px-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-purple-200 outline-none focus:border-white/40"
                  />
                  <input 
                    type="email" 
                    placeholder="Email professionnel" 
                    className="w-full h-12 px-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-purple-200 outline-none focus:border-white/40"
                  />
                  <textarea 
                    placeholder="Décrivez votre projet..." 
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-purple-200 outline-none focus:border-white/40 resize-none"
                  />
                  <Button className="w-full h-12 bg-white text-purple-600 hover:bg-purple-50 font-bold">
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