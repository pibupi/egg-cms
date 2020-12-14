const { verify } = require('jsonwebtoken');

function verifyToken(token, secret) {
  return new Promise((resolve, reject) => {
    verify(token, secret, function(err, payload) {
      if (err) {
        reject(err);
      } else {
        resolve(payload)
      }
    });
  });
}

// 这种是白名单的方式
// module.exports = (options, app) => {
//   return async function (ctx, next) {
//     // 在此处进行权限判断
//     const authUrls = options.authUrls
//     if (authUrls.includes(ctx.url)) {
//       const authorization = ctx.get('Authorization')
//       if (authorization) {
//         try {
//           const user = await verifyToken(authorization, app.config.jwtSecret)
//           ctx.session.user = user
//           await next()
//         } catch (err) {
//           ctx.status = 401
//           ctx.body = 'Token验证失败'
//         }
//       } else {
//         ctx.status = 401
//         ctx.body = '没有Token'
//       }
//     } else {
//       await next()
//     }
//   }
// }

// 这种不需要白名单，以中间件的形式
module.exports = app => {
  return async function(ctx, next) {
    // 肯定要进行token判断
    const authorization = ctx.get('Authorization');
    if (authorization) {
      try {
        const user = await verifyToken(authorization, app.config.jwtSecret);
        ctx.session.user = user;
        await next();
      } catch (err) {
        ctx.status = 401;
        ctx.body = 'Token验证失败';
      }
    } else {
      ctx.status = 401;
      ctx.body = '没有Token';
    }
  };
};
