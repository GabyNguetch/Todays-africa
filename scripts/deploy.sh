#!/bin/bash

echo "🚀 Déploiement de Today's Africa depuis la branche frontend"

# Créer le dossier s'il n'existe pas
sudo mkdir -p /opt/todayafrica
sudo chown $USER:$USER /opt/todayafrica

# Cloner ou mettre à jour le dépôt
if [ ! -d "/opt/todayafrica/.git" ]; then
    echo "📥 Clonage du dépôt..."
    git clone https://github.com/Folong-zidane/totayafrica.git /opt/todayafrica
fi

cd /opt/todayafrica

# Checkout sur la branche frontend
echo "🔄 Checkout sur la branche frontend..."
git fetch origin
git checkout frontend
git pull origin frontend

# Arrêter les conteneurs existants
echo "🛑 Arrêt des conteneurs..."
docker-compose down || true

# Nettoyer les images non utilisées
docker system prune -f

# Construire et lancer les conteneurs
echo "🏗️ Construction et lancement..."
docker-compose up -d --build

# Attendre que les services démarrent
echo "⏳ Attente du démarrage des services..."
sleep 30

# Vérifier le statut
echo "🔍 Vérification du statut..."
docker-compose ps

# Tester la connectivité
echo "🌐 Test de connectivité..."
curl -f http://localhost:80/health || echo "❌ Service non accessible"

echo "✅ Déploiement terminé"
echo "🌐 Application accessible sur : http://194.163.175.53"