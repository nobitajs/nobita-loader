exports.bindFunc = (func, ctx) => {
  const data = {};
  if (typeof func == 'function') {
    return func.bind(ctx);
  } else if (typeof func == 'object') {
    for (const i in func) {
      data[i] = this.bindFunc(func[i], ctx);
    }
  }
  return data;
}

exports.readName = (path) => {
  return (item) => {
    const fileName = item.split(path)[1];
    if (fileName.indexOf('.js') != -1) {
      return fileName.split('.js')[0].replace(/\//g, '.');
    }
  }
}