# =============================================================================
# STAGE 1: Build the React application
# =============================================================================
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files first for better Docker layer caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --silent

# Copy the rest of the frontend source code
COPY . .

# Build argument for the API URL — set at build time
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}

# Build the production bundle
RUN npm run build

# =============================================================================
# STAGE 2: Serve with Nginx
# =============================================================================
FROM nginx:alpine AS production

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# The nginx config will be mounted from docker-compose
# but we include a sensible default
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
