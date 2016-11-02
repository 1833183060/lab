;(function() {
    function sharkFin(x) {
        if (x < 0) return 0;
        x = x * 2 % 2 + 0.05;
        if (x < 1) {
            return  1 + Math.log(x) / 4;

        }
        return Math.pow(-x, -2);

    }
    var count = 70;
    var sharkFinValues = new Array(count);
    for (var i = 0; i < count; i++) {
        sharkFinValues[i] = sharkFin(i/count);

    }
    var ft = new DFT(sharkFinValues.length);
    ft.forward(sharkFinValues);

    console.log( ft );

    var audioCtx = new AudioContext(),
        canvasCtx = document.getElementById( 'my_canvas' );
    
        hornTable = audioCtx.createPeriodicWave(ft.real, ft.imag);

    var osc = audioCtx.createOscillator();

    var lfo = audioCtx.createOscillator();
        //lfo.setPeriodicWave(hornTable);
        lfo.type = 'sine';
        lfo.frequency.value = 120;

    var lfoGain = audioCtx.createGain();
        lfoGain.gain.value = 0;

        lfo.connect( lfoGain );
        lfoGain.connect( osc.frequency );
        osc.start(0);
        lfo.start(0)

    var analyser = audioCtx.createAnalyser();
        analyser.fftSize = 1024;
    var bufferLength = analyser.fftSize,
        dataArray = new Uint8Array( bufferLength );

    var flag;

    var draw = canvasHandle( canvasCtx , dataArray );

    (function a() {
        analyser.getByteTimeDomainData( dataArray );
        draw();
        requestAnimationFrame(a);
    })();

    var stop = document.getElementById('stop'),
        start = document.getElementById('start'),
        range = document.getElementById('range'),
        canvas = document.getElementById('my_canvas');
    stop.addEventListener('click', function() {
        stopAudio();
    });
    start.addEventListener('click', function() {
        playAudio();
    });
    range.addEventListener('mouseup', function() {
        if( flag )
            playAudio();
    });

    function playAudio() {
        flag = true;
        osc.frequency.value = 20;
        lfoGain.gain.value = range.value;
        osc.connect( analyser );
        analyser.connect( audioCtx.destination );
    }
    function stopAudio() {
        flag = !flag;
        analyser.disconnect();
    }

    function canvasHandle( canvasObj, dataArray ) {
        var w= canvasObj.width,
            h= canvasObj.height,
            canvasCtx = canvasObj.getContext('2d');

        canvasCtx.clearRect( 0, 0, w, h );
        canvasCtx.fillStyle = '#ccc';
        canvasCtx.fillRect( 0, 0, w, h );
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = '#fff';
        canvasCtx.beginPath();
        canvasCtx.moveTo( 0, h/2 );
        canvasCtx.lineTo( w, h/2 );
        canvasCtx.stroke();

        return function() {
            var bufferLength = dataArray.length,
                sliceWidth = w / bufferLength,
                x = 0;
            canvasCtx.fillRect( 0, 0, w, h );
            canvasCtx.beginPath();

            var v, y;
            
            for( var i = 0; i < bufferLength; i++ ) {
                v = dataArray[i] / 128.0;
                y = v * h / 2;

                if( i == 0 )
                    canvasCtx.moveTo( x, y );
                else
                    canvasCtx.lineTo( x, y );

                x += sliceWidth;
            }
            canvasCtx.lineTo( w, h / 2 );
            canvasCtx.stroke();
        };
    }

})()
