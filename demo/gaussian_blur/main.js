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
		imgPixel = data.imgPixel, // data.imgData.data, //<-slower //这里是两种运算方式，当前正在使用的这种是以原数组为模板进行运算，将运算结果填入另一个数组中；注释掉的这种是将运算结果直接在原数组中进行修改，即在后面的运算中会使用已经改变的通道值而不是原图的通道值。后者在这种情况下会很慢：在下面的通道运算的第三重循环中不使用if(current<0) continue 。其余情况与前者的运算时间是相差无几的。
		imgWidth = data.imgWidth;

	var current,
		newValue = [0,0,0],
		b_row = 0,
		weight = [], //高斯卷积核
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
				l++;
				continue; //在这里使用continue跳过下面的越界判断会缩短一些时间，比如我的电脑，对于3.jpg，radius=5，当线程为1时，且使用index.html中第60行的imgData，有continue时2s左右，没有时4s左右
			}
			if(imgPixel[i + a*imgWidth*4]) {
				// console.log(imgPixel[i + a*imgWidth*4])
				for(var b = -radius; b<=radius; b++) {
					current = i + 4*(a*imgWidth + b); //当前要参与卷积运算的像素的位置，即该像素的r通道值的下标
					b_row = b*4 + (Math.floor(i/4)%(imgWidth) + 1); //用来判断当前要做运算的像素（通道）所在的位置有没有超出图片实际的范围。由于数组是一维的就算当前参与运算的像素矩阵超出了图像实际的范围也不会出现undefined，所以这里要专门判断一下
						k++;	
					if (current<0) {
						continue; //在使用多线程时，在这里使用continue跳过下面的越界判断会缩短相当多的时间。比如不使用continue，开了两个线程，会发现第一个线程非常快，但是第二个非常慢，而且会发现k的输出一个为0，一个为90，也就是说第一个线程没有进行越界判断第二个线程进行了90次越界判断（在这里请判断我的想法正确与否）。当加上continue后，两个进程的速度就差不多快了。其实已经可以发现，所有拖慢速度的根本原因都是这里的越界判断，如果没有使用continue来跳过，速度会非常非常慢，反之会非常快。可是只有不到一百次的判断（有75次有90次），为什么会这么慢？
					}
					if(imgPixel[current] && b_row >= 0 && b_row <= imgWidth ) {

						//if(imgPixel[current] == undefined)
							//console.log(imgPixel[current])
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
