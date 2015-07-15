FROM library/node

ENV NODE_ENV="development"
ENV PORT=3000
ENV SERVER_SECRET="This is not secret, you should change it"
ENV SNOWSHOE_HOSTNAME="127.0.0.1:3000"
ENV SNOWSHOE_APP_PROTOCOL="http"
ENV SNOWSHOE_APP_DISPLAY_PR_TITLE=true
ENV GITHUB_POLL_TIMEOUT=60

RUN mkdir /sources

COPY package.json /sources/package.json

WORKDIR /sources

RUN npm install

COPY . /sources

# Manually call reactify
CMD /sources/node_modules/.bin/gulp reactify
CMD /sources/node_modules/.bin/gulp server
