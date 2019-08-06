const rgb2Hsb = require('./util').rgb2Hsb
const hsb2Rgb = require('./util').hsb2Rgb

module.exports = {
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
    let hsbOriginal = rgb2Hsb(originRGBArr)
    let hsbTexture = rgb2Hsb(textureRGBArr)
    let hsbBlending = ([hsbTexture[0], hsbOriginal[1], hsbOriginal[2]])
    let rgbBlending = hsb2Rgb(hsbBlending)
    return rgbBlending
  },
  /**
   * 饱和度
   */
  saturation: (originRGBArr, textureRGBArr) => {
    let hsbOriginal = rgb2Hsb(originRGBArr)
    let hsbTexture = rgb2Hsb(textureRGBArr)
    let hsbBlending = ([hsbOriginal[0], hsbTexture[1], hsbOriginal[2]])
    let rgbBlending = hsb2Rgb(hsbBlending)
    return rgbBlending
  },
  /**
   * 颜色
   */
  color: (originRGBArr, textureRGBArr) => {
    let hsbOriginal = rgb2Hsb(originRGBArr)
    let hsbTexture = rgb2Hsb(textureRGBArr)
    let hsbBlending = ([hsbTexture[0], hsbTexture[1], hsbOriginal[2]])
    let rgbBlending = hsb2Rgb(hsbBlending)
    return rgbBlending
  },
  /**
   * 明度
   */
  luminosity: (originRGBArr, textureRGBArr) => {
    let hsbOriginal = rgb2Hsb(originRGBArr)
    let hsbTexture = rgb2Hsb(textureRGBArr)
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
