#Pixel Color Cruncher

Given an image, gives you the a palette of colors from it. A [median-cut color quantization](https://www.wikiwand.com/en/Median_cut) implementation. 

## Demo
See it in action here: [demo!](http://piratefsh.github.io/pixel-color-cruncher/)

## To use

Pixel cruncher is a WebWorker. 

    // create web worker
    var pixelCruncher = new Worker('/js/pixel-cruncher.js'); // or wherever pixel-cruncher.js is located
    
    pixelCruncher.addEventListener('message', function(e){
        var colors = e.data;
        displayColors(colors);
    });

    // spawn worker thread to crunch pixels. num_colors must be multiple of 2
    pixelCruncher.postMessage({data: imageData, num_colors: 16});


Refer to `js/main.js` for a usage example. 