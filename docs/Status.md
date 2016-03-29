# Status Endpoints

## GET /status/dates

_Public Endpoint_

### Parameters

None

### Response

* `start`: A date string containing the start date for the game.
* `end`: A date string containing the end date for the game.
* `next`: This will be `start` if the current date is before `start`, or `end` otherwise.

### Sample

#### Request

    GET http://127.0.0.1/api/v2/status/dates

#### Response

    {
      "start": "2016-03-23T01:00:00.000Z",
      "end": "2016-03-30T01:00:00.000Z",
      "next": "2016-03-30T01:00:00.000Z"
    }

## GET /status/score

_Public Endpoint_

### Parameters

None

### Response

* `humans`: The number of active humans (excluding moderators) in the game
* `zombies`: The number of active zombies (excluding moderators) in the game

### Sample

#### Request

    GET http://127.0.0.1/api/v2/status/score

#### Response

    {
      "humans": 300
      "zombies": 253
    }

## GET /status/players

_Public Endpoint_

Get or search the list of players. Moderators, admins, and superadmins will not appear in this
list.

### Parameters

* `sort`: `"team"` for standard sorting, `"clan"` for clans-only and sorted by clan name.
  __Default:__ `"team"`
* `search`: A string to search for in the name or clan name of players. The search is
  case-insensitive. __Not Required__
* `limit`: The maximum number of results to return. __Default:__ no limit
* `skip`: The number of players to skip over. Useful for pagination. __Default:__ `0`
* `team`: `"human"` or `"zombie"` will limit players show to that team. __Not Required__

### Response

* `players`: An array of `PublicUser` objects.

### Sample

#### Request

    GET http://127.0.0.1/api/v2/status/players?search=John

#### Response

    {
      "players": [
        {
          "id": 3,
          "name": "John Doe",
          "signupDate": "2016-03-27T22:14:26.560Z",
          "team": "zombie",
          "badges": [
            {
              "name": "Infected",
              "description": "Died in the zombie apocalypse",
              "image": "infected.png",
              "access": "internal"
            }
          ],
          "clan": "Brain Eaters",
          "access": "player",
          "hasAvatar": true
        }
      ]
    }

## GET /status/moderators

_Public Endpoint_

Get the list of moderators, admins, and superadmins.

### Parameters

None

### Response

* `players`: An array of `PublicUser` objects.

### Sample

#### Request

    GET http://127.0.0.1/api/v2/status/moderators
    
#### Response

    {
      "players": [
        {
          "id": 1,
          "name": "John Doe",
          "signupDate": "2016-03-27T22:14:26.560Z",
          "team": "human",
          "badges": [],
          "clan": "Admins",
          "access": "admin",
          "hasAvatar": true
        }
      ]
    }

## GET /status/infections

_Public Endpoint_

### Parameters

* `limit`: The maximum number of results to return. __Default:__ no limit
* `skip`: The number of infections to skip over. Useful for pagination. __Default:__ `0`
* `human`: If specified, will look for infections that have the specified user id as the
  human. __Not Required__
* `zombie`: If specified, will look for infections that have the specified user id as the
  zombie. __Not Required__

_If both `human` and `zombie` are specified, the infection search will look for infections
with both parameters.__

### Response

* `infections`: An array of `InfectionSpread` objects.

### Sample

#### Request

    GET http://127.0.0.1/api/v2/status/infections?human=4

#### Response

    {
      "infections": [
        {
          "time": "2016-03-28T20:47:20.209Z",
          "hasLocation": true,
          "latitude": 43.0801322,
          "longitude": -77.6778416,
          "zombie": {
            "id": 1,
            "name": "Jane Doe"
          },
          "human": {
            "id": 4,
            "name": "John Doe"
          }
        }
      ]
    }
