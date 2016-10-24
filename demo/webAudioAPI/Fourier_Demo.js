;(function() {
    var squ = oscillator( 100 , 0.1, 'square' );
    //squ.osc.start( 0 );
    var ft = getSpectrum( squ.ctx );
    var audioCtx = new AudioContext(),
        canvasCtx = document.getElementById( 'my_canvas' );
    wave = audioCtx.createPeriodicWave(ft.real, ft.imag);
    var osc = audioCtx.createOscillator();
    osc.setPeriodicWave( wave );
    osc.connect( audioCtx.destination );
    setVolume( audioCtx, 0 );
    //osc.start(0)

        osc.start(0);

    function genWhiteGaussionNoise() {

    }
    function getSpectrum( audioCtx ) {
        var getTimeDomain = getTimeDomainHandle( audioCtx );
        var timeDataArray = getTimeDomain();
        var ft = new DFT(timeDataArray.length);
        ft.forward(timeDataArray);

        return ft;
    }
    function getTimeDomainHandle( audioCtx ) {
        var analyser = audioCtx.createAnalyser();
            analyser.fftSize = 1024;
        var bufferLength = analyser.fftSize,
            timeDataArray = new Uint8Array( bufferLength );

        return function() {
            analyser.getByteTimeDomainData( timeDataArray );
            return timeDataArray;
        }
    }
    function setVolume( audioCtx, input, vol ) {
        var gainNode = audioCtx.createGain();
        gainNode.gain.value = vol || 1;
        console.log( gainNode );
        audioCtx.destination.connect( gainNode );
        gainNode.connect( audioCtx.destination );
    }
    function oscillator( frequency, vol, type ) {
        var audioCtx = new window.AudioContext(),
            oscillator = audioCtx.createOscillator(),
            gainNode = audioCtx.createGain();

        oscillator.type = type || 'sine';
        oscillator.frequency.value = frequency;
        oscillator.connect( gainNode );
        gainNode.gain.value = vol || 1;
        gainNode.connect( audioCtx.destination );
        
        return {
            ctx: audioCtx,
            osc: oscillator
        };
    }
    function canvasHandle( canvasObj, dataArray ) {
        var w = canvasObj.width,
            h = canvasObj.height,
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
