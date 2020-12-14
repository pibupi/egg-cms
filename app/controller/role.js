const BaseController = require('./base');
class Controller extends BaseController {
  constructor(...args) {
    super(...args);
    this.entity = 'role';
  }
  async getResource() {
    const { service } = this;
    const result = await service.role.getResource();
    this.success(result);
    // ctx.body = result
  }
  async setResource() {
    const { ctx, service } = this;
    const body = ctx.request.body;
    await service.role.setResource(body);
    this.success('授权成功');
  }
  async getUser() {
    const { ctx, service } = this;
    console.log(ctx.session.user);
    const result = await service.role.getUser();
    // ctx.body = result
    this.success(result);
  }
  async setUser() {
    const { ctx, service } = this;
    const body = ctx.request.body;
    await service.role.setUser(body);
    this.success('授权成功');
  }
}
module.exports = Controller;
