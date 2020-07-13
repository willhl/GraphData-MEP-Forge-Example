FROM node:8

# Create app directory
WORKDIR /usr/src/app

#VOLUME /cert

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

#RUN npm install
# If you are building your code for production
#RUN npm install --only=production
RUN npm install 

# Bundle app source
COPY . .

ENV HOT_RELOADING=false NODE_ENV=production 

RUN npm run build-server && npm run build-prod


EXPOSE 3000
EXPOSE 3001
#EXPOSE 9229
CMD [ "node", "bin/start.js" ]
