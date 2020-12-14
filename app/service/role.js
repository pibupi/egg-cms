const baseService = require('./base');
class Service extends baseService {
  constructor(...args) {
    super(...args);
    this.entity = 'role';
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
    for (let i = 0; i < list.length; i++) {
      let rows = await this.app.mysql.select('role_resource', {
        where: { role_id: list[i].id },
      });
      list[i].resourceIds = rows.map(item => item.resource_id);
      rows = await this.app.mysql.select('role_user', {
        where: { role_id: list[i].id },
      });
      list[i].userIds = rows.map(item => item.user_id);
    }
    console.log(list);
    const total = await this.app.mysql.count(this.entity, where);
    return {
      list,
      total,
    };
  }
  async getResource() {
    const { app } = this;
    const resources = await app.mysql.select('resource');
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
    return rootMenus;
  }
  async setResource({ roleId, resourceIds }) {
    const { app } = this;
    await app.mysql.query('DELETE FROM role_resource WHERE role_id=?', [
      roleId,
    ]);
    for (let i = 0; i < resourceIds.length; i++) {
      const resourceId = resourceIds[i];
      await app.mysql.insert('role_resource', {
        role_id: roleId,
        resource_id: resourceId,
      });
    }
  }
  async getUser() {
    const { app } = this;
    return await app.mysql.select('user');
  }
  async setUser({ roleId, userIds }) {
    const { app } = this;
    const conn = await app.mysql.beginTransaction();
    try {
      await conn.query('DELETE FROM role_user WHERE role_id=?', [ roleId ]);
      for (let i = 0; i < userIds.length; i++) {
        const userId = userIds[i];
        await conn.insert('role_user', {
          role_id: roleId,
          user_id: userId,
        });
      }
      await conn.commit();
    } catch (error) {
      await conn.rollback();
      throw error;
    }
  }
}
module.exports = Service;
