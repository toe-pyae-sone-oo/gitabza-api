const delay = async duration => {
  return new Promise(res => setTimeout(res, duration))
}

module.exports = {
  delay,
}