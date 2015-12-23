# SnowShoe [![Build Status](https://travis-ci.org/ludovic-gonthier/snowshoe.svg)](https://travis-ci.org/ludovic-gonthier/snowshoe) [![Coverage Status](https://coveralls.io/repos/ludovic-gonthier/snowshoe/badge.svg?branch=master&service=github)](https://coveralls.io/github/ludovic-gonthier/snowshoe?branch=master)

GitHub dashboard to keep tracks on your ongoing PR.

![SnowShoe](docs/quick-glimpse.png "SnowShoe")

## Requirements

- Node v0.12.2
- Gulp

## Install

First clone the repo:

``` sh
git clone git@github.com:ludovic-gonthier/snowshoe.git
```

If you do not have NodeJS installed yet, we recommend you use [Nvm](https://github.com/creationix/nvm) :

``` sh
cd snowshoe
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.25.0/install.sh | bash

## Install the correct node version
nvm install
## Or use the already installed version
nvm use
```

The project is running tasks with [Gulp](http://gulpjs.com/).
To install it:
```
npm install -g gulp
```

Then install the project dependencies:

``` sh
npm install
```

### Github application
While npm is installing dependencies, [create an application on Github](https://github.com/settings/applications/new).
For the field `Authorization callback URL` follow this pattern: `<your.domain.com>/auth/github/callback`, for Snowshoe to be able to log in to github.
After the application creation, note the **Client ID** and the **Client Secret** and set the environment variables in .env (we use [dotenv](https://github.com/motdotla/dotenv)) file:

e.g.:
```
SERVER_SECRET="xxxxx"
GITHUB_CLIENT_ID="xxxx"
GITHUB_CLIENT_SECRET="xxxxx"
GITHUB_POLL_TIMEOUT=60
SNOWSHOE_HOST="127.0.0.1:3000"
SNOWSHOE_APP_PROTOCOL="http"
SNOWSHOE_APP_DISPLAY_PR_TITLE="false"
PORT=3000
```

Snowshoe uses Browserify to regroup all javascript used in a page in one file.
In addition to that, we transform the JSX files into plain javascript.
To generate the file run:
```
gulp reactify
```

An finally run the server:
```
gulp server
```

You can change the port on which the application runs by changing the ``PORT`` environment variable.
e.g.
```
PORT=8500
```

### Full installation instructions
```
git clone git@github.com:ludovic-gonthier/snowshoe.git
cd snowshoe

wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.25.0/install.sh | bash
nvm install

npm install -g gulp
npm install

# create a .env file with
# SERVER_SECRET="xxxxx"
# GITHUB_CLIENT_ID="xxxx"
# GITHUB_CLIENT_SECRET="xxxxx"
# GITHUB_POLL_TIMEOUT=60
# SNOWSHOE_HOST="127.0.0.1:3000"
# SNOWSHOE_APP_PROTOCOL="http"
# SNOWSHOE_APP_DISPLAY_PR_TITLE="false"
# PORT=3000

gulp reactify
gulp server
```

## Heroku deployment

You can deploy a sandbox or production instance using the following button.

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

In order to set the environment variables properly you need to [create an application on github](#github-application).
Once it is created update the heroku environment variables, you will find more information below.

### Environment variables definition
Exhaustive list of variables:

- SERVER_SECRET: secret used for sessions, set it to a long random string
- GITHUB_CLIENT_ID: github client id you got from creating the app on github (see [above](#github-application))
- GITHUB_CLIENT_SECRET: github secret from last step
- GITHUB_POLL_TIMEOUT: control timeout when calling out github api (default: 60 seconds)
- SNOWSHOE_HOST: Host used in the Github Oauth callback (can contain the port as much as the hostname)
- SNOWSHOE_APP_PROTOCOL: "https" or "http", on heroku you can safely use https
- SNOWSHOE_APP_DISPLAY_PR_TITLE: Weither the application should display the PR titles
- PORT: do not set this variable, Heroku sets it for you

## Personnal Access Token

You can use [Github generated personnal Token](https://github.com/settings/tokens/new) to access your dashboard.
Simply add the `access_token` to the url:
```
http://<application_domain_name>/?access_token=<your_personnal_token>
```

Make sure the token has access to these scopes:

- **repo**
- **user**
- **read:org**
