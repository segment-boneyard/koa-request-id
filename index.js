
/**
 * Module dependencies.
 */

var uuid = require('node-uuid').v4;

/**
 * Add a request `id` the the context.
 *
 * First looks for `?request-id` and a `request-id` header,
 * or looks for a custom header if specified,
 * and generates a new id if none is found
 *
 * @return {Function}
 * @api public
 */

module.exports = function(customHeader){
  var header = customHeader || 'request-id';

  return function*(next){
    this.id = this.query[header]
      || this.get(header.toLowerCase())
      || uuid();
    yield next;
  }
};
