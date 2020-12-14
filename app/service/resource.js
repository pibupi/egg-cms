const baseService = require('./base');
class Service extends baseService {
  constructor(...args) {
    super(...args);
    this.entity = 'resource';
  }
}
module.exports = Service;
