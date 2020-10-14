const delay = async duration => {
  return new Promise(res => setTimeout(res, duration))
}

const deepCopy = json => {
  return JSON.parse(JSON.stringify(json))
}

module.exports = {
  delay,
  deepCopy,
}