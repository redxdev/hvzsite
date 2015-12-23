# Humans vs Zombies

__This version of the website is unfinished! If you want to see working code,
checkout the [old version](https://github.com/redxdev/hvzsite) written in
PHP.__

This is the next-generation version of the website used by the Rochester
Institute of Technology's Humans vs Zombies club.

## Installing

The website is powered by _NodeJS_ and requires both _node_ and _npm_ to be
installed.

The following packages should be installed with `npm install -g <package>`:

  - sails
  - bower

Once global packages are installed, run the following to install dependencies:

    npm install
    bower install

To configure the website, copy `config/local.js.dist` to `config/local/js`.
Edit this file, and add any additional settings you may need to it. You can
also edit other files in the config directory, but note that all options
are overridden by entries in `local.js`.

For development purposes, the "localDiskDb" connection is probably good
enough (it saves to a json file in .tmp). For production purposes, you should
setup a connection to a database such as MySQL, MongoDB, etc...

### User Accounts

TODO: How to setup an admin user.

## Running the Website

To run the website, run the following command:

    sails lift

If successful, the website should start on port 1337.

### Running in Production

For running in production, we use [PM2](http://pm2.keymetrics.io/), configured
to run `app.js`.
