const baseService = require('./base');
class Service extends baseService {
  constructor(...args) {
    super(...args);
    this.entity = 'user';
  }
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
    for (let i = 0; i < list.length; i++) {
      const user = list[i];
      const resources = await this.app.mysql.query(
        `select resource.* from resource
      inner join role_resource on resource.id = role_resource.resource_id
      inner join role_user on role_resource.role_id = role_user.role_id
      where role_user.user_id = ?`,
        [ user.id ]
      );
      const rootMenus = [];
      const map = {};
      resources.forEach(resource => {
        resource.children = [];
        map[resource.id] = resource;
        if (resource.parent_id === 0) {
          rootMenus.push(resource);
        } else {
          map[resource.parent_id].children.push(resource);
        }
      });
      user.resources = rootMenus;
    }
    const total = await this.app.mysql.count(this.entity, where);
    return {
      list,
      total,
    };
  }
}
module.exports = Service;
