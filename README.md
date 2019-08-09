# image-processor

**A powerful JavaScript image processing tool, Including picture blending and LUT filter overlay.😎**

## Features
- Url that supports incoming local or online pictures
- Support for 27 image blend modes in PhotoShop
- Support LUT filter overlay
- Support for outputting blob and url of processed images

## Installing
### Using npm:
```shell
  $ npm install @jaxon_song/image-processor
```
### Using cdn:
```javascript
  <script src="https://unpkg.com/@jaxon_song/image-processor/dist/bundle.min.js"></script>
```

## Usage
### blending method:
```javascript
  const { blending } = require('@jaxon_song/image-processor')

  blending({
    srcOriginalImage: [url],
    srcTextureImage: [url],
    blendingMode: 'difference'
  })
    .then( data => {
      // data includes the blob object and url of the processed image
      console.log(data)
    })
```
### lut method:
```javascript
  const { lut } = require('@jaxon_song/image-processor')

  lut({
    srcOriginalImage: [url],
    srcLutImage: [url]
  })
    .then(data => {
      // data includes the blob object and url of the processed image
      console.log(data)
    })
```
### Output the processed image to the canvas:
```javascript
  const { blending, lut } = require('@jaxon_song/image-processor')

  // If the canvas element is passed, the processed image will be directly output to the canvas.

  blending({
    srcOriginalImage: [url],
    srcTextureImage: [url],
    blendingMode: 'difference'，
    canvasOutput: [cnavas element]
  })

  lut({
    srcOriginalImage: [url],
    srcLutImage: [url],
    canvasOutput: [cnavas element]
  })
```
## API
### blending
```javascript
  const { blending } = require('@jaxon_song/image-processor')

  blending({
    // Original image url ( Underlying image )
    srcOriginalImage: [string],
    // Mixed image url ( Upper picture )
    srcTextureImage: [string],
    // The canvas element to be output
    canvasOutput: [canvas element],
    // blending mode ( Same as PhotoShop's blend mode ). The default mode is multiply.
    blendingMode: [string],
    // A DOMString indicating the image format. The default type is image/jpeg.
    mimeType: [string],
    // A Number between 0 and 1 indicating image quality if the requested type is image/jpeg or image/webp. If this argument is anything else, the default values 0.92 and 0.80 are used for image/jpeg and image/webp respectively. Other arguments are ignored.
    quality: [number]
  })
```
### lut
```javascript
  const { lut } = require('@jaxon_song/image-processor')

  lut({
    // Original image url ( Underlying image )
    srcOriginalImage: [string],
    // lut image url ( Upper picture )
    srcLutImage: [string],
    // The canvas element to be output
    canvasOutput: [canvas element],
    // A DOMString indicating the image format. The default type is image/jpeg.
    mimeType: [string],
    // A Number between 0 and 1 indicating image quality if the requested type is image/jpeg or image/webp. If this argument is anything else, the default values 0.92 and 0.80 are used for image/jpeg and image/webp respectively. Other arguments are ignored.
    quality: [number]
  })
```
## Blending Mode
| Name      |    Mode |
| :-------- | --------:|
| normal  | normal |
| multiply     |   multiply |
| screen      |    screen |
| difference      |    difference |
| subtract      |    subtract |
| overlay      |    overlay |
| darken      |    darken |
| lighten      |    lighten |
| exclusion      |    exclusion |
| colorDodge      |    color-dodge |
| colorBurn      |    color-burn |
| hardLight      |    hard-light |
| softLight      |    soft-light |
| hue      |    hue |
| saturation      |    saturation|
| color      |    color |
| luminosity      |    luminosity |
| dissolve      |    dissolve |
| linearBurn      |    linear-burn |
| darkerColor      |    darker-color |
| linearDodge      |    linear-dodge |
| lighterColor      |    lighter-color |
| vividLight      |    vivid-light |
| linearLight      |    linear-light |
| pinLight      |    pin-light |
| hardMix      |    hard-mix |
| divide      |    divide |

## License
MIT