const { Service } = require('egg');
class BaseService extends Service {
  async list(pageNum, pageSize, where) {
    console.log(pageNum, pageSize);
    const list = await this.app.mysql.select(this.entity, {
      where,
      order: [
        [ 'id', 'asc' ],
        [ 'username', 'asc' ],
      ],
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
    });
    console.log(list);
    const total = await this.app.mysql.count(this.entity, where);
    return {
      list,
      total,
    };
  }
  async create(entity) {
    const result = await this.app.mysql.insert(this.entity, entity);
    return result.affectedRows > 0;
  }
  async update(entity) {
    const result = await this.app.mysql.update(this.entity, entity);
    return result.affectedRows > 0;
  }
  async destroy(ids) {
    const result = await this.app.mysql.delete(this.entity, { id: ids });
    return result.affectedRows > 0;
  }
}
module.exports = BaseService;
