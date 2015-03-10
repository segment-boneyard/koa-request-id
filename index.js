
/**
 * Module dependencies.
 */

var uuid = require('node-uuid').v4;
var assign = require('lodash.assign');

/**
 * Add a request `id` the the context `state`.
 *
 * First looks for `?request-id` and a `request-id` header,
 * then generates a new one. Optionally exposes it on a
 * response header.
 *
 * @return {Function}
 * @api public
 */

module.exports = function(options){
  options = assign({
    expose: false,
    header: 'request-id',
    query: 'request-id'
  }, options);

  return function *requestId(next){
    var id;

    if (options.query) {
      id = this.query[options.header];
    }

    if (!id && options.header) {
      id = this.get(options.header);
    }

    if (!id) {
      id = uuid();
    }

    if (options.expose) {
      this.set(options.expose, id);
    }

    if (this.state) {
      this.state.id = id;
    } else {
      this.id = id;
    }

    yield next;
  }
};
