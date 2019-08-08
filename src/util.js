module.exports.loadImage = function (src, width, height) {
  return new Promise((resolve, reject) => {
    let image = new Image()

    image.crossOrigin = 'Anonymous'
    if (isLocalImage(src)) {
      image.src = src
    } else {
      image.src = 'https://images.weserv.nl/?url=' + src
    }

    if (image.complete) {
      if (width) {
        image.width = width
      }
      if (height) {
        image.width = height
      }
      resolve(image)
    } else {
      image.onload = function () {
        if (width) {
          image.width = width
        }
        if (height) {
          image.width = height
        }
        resolve(image)
      }
    }
  })
}

function isLocalImage (src) {
  if (src.includes('http')) {
    if (src.includes('localhost') || src.includes('192.168.1.10')) {
      return true
    } else {
      let getHostReg = /http(s)?:\/\/(.*?)\//
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

module.exports.rgb2Hsb = function ([r, g, b]) {
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

module.exports.hsb2Rgb = function ([hsbH, hsbS, hsbB]) {
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
