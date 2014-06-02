module.exports = {
  clone: clone
}

function clone(obj) {
  if (!obj) return obj;
  return JSON.parse(JSON.stringify(obj));
}