#!/bin/sh

# Espera o PostgreSQL iniciar
until nc -z db 5432; do
  echo "Aguardando o PostgreSQL iniciar..."
  sleep 1
done

# Gera os arquivos do Prisma
npx prisma generate

# Inicia a aplicação
exec "$@"
