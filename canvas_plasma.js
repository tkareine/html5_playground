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
        function createPalette() {
          function paletteGradient(index) {
            return [
              Math.floor( 32.0 + 128.0 * Math.sin(Math.PI * index /  16.0)),
              Math.floor( 64.0 + 128.0 * Math.sin(Math.PI * index / 256.0)),
              Math.floor(128.0 + 128.0 * Math.sin(Math.PI * index / 256.0))
            ];
          }

          var palette = new Array(256);

          for (var index = 0; index < 256; index += 1) {
            palette[index] = paletteGradient(index);
          }

          return palette;
        }

        var palette = createPalette(),
            sineBaseWidth = 16.0;

        function plasmaTransform(x, y, shift) {
          return Math.floor(
            128.0 * (
              Math.sin((x + shift) / sineBaseWidth) +
                Math.sin((y + shift) / sineBaseWidth) +
                Math.sin((x + y) / sineBaseWidth / 2.0) +
                Math.sin(Math.sqrt(x * x + y * y) / sineBaseWidth * 2)
            ) / 4.0 + shift);
        }

        function getContinousValue() { return Date.now(); }

        function drawPlasma(pixels) {
          var shift = Math.floor(getContinousValue() / 100.0);
          for (var x = 0; x < width; x += 1) {
            for (var y = 0; y < height; y += 1) {
              var rgb = palette[(plasmaTransform(x, y, shift)) % 256];
              drawPixel(pixels, x, y, rgb);
            }
          }
        }

        function drawFrame() { drawFrameWith(drawPlasma); }

        var fps = 33;
        var timeout = Math.floor(1 / fps * 1000);

        (function animation() {
          setTimeout(animation, timeout);
          drawFrame();
        })();
      }
    };
  };
})(CanvasEffects, window.jQuery);
