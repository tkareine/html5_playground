var CanvasEffects = {};

(function (CE, $) {
  CE.to = function(canvas) {
    if (!canvas || !canvas[0] || !canvas[0].getContext) return void(0);

    var context = canvas[0].getContext('2d'),
        width = canvas[0].width,
        height = canvas[0].height;

    function drawFrameWith(routine) {
      var imageData = context.getImageData(0, 0, width, height),
          pixels = imageData.data;

      routine(pixels);
      context.putImageData(imageData, 0, 0);
    }

    function drawPixel(pixels, x, y, rgb) {
      var offset = (y * width + x) * 4;

      pixels[offset]   = rgb[0];  // red
      pixels[offset+1] = rgb[1];  // green
      pixels[offset+2] = rgb[2];  // blue
      pixels[offset+3] = 255;     // alpha
    }

    return {
      plasma: function () {
        function createPalette(size) {
          function paletteGradient(index) {
            return [
              Math.floor( 32 + 128 * Math.sin(Math.PI * index /  16)),
              Math.floor( 64 + 128 * Math.sin(Math.PI * index / 256)),
              Math.floor(128 + 128 * Math.sin(Math.PI * index / 256))
            ];
          }

          var index, palette = new Array(size);

          for (index = 0; index < size; index += 1) {
            palette[index] = paletteGradient(index);
          }

          return palette;
        }

        var paletteSize = 256,
            palette = createPalette(paletteSize),
            sineBaseWidth = 16;

        function plasmaWave(x, y, shift) {
          return Math.floor(
            128 * (
              Math.sin((x + shift) / sineBaseWidth) +
              Math.sin((y + shift) / sineBaseWidth) +
              Math.sin((x + y) / sineBaseWidth / 2) +
              Math.sin(Math.sqrt(x * x + y * y) / sineBaseWidth * 2)
            ) / 4 + shift);
        }

        function plasmaWaveToPaletteIndex(x, y, shift) {
          return Math.abs(plasmaWave(x, y, shift)) % paletteSize;
        }

        function getContinousValue() { return Date.now(); }

        function drawPlasma(pixels) {
          var x, y, rgb;
          var shift = Math.floor(getContinousValue() / 100);

          for (x = 0; x < width; x += 1) {
            for (y = 0; y < height; y += 1) {
              rgb = palette[plasmaWaveToPaletteIndex(x, y, shift)];
              drawPixel(pixels, x, y, rgb);
            }
          }
        }

        function drawFrame() { drawFrameWith(drawPlasma); }

        (function animation() {
          window.requestAnimationFrame(animation);
          drawFrame();
        })();
      }
    };
  };
})(CanvasEffects, window.jQuery);
