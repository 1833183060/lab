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
		imgPixel = data.imgPixel,
		imgWidth = data.imgWidth,
		matrix = data.matrix; //卷积核

	var current,
		newValue = [0,0,0],
		b_row = 0,
		weightSum = 0,
		temp;

	for(i=0; i<imgPixel.length; i+=4) {

		for(var a = -radius; a<=radius; a++) {
			if(i+a*imgWidth*4<0) {
				continue; 
			}
			if(imgPixel[i + a*imgWidth*4]) {
				for(var b = -radius; b<=radius; b++) {
					current = i + 4*(a*imgWidth + b); //当前要参与卷积运算的像素的位置，即该像素的r通道值的下标
					b_row = b*4 + (Math.floor(i/4)%(imgWidth) + 1); //用来判断当前要做运算的像素（通道）所在的位置有没有超出图片实际的范围。由于数组是一维的就算当前参与运算的像素矩阵超出了图像实际的范围也不会出现undefined，所以这里要专门判断一下
					if (current<0) {
						continue; 
					}
					if(imgPixel[current] && b_row >= 0 && b_row <= imgWidth ) {

						temp = matrix[a+radius][b+radius];
						newValue[0] += imgPixel[current] * temp;
						newValue[1] += imgPixel[current+1] * temp;
						newValue[2] += imgPixel[current+2] * temp;
						weightSum += temp;
					}
				}
			}
		}
		for(j=0; j<newValue.length; j++) {
			data.imgData.data[i+j] = weightSum == 0 ? newValue[j] : (Math.round(newValue[j] / weightSum));
		}
		newValue = [0,0,0];
		weightSum = 0;
	}

	return data.imgData;

}
