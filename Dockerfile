FROM node:latest

ARG BUILDTYPE
ENV NODE_ENV $BUILDTYPE

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package.json ./

RUN npm install --production
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
RUN mkdir config crt
COPY src/ .
COPY crt/ ./crt
COPY config/ ./config
RUN chown -R node:node .

EXPOSE 3000

CMD [ "node", "server.js" ]
