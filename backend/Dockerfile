FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build TypeScript - ADD THIS LINE
RUN npm run build

# Verify dist was created
RUN ls -la /app/dist

EXPOSE 5000

CMD ["npm", "start"]