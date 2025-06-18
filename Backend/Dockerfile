#Dieses Image wird von den Node.js-Entwicklern und der Docker-Community gepflegt.
#Es befindet sich auf Docker Hub (dem öffentlichen Standard-Repository für Docker-Images).
#Es enthält nicht nur die Node.js-Software selbst, sondern ein komplettes, lauffähiges Linux-Betriebssystem, 
#in dem Node.js und npm (Node Package Manager) bereits vorinstalliert und konfiguriert sind.

FROM node:20-alpine

WORKDIR /app

# Abhängigkeiten separat cachen
COPY package*.json ./

RUN npm install --legacy-peer-deps

# Quellcode kopieren
COPY . .

# Standard-Start
CMD ["npm", "run", "dev"]



