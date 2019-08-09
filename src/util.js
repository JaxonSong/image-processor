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
        image.height = height
      }
      resolve(image)
    } else {
      image.onload = function () {
        if (width) {
          image.width = width
        }
        if (height) {
          image.height = height
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

module.exports.rgb2Hsb = function (r, g, b) {
  r /= 255
  g /= 255
  b /= 255
  let h, s, v
  let min = Math.min(r, g, b)
  let max = v = Math.max(r, g, b)
  let difference = max - min

  if (max === min) {
    h = 0
  } else {
    switch (max) {
      case r:
        h = (g - b) / difference + (g < b ? 6 : 0)
        break
      case g:
        h = 2.0 + (b - r) / difference
        break
      case b:
        h = 4.0 + (r - g) / difference
        break
    }
    h = Math.round(h * 60)
  }
  if (max === 0) {
    s = 0
  } else {
    s = 1 - min / max
  }
  s = Math.round(s * 100 * 100) / 100
  v = Math.round(v * 100 * 100) / 100
  return [h, s, v]
}

module.exports.hsb2Rgb = function (h, s, v) {
  s /= 100
  v /= 100
  let h1 = Math.floor(h / 60) % 6
  let f = h / 60 - h1
  let p = v * (1 - s)
  let q = v * (1 - f * s)
  let t = v * (1 - (1 - f) * s)
  let r, g, b
  switch (h1) {
    case 0:
      r = v
      g = t
      b = p
      break
    case 1:
      r = q
      g = v
      b = p
      break
    case 2:
      r = p
      g = v
      b = t
      break
    case 3:
      r = p
      g = q
      b = v
      break
    case 4:
      r = t
      g = p
      b = v
      break
    case 5:
      r = v
      g = p
      b = q
      break
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}
