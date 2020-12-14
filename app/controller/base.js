const { Controller } = require('egg');
class BaseController extends Controller {
  async index() {
    const { ctx, service } = this;
    const { pageNum, pageSize, ...where } = ctx.query;
    console.log(pageNum, pageSize);
    const list = await service[this.entity].list(
      isNaN(pageNum) ? 1 : parseInt(pageNum),
      isNaN(pageSize) ? 3 : parseInt(pageSize),
      where
    );
    this.success(list);
  }
  async create() {
    const { ctx, service } = this;
    const entiry = ctx.request.body;
    const result = await service[this.entity].create(entiry);
    result ? this.success('success') : this.error('创建失败');
  }
  async update() {
    const { ctx, service } = this;
    const id = ctx.params.id;
    const entiry = ctx.request.body;
    entiry.id = id;
    const result = await service[this.entity].update(entiry);
    result ? this.success('success') : this.error('更新失败');
  }
  async destroy() {
    const { ctx, service } = this;
    const id = ctx.params.id;
    let ids = ctx.request.body;
    if (!ids) {
      ids = [ id ];
    }
    const result = await service[this.entity].destroy(ids);
    result ? this.success('success') : this.error('删除失败');
  }
  success(data) {
    this.ctx.body = {
      code: 0,
      data,
    };
  }
  error(error) {
    this.ctx.body = {
      code: 1,
      error,
    };
  }
}
module.exports = BaseController;
