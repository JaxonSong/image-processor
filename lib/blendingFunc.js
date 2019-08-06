'use strict';

var rgb2Hsb = require('./util').rgb2Hsb;
var hsb2Rgb = require('./util').hsb2Rgb;

module.exports = {
  /**
   * 正常
   */
  normal: function normal(originRGBArr, textureRGBArr) {
    return textureRGBArr.map(function (item) {
      return item;
    });
  },
  /**
   * 正片叠底
   */
  multiply: function multiply(originRGBArr, textureRGBArr) {
    return textureRGBArr.map(function (item, index) {
      return item * originRGBArr[index] / 255;
    });
  },
  /**
   * 滤色
   */
  screen: function screen(originRGBArr, textureRGBArr) {
    return textureRGBArr.map(function (item, index) {
      return 255 - (255 - item) * (255 - originRGBArr[index]) / 255;
    });
  },
  /**
   * 差值
   */
  difference: function difference(originRGBArr, textureRGBArr) {
    return textureRGBArr.map(function (item, index) {
      return Math.abs(item - originRGBArr[index]);
    });
  },
  /**
   * 减去
   */
  subtract: function subtract(originRGBArr, textureRGBArr) {
    return textureRGBArr.map(function (item, index) {
      return originRGBArr[index] - item;
    });
  },
  /**
   * 叠加
   */
  overlay: function overlay(originRGBArr, textureRGBArr) {
    return textureRGBArr.map(function (item, index) {
      if (textureRGBArr[index] <= 128) {
        return item * originRGBArr[index] / 128;
      } else {
        return 255 - (255 - item) * (255 - originRGBArr[index]) / 128;
      }
    });
  },
  /**
   * 变暗
   */
  darken: function darken(originRGBArr, textureRGBArr) {
    return textureRGBArr.map(function (item, index) {
      return Math.min(item, originRGBArr[index]);
    });
  },
  /**
   * 变亮
   */
  lighten: function lighten(originRGBArr, textureRGBArr) {
    return textureRGBArr.map(function (item, index) {
      return Math.max(item, originRGBArr[index]);
    });
  },
  /**
   * 排除
   */
  exclusion: function exclusion(originRGBArr, textureRGBArr) {
    return textureRGBArr.map(function (item, index) {
      return item + originRGBArr[index] - item * originRGBArr[index] / 128;
    });
  },
  /**
   * 颜色减淡
   */
  colorDodge: function colorDodge(originRGBArr, textureRGBArr) {
    return textureRGBArr.map(function (item, index) {
      return originRGBArr[index] + item * originRGBArr[index] / (255 - originRGBArr[index]);
    });
  },
  /**
   * 颜色加深
   */
  colorBurn: function colorBurn(originRGBArr, textureRGBArr) {
    return textureRGBArr.map(function (item, index) {
      return (originRGBArr[index] + item - 255) * 255 / item;
    });
  },
  /**
   * 强光
   */
  hardLight: function hardLight(originRGBArr, textureRGBArr) {
    return textureRGBArr.map(function (item, index) {
      if (item <= 128) {
        return item * originRGBArr[index] / 128;
      } else {
        return 255 - (255 - item) * (255 - originRGBArr[index]) / 128;
      }
    });
  },
  /**
   * 柔光
   */
  softLight: function softLight(originRGBArr, textureRGBArr) {
    return textureRGBArr.map(function (item, index) {
      if (item <= 128) {
        return originRGBArr[index] + (2 * item - 255) * (originRGBArr[index] - originRGBArr[index] * originRGBArr[index] / 255) / 255;
      } else {
        return originRGBArr[index] + (2 * item - 255) * (Math.sqrt(originRGBArr[index] / 255) * 255 - originRGBArr[index]) / 255;
      }
    });
  },
  /**
   * 色相
   */
  hue: function hue(originRGBArr, textureRGBArr) {
    var hsbOriginal = rgb2Hsb(originRGBArr);
    var hsbTexture = rgb2Hsb(textureRGBArr);
    var hsbBlending = [hsbTexture[0], hsbOriginal[1], hsbOriginal[2]];
    var rgbBlending = hsb2Rgb(hsbBlending);
    return rgbBlending;
  },
  /**
   * 饱和度
   */
  saturation: function saturation(originRGBArr, textureRGBArr) {
    var hsbOriginal = rgb2Hsb(originRGBArr);
    var hsbTexture = rgb2Hsb(textureRGBArr);
    var hsbBlending = [hsbOriginal[0], hsbTexture[1], hsbOriginal[2]];
    var rgbBlending = hsb2Rgb(hsbBlending);
    return rgbBlending;
  },
  /**
   * 颜色
   */
  color: function color(originRGBArr, textureRGBArr) {
    var hsbOriginal = rgb2Hsb(originRGBArr);
    var hsbTexture = rgb2Hsb(textureRGBArr);
    var hsbBlending = [hsbTexture[0], hsbTexture[1], hsbOriginal[2]];
    var rgbBlending = hsb2Rgb(hsbBlending);
    return rgbBlending;
  },
  /**
   * 明度
   */
  luminosity: function luminosity(originRGBArr, textureRGBArr) {
    var hsbOriginal = rgb2Hsb(originRGBArr);
    var hsbTexture = rgb2Hsb(textureRGBArr);
    var hsbBlending = [hsbOriginal[0], hsbOriginal[1], hsbTexture[2]];
    var rgbBlending = hsb2Rgb(hsbBlending);
    return rgbBlending;
  },
  /**
   * 溶解
   */
  dissolve: function dissolve(originRGBArr, textureRGBArr) {
    // if (Math.floor(Math.random() * 100) > (textureRGBArr[3] / 255 * 100)) {
    if (Math.floor(Math.random() * 100) > 50) {
      return originRGBArr;
    } else {
      return textureRGBArr;
    }
  },
  /**
   * 线性加深
   */
  linearBurn: function linearBurn(originRGBArr, textureRGBArr) {
    return textureRGBArr.map(function (item, index) {
      return originRGBArr[index] + item - 255;
    });
  },
  /**
   * 深色
   */
  darkerColor: function darkerColor(originRGBArr, textureRGBArr) {
    if (originRGBArr[0] + originRGBArr[1] + originRGBArr[2] + originRGBArr[3] < textureRGBArr[0] + textureRGBArr[1] + textureRGBArr[2] + textureRGBArr[3]) {
      return originRGBArr;
    } else {
      return textureRGBArr;
    }
  },
  /**
   * 线性减淡
   */
  linearDodge: function linearDodge(originRGBArr, textureRGBArr) {
    return textureRGBArr.map(function (item, index) {
      return Math.min(originRGBArr[index] + item, 255);
    });
  },
  /**
   * 浅色
   */
  lighterColor: function lighterColor(originRGBArr, textureRGBArr) {
    if (originRGBArr[0] + originRGBArr[1] + originRGBArr[2] + originRGBArr[3] > textureRGBArr[0] + textureRGBArr[1] + textureRGBArr[2] + textureRGBArr[3]) {
      return originRGBArr;
    } else {
      return textureRGBArr;
    }
  },
  /**
   * 亮光
   */
  vividLight: function vividLight(originRGBArr, textureRGBArr) {
    return textureRGBArr.map(function (item, index) {
      if (item <= 128) {
        return 255 - (255 - originRGBArr[index]) / (2 * item) * 255;
      } else {
        return originRGBArr[index] / (2 * (255 - item)) * 255;
      }
    });
  },
  /**
   * 线性光
   */
  linearLight: function linearLight(originRGBArr, textureRGBArr) {
    return textureRGBArr.map(function (item, index) {
      return Math.min(2 * item + originRGBArr[index] - 255, 255);
    });
  },
  /**
   * 点光
   */
  pinLight: function pinLight(originRGBArr, textureRGBArr) {
    return textureRGBArr.map(function (item, index) {
      if (originRGBArr[index] < 2 * item - 255) {
        return 2 * item - 255;
      } else if (2 * item - 255 < originRGBArr[index] < 2 * item) {
        return originRGBArr[index];
      } else if (originRGBArr[index] > 2 * item) {
        return 2 * item;
      }
    });
  },
  /**
   * 实色混合
   */
  hardMix: function hardMix(originRGBArr, textureRGBArr) {
    return textureRGBArr.map(function (item, index) {
      return item < 255 - originRGBArr[index] ? 0 : 255;
    });
  },
  /**
   * 划分
   */
  divide: function divide(originRGBArr, textureRGBArr) {
    return textureRGBArr.map(function (item, index) {
      return originRGBArr[index] / item * 255;
    });
  }
};