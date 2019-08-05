(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["imageProcessor"] = factory();
	else
		root["imageProcessor"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

  module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

  "use strict";
    
  var blending = __webpack_require__(2);
  var lut = __webpack_require__(7);

  module.exports = {
    blending,
    lut
  };


/***/ }),


/* 2 */
/***/ (function(module, exports, __webpack_require__) {

  "use strict";
    
  var blendingFunc = __webpack_require__(4);
  var loadImage = __webpack_require__(5);

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

/***/ }),


/* 3 */
/***/ (function(module, exports, __webpack_require__) {

  "use strict";
    
  function rgb2hsb ([r, g, b]) {
    r /= 255
    b /= 255
    r /= 255
    let max = Math.max(r, g, b)
    let min = Math.min(r, g, b)
    let hsbH = 0
    let hsbS = 0
    let hsbB = 0
    // 计算色相Hue
    switch (max) {
      case min:
        hsbH = 0
        break
      case g:
        hsbH = 60 * (b - r) / (max - min) + 120
        break
      case b:
        hsbH = 60 * (r - g) / (max - min) + 240
        break
      case r:
        hsbH = g >= b ? 60 * (g - b) / (max - min) + 0 : 60 * (g - b) / (max - min) + 360
        break
    }
    // 计算饱和度Saturation
    hsbS = max === 0 ? 0 : (max - min) / max
    // 计算明度Brightness
    hsbB = max
    return [hsbH, hsbS, hsbB].map(item => Math.round(item))
  }
  
  function hsb2Rgb ([hsbH, hsbS, hsbB]) {
    let rgbArr = []
    let i = Math.abs(hsbH / 60) % 6
    let f = hsbH / 60 - i
    let p = hsbB * (1 - hsbS)
    let q = hsbB * (1 - f * hsbS)
    let t = hsbB * (1 - (1 - f) * hsbS)
    switch (i) {
      case 0:
        rgbArr = [hsbB, t, p]
        break
      case 1:
        rgbArr = [q, hsbB, p]
        break
      case 2:
        rgbArr = [p, hsbB, t]
        break
      case 3:
        rgbArr = [p, q, hsbB]
        break
      case 4:
        rgbArr = [t, p, hsbB]
        break
      case 5:
        rgbArr = [hsbB, p, q]
        break
    }
    return rgbArr.map(item => Math.round(item))
  }
  
  module.exports =  {
    rgb2hsb,
    hsb2Rgb
  }

/***/ }),


