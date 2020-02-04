FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .
RUN chown -R node:node .

EXPOSE 3000

ENTRYPOINT [ "node", "src/server.js" ]
CMD [ "--help" ]
