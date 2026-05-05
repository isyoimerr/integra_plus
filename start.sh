#!/bin/bash

# Script para iniciar INTEGRA+ (Backend, Frontend y XAMPP)

echo "🚀 Iniciando INTEGRA+..."

# 1. Iniciar XAMPP (MySQL y phpMyAdmin)
echo "📊 Iniciando XAMPP..."
sudo /opt/lampp/lampp start

# Esperar un poco para que XAMPP inicie
sleep 3

# 2. Iniciar Backend y Frontend en paralelo
echo "⚙️  Iniciando Backend y Frontend..."
cd /home/ing-ospino/integra_plus
npm run dev

echo "✅ INTEGRA+ iniciado correctamente!"
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend: http://localhost:5000"
echo "🗄️  phpMyAdmin: http://localhost/phpmyadmin"