/* 4 */
/***/ (function(module, exports, __webpack_require__) {

  "use strict";
    
  module.exports =  {
    /**
     * 正常
     */
    normal: (originRGBArr, textureRGBArr) => {
      return textureRGBArr.map(item => item)
    },
    /**
     * 正片叠底
     */
    multiply: (originRGBArr, textureRGBArr) => {
      return textureRGBArr.map((item, index) => item * originRGBArr[index] / 255)
    },
    /**
     * 滤色
     */
    screen: (originRGBArr, textureRGBArr) => {
      return textureRGBArr.map((item, index) => 255 - (255 - item) * (255 - originRGBArr[index]) / 255)
    },
    /**
     * 差值
     */
    difference: (originRGBArr, textureRGBArr) => {
      return textureRGBArr.map((item, index) => Math.abs(item - originRGBArr[index]))
    },
    /**
     * 减去
     */
    subtract: (originRGBArr, textureRGBArr) => {
      return textureRGBArr.map((item, index) => originRGBArr[index] - item)
    },
    /**
     * 叠加
     */
    overlay: (originRGBArr, textureRGBArr) => {
      return textureRGBArr.map((item, index) => {
        if (textureRGBArr[index] <= 128) {
          return item * originRGBArr[index] / 128
        } else {
          return 255 - (255 - item) * (255 - originRGBArr[index]) / 128
        }
      })
    },
    /**
     * 变暗
     */
    darken: (originRGBArr, textureRGBArr) => {
      return textureRGBArr.map((item, index) => Math.min(item, originRGBArr[index]))
    },
    /**
     * 变亮
     */
    lighten: (originRGBArr, textureRGBArr) => {
      return textureRGBArr.map((item, index) => Math.max(item, originRGBArr[index]))
    },
    /**
     * 排除
     */
    exclusion: (originRGBArr, textureRGBArr) => {
      return textureRGBArr.map((item, index) => (item + originRGBArr[index]) - item * originRGBArr[index] / 128)
    },
    /**
     * 颜色减淡
     */
    colorDodge: (originRGBArr, textureRGBArr) => {
      return textureRGBArr.map((item, index) => originRGBArr[index] + item * originRGBArr[index] / (255 - originRGBArr[index]))
    },
    /**
     * 颜色加深
     */
    colorBurn: (originRGBArr, textureRGBArr) => {
      return textureRGBArr.map((item, index) => (originRGBArr[index] + item - 255) * 255 / item)
    },
    /**
     * 强光
     */
    hardLight: (originRGBArr, textureRGBArr) => {
      return textureRGBArr.map((item, index) => {
        if (item <= 128) {
          return item * originRGBArr[index] / 128
        } else {
          return 255 - (255 - item) * (255 - originRGBArr[index]) / 128
        }
      })
    },
    /**
     * 柔光
     */
    softLight: (originRGBArr, textureRGBArr) => {
      return textureRGBArr.map((item, index) => {
        if (item <= 128) {
          return originRGBArr[index] + (2 * item - 255) * (originRGBArr[index] - originRGBArr[index] * originRGBArr[index] / 255) / 255
        } else {
          return originRGBArr[index] + (2 * item - 255) * (Math.sqrt(originRGBArr[index] / 255) * 255 - originRGBArr[index]) / 255
        }
      })
    },
    /**
     * 色相
     */
    hue: (originRGBArr, textureRGBArr) => {
      let hsbOriginal = utils.rgb2hsb(originRGBArr)
      let hsbTexture = utils.rgb2hsb(textureRGBArr)
      let hsbBlending = ([hsbTexture[0], hsbOriginal[1], hsbOriginal[2]])
      let rgbBlending = utils.hsb2Rgb(hsbBlending)
      return rgbBlending
    },
    /**
     * 饱和度
     */
    saturation: (originRGBArr, textureRGBArr) => {
      let hsbOriginal = utils.rgb2hsb(originRGBArr)
      let hsbTexture = utils.rgb2hsb(textureRGBArr)
      let hsbBlending = ([hsbOriginal[0], hsbTexture[1], hsbOriginal[2]])
      let rgbBlending = utils.hsb2Rgb(hsbBlending)
      return rgbBlending
    },
    /**
     * 颜色
     */
    color: (originRGBArr, textureRGBArr) => {
      let hsbOriginal = utils.rgb2hsb(originRGBArr)
      let hsbTexture = utils.rgb2hsb(textureRGBArr)
      let hsbBlending = ([hsbTexture[0], hsbTexture[1], hsbOriginal[2]])
      let rgbBlending = utils.hsb2Rgb(hsbBlending)
      return rgbBlending
    },
    /**
     * 明度
     */
    luminosity: (originRGBArr, textureRGBArr) => {
      let hsbOriginal = utils.rgb2hsb(originRGBArr)
      let hsbTexture = utils.rgb2hsb(textureRGBArr)
      let hsbBlending = ([hsbOriginal[0], hsbOriginal[1], hsbTexture[2]])
      let rgbBlending = utils.hsb2Rgb(hsbBlending)
      return rgbBlending
    },
    /**
     * 溶解
     */
    dissolve: (originRGBArr, textureRGBArr) => {
      // if (Math.floor(Math.random() * 100) > (textureRGBArr[3] / 255 * 100)) {
      if (Math.floor(Math.random() * 100) > 50) {
        return originRGBArr
      } else {
        return textureRGBArr
      }
    },
    /**
     * 线性加深
     */
    linearBurn: (originRGBArr, textureRGBArr) => {
      return textureRGBArr.map((item, index) => originRGBArr[index] + item - 255)
    },
    /**
     * 深色
     */
    darkerColor: (originRGBArr, textureRGBArr) => {
      if (originRGBArr[0] + originRGBArr[1] + originRGBArr[2] + originRGBArr[3] < textureRGBArr[0] + textureRGBArr[1] + textureRGBArr[2] + textureRGBArr[3]) {
        return originRGBArr
      } else {
        return textureRGBArr
      }
    },
    /**
     * 线性减淡
     */
    linearDodge: (originRGBArr, textureRGBArr) => {
      return textureRGBArr.map((item, index) => Math.min(originRGBArr[index] + item, 255))
    },
    /**
     * 浅色
     */
    lighterColor: (originRGBArr, textureRGBArr) => {
      if (originRGBArr[0] + originRGBArr[1] + originRGBArr[2] + originRGBArr[3] > textureRGBArr[0] + textureRGBArr[1] + textureRGBArr[2] + textureRGBArr[3]) {
        return originRGBArr
      } else {
        return textureRGBArr
      }
    },
    /**
     * 亮光
     */
    vividLight: (originRGBArr, textureRGBArr) => {
      return textureRGBArr.map((item, index) => {
        if (item <= 128) {
          return 255 - (255 - originRGBArr[index]) / (2 * item) * 255
        } else {
          return originRGBArr[index] / (2 * (255 - item)) * 255
        }
      })
    },
    /**
     * 线性光
     */
    linearLight: (originRGBArr, textureRGBArr) => {
      return textureRGBArr.map((item, index) => Math.min(2 * item + originRGBArr[index] - 255, 255))
    },
    /**
     * 点光
     */
    pinLight: (originRGBArr, textureRGBArr) => {
      return textureRGBArr.map((item, index) => {
        if (originRGBArr[index] < 2 * item - 255) {
          return 2 * item - 255
        } else if (2 * item - 255 < originRGBArr[index] < 2 * item) {
          return originRGBArr[index]
        } else if (originRGBArr[index] > 2 * item) {
          return 2 * item
        }
      })
    },
    /**
     * 实色混合
     */
    hardMix: (originRGBArr, textureRGBArr) => {
      return textureRGBArr.map((item, index) => item < 255 - originRGBArr[index] ? 0 : 255)
    },
    /**
     * 划分
     */
    divide: (originRGBArr, textureRGBArr) => {
      return textureRGBArr.map((item, index) => originRGBArr[index] / item * 255)
    }
  }
  

/***/ }),


