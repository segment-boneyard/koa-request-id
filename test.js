var koa = require('koa');
var requestId = require('./');
var request = require('supertest');

describe('requestId()', function(){
  
  var app = koa();
  app.use(requestId());
  
  it('should add a request id', function(done){
    request(app.listen())
    .get('/')
    .expect('Request-id', /^[a-f0-9]{8}-[a-f0-9]{4}/, done);
  });
  
  it('should check the querystring', function(done){
    request(app.listen())
    .get('/?request-id=1337')
    .expect('Request-id', '1337', done);
  });
  
  it('should check headers', function(done){
    request(app.listen())
    .get('/')
    .set('Request-id', '1337')
    .expect('Request-id', '1337', done);
  });

  it('should add the new id to the response headers', function(done){
    request(app.listen())
    .get('/')
    .set('Request-id', '1337')
    .expect('Request-id', '1337', done);
  });
});
