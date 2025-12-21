#!/bin/bash

echo "🚀 Installation du serveur pour Today's Africa"

# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Installation Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Installation Git
sudo apt install -y git

# Installation Nginx (pour la configuration SSL future)
sudo apt install -y nginx

# Création du dossier de l'application
sudo mkdir -p /opt/todayafrica
sudo chown $USER:$USER /opt/todayafrica

# Configuration du firewall
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

echo "✅ Installation terminée. Redémarrage recommandé."
echo "Commandes suivantes :"
echo "1. Redémarrer : sudo reboot"
echo "2. Cloner le projet : git clone [votre-repo] /opt/todayafrica"
echo "3. Lancer : cd /opt/todayafrica && docker-compose up -d"