/* 5 */
/***/ (function(module, exports, __webpack_require__) {

  "use strict";
    
  var isLocalImage = __webpack_require__(6);

  function loadImage ( src, width, height ) {
    return new Promise((resolve, reject) => {
      let image = new Image()

      image.crossOrigin = 'Anonymous'
      if ( isLocalImage(src) ) {
        image.src = src
      } else {
        image.src = 'https://images.weserv.nl/?url=' + src
      }


      if(image.complete){
        if ( width ) {
          image.width = width
        }
        if ( height ) {
          image.width = height
        }
        resolve(image)
      }else{
        image.onload = function () {
          if ( width ) {
            image.width = width
          }
          if ( height ) {
            image.width = height
          }
          resolve(image)
        }
      }

    })
  }

  module.exports =  loadImage


/***/ }),


/* 6 */
/***/ (function(module, exports, __webpack_require__) {

  "use strict";
    
  function isLocalImage ( src ) {
    if (src.includes('http')) {
      if (src.includes('localhost') || src.includes('192.168.1.10')) {
        return true
      } else {
        let getHostReg = /^http(s)?:\/\/(.*?)\//
        let href = window.location.href
        if (href.match(getHostReg)[0] === src.match(getHostReg)[0]) {
          return true
        } else {
          return false
        }
      }
    } else {
      return true
    }
  }

  module.exports =  isLocalImage


/***/ }),


/* 7 */
/***/ (function(module, exports, __webpack_require__) {

  "use strict";
    
  var loadImage = __webpack_require__(5);

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


      canvasOutput.toBlob( blob => {
        let url = window.URL.createObjectURL(blob)
        resolve({blob, url})
      }, 'image/' + mimeType, quality)


    })
  }

  module.exports = lut


/***/ }),


/******/ ])
});
;