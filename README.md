# Documentação da API

Este projeto contém uma API que pode ser testada usando o Swagger. Esta documentação orienta como acessar e testar as APIs disponíveis.

## Tecnologias utilizadas:

![NodeJs](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=Prisma&logoColor=white)
![PostgreSql](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=PostgreSQL&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white)

## Pré-requisitos

Antes de começar, você precisa ter os seguintes itens instalados em seu ambiente:

- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- [Docker](https://www.docker.com/get-started)

## Instalação

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/alehandroferreira/vehicle-management
   ```

2. **Acesse o repositório:**

   ```bash
   cd vehicle-management
   ```

3. **Nesse caso a nível exclusivo de teste, deve-se criar um arquivo com o nome .env , inserir esses dados:**

   ```bash
   #postgre
   POSTGRES_DB=vehicle_management
   POSTGRES_USER=username
   POSTGRES_PASSWORD=pa55word
   DATABASE_URL=postgresql://username:pa55word@db:5432/vehicle_management
   ```

4. **Rodar o comando abaixo:**

   ```bash
   npm install
   ```

5. **Verificar se o docker está devidamente instalado e configurado na maquina:**

- [Docker](https://www.docker.com/get-started)

6. **Estando tudo ok com o ambiente docker, executar o comando:**

   ```bash
   npm run docker:up
   ```

7. **Aguardar a aplicação ficar com o status de "Running"**

8. **Acessar a rota do swagger:**

   ```bash
   http://localhost:3000/api
   ```

9. **Seguir as orientações dos modelos e exemplos que estão disponibilizados no swagger.**

10. **Acessar a rota do swagger:**

    ```bash
    npm run test
    ```
