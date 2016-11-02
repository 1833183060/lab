;(function() {
    'use strict';

    // 当 AudioNode 接入 AudioCtx 中时声音才可播放
    // 以下用来生成波形的函数在初次创建出波形时默认不将 AudioNode 接入 AudioCtx，若需要播放声音，需使用 connect 函数；同理，要使播放停止，使用 disconnect 函数
    // 这个项目本意是为了展示傅里叶变换的实际应用——在某单频波中加入已知频谱的噪声，然后将其滤除——用以教学展示。可是经过和老师交流，我发现我好像想得太过简单了。再加上我本人最近没有太多精力顾及不太重要的事情，因此该项目暂停，等到合适的时机再捡起来吧。
    // 该项目已经完成最基本的功能函数的设计，但是关于 fftSize 的含义尚不明了，如果要继续下去需要查资料明确它的含义，这大概涉及到 FFT 算法的实现，最好能自己写一遍这个算法。
    // 2016-10-27 Sevenskey
    
    var canvasCtx = document.getElementById( 'my_canvas' );

    // 用振荡器生成一个波形
    var squ = oscillator( 200 , 0.5, 'sine' );

    // 获取该波形的频谱
    var ft = getSpectrum( squ.ctx, squ.output );

    // 使用该频谱再生成波形
    var wave = genWave( ft.real, ft.imag );

    // 得到再次生成波形的时域信息获取函数
    var updateTimeDataArray = getTimeDomainHandle( wave.ctx, wave.output );

    //connect( wave.ctx, wave.output );
    
    // 得到绘制函数
    var draw = canvasHandle( canvasCtx, updateTimeDataArray() );

    // 刷新视图
    (function a() {
        updateTimeDataArray();
        draw();
        requestAnimationFrame( a );
    })();

    function connect( audioCtx, input ) {
        input.connect( audioCtx.destination );
    }
    function disconnect( audioCtx, input ) {
        input.disconnect();
    }

    // 获取时域信息的处理函数
    function getTimeDomainHandle( audioCtx, input ) {
        var analyser = audioCtx.createAnalyser();
            analyser.fftSize = 1024;
        var bufferLength = analyser.fftSize,
            timeDataArray = new Uint8Array( bufferLength );
        
        input.connect( analyser );

        // 获取时域信息
        return function() {
            analyser.getByteTimeDomainData( timeDataArray );
            return timeDataArray;
        }
    }

    // 获取频谱
    function getSpectrum( audioCtx, input ) {
        var getTimeDomain = getTimeDomainHandle( audioCtx, input );
        var timeDataArray = getTimeDomain();

        for( var i = 0; i < 50; i++ ) {

            console.log( getTimeDomain() );
        }

        timeDataArray = timeDataArray.slice( 0, 230 ); // 应该选择一个周期内的时域信息，暂时还不知道该怎么算
        console.log( timeDataArray )
        var ft = new DFT(timeDataArray.length);
        ft.forward(timeDataArray);
        console.log(ft)

        return ft;
    }

    // 输入频谱，生成响应波形
    function genWave( real, imag ) {
        var audioCtx = new AudioContext(),
            wave = audioCtx.createPeriodicWave( real, imag ),
            osc = audioCtx.createOscillator();

        osc.setPeriodicWave( wave );
        osc.start( 0 );

        return {
            ctx: audioCtx,
            output: osc
        };
    }

    // 波形振荡器
    function oscillator( frequency, vol, type ) {
        var audioCtx = new window.AudioContext(),
            oscillator = audioCtx.createOscillator(),
            gainNode = audioCtx.createGain();

        oscillator.type = type || 'sine';
        oscillator.frequency.value = frequency;
        oscillator.start( 0 );
        oscillator.connect( gainNode );
        gainNode.gain.value = vol || 1;
        
        return {
            ctx: audioCtx,
            output: gainNode
        };
    }

    // 设置音频音量
    function setVolume( audioCtx, input, vol ) {
        var gainNode = audioCtx.createGain();
        gainNode.gain.value = vol || 1;
        input.connect( gainNode );
        gainNode.connect( audioCtx.destination );
    }

    // 波形绘制处理函数
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

        // 绘制波形
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
