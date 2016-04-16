this.onmessage = function(event) {
	var startTime = new Date();

	var data = event.data;
	postMessage({
		imgData: launch(data),
		i: event.data.i
	});

	var endTime = new Date();

	console.log(" 渲染时间：" + (endTime - startTime) + "ms");
}

function launch(data) {
	var radius = data.radius,
		imgPixel = data.imgPixel, //data.imgData.data, //<-slower 
		imgWidth = data.imgWidth;

	var current,
		newValue = [0,0,0],
		b_row = 0,
		weight = [],
		weightSum = 0,
		temp;

	for(var i=-radius; i<=radius; i++) {
		weight[i+radius] = [];
		for(var j=-radius; j<=radius; j++) {
			weight[i+radius][j+radius] = parseFloat(gaussian(i, j, radius).toFixed(6));
		}
	}
	var k = 0,
		l = 0;
	for(i=0; i<imgPixel.length; i+=4) {

		for(var a = -radius; a<=radius; a++) {
			if(i+a*imgWidth*4<0) {
				// l++;
				continue;
			}
			if(imgPixel[i + a*imgWidth*4]) {
				// console.log(imgPixel[i + a*imgWidth*4])
				for(var b = -radius; b<=radius; b++) {
					current = i + 4*(a*imgWidth + b);
					b_row = b*4 + (Math.floor(i/4)%(imgWidth) + 1);
					if (current<0) {
						k++;	
						continue;
					}
					if(imgPixel[current] && b_row >= 0 && b_row <= imgWidth ) {

						//if(imgPixel[current] == undefined)
							//console.log(imgPixel[current])
						l++;
						temp = weight[a+radius][b+radius];
						newValue[0] += imgPixel[current] * temp;
						newValue[1] += imgPixel[current+1] * temp;
						newValue[2] += imgPixel[current+2] * temp;
						weightSum += temp;
					}
				}
			}
		}
		for(j=0; j<newValue.length; j++) {
			data.imgData.data[i+j] = (Math.round(newValue[j] / weightSum));
		}
		newValue = [0,0,0];
		weightSum = 0;
	}
	console.log(l)
	console.log(k)
	return data.imgData;

}

function gaussian(x, y, o) {
	var x2 = Math.pow(x, 2),
		y2 = Math.pow(y, 2),
		o2 = Math.pow(o, 2);

	return Math.exp(-(x2 + y2) / (2 * o2)) / (2 * Math.PI * o2);
}