export default function className(classNames, ...others) {
  return Object.keys(classNames).reduce((pre, cur) => {
    if (classNames[cur]) {
      return `${pre} ${cur} `
    }
    return pre
  }, '').concat(others)
}
