# Stage 1: Build the app
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production environment
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
# We copy the 'dist' folder from the stage we named 'build'
COPY --from=build /app/dist ./dist

CMD ["npm", "run", "start:prod"]
