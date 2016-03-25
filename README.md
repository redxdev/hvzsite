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

To configure the website, copy `config/local.js.dist` to `config/local.js`.
Edit this file, and add any additional settings you may need to it. You can
also edit other files in the config directory, but note that all options
are overridden by entries in `local.js`.

For development purposes, the "localDiskDb" connection is probably good
enough (it saves to a json file in .tmp). For production purposes, you should
setup a connection to a database such as MySQL, MongoDB, etc...

### Development

For the purposes of development, you will need to launch both the api server and also an ember-cli server. To do so,
run the following in two different terminals:

    cd server
    sails lift
    
and

    cd client
    ember server
    
This will launch the api server on http://127.0.0.1:1337 and the ember development server on http://127.0.0.1:4200.

### Building the Client

Run the following command to build the client:

    ember build --environment=production --output-path=../server/assets

### User Accounts

In order to create the initial superadmin account, open up the sails console with

    sails console
    
within the server directory. Run the following command:

    AuthService.createSuperAdmin('Your Name', 'Your Email');

You may also create additional accounts with any of the following commands:

    AuthService.createUser('Your Name', 'Your Email'); // creates an inactive user, same as registering a new user account
    AuthService.createActiveUser('Your Name', 'Your Email'); // creates an active user

## Running the Website

To run the website, run the following command:

    sails lift

If successful, the website should start on port 1337.

### Running in Production

For running in production, we use [PM2](http://pm2.keymetrics.io/), configured
to run `app.js`.
