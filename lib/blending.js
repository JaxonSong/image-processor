const rgb2hsb = require('./utils/color_converter').rgb2hsb
const hsb2Rgb = require('./utils/color_converter').hsb2Rgb

class Blending {
  constructor () {
    this.srcOriginalImage = null
    this.srcLUTImage = null
    this.srcTextureImage = null
    this.blendingMode = {}
    this.currentBlendingMode = '',
    this.outPutFormat = ''
    this.outPutQuality = ''
    this.tempImageData = () => []
    this.index = 0
    this.initialized()
  }
  initialized () {
    this.initBlendingMode()
  }
  convertLut ({originalImage, lutImage, canvasOutPutDom, outPutFormat, outPutQuality, index, shouldSaveImageData}) {
    return new Promise((resolve, reject) => {
      this.srcOriginalImage = originalImage.isLocal ? originalImage.url : 'https://images.weserv.nl/?url=' + originalImage.url
      this.srcLUTImage = lutImage.isLocal ? lutImage.url : 'https://images.weserv.nl/?url=' + lutImage.url
      let ctxOutPutCanvas = canvasOutPutDom.getContext('2d')
      this.outPutFormat = outPutFormat
      this.outPutQuality = outPutQuality
      this.index = index

      if (index === undefined) {
        this.initOriginalImage({canvasOutPutDom, ctxOutPutCanvas}).then(() => {
          this.initLUT({canvasOutPutDom, ctxOutPutCanvas, shouldSaveImageData}).then(() => { resolve() })
        })
      } else {
        this.initLUT({canvasOutPutDom, ctxOutPutCanvas}).then(() => { resolve() })
      }
    })
  }
  convertBlending ({originalImage, textureImage, canvasOutPutDom, outPutFormat, outPutQuality, blendingMode, index, shouldSaveImageData}) {
    return new Promise((resolve, reject) => {
      let ctxOutPutCanvas = canvasOutPutDom.getContext('2d')
      this.srcOriginalImage = originalImage.isLocal ? originalImage.url : 'https://images.weserv.nl/?url=' + originalImage.url
      this.srcTextureImage = textureImage.isLocal ? textureImage.url : 'https://images.weserv.nl/?url=' + textureImage.url
      this.currentBlendingMode = blendingMode
      this.outPutFormat = outPutFormat
      this.outPutQuality = outPutQuality
      this.index = index
      if (index === undefined) {
        this.initOriginalImage({canvasOutPutDom, ctxOutPutCanvas}).then(() => {
          this.initTexture({canvasOutPutDom, ctxOutPutCanvas, shouldSaveImageData}).then(() => { resolve() })
        })
      } else {
        this.initTexture({canvasOutPutDom, ctxOutPutCanvas}).then(() => { resolve() })
      }
    })
  }
  initOriginalImage ({canvasOutPutDom, ctxOutPutCanvas}) {
    return new Promise((resolve, reject) => {
      let imageInput = new Image()

      imageInput.crossOrigin = 'Anonymous'

      imageInput.onload = function () {
        canvasOutPutDom.width = imageInput.width
        canvasOutPutDom.height = imageInput.height
        ctxOutPutCanvas.drawImage(imageInput, 0, 0)
        resolve()
      }
      imageInput.src = this.srcOriginalImage

      // make sure the load event fires for cached images too
      if (imageInput.complete || imageInput.complete === undefined) {
        imageInput.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='
        imageInput.src = this.srcOriginalImage
      }
    })
  }
  initLUT ({canvasOutPutDom, ctxOutPutCanvas, shouldSaveImageData}) {
    return new Promise((resolve, reject) => {
      let that = this
      let imageLut = new Image()
      let canvasLutDom = document.createElement('canvas')
      let ctxLut = canvasLutDom.getContext('2d')
      imageLut.crossOrigin = 'Anonymous'
      imageLut.onload = function () {
        canvasLutDom.width = imageLut.width
        canvasLutDom.height = imageLut.height
        ctxLut.drawImage(imageLut, 0, 0)
        that.applyLUT({canvasOutPutDom, ctxOutPutCanvas, canvasLutDom, ctxLut, shouldSaveImageData}).then(() => { resolve() })
      }

      imageLut.src = this.srcLUTImage
      // make sure the load event fires for cached images too
      if (imageLut.complete || imageLut.complete === undefined) {
        imageLut.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='
        imageLut.src = this.srcLUTImage
      }
    })
  }
  initTexture ({canvasOutPutDom, ctxOutPutCanvas, shouldSaveImageData}) {
    return new Promise((resolve, reject) => {
      let that = this
      let imageTexture = new Image()
      let canvasTextureDom = document.createElement('canvas')
      let ctxTexture = canvasTextureDom.getContext('2d')

      imageTexture.crossOrigin = 'Anonymous'
      imageTexture.onload = function () {
        let width = canvasOutPutDom.width
        let height = canvasOutPutDom.height
        imageTexture.width = width
        imageTexture.height = height
        canvasTextureDom.width = width
        canvasTextureDom.height = height
        // console.log(width)
        // console.log(height)
        // console.log(imageTexture)
        // console.log(canvasTextureDom)
        // console.log(canvasOutPutDom)

        ctxTexture.drawImage(imageTexture, 0, 0, width, height)
        that.appleShadowBlebding({canvasOutPutDom, ctxOutPutCanvas, canvasTextureDom, ctxTexture, shouldSaveImageData}).then(() => { resolve() })
      }

      imageTexture.src = this.srcTextureImage
      // make sure the load event fires for cached images too
      if (imageTexture.complete || imageTexture.complete === undefined) {
        imageTexture.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='
        imageTexture.src = this.srcTextureImage
      }
    })
  }
  applyLUT ({canvasOutPutDom, ctxOutPutCanvas, canvasLutDom, ctxLut, shouldSaveImageData}) {
    return new Promise((resolve, reject) => {
      // let filterWidth = canvasLutDom.width
      // let imageDataOutput = ctxOutPutCanvas.getImageData(0, 0, canvasOutPutDom.width, canvasOutPutDom.height)
      let imageDataOutput = this.tempImageData.length ? this.tempImageData[this.index] : ctxOutPutCanvas.getImageData(0, 0, canvasOutPutDom.width, canvasOutPutDom.height)
      let filterData = ctxLut.getImageData(0, 0, canvasLutDom.width, canvasLutDom.height)

      // invert colors
      for (var i = 0; i < imageDataOutput.data.length; i += 4) {
        // original rgba
        const factor = 255.0
        const r = imageDataOutput.data[i] / factor
        const g = imageDataOutput.data[i + 1] / factor
        const b = imageDataOutput.data[i + 2] / factor
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
        imageDataOutput.data[i] = mixxx * ofactor
        imageDataOutput.data[i + 1] = mixyy * ofactor
        imageDataOutput.data[i + 2] = mixzz * ofactor
        imageDataOutput.data[i + 3] = a
      }
      Promise.all([
        // Cut out two sprites from the sprite sheet
        createImageBitmap(imageDataOutput, 0, 0, canvasOutPutDom.width, canvasOutPutDom.height)
      ]).then(sprites => {
        // Draw each sprite onto the canvas
        ctxOutPutCanvas.drawImage(sprites[0], 0, 0)

        let dataUrl = canvasOutPutDom.toDataURL('image/'+this.outPutFormat, this.outPutQuality)
        resolve(dataUrl)
      })
    })
  }
  appleShadowBlebding ({canvasOutPutDom, ctxOutPutCanvas, canvasTextureDom, ctxTexture, shouldSaveImageData}) {
    return new Promise((resolve, reject) => {
      let imageDataOutput = this.tempImageData.length ? this.tempImageData[this.index] : ctxOutPutCanvas.getImageData(0, 0, canvasOutPutDom.width, canvasOutPutDom.height)
      let filterData = ctxTexture.getImageData(0, 0, canvasTextureDom.width, canvasTextureDom.height)
      for (let i = 0; i < imageDataOutput.data.length; i += 4) {
        // 跳过全透明像素
        if (imageDataOutput.data[i + 3] === 0) continue

        // get original image 4 channel
        let originalR = imageDataOutput.data[i]
        let originalG = imageDataOutput.data[i + 1]
        let originalB = imageDataOutput.data[i + 2]
        let originalA = imageDataOutput.data[i + 3]
        // get texture image 4 channel
        let textureR = filterData.data[i]
        let textureG = filterData.data[i + 1]
        let textureB = filterData.data[i + 2]
        let textureA = filterData.data[i + 3]
        let blendingData = this.blendingMode[this.currentBlendingMode]([originalR, originalG, originalB, originalA], [textureR, textureG, textureB, textureA])
        imageDataOutput.data[i] = blendingData[0]
        imageDataOutput.data[i + 1] = blendingData[1]
        imageDataOutput.data[i + 2] = blendingData[2]
        // imageDataOutput.data[i + 3] = 255
      }
      // console.log('afterBlending', imageDataOutput)
      if (shouldSaveImageData) {
        this.tempImageData.push(imageDataOutput)
      }
      ctxOutPutCanvas.clearRect(0, 0, canvasOutPutDom.width, canvasOutPutDom.height)
      ctxOutPutCanvas.putImageData(imageDataOutput, 0, 0)

      let dataUrl = canvasOutPutDom.toDataURL('image/'+this.outPutFormat, this.outPutQuality)
      resolve(dataUrl)
    })
  }
  initBlendingMode () {
    this.blendingMode = {
      /**
       * 正常
       */
      normal: (originRGBArr, textureRGBArr) => {
        return textureRGBArr.map(item => item)
        // let alpha = textureRGBArr[3]
        // return textureRGBArr.map((item, index) => {
        //   let opaqueness = 255 - item[3] // 不透明度
        //   if (index < 3) {
        //     return item * opaqueness + (255 - opaqueness)
        //   }
        // })
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
        let hsbOriginal = rgb2hsb(originRGBArr)
        let hsbTexture = rgb2hsb(textureRGBArr)
        let hsbBlending = ([hsbTexture[0], hsbOriginal[1], hsbOriginal[2]])
        let rgbBlending = hsb2Rgb(hsbBlending)
        return rgbBlending
      },
      /**
       * 饱和度
       */
      saturation: (originRGBArr, textureRGBArr) => {
        let hsbOriginal = rgb2hsb(originRGBArr)
        let hsbTexture = rgb2hsb(textureRGBArr)
        let hsbBlending = ([hsbOriginal[0], hsbTexture[1], hsbOriginal[2]])
        let rgbBlending = hsb2Rgb(hsbBlending)
        return rgbBlending
      },
      /**
       * 颜色
       */
      color: (originRGBArr, textureRGBArr) => {
        let hsbOriginal = rgb2hsb(originRGBArr)
        let hsbTexture = rgb2hsb(textureRGBArr)
        let hsbBlending = ([hsbTexture[0], hsbTexture[1], hsbOriginal[2]])
        let rgbBlending = hsb2Rgb(hsbBlending)
        return rgbBlending
      },
      /**
       * 明度
       */
      luminosity: (originRGBArr, textureRGBArr) => {
        let hsbOriginal = rgb2hsb(originRGBArr)
        let hsbTexture = rgb2hsb(textureRGBArr)
        let hsbBlending = ([hsbOriginal[0], hsbOriginal[1], hsbTexture[2]])
        let rgbBlending = hsb2Rgb(hsbBlending)
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
  }
}

module.exports = Blending
