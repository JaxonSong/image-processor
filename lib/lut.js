var loadImage = require('./util.js').loadImage

function lut ({originalImageSrc, lutImageSrc, canvasOutput, mimeType = 'jpeg', quality = 1}) {
  return new Promise(async (resolve, reject) => {
    const correctmimeTypeList = ['jpeg', 'png', 'webp']
    if (!correctmimeTypeList.includes(mimeType)) {
      reject(new Error('mimeType wrong ! '))
      return
    }

    let canvasOriginal = document.createElement('canvas')
    let ctxOriginal = canvasOriginal.getContext('2d')
    let canvasLut = document.createElement('canvas')
    let ctxLut = canvasLut.getContext('2d')
    canvasOutput = canvasOutput instanceof HTMLElement && canvasOutput.tagName === 'CANVAS' ? canvasOutput : document.createElement('canvas')
    let ctxOutPut = canvasOutput.getContext('2d')

    let originalImage = await loadImage(originalImageSrc)
    let width = originalImage.width
    let height = originalImage.height

    canvasOriginal.width = width
    canvasOriginal.height = height
    ctxOriginal.drawImage(originalImage, 0, 0)

    let lutImage = await loadImage(lutImageSrc)
    canvasLut.width = lutImage.width
    canvasLut.height = lutImage.height
    ctxLut.drawImage(lutImage, 0, 0)

    canvasOutput.width = width
    canvasOutput.height = height

    let imageDataOriginal = ctxOriginal.getImageData(0, 0, width, height)
    let filterData = ctxLut.getImageData(0, 0, lutImage.width, lutImage.height)

    for (var i = 0; i < imageDataOriginal.data.length; i += 4) {
      // original rgba
      const factor = 255.0
      const r = imageDataOriginal.data[i] / factor
      const g = imageDataOriginal.data[i + 1] / factor
      const b = imageDataOriginal.data[i + 2] / factor
      const a = 255

      let blueColor = b * 63.0

      let quad1 = {}
      quad1.y = Math.floor(Math.floor(blueColor) / 8.0)
      quad1.x = Math.floor(blueColor) - (quad1.y * 8.0)

      let quad2 = {}
      quad2.y = Math.floor(Math.ceil(blueColor) / 8.0)
      quad2.x = Math.ceil(blueColor) - (quad2.y * 8.0)

      var texPos1 = {
        x: (quad1.x * 0.125) + 0.5 / 512.0 + ((0.125 - 1.0 / 512.0) * r),
        y: (quad1.y * 0.125) + 0.5 / 512.0 + ((0.125 - 1.0 / 512.0) * g)
      }

      var texPos2 = {
        x: (quad2.x * 0.125) + 0.5 / 512.0 + ((0.125 - 1.0 / 512.0) * r),
        y: (quad2.y * 0.125) + 0.5 / 512.0 + ((0.125 - 1.0 / 512.0) * g)
      }

      const column = Math.sqrt(filterData.data.length / 4)
      const line = column

      // color1
      const index1 = (Math.floor(texPos1.y * 512.0) * (line) + (Math.floor(texPos1.x * 512.0) + 1.0)) * 4.0
      const Rr = filterData.data[index1 - 4] / 255
      const Gg = filterData.data[index1 - 3] / 255
      const Bb = filterData.data[index1 - 2] / 255

      // color2
      const index2 = (Math.floor(texPos2.y * 512.0) * (line) + (Math.floor(texPos2.x * 512.0) + 1.0)) * 4.0
      const Rrr = filterData.data[index2 - 4] / 255
      const Ggg = filterData.data[index2 - 3] / 255
      const Bbb = filterData.data[index2 - 2] / 255

      // fract
      let fraceB = blueColor - Math.floor(blueColor)

      // mix color1, color2, fraceB     x * (1 − z) + y * z
      // newColor
      var mixx = Rr * (1 - fraceB) + Rrr * fraceB
      var mixy = Gg * (1 - fraceB) + Ggg * fraceB
      var mixz = Bb * (1 - fraceB) + Bbb * fraceB

      // mix original, newColor, intensity
      var intensity = 1
      var mixxx = r * (1 - intensity) + mixx * intensity
      var mixyy = g * (1 - intensity) + mixy * intensity
      var mixzz = b * (1 - intensity) + mixz * intensity

      var ofactor = 255.0
      imageDataOriginal.data[i] = mixxx * ofactor
      imageDataOriginal.data[i + 1] = mixyy * ofactor
      imageDataOriginal.data[i + 2] = mixzz * ofactor
      imageDataOriginal.data[i + 3] = a
    }

    ctxOutPut.putImageData(imageDataOriginal, 0, 0)

    canvasOutput.toBlob(blob => {
      let url = window.URL.createObjectURL(blob)
      resolve({blob, url})
    }, 'image/' + mimeType, quality)
  })
}

module.exports = lut
