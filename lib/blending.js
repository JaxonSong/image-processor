'use strict';

var blendingFunc = require('./blendingFunc.js');
var loadImage = require('./util.js').loadImage;

function blending(_ref) {
  var srcOriginalImage = _ref.srcOriginalImage,
      srcTextureImage = _ref.srcTextureImage,
      canvasOutput = _ref.canvasOutput,
      _ref$blendingMode = _ref.blendingMode,
      blendingMode = _ref$blendingMode === undefined ? 'multiply' : _ref$blendingMode,
      _ref$mimeType = _ref.mimeType,
      mimeType = _ref$mimeType === undefined ? 'jpeg' : _ref$mimeType,
      _ref$quality = _ref.quality,
      quality = _ref$quality === undefined ? 1 : _ref$quality;

  return new Promise(async function (resolve, reject) {
    var correctmimeTypeList = ['jpeg', 'png', 'webp'];
    if (!correctmimeTypeList.includes(mimeType)) {
      reject(new Error('mimeType wrong ! '));
      return;
    }

    var canvasOriginal = document.createElement('canvas');
    var ctxOriginal = canvasOriginal.getContext('2d');
    var canvasBlend = document.createElement('canvas');
    var ctxBlend = canvasBlend.getContext('2d');
    canvasOutput = canvasOutput instanceof HTMLElement && canvasOutput.tagName === 'CANVAS' ? canvasOutput : document.createElement('canvas');
    var ctxOutPut = canvasOutput.getContext('2d');

    var originalImage = await loadImage(srcOriginalImage);
    var width = originalImage.width;
    var height = originalImage.height;

    canvasOriginal.width = width;
    canvasOriginal.height = height;
    ctxOriginal.drawImage(originalImage, 0, 0);

    var blendImage = await loadImage(srcTextureImage, width, height);
    canvasBlend.width = width;
    canvasBlend.height = height;
    ctxBlend.drawImage(blendImage, 0, 0, width, height);

    canvasOutput.width = width;
    canvasOutput.height = height;

    var imageDataOriginal = ctxOriginal.getImageData(0, 0, width, height);
    var filterData = ctxBlend.getImageData(0, 0, width, height);

    for (var i = 0; i < imageDataOriginal.data.length; i += 4) {
      // 跳过全透明像素
      if (imageDataOriginal.data[i + 3] === 0) continue;

      // get original image 4 channel
      var originalR = imageDataOriginal.data[i];
      var originalG = imageDataOriginal.data[i + 1];
      var originalB = imageDataOriginal.data[i + 2];
      var originalA = imageDataOriginal.data[i + 3];
      // get texture image 4 channel
      var textureR = filterData.data[i];
      var textureG = filterData.data[i + 1];
      var textureB = filterData.data[i + 2];
      var textureA = filterData.data[i + 3];
      var blendingData = blendingFunc[blendingMode]([originalR, originalG, originalB, originalA], [textureR, textureG, textureB, textureA]);
      imageDataOriginal.data[i] = blendingData[0];
      imageDataOriginal.data[i + 1] = blendingData[1];
      imageDataOriginal.data[i + 2] = blendingData[2];
      // imageDataOriginal.data[i + 3] = 255
    }
    ctxOutPut.clearRect(0, 0, width, height);
    ctxOutPut.putImageData(imageDataOriginal, 0, 0);

    canvasOutput.toBlob(function (blob) {
      var url = window.URL.createObjectURL(blob);
      resolve({ blob: blob, url: url });
    }, 'image/' + mimeType, quality);
  });
}

module.exports = blending;