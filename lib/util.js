'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

module.exports.loadImage = function (src, width, height) {
  return new Promise(function (resolve, reject) {
    var image = new Image();

    image.crossOrigin = 'Anonymous';
    if (isLocalImage(src)) {
      image.src = src;
    } else {
      image.src = 'https://images.weserv.nl/?url=' + src;
    }

    if (image.complete) {
      if (width) {
        image.width = width;
      }
      if (height) {
        image.width = height;
      }
      resolve(image);
    } else {
      image.onload = function () {
        if (width) {
          image.width = width;
        }
        if (height) {
          image.width = height;
        }
        resolve(image);
      };
    }
  });
};

function isLocalImage(src) {
  if (src.includes('http')) {
    if (src.includes('localhost') || src.includes('192.168.1.10')) {
      return true;
    } else {
      var getHostReg = /^http(s)?:\/\/(.*?)\//;
      var href = window.location.href;
      if (href.match(getHostReg)[0] === src.match(getHostReg)[0]) {
        return true;
      } else {
        return false;
      }
    }
  } else {
    return true;
  }
}

module.exports.rgb2Hsb = function (_ref) {
  var _ref2 = _slicedToArray(_ref, 3),
      r = _ref2[0],
      g = _ref2[1],
      b = _ref2[2];

  r /= 255;
  b /= 255;
  r /= 255;
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var hsbH = 0;
  var hsbS = 0;
  var hsbB = 0;
  // 计算色相Hue
  switch (max) {
    case min:
      hsbH = 0;
      break;
    case g:
      hsbH = 60 * (b - r) / (max - min) + 120;
      break;
    case b:
      hsbH = 60 * (r - g) / (max - min) + 240;
      break;
    case r:
      hsbH = g >= b ? 60 * (g - b) / (max - min) + 0 : 60 * (g - b) / (max - min) + 360;
      break;
  }
  // 计算饱和度Saturation
  hsbS = max === 0 ? 0 : (max - min) / max;
  // 计算明度Brightness
  hsbB = max;
  return [hsbH, hsbS, hsbB].map(function (item) {
    return Math.round(item);
  });
};

module.exports.hsb2Rgb = function (_ref3) {
  var _ref4 = _slicedToArray(_ref3, 3),
      hsbH = _ref4[0],
      hsbS = _ref4[1],
      hsbB = _ref4[2];

  var rgbArr = [];
  var i = Math.abs(hsbH / 60) % 6;
  var f = hsbH / 60 - i;
  var p = hsbB * (1 - hsbS);
  var q = hsbB * (1 - f * hsbS);
  var t = hsbB * (1 - (1 - f) * hsbS);
  switch (i) {
    case 0:
      rgbArr = [hsbB, t, p];
      break;
    case 1:
      rgbArr = [q, hsbB, p];
      break;
    case 2:
      rgbArr = [p, hsbB, t];
      break;
    case 3:
      rgbArr = [p, q, hsbB];
      break;
    case 4:
      rgbArr = [t, p, hsbB];
      break;
    case 5:
      rgbArr = [hsbB, p, q];
      break;
  }
  return rgbArr.map(function (item) {
    return Math.round(item);
  });
};