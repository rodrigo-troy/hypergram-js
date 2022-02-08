/*jshint esversion: 8 */

/* global console*/
const fileInput = document.getElementById('file-input');
const canvas = document.getElementById('canvas');
const brightnessComponent = document.getElementById('brightness');
const contrastComponent = document.getElementById('contrast');
const transparentComponent = document.getElementById('transparent');
let ctx = canvas.getContext("2d");
let image = new Image();

window.onload = () => {
    "use strict";
    console.log("Page loaded");
    resetPage();
};

function resetPage() {
    "use strict";
    console.log("Reset page");
    let clientHeight = document.documentElement.clientHeight;
    canvas.style.height = clientHeight + "px";
    canvas.style.width = "100%";
    canvas.style.maxWidth = canvas.style.width;

    const brightness = document.getElementById('brightness');
    const contrast = document.getElementById('contrast');
    const transparent = document.getElementById('transparent');

    brightness.value = 0;
    contrast.value = 0;
    transparent.value = 1;

    console.log(`brightness: ${brightness.value}`);
    console.log(`contrast: ${contrast.value}`);
    console.log(`transparent: ${transparent.value}`);
}

fileInput.addEventListener('change',
                           function (ev) {
                               "use strict";
                               if (ev.target.files) {
                                   let file = ev.target.files[0];
                                   let reader = new FileReader();
                                   reader.readAsDataURL(file);
                                   reader.onloadend = function (e) {
                                       image.src = e.target.result;
                                       image.onload = function (ev) {
                                           canvas.width = image.width;
                                           canvas.height = image.height;
                                           ctx.drawImage(image,
                                                         0,
                                                         0);
                                       };
                                   };
                               }
                           });

brightnessComponent.addEventListener("change",
                                     function () {
                                         "use strict";
                                         applyFilters();
                                     });

contrastComponent.addEventListener("change",
                                   function () {
                                       "use strict";
                                       applyFilters();
                                   });

transparentComponent.addEventListener("change",
                                      function () {
                                          "use strict";
                                          applyFilters();
                                      });


function applyFilters() {
    let brightness = parseInt(brightnessComponent.value);
    let contrast = parseInt(contrastComponent.value);
    let transparent = parseFloat(transparentComponent.value);

    ctx.drawImage(image,
                  0,
                  0);

    let imageData = ctx.getImageData(0,
                                     0,
                                     canvas.width,
                                     canvas.height);
    let pixels = imageData.data;
    let factor = 259 * (255 + contrast) / (255 * (259 - contrast));

    for (let i = 0; i < pixels.length; i++) {
        if ((i + 1) % 4 !== 0) {
            pixels[i] = truncate(factor * (pixels[i] - 128) + 128 + brightness);
        } else {
            pixels[i] *= transparent;
        }
    }

    imageData.data = pixels;

    ctx.putImageData(imageData,
                     0,
                     0);
}

function truncate(number) {
    "use strict";

    if (number < 0) {
        number = 0;
    } else if (number > 255) {
        number = 255;
    }

    return number;
}


document.getElementById('save-button')
        .addEventListener("click",
                          function () {
                              "use strict";
                              let image = canvas.toDataURL();

                              let tmpLink = document.createElement('a');
                              tmpLink.download = 'result.png';
                              tmpLink.href = image;

                              document.body.appendChild(tmpLink);
                              tmpLink.click();
                              document.body.removeChild(tmpLink);
                          });
