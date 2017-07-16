# Humans vs Zombies

This is the next-generation version of the website used by the Rochester
Institute of Technology's Humans vs Zombies club.

## Warning

This website echews most best practices of ember, dear god do not use it as a model for how to make a website. It works and it works well, that doesn't mean the code is pretty.

## Installing

The website is powered by _NodeJS_ and requires both _node_ and _npm_ to be
installed.

The following packages should be installed with `npm install -g <package>`:

  - sails
  - bower
  - ember-cli

Once global packages are installed, run the following to install dependencies:

    cd ./server
    npm install
    cd ../client
    npm install
    bower install

To configure the website, copy `config/local.js.dist` to `config/local.js`.
Edit this file, and add any additional settings you may need to it. You can
also edit other files in the config directory, but note that all options
are overridden by entries in `local.js`.

For development purposes, the "localDiskDb" connection is probably good
enough (it saves to a json file in .tmp). For production purposes, you should
setup a connection to a database such as MySQL, MongoDB, etc...

### Push Notification Support

We use [OneSignal](https://onesignal.com/) for web-push notifications. hvzsite doesn't send any notifications itself,
but it will prompt users to enable notifications if you want (and it will set the user's `team` tag in OneSignal).
We use this to quickly disseminate emergency information or changes to missions. If you want to use it, copy
`client/public/manifest.json.dist` to `client/public/manifest.json` and edit according to the docs
[here](https://documentation.onesignal.com/docs/web-push-setup). You can then change the OneSignal settings in
`client/config/environment.js`.

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

Make sure to run this whenever the client changes!

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

## Some Notes

The frontend is a bit hastily thrown together in Ember, and doesn't really follow all conventions thoroughly. It doesn't
make use of Ember's model system or components very well, but there are plans to slowly clean it up.

If the database model changes in sails, running in production will _not_ automatically apply the changes. You will have
to either manually apply changes or let sails try to alter it (possibly destroying data!!!) by running the server
in development mode briefly.

## Additional Credits

* Notification Dropdown: https://bootsnipp.com/snippets/depAz