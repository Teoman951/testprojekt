#Dieses Image wird von den Node.js-Entwicklern und der Docker-Community gepflegt.
#Es befindet sich auf Docker Hub (dem öffentlichen Standard-Repository für Docker-Images).
#Es enthält nicht nur die Node.js-Software selbst, sondern ein komplettes, lauffähiges Linux-Betriebssystem, 
#in dem Node.js und npm (Node Package Manager) bereits vorinstalliert und konfiguriert sind.

FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

CMD ["npm","run","dev","--","--host","0.0.0.0"]
