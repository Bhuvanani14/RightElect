FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --only=production || true
COPY . .
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=build /app/package.json ./
COPY --from=build /app/dist ./dist
RUN npm ci --only=production || true
ENV PORT=8080
EXPOSE 8080
CMD ["node", "dist/index.js"]
