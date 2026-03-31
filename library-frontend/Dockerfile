# Step 1: Build the React application
FROM node:18-alpine AS build
WORKDIR /app
# Copy dependency files first for better caching
COPY package*.json ./
RUN npm install
# Copy the rest of the code and build
COPY . .
RUN npm run build

# Step 2: Serve the app using Nginx
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]