#!/bin/bash
set -e

# Script para iniciar INTEGRA+ (Backend, Frontend y XAMPP)
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Iniciando INTEGRA+..."

# 1. Iniciar XAMPP (MySQL y phpMyAdmin)
echo "📊 Iniciando XAMPP..."
sudo /opt/lampp/lampp start

# Esperar un poco para que XAMPP inicie
sleep 3

find_free_port() {
  local port=$1
  while lsof -iTCP:"${port}" -sTCP:LISTEN >/dev/null 2>&1; do
    port=$((port + 1))
  done
  echo "$port"
}

BACKEND_PORT=$(find_free_port 5000)
FRONTEND_PORT=$(find_free_port 5173)

if [ "$BACKEND_PORT" != "5000" ]; then
  echo "⚠️  Puerto 5000 ocupado. Usando backend en puerto $BACKEND_PORT"
fi
if [ "$FRONTEND_PORT" != "5173" ]; then
  echo "⚠️  Puerto 5173 ocupado. Usando frontend en puerto $FRONTEND_PORT"
fi

export PORT="$BACKEND_PORT"
export FRONTEND_URL="http://localhost:$FRONTEND_PORT"
export VITE_API_URL="http://localhost:$BACKEND_PORT"
export VITE_PORT="$FRONTEND_PORT"

# 2. Iniciar Backend y Frontend en paralelo
echo "⚙️  Iniciando Backend y Frontend..."
cd "$ROOT_DIR"
npm run dev

echo "✅ INTEGRA+ iniciado correctamente!"
echo "🌐 Frontend: http://localhost:$FRONTEND_PORT"
echo "🔧 Backend: http://localhost:$BACKEND_PORT"
echo "🗄️  phpMyAdmin: http://localhost/phpmyadmin"