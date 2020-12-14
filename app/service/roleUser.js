const baseService = require('./base');
class Service extends baseService {
  constructor(...args) {
    super(...args);
    this.entity = 'rule_user';
  }
}
module.exports = Service;
