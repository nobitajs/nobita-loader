const merge = require('lodash/merge');
const setWith = require('lodash/setWith');
const isEmpty = require('lodash/isEmpty')
const readdir = require('nobita-readdir');
const requireJS = require('nobita-require');
const helper = requireJS('./app/extend/helper.js');
const { bindFunc, readName } = require('./utils.js');
const cloneDeep = require('lodash/cloneDeep')

module.exports = async (app) => {
  const allPath = {
    controllers: '/app/controllers/',
    service: '/app/service/',
    helper: '/app/extend/helper/'
  };
  let data = {};
  let data2 = {};
  for (const key in allPath) {
    data[key] = {};
    const arrayPath = readdir(`.${allPath[key]}`);
    const newArrPath = arrayPath.map(readName(allPath[key]));
    for (const i in arrayPath) {
      try {
        let foo = require(arrayPath[i]);
        if (typeof foo == 'function') {
          foo = await foo(app);
        }
        data[key] = merge(data[key], setWith({}, newArrPath[i], foo, Object));
      } catch (e) {
        throw (`${e.message} \n at module.exports (${arrayPath[i]})`);
      }
    }

    // 兼容旧版本 Nobita。
    if (key == 'helper' && isEmpty(data[key])) {
      data[key] = helper;
    }
    data2[key] = cloneDeep(data[key]);
    app.context[key] = app[key] = bindFunc(data[key], app.quoteContext);
  }

  return async function (ctx, next) {
    for (const key in allPath) {
      ctx[key] = bindFunc(data2[key], { ctx });
    }
    await next();
  }
};