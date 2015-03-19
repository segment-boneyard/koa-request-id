var assert = require('assert');
var koa = require('koa');
var requestId = require('./');
var request = require('supertest');
var uuid = /^[a-f0-9]{8}-[a-f0-9]{4}/;

describe('requestId()', function(){
  var app;

  beforeEach(function() {
    app = koa();
  });

  it('should expose a named function', function(){
    assert.equal(requestId().name, 'requestId');
  });

  it('should add a request id to `ctx.state` by default', function(done){
    app.use(requestId());
    app.use(function*(){
      this.body = this.state.id;
    });

    request(app.listen())
      .get('/')
      .expect(uuid, done);
  });

  it('should add a request id to `ctx` on older versions of koa', function(done){
    app.use(function*(next) {
      this.state = undefined;
      yield next;
    });
    app.use(requestId());
    app.use(function*(){
      this.body = this.id;
    });

    request(app.listen())
      .get('/')
      .expect(uuid, done);
  });

  it('should check the `request-id` querystring by default', function(done){
    app.use(requestId());
    app.use(function*(){
      this.body = this.state.id;
    });

    request(app.listen())
      .get('/?request-id=1337')
      .expect('1337', done);
  });

  it('should ignore the querystring if `query` is false', function(done){
    app.use(requestId({ query: false }));
    app.use(function*(){
      this.body = this.state.id;
    });

    request(app.listen())
      .get('/?request-id=1337')
      .expect(uuid, done);
  });

  it('should check the `request-id` header by default', function(done){
    app.use(requestId());
    app.use(function*(){
      this.body = this.state.id;
    });

    request(app.listen())
      .get('/')
      .set('Request-id', '1337')
      .expect('1337', done);
  });

  it('should ignore the header if `header` is false', function(done){
    app.use(requestId({ header: false }));
    app.use(function*(){
      this.body = this.state.id;
    });

    request(app.listen())
      .get('/')
      .set('Request-id', '1337')
      .expect(uuid, done);
  });

  it('should not expose the request id by default', function(done){
    app.use(requestId());
    app.use(function*(){
      this.body = this.response.header;
    });

    request(app.listen())
      .get('/')
      .set('Request-id', '1337')
      .expect({}, done);
  });

  it('should expose the request id if the `expose` header is defined', function(done){
    app.use(requestId({ expose: 'X-Request-Id'}));
    app.use(function*(){
      this.body = this.response.header['x-request-id'];
    });

    request(app.listen())
      .get('/')
      .set('Request-id', '1337')
      .expect('1337', done);
  });
});
