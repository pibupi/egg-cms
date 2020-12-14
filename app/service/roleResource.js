const baseService = require('./base');
class Service extends baseService {
  constructor(...args) {
    super(...args);
    this.entity = 'role_resource';
  }
}
module.exports = Service;
