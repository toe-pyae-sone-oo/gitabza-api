const knayi = require('knayi-myscript')
const { isZg } = require('./detector')

knayi.setGlobalOptions({
  use_myanmartools: true,
  myanmartools_zg_threshold: [0.05, 0.95]
})

const convertToUni = txt => knayi.fontConvert(txt, 'unicode')

const convertToUniIfZg = txt => isZg(txt) ? convertToUni(txt) : txt

module.exports = {
	convertToUni,
	convertToUniIfZg
}