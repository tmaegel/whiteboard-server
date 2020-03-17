FROM node:13-alpine
LABEL maintainer="Toni Mägel <tmaegel@posteo.de>"

ARG BUILDTYPE
ENV NODE_ENV $BUILDTYPE

# Create app directory
WORKDIR /usr/src/app
RUN chown -R 1000:1000 /usr/src/app
# User node
USER 1000

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY --chown=1000:1000 package.json ./

RUN npm install --production
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
RUN mkdir config
COPY --chown=1000:1000 src/ .
COPY --chown=1000:1000 config/ ./config

EXPOSE 3000

CMD [ "node", "server.js" ]
