# 🔥 FIX: use Debian-based image (Prisma compatible)
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the app
COPY . .

# Prisma generate
RUN npx prisma generate

# Expose port
EXPOSE 8000

# Start app
CMD ["sh", "-c", "npx prisma migrate deploy; node start.js"]