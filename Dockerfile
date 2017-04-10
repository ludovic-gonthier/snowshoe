FROM node:7.4.0

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/snowshoe && cp -a /tmp/node_modules /opt/snowshoe/

ADD . /opt/snowshoe
WORKDIR /opt/snowshoe
RUN npm run build

CMD npm run nodemon:application
