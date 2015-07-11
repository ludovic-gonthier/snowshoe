FROM library/node

RUN npm install -g gulp

RUN mkdir /sources

COPY package.json /sources/package.json
WORKDIR /sources
RUN npm install

COPY . /sources

RUN gulp reactify

CMD /sources/docker/run
