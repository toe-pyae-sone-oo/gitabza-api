const { ZawgyiDetector } = require('../lib/myanmar-tools/zawgyi-detector')
const zgDetector = new ZawgyiDetector()

const isZg = txt => zgDetector.detect(txt).detectedEnc === 'zg'
const isUni = txt => !isZg(txt)

module.exports = {
	isZg,
	isUni,
}