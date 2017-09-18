# Feed Endpoints

## GET /feed

_API key required_

_Minimum access:_ `player`

Get the list of all of your notifications.

### Parameters

* `stringify`: If this option is present, then the message in each notification will be a rendered string.

### Response

* `feed`: A list of Feed objects.

Feed objects can be fairly complex. The `message` element of a feed object, if not
prerendered via the `stringify` parameter, will contain an array of strings and
objects. This is so that additional processing can be done by the client.

Currently, the only object supported is a `user` object, which is in the format:

    {
        "t": "u",
        "i": x
    }

`t` specifies that the object is a user object, while `i` is the user id. Objects
and strings in the message array should be concatinated in order to build the final
message.

### Sample

#### Request

    GET http://127.0.0.1/api/v2/feed?apikey=someapikey

#### Response

Normal response:

    {
      "feed": {
        "viewed": false,
        "message": [
            {"t": "u", "i": 1},
            " did a thing!"
        ],
        "image": null,
        "time": "2017-08-13T22:54:34.072Z"
      }
    }

Stringified response:

    {
        "feed": {
            "viewed": false,
            "message": "John Doe did a thing!",
            "image": null
        }
    }

## POST /feed/view

_API key required_

_Minimum access:_ `player`

Marks all of your notifications as viewed.

### Parameters

None

### Response

None

### Sample

#### Request

POST http://127.0.0.1/api/v2/feed/view?apikey=somekey

#### Response

    {
        "message": "All notifications have been marked as viewed."
    }
