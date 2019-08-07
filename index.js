var blending = require('./lib/blending.js')
var lut = require('./lib/lut.js')

if (typeof window !== 'undefined') {
  window.blending = blending
  window.lut = lut
}

module.exports = {
  blending: blending,
  lut: lut
}
