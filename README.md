SnowShoe
========

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

While npm is installing dependencies, [create an application on Github](https://github.com/settings/applications/new).
For the field `Authorization callback URL` follow this pattern: `<your.domain.com>/auth/github/callback`, for Snowshoe to be able to log in to github.
After the application creation, note the **Client ID** and the **Client Secret** and copy them to the configuration file:
```
cp config/default.yml.dist config/default.yml
sed -i 's/\[GITHUB_CLIENT_ID\]/<your_application_client_id>/' config/default.yml
sed -i 's/\[GITHUB_CLIENT_SECRET\]/<your_application_client_secret>/' config/default.yml
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

### Full installation instructions
```
git clone git@github.com:ludovic-gonthier/snowshoe.git
cd snowshoe

wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.25.0/install.sh | bash
nvm install

npm install -g gulp
npm install

cp config/default.yml.dist config/default.yml
sed -i 's/\[GITHUB_CLIENT_ID\]/<your_application_client_id>/' config/default.yml
sed -i 's/\[GITHUB_CLIENT_SECRET\]/<your_application_client_secret>/' config/default.yml

gulp reactify
gulp server
```

## Heroku deployment

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)
