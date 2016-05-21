function Wave(audioNode, canvasNode) {
	
	//获取audio和canvas对象
	this.audioNode = audioNode;
	this.canvasNode = canvasNode;

	this.audioNode.crossOrigin = "anonymous";

	//初始化canvas
	this.WIDTH = this.canvasNode.width;
	this.HEIGHT = this.canvasNode.height;
	this.canvasCtx = this.canvasNode.getContext('2d');
	this.canvasCtx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
	// this.canvasCtx.fillStyle = '#ccc';
		// this.canvasCtx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
	this.canvasCtx.lineWidth = 2;
		this.canvasCtx.strokeStyle = '#fff';
		this.canvasCtx.beginPath();
		this.canvasCtx.moveTo(0, this.HEIGHT / 2)
		this.canvasCtx.lineTo(this.WIDTH, this.HEIGHT / 2);
		this.canvasCtx.stroke();

	//
	this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	this.analyser = this.audioCtx.createAnalyser();
	this.source = this.audioCtx.createMediaElementSource(this.audioNode);
	this.source.connect(this.analyser);
	this.analyser.connect(this.audioCtx.destination);
	this.analyser.fftSize = 1024;
	this.bufferLength = this.analyser.fftSize;
	this.dataArray = new Uint8Array(this.bufferLength);
}

Wave.prototype.draw = function() {

	// this.canvasCtx.fillStyle = '#';
		this.canvasCtx.clearRect(0, 0, this.WIDTH, this.HEIGHT);

	this.canvasCtx.lineWidth = 2;
		this.canvasCtx.strokeStyle = '#fff';
		this.canvasCtx.beginPath();

	var sliceWidth = this.WIDTH / this.bufferLength;
	var x = 0;

	for(var i=0; i<this.bufferLength; i++) {
		var v = this.dataArray[i] / 128.0;
		var y = v * this.HEIGHT / 2;

		if(i===0) {
			this.canvasCtx.moveTo(x, y);
		} else {
			this.canvasCtx.lineTo(x, y);
		}

		x += sliceWidth;
	}

	this.canvasCtx.lineTo(this.WIDTH, this.HEIGHT / 2);
		this.canvasCtx.stroke();
}

Wave.prototype.render = function() {
	if (!this.audioNode.paused) {
		this.analyser.getByteTimeDomainData(this.dataArray);
		this.draw();
	}

	var _this = this;
	this.drawVisual = requestAnimationFrame(function(){
		_this.render()
	});
}