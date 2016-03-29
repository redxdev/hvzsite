# Content Endpoints

## GET /content/rules

_Public Endpoint_

This will return the list of rules in the order they should be displayed.

### Parameters

None

### Response

* `rules`: A list of `Ruleset` objects.

### Sample

#### Request

    GET http://127.0.0.1/api/v2/content/rules
    
#### Response

    {
      "rules": [
        {
          "id": 1,
          "title": "Foo Bar",
          "body": "<strong>Body supports</strong> full HTML"
        }
      ]
    }

## GET /content/news

_Public Endpoint_

This will return the list of news posts with the newest ones first.

### Parameters

None

### Response

* `posts`: A list of `News` objects.

### Sample

#### Request

    GET http://127.0.0.1/api/v2/content/news
    
#### Response

    {
      "posts": [
        {
          "id": 2,
          "title": "Foo Bar",
          "summary": "Some simple text",
          "body": "<strong>Full html</strong> text",
          "postDate": "2016-03-27T18:15:29.688Z",
          "important": false
        }
      ]
    }

## GET /content/news/:id

_Public Endpoint_

This will retrieve a single news post.

### Parameters

* `:id`: The id of the post.

### Response

* `post`: A `News` object.

#### Request

    GET http://127.0.0.1/api/v2/content/news/2
    
#### Response

    {
      "post":{
        "id": 2,
        "title": "Foo Bar",
        "summary": "Some simple text",
        "body": "<strong>Full html</strong> text",
        "postDate": "2016-03-27T18:15:29.688Z",
        "important": false
      }
    }

## GET /content/announcements

_Public Endpoint_

Get the list of news posts marked as _important_. These are used as global announcements on the
website.

Generally, there should only be a single post returned by this endpoint but any application
implementing this should be able to gracefully handle multiple being returned.

### Parameters

None

### Response

* `posts`: A list of `News` objects. There will usually be either zero or one objects in the
  list.

### Sample

#### Request

    GET http://127.0.0.1/api/v2/content/announcements
    
#### Response

    {
      "posts": [
        {
          "id": 2,
          "title": "Foo Bar",
          "summary": "Some simple text",
          "body": "<strong>Full html</strong> text",
          "postDate": "2016-03-27T18:15:29.688Z",
          "important": true
        }
      ]
    }

## GET /content/missions

_API key required_

_Minimum access:_ `player`

Get the list of missions for your team. Note that this includes missions with their team set to
`"all"` in addition to ones associated with your team.

### Parameters

None

### Response

* `missions`: A list of `Mission` objects.

### Sample

#### Request

    GET http://127.0.0.1/api/v2/content/missions?apikey=someapikey
    
#### Response

    {
      "missions": [
        "id": 2,
        "title": "Find Brains",
        "body": "<strong>Full HTML</strong> support. Go get some brains!",
        "postDate": "2016-03-27T18:45:00.000Z",
        "team": "zombie"
      ]
    }
