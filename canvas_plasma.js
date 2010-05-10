var CanvasEffects = {};

(function (CE, $) {
    CE.to = function(canvas) {
        if (!canvas || !canvas[0] || !canvas[0].getContext) {
            return;
        }

        var context = canvas[0].getContext('2d'),
            width = canvas.width(),
            height = canvas.height();

        function drawFrame(drawingFun) {
            var imageData = context.getImageData(0, 0, width, height),
                pixels = imageData.data;
            drawingFun(pixels);
            context.putImageData(imageData, 0, 0);
        }

        function drawPixel(pixels, x, y, rgb) {
            var offset = (y * width + x) * 4;
            pixels[offset]   = rgb[0];
            pixels[offset+1] = rgb[1];
            pixels[offset+2] = rgb[2];
            pixels[offset+3] = 255;
        }

        return {
            plasma: function () {
                function createPalette() {
                    function paletteGradient(index) {
                        return [
                            Math.floor(32  + 128.0 * Math.sin(Math.PI * index / 16.0)),
                            Math.floor(64  + 128.0 * Math.sin(Math.PI * index / 256.0)),
                            Math.floor(128 + 128.0 * Math.sin(Math.PI * index / 256.0))
                        ];
                    }

                    var palette = new Array(256);
                    for (var index = 0; index < 256; index += 1) {
                        palette[index] = paletteGradient(index);
                    }
                    return palette;
                }

                var palette = createPalette(),
                    sineAmplitude = 128.0,
                    sineWidth = 16.0;

                function plasmaTransform(x, y, shift) {
                    return Math.floor(
                        sineAmplitude * (
                            Math.sin((x + shift) / sineWidth) +
                            Math.sin((y + shift) / sineWidth) +
                            Math.sin((x + y) / sineWidth / 2.0) +
                            Math.sin(Math.sqrt(x * x + y * y) / sineWidth * 2)
                        ) / 4.0 + shift);
                }

                function getContinousValue() {
                    return new Date().getTime();
                }

                function drawPlasma(pixels) {
                    var shift = Math.floor(getContinousValue() / 100.0);
                    for (var x = 0; x < width; x += 1) {
                        for (var y = 0; y < height; y += 1) {
                            var rgb = palette[(plasmaTransform(x, y, shift)) % 256];
                            drawPixel(pixels, x, y, rgb);
                        }
                    }
                }

                setInterval(function () {
                    drawFrame(function (pixels) {
                        drawPlasma(pixels);
                    });
                }, 33);     // ~30 fps if the computer is up to it per frame
            }
        };
    }
})(CanvasEffects, jQuery);
