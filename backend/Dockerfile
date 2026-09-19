# API de Yenyleths para Cloud Run.
#
# Se usa Cloud Run y no Cloud Functions porque el backend mantiene conexiones
# WebSocket abiertas (socket.io: chat y senalizacion de videollamadas), y las
# funciones no sostienen conexiones de larga duracion.

FROM node:22-slim

WORKDIR /app

# Las dependencias se copian aparte para que la capa se reutilice mientras el
# package.json no cambie: los despliegues siguientes suben solo el codigo.
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# Cloud Run asigna el puerto por la variable PORT; server.js ya la respeta.
ENV NODE_ENV=production
EXPOSE 8080

CMD ["node", "server.js"]
