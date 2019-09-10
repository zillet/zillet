export function getValueByPath(obj, path) {
  const value = path.split('.').reduce((o, i) => o[i], obj);
  return value;
}
export function roundUp(num, precision) {
  if (!precision) precision = 0;
  precision = Math.pow(10, precision);
  return Math.ceil(num * precision) / precision;
}
