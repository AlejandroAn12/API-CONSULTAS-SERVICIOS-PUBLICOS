# Etapa de construcción
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar todas las dependencias (incluyendo devDependencies para build)
RUN npm ci

# Copiar el código fuente
COPY . .

# Generar cliente de Prisma
RUN npx prisma generate

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM node:18-alpine AS production

WORKDIR /app

# Copiar package.json
COPY package*.json ./
COPY prisma ./prisma/

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Copiar el build desde la etapa builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Verificar que el build existe
RUN ls -la dist/

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["node", "dist/main"]