# Stage 1: Build frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Build backend
FROM node:22-alpine AS backend-builder
WORKDIR /app
COPY server/package*.json ./
RUN npm install
COPY server/. .
RUN npm run build

# Stage 3: Production - run backend + serve frontend
FROM node:22-alpine
WORKDIR /app

# Install backend production deps
COPY server/package*.json ./
RUN npm install --production

# Copy backend compiled code
COPY --from=backend-builder /app/dist ./dist

# Copy frontend built assets to /dist (server looks for ../dist from /app)
COPY --from=frontend-builder /app/dist /dist

EXPOSE 3001
CMD ["node", "dist/index.js"]
