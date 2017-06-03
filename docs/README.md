# hvzsite documentation

Files in this folder contain documentation for the hvzsite REST API. The current API version is 2.

## Endpoint

All API endpoints are located at http://your-server-url/api/v2/ unless otherwise specified. All
endpoints return a JSON response unless otherwise specified.

## Errors

Errors will always be returned as a non-200 error code. Errors may have either a `message` key
containing a string describing the error or a `problems` key containing an array of strings
describing the error. `problems` should be preferred if it exists.

## Administrative Endpoints

Administrative endpoints are not currently documented. Check out `server/config/routes.js` for a list of
routes. See `server/config/policies.js` for access level requirements.