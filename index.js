
/**
 * Module dependencies.
 */

var uuid = require('node-uuid').v4;

/**
 * Add a request `id` the the context.
 *
 * First looks for `?request-id` and a `request-id` header,
 * then generates a new one.
 *
 * @return {Function}
 * @api public
 */

module.exports = function(options){
  options = options || {};
  var id = options.id || 'request-id';

  return function*(next){
    this.id = this.query[id]
      || this.get(id)
      || uuid();
    yield next;
    this.set(id, this.id);
  }
};
