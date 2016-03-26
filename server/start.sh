#!/bin/bash

## You must run 'pm2 delete web' after changing anything here!
NODE_ENV=production pm2 start app.js --name=web -i 5 --env=production
