# koa-request-id

  Add a request id as `this.id`, if set reusing one from the querystring or
  headers.

  [Express version](https://github.com/segmentio/request-id-middleware).
  
  [![build status](https://secure.travis-ci.org/segmentio/koa-request-id.png)](http://travis-ci.org/segmentio/koa-request-id)

## Example

```js
var koa = require('koa');
var requestId = require('koa-request-id');

var app = koa();
app.use(requestId());
app.use(function*(){
  this.body = this.id;
});

app.listen(3000);
```

  Query it:

```bash
$ curl http://localhost:3000
23691882-abd8-4857-88f3-41a7f962aefd

$ curl http://localhost:3000/?request-id=1337
1337

$ curl -H "Request-id: 1337" http://localhost:3000
1337
```

## Installation

```bash
$ npm install koa-request-id
```

## License

  MIT
