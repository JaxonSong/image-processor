const blendingFunc = require('./blendingFunc.js');
var loadImage = require('./util.js');

function blending ({originalImageSrc, textureImageSrc, canvasOutput, blendingMode = 'multiply', mimeType = 'jpeg', quality = 1}) {
  return new Promise(async (resolve, reject) => {
    const correctmimeTypeList = ['jpeg', 'png', 'webp']
    if (!correctmimeTypeList.includes(mimeType)) {
      reject(new Error('mimeType wrong ! '))
      return
    }

    let canvasOriginal = document.createElement('canvas')
    let ctxOriginal = canvasOriginal.getContext('2d')
    let canvasBlend = document.createElement('canvas')
    let ctxBlend = canvasBlend.getContext('2d')
    canvasOutput = canvasOutput instanceof HTMLElement && canvasOutput.tagName === 'CANVAS' ? canvasOutput : document.createElement('canvas')
    let ctxOutPut = canvasOutput.getContext('2d')

    let originalImage = await loadImage(originalImageSrc)
    let width = originalImage.width
    let height = originalImage.height

    canvasOriginal.width = width
    canvasOriginal.height = height
    ctxOriginal.drawImage(originalImage, 0, 0)

    let blendImage = await loadImage(textureImageSrc, width, height)
    canvasBlend.width = width
    canvasBlend.height = height
    ctxBlend.drawImage(blendImage, 0, 0, width, height)

    canvasOutput.width = width
    canvasOutput.height = height

    let imageDataOriginal = ctxOriginal.getImageData(0, 0, width, height)
    let filterData = ctxBlend.getImageData(0, 0, width, height)
  
    for (let i = 0; i < imageDataOriginal.data.length; i += 4) {
      // 跳过全透明像素
      if (imageDataOriginal.data[i + 3] === 0) continue
  
      // get original image 4 channel
      let originalR = imageDataOriginal.data[i]
      let originalG = imageDataOriginal.data[i + 1]
      let originalB = imageDataOriginal.data[i + 2]
      let originalA = imageDataOriginal.data[i + 3]
      // get texture image 4 channel
      let textureR = filterData.data[i]
      let textureG = filterData.data[i + 1]
      let textureB = filterData.data[i + 2]
      let textureA = filterData.data[i + 3]
      let blendingData = blendingFunc[blendingMode]([originalR, originalG, originalB, originalA], [textureR, textureG, textureB, textureA])
      imageDataOriginal.data[i] = blendingData[0]
      imageDataOriginal.data[i + 1] = blendingData[1]
      imageDataOriginal.data[i + 2] = blendingData[2]
      // imageDataOriginal.data[i + 3] = 255
    }
    ctxOutPut.clearRect(0, 0, width, height)
    ctxOutPut.putImageData(imageDataOriginal, 0, 0)


    canvasOutput.toBlob( blob => {
      let url = window.URL.createObjectURL(blob)
      resolve({blob, url})
    }, 'image/' + mimeType, quality)
  })
}

module.exports = blending
