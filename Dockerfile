# Usar a imagem oficial do Node.js com versão LTS e Alpine
FROM node:20.17.0-alpine

# Diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copiar os arquivos de package.json e package-lock.json para instalar as dependências
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar o restante dos arquivos da aplicação
COPY . .

# Expor a porta que a aplicação vai rodar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD npx prisma migrate dev --name migration && npm run start:dev
