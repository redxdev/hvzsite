# Authentication

Authentication endpoints are quite a bit different from other endpoints as they need to be able
to handle google authentication. The login and register endpoints are only meant to be used by
an application, and not by other websites. In fact, cross-origin restrictions in browsers will
prevent google auth from working outside of the HvZ website itself.

## Google Authentication

Google authentication should only be attempted from inside an application, instead of a website.
Cross-origin restrictions will prevent any other website from authenticating via google.

Using google authentication will allow an application to retrieve a user's API key for subsequent
requests to the API. To obtain the API key, you have to do the following:

1. Open a browser frame pointing at `http://your-hvz-website.com/auth/l/google`
2. Immediately set `window.onAuthResult` to your own function.
3. Wait for `window.onAuthResult` to be called.

`onAuthResult` will be called with a single parameter in the following format:

    {
      "success": boolean,
      "message": string
    }

If `success` is true, there will be an additional key called `key` which will contain the user's
API key.

### Internal Use

Interally, the website client uses a slightly different method, instead opening a window and
then listening for `postMessage`. This, however, will not work for external websites due to
cross-origin restrictions in browsers. This is also hard to implement in an application as it
requires setting `window.origin` on the authentication window to something that can receive
`postMessage`.

## Registering

Registration works much the same way as logging in, except the URL is `/auth/r/google`.
Registration also does not return an API key on success.

## Logging Out

Logging out works the same way as registering except with the URL `/auth/logout`. Logging out
will result in a failure if the user is not logged in, but this can be safely ignored.

## API Key Endpoint

There is an endpoint to retrieve a user's api key at `/api/v2/auth/apikey`, but it can only be
accessed if the user is already logged in through google auth.

## Using API Keys

If you have access to a user's api key, add it as a parameter called `apikey` either in the query string or
as form data if you're using `POST` or another similar method.

Setting the `apikey` parameter will, if the key is valid, update the user's session such that the key does
not need to be given in subsequent requests. That said, you should always provide it just in case, especially
if you are using multiple keys.

Most routes take the `apikey` parameter. The few that don't will _not_ have an `apikey` policy set in
`server/config/policies.js` and will not update the user's session. Basically, always set `apikey` when
possible.