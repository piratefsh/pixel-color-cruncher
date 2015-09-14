var canvas, context;
var samples = document.querySelector('#color-samples');

function init(){
    canvas = document.getElementById('colors');

    context = canvas.getContext('2d');

    // draw image on canvas
    var img = new Image();
    img.src = 'img/puppy2.jpeg'
    img.onload = function(){
        canvas.width = this.width;
        canvas.height = this.height;
        context.drawImage(this, 0, 0);

        // get pixel data of image on canvas
        var imageData = context.getImageData(0,0,canvas.width,canvas.height).data;

        // create web worker
        var pixelCruncher = new Worker('/js/pixel-cruncher.js');
        pixelCruncher.addEventListener('crunch-pixels', function(e){
            var colors = e.data;
            displayColors(colors);
        });

        // spawn worker thread to CRUNCH pixels. num_colors must be multiple of 2
        pixelCruncher.postMessage({pixels: imageData, num_colors: 16});
    }
}

function displayColors(colors){
    // list colors
    for(var c of colors){
        var elem = document.createElement('div');
        elem.className = "color-box"
        var colorString = 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] +')'
        elem.style.backgroundColor = colorString; 
        samples.appendChild(elem);
    }
}

init();
// test();