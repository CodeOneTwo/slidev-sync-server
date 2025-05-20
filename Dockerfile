# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY . .
RUN npm ci && npm run build

EXPOSE 8080
CMD ["npm", "run", "start"]

