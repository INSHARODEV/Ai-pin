FROM node:18-alpine


WORKDIR /app


 COPY package*.json ./

# Install dependencies
RUN npm ci  

# Copy source code
COPY . .

RUN npm run build




 
# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]