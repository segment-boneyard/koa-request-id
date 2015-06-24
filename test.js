var koa = require('koa');
var requestId = require('./');
var request = require('supertest');

describe('requestId()', function(){
  describe('when NO custom RequestId header is specified', function () {
    var app = koa();
    app.use(requestId());
    app.use(function*(){
      this.body = this.id;
    });

    it('should add a request id', function(done){
      request(app.listen())
      .get('/')
      .expect(/^[a-f0-9]{8}-[a-f0-9]{4}/, done);
    });

    it('should check the querystring', function(done){
      request(app.listen())
      .get('/?request-id=1337')
      .expect('1337', done);
    });

    it('should check headers', function(done){
      request(app.listen())
      .get('/')
      .set('Request-id', '1337')
      .expect('1337', done);
    });
  });

  describe('when custom RequestId header is specified', function () {
    var app = koa();
    var CUSTOM_HEADER = 'X-Request-ID';

    app.use(requestId(CUSTOM_HEADER));
    app.use(function*(){
      this.body = this.id;
    });

    it('should check the querystring', function(done){
      request(app.listen())
      .get('/?X-Request-ID=1337')
      .expect('1337', done);
    });

    it('should check headers', function(done){
      request(app.listen())
      .get('/')
      .set(CUSTOM_HEADER, '1337')
      .expect('1337', done);
    });
  });
});
