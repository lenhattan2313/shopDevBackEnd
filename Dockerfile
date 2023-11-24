ARG NODE_VERSION=18.12.1
FROM node:${NODE_VERSION}-alpine
WORKDIR /usr/src/app
COPY package*.json .
RUN npm ci
COPY . .
EXPOSE 3052
CMD ["npm", "run", "dev"]
