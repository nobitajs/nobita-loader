const merge = require('lodash/merge');
const setWith = require('lodash/setWith');
const readdir = require('nobita-readdir');
const { bindFunc, readName } = require('./utils.js');

module.exports = async (app) => {
  const allPath = {
    controllers: '/app/controllers/',
    service: '/app/service/',
    helper: '/app/extend/helper/'
  };
  const data = {};
  for (const key in allPath) {
    data[key] = {};
    const arrayPath = readdir(`.${allPath[key]}`);
    const newArrPath = arrayPath.map(readName(allPath[key]));
    for (const i in arrayPath) {
      let foo = require(arrayPath[i]);
      if (typeof foo == 'function') {
        foo = await foo(app);
      }
      data[key] = merge(data[key], setWith({}, newArrPath[i], foo, Object));

    }
    app.context[key] = app[key] = bindFunc(data[key], app.quoteContext);
  }
};