'use strict';

var loadImage = require('./util.js').loadImage;

function lut(_ref) {
  var srcOriginalImage = _ref.srcOriginalImage,
      srcLutImage = _ref.srcLutImage,
      outputCanvas = _ref.outputCanvas,
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
    var canvasLut = document.createElement('canvas');
    var ctxLut = canvasLut.getContext('2d');
    outputCanvas = outputCanvas instanceof HTMLElement && outputCanvas.tagName === 'CANVAS' ? outputCanvas : document.createElement('canvas');
    var ctxOutPut = outputCanvas.getContext('2d');

    var originalImage = await loadImage(srcOriginalImage);
    var width = originalImage.width;
    var height = originalImage.height;

    canvasOriginal.width = width;
    canvasOriginal.height = height;
    ctxOriginal.drawImage(originalImage, 0, 0);

    var lutImage = await loadImage(srcLutImage);
    canvasLut.width = lutImage.width;
    canvasLut.height = lutImage.height;
    ctxLut.drawImage(lutImage, 0, 0);

    outputCanvas.width = width;
    outputCanvas.height = height;

    var imageDataOriginal = ctxOriginal.getImageData(0, 0, width, height);
    var filterData = ctxLut.getImageData(0, 0, lutImage.width, lutImage.height);

    for (var i = 0; i < imageDataOriginal.data.length; i += 4) {
      // original rgba
      var factor = 255.0;
      var r = imageDataOriginal.data[i] / factor;
      var g = imageDataOriginal.data[i + 1] / factor;
      var b = imageDataOriginal.data[i + 2] / factor;
      var a = 255;

      var blueColor = b * 63.0;

      var quad1 = {};
      quad1.y = Math.floor(Math.floor(blueColor) / 8.0);
      quad1.x = Math.floor(blueColor) - quad1.y * 8.0;

      var quad2 = {};
      quad2.y = Math.floor(Math.ceil(blueColor) / 8.0);
      quad2.x = Math.ceil(blueColor) - quad2.y * 8.0;

      var texPos1 = {
        x: quad1.x * 0.125 + 0.5 / 512.0 + (0.125 - 1.0 / 512.0) * r,
        y: quad1.y * 0.125 + 0.5 / 512.0 + (0.125 - 1.0 / 512.0) * g
      };

      var texPos2 = {
        x: quad2.x * 0.125 + 0.5 / 512.0 + (0.125 - 1.0 / 512.0) * r,
        y: quad2.y * 0.125 + 0.5 / 512.0 + (0.125 - 1.0 / 512.0) * g
      };

      var column = Math.sqrt(filterData.data.length / 4);
      var line = column;

      // color1
      var index1 = (Math.floor(texPos1.y * 512.0) * line + (Math.floor(texPos1.x * 512.0) + 1.0)) * 4.0;
      var Rr = filterData.data[index1 - 4] / 255;
      var Gg = filterData.data[index1 - 3] / 255;
      var Bb = filterData.data[index1 - 2] / 255;

      // color2
      var index2 = (Math.floor(texPos2.y * 512.0) * line + (Math.floor(texPos2.x * 512.0) + 1.0)) * 4.0;
      var Rrr = filterData.data[index2 - 4] / 255;
      var Ggg = filterData.data[index2 - 3] / 255;
      var Bbb = filterData.data[index2 - 2] / 255;

      // fract
      var fraceB = blueColor - Math.floor(blueColor);

      // mix color1, color2, fraceB     x * (1 − z) + y * z
      // newColor
      var mixx = Rr * (1 - fraceB) + Rrr * fraceB;
      var mixy = Gg * (1 - fraceB) + Ggg * fraceB;
      var mixz = Bb * (1 - fraceB) + Bbb * fraceB;

      // mix original, newColor, intensity
      var intensity = 1;
      var mixxx = r * (1 - intensity) + mixx * intensity;
      var mixyy = g * (1 - intensity) + mixy * intensity;
      var mixzz = b * (1 - intensity) + mixz * intensity;

      var ofactor = 255.0;
      imageDataOriginal.data[i] = mixxx * ofactor;
      imageDataOriginal.data[i + 1] = mixyy * ofactor;
      imageDataOriginal.data[i + 2] = mixzz * ofactor;
      imageDataOriginal.data[i + 3] = a;
    }

    ctxOutPut.putImageData(imageDataOriginal, 0, 0);

    outputCanvas.toBlob(function (blob) {
      var url = window.URL.createObjectURL(blob);
      resolve({ blob: blob, url: url });
    }, 'image/' + mimeType, quality);
  });
}

module.exports = lut;