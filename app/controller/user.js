const BaseController = require('./base');
const svgCaptcha = require('svg-captcha');
const { sign } = require('jsonwebtoken');
class Controller extends BaseController {
  constructor(...args) {
    super(...args);
    this.entity = 'user';
  }
  async captcha() {
    const { ctx } = this;
    const captchaObj = svgCaptcha.create();
    ctx.session.captcha = captchaObj.text;
    console.log('ctx.session.captcha', ctx.session.captcha);
    // ctx.session.captcha = {
    //   text: captchaObj.text,
    //   expires: new Date(Date.now() + 60 * 1000),
    // };
    ctx.set('Content-Type', 'image/svg+xml');
    ctx.body = captchaObj.data;
  }
  async checkCaptcha() {
    const { ctx } = this;
    const captcha = ctx.request.body.captcha;
    if (
      captcha === ctx.session.captcha
      // &&
      // ctx.session.captcha.expires.getTime() > Date.now()
    ) {
      ctx.body = '验证成功';
    } else {
      ctx.body = '验证失败';
    }
  }
  async signup() {
    const { ctx, app } = this;
    const {
      aggrement,
      prefix,
      phone,
      address,
      repassword,
      captcha,
      ...user
    } = ctx.request.body;
    if (!aggrement) {
      return this.error('请同意协议再注册');
    }
    if (user.password !== repassword) {
      return this.error('密码和确认密码不一致！');
    }
    // console.log(captcha, ctx.session.captcha);
    console.log(ctx.session.captcha);
    if (captcha.toLowerCase() !== ctx.session.captcha.toLowerCase()) {
      return this.error('验证码不正确');
    }
    user.phone = prefix + '-' + phone;
    user.address = address.join('-');
    console.log('user', user);
    const result = await app.mysql.insert('user', user);
    if (result.affectedRows > 0) {
      this.success({
        id: result.insertId,
      });
    } else {
      this.error('注册失败');
    }
  }
  async signin() {
    const { ctx, app } = this;
    const { username, password } = ctx.request.body;
    const result = await app.mysql.select('user', {
      where: { username, password },
      limit: 1,
    });
    if (result && result.length > 0) {
      const u = JSON.parse(JSON.stringify(result[0]));
      delete u.password;
      // 登录成功之后，查询此用户所拥有的权限
      const list = await this.app.mysql.query(
        `select resource.* from
      role_user
      inner join role_resource on role_user.role_id = role_resource.role_id
      inner join resource on role_resource.resource_id = resource.id
      where role_user.user_id=? order by resource.id ASC`,
        [ u.id ]
      );
      console.log(list);
      const resources = [];
      const map = {};
      list.forEach(resource => {
        resource.children = [];
        map[resource.id] = resource;
      });
      list.forEach(resource => {
        // resource.children = [];
        // map[resource.id] = resource;
        if (resource.parent_id === 0) {
          resources.push(resource);
        } else {
          map[resource.parent_id] &&
            map[resource.parent_id].children.push(resource);
        }
      });
      // list.forEach((resource) => {
      //   resource.children = [];
      //   map[resource.id] = resource;
      //   if (resource.parent_id === 0) {
      //     resources.push(resource);
      //   } else {
      //     map[resource.parent_id].push(resource);
      //   }
      // });
      u.resources = resources;
      console.log('resources', resources);
      this.success(
        sign(u, this.config.jwtSecret, {
          // expiredAt: new Date(Date.now() + 60 * 1000),
        })
      );
    } else {
      this.error('登录失败');
    }
  }
}
module.exports = Controller;
