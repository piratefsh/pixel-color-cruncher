var SAMPLE_SIZE = 32;

function colorQuant(imageData){
    var paletteSize = SAMPLE_SIZE;
    var bucketColors = new Array(paletteSize);

    var buckets = [];

    var initBucket = new Array(imageData.length/4);

    //put all pixels in bucket
    for(var i = 0; i < imageData.length; i+=4){
        initBucket[i/4] = imageData.slice(i, i+3);
    }

    buckets.push(initBucket);

    // repeat until number of buckets you want
    while(buckets.length < paletteSize){
        var n = buckets.length;
        // for each bucket
        for(var i = 0 ; i < n; i++){
            var bucket = buckets.shift();

            // chanel = find out whih color channel has greatest range
            var channel = greatestRange(bucket)            

            // sort pixels according to channel in desc order
            bucket.sort(pixelSort(channel))

            // move upper half of pixels to new bucket (size = paletteSize/2)
            Array.prototype.push.apply(buckets, splitBucket(bucket));
        }
    }

    // apply avg to each bucket and that will give you a color
    return buckets.map(function(bucket){
        return averageColor(bucket);
    });
}

function averageColor(pixels) {
    accumulatedPixels = pixels.reduce(function (accumulate, pixel) {
        accumulate[0] += pixel[0];
        accumulate[1] += pixel[1];
        accumulate[2] += pixel[2];

        return accumulate;
    }, [0, 0, 0]);

    return accumulatedPixels.map(function (accumulate) {
        return Math.floor(accumulate/pixels.length);
    });
}

function getAverageColor(bucket) {
    bucket.map(averageColor)
}

function splitBucket(bucket){
    var lowerHalf = bucket.slice(Math.floor(bucket.length/2), bucket.length);
    var upperHalf = bucket.splice(0, bucket.length/2);

    return [lowerHalf, upperHalf];
}

function pixelSort(channel) {
    return function (a, b) {
        return b[channel] - a[channel];
    }
}

function greatestRange(bucket){
    var max = {r: 0, g: 0, b: 0};
    var min = {r: 255, g: 255, b: 255};
    var keys = Object.keys(max);

    for(var i = 0; i < bucket.length; i++){
        var pixel = bucket[i];

        for(var j = 0; j < keys.length; j++){
            var channel = pixel[j];
            var key = keys[j];
            if(channel > max[key]){
                max[key] = channel;
            }
            if(channel < min[key]){
                min[key] = channel;
            }
        }
    }

    var channelWithGreatestRange = 'r';
    var greatestRangeSoFar = 0;
    for(var j = 0; j < keys.length; j++){
        var channel = keys[j];
        var diff = max[channel] - min[channel] 
        if(diff > greatestRangeSoFar){
            channelWithGreatestRange = channel;
            greatestRangeSoFar = diff;
        }
    }
    return keys.indexOf(channelWithGreatestRange);
}

function test(){
    var b1 = [[0,100,100], [255,120,140]]

    var b2 = [[255,0,90], [254,0,100]]

    var b3 = [[255,255,0], [254,254,0]]
    assert(greatestRange(b1), 0);
    assert(greatestRange(b2), 2);
    assert(greatestRange(b3), 0);

    var b4 = [[254,2,0], [255,1,0], [255,3,0]]
    b4.sort(pixelSort(1));

    assert(splitBucket(b1).sort().toString(), [[[0,100,100]], [[255,120,140]]].sort().toString())

}

function assert(a, b){
    if (a != b){
        console.error('Assertion failed', a, b);
    }
    else{
        console.info('Test pass')
    }
}

//worker stuff
self.addEventListener('message', function(e){
    console.log(e.data)
    var imageData = e.data.pixels;
    SAMPLE_SIZE = e.data.num_colors;
    var colors = colorQuant(imageData);
    self.postMessage(colors);
});
