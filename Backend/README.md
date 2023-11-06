# creaTurn-backend

Dependencies to install: `node express mongodb` MongoDB needs to be running on port `27017` (default port) and have a database called `creatourn`.<br>
The app runs on `http://localhost:2000` and accepts connections from `http://localhost:3000`.

## API

### Templates

#### Requests

`GET: http://localhost:2000/templates/:id`<br>
`:id` is the id of an item to be retrieved from database

`GET: http://localhost:2000/templates?private=&publicfrom=&quantity=&query=`<br>
`private` = `true`/`false` (**required**) determines whether to include user's own templates in response<br>
`public` = `true`/`false` (**required**) determines whether to include public templates in response<br>
`from` is the index of the first item to be retrieved from database (indexing starts from 0)<br>
`quantity` is quantity of items to be retrieved from database<br>
`query` is a string which will be checked against `name` field of a template (case insensitive, may start and end at any position witihin `name`)

`POST: http://localhost:2000/templates/`<br>
Please use following format:

```
{
  template: {
    // actual template
  }
}
```

`PUT: http://localhost:2000/templates/:id`<br>
Please use following format:

```
{
  template: {
    // actual template
  }
}
```

`DELETE: http://localhost:2000/templates/:id`<br>
`:id` is the id of an item to be deleted in database

#### Responses



Responses are in following format: `{ success: 'true/false', message: 'error message', data: 'response data' }`



`GET: http://localhost:2000/templates/:id`<br>
`data` will contain whole template



`GET: http://localhost:2000/templates?private=&publicfrom=&quantity=&query=`<br>
`data` will contain only some fields of a template, along with total count of templates matching query criteria:

```
{
  templateCount:
  templates: [
    {
      _id:
      name:
      private:
      numberOfPlayers:
      owner:
    }
  ]
}
```

`POST: http://localhost:2000/templates/`<br>
`data` will contain whole template

`PUT: http://localhost:2000/templates/:id`<br>
`data` will contain whole template

`DELETE: http://localhost:2000/templates/:id`<br>
`data` will contain empty string

### Tournaments

#### Requests

`GET: http://localhost:2000/tournaments/:id`<br>
`:id` is the id of an item to be retrieved from database

`GET: http://localhost:2000/tournaments?private=&publicfrom=&quantity=&query=`<br>
`private` = `true`/`false` (**required**) determines whether to include user's own tournaments in response<br>
`public` = `true`/`false` (**required**) determines whether to include public tournaments in response<br>
`from` is the index of the first item to be retrieved from database (indexing starts from 0)<br>
`quantity` is quantity of items to be retrieved from database<br>
`query` is a string which will be checked against `name` field of a tournament (case insensitive, may start and end at any position witihin `name`)

`POST: http://localhost:2000/tournaments/`<br>
Please use following format:

```
{
  tournament: {
    name:
    private:
    owner:
    template: {
      _id:
    }
    moderators: []
    description:
  }
}
```

`PUT: http://localhost:2000/tournaments/:id`<br>
Please use following format:

```
{
  tournaments: {
    // tournament's properties, e.g.
    name:
    owner: {}
    blocks.1: {}
  }
}
```

`DELETE: http://localhost:2000/tournaments/:id`<br>
`:id` is the id of an item to be deleted in database

#### Responses

`GET: http://localhost:2000/tournaments/:id`<br>
`data` will contain whole tournament

`GET: http://localhost:2000/templates?private=&publicfrom=&quantity=&query=`<br>
`data` will contain only some fields of a template, along with total count of templates matching query criteria:

```
{
  tournamentCount:
  tournaments: [
    {
      _id:
      name:
      private:
      numberOfPlayers:
      owner:
      template: {
        _id:
        name:
      }
      description:
    }
  ]
}
```

`POST: http://localhost:2000/tournaments/`<br>
`data` will contain whole tournament

`PUT: http://localhost:2000/tournaments/:id`<br>
`data` will contain whole tournament

`DELETE: http://localhost:2000/tournaments/:id`<br>
`data` will contain empty string
