#!/bin/bash

echo "🚀 Iniciando Yenyleths Store..."
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Backend
echo -e "${BLUE}[1/3]${NC} Iniciando Backend en puerto 5000..."
(cd backend && npm start) &
BACKEND_PID=$!

sleep 2

# Frontend
echo -e "${BLUE}[2/3]${NC} Iniciando Frontend en puerto 5175..."
(cd frontend && npm run dev) &
FRONTEND_PID=$!

sleep 2

# Administrador
echo -e "${BLUE}[3/3]${NC} Iniciando Administrador en puerto 5173..."
(cd administrador && npm run dev) &
ADMIN_PID=$!

echo ""
echo -e "${GREEN}✓ Todo está corriendo:${NC}"
echo "  📦 Backend:      http://localhost:5000"
echo "  🛍️  Frontend:     http://localhost:5175"
echo "  👨‍💼 Administrador: http://localhost:5173"
echo ""
echo "Presiona Ctrl+C para detener todo"
echo ""

# Trap para limpiar procesos al salir
trap "kill $BACKEND_PID $FRONTEND_PID $ADMIN_PID 2>/dev/null" EXIT

# Mantener el script corriendo
wait
