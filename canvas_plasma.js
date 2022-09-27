var CanvasEffects = {}

;(function (CE) {
  CE.to = function (canvasEl) {
    if (!canvasEl || !canvasEl.getContext) {
      return void 0
    }

    var context = canvasEl.getContext("2d")
    var width = canvasEl.width
    var height = canvasEl.height

    function drawFrameWith(routine) {
      var imageData = context.getImageData(0, 0, width, height)
      var pixels = imageData.data

      routine(pixels)
      context.putImageData(imageData, 0, 0)
    }

    function drawPixel(pixels, x, y, rgb) {
      var offset = (y * width + x) * 4

      pixels[offset] = rgb[0] // red
      pixels[offset + 1] = rgb[1] // green
      pixels[offset + 2] = rgb[2] // blue
      pixels[offset + 3] = 255 // alpha
    }

    return {
      plasma: function () {
        function createPalette(size) {
          function paletteGradient(index) {
            return [
              Math.floor(32 + 128 * Math.sin((Math.PI * index) / 16)),
              Math.floor(64 + 128 * Math.sin((Math.PI * index) / 256)),
              Math.floor(128 + 128 * Math.sin((Math.PI * index) / 256)),
            ]
          }

          var index
          var palette = new Array(size)

          for (index = 0; index < size; index += 1) {
            palette[index] = paletteGradient(index)
          }

          return palette
        }

        var paletteSize = 256
        var palette = createPalette(paletteSize)
        var sineBaseWidth = 16

        function plasmaWave(x, y, shift) {
          return Math.floor(
            (128 *
              (Math.sin((x + shift) / sineBaseWidth) +
                Math.sin((y + shift) / sineBaseWidth) +
                Math.sin((x + y) / sineBaseWidth / 2) +
                Math.sin((Math.sqrt(x * x + y * y) / sineBaseWidth) * 2))) /
              4 +
              shift
          )
        }

        function plasmaWaveToPaletteIndex(x, y, shift) {
          return Math.abs(plasmaWave(x, y, shift)) % paletteSize
        }

        function getCurrentAnimationShift() {
          return Math.floor(Date.now() / 100)
        }

        function drawPlasma(pixels) {
          var x, y, rgb
          var shift = getCurrentAnimationShift()

          for (x = 0; x < width; x += 1) {
            for (y = 0; y < height; y += 1) {
              rgb = palette[plasmaWaveToPaletteIndex(x, y, shift)]
              drawPixel(pixels, x, y, rgb)
            }
          }
        }

        function drawFrame() {
          drawFrameWith(drawPlasma)
        }

        ;(function animation() {
          window.requestAnimationFrame(animation)
          drawFrame()
        })()
      },
    }
  }
})(CanvasEffects)
