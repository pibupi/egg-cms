/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1607696162942_7763';

  // add your middleware config here
  config.middleware = [];
  config.auth = {
    authUrls: [ '/api/role/getUser', '/api/role/setUser' ],
  };
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };
  userConfig.security = {
    csrf: false,
    domainWhiteList: [ 'http://localhost:8000' ],
  };
  userConfig.cors = {
    credentials: true,
  };
  userConfig.jwtSecret = 'zh';
  userConfig.mysql = {
    client: {
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: 'mei@520225',
      database: 'cms-api',
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
