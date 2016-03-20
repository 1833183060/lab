/*
十进制转任意进制数，写数电作业专用kira
2016.3.16
*/

function hc(num10, scale, sf) { //十进制数，目标进制，有效小数位数
	if(num10 < 0)
		var f = true;

	num10 = Math.abs(num10);

	var z = Math.floor(num10),
		x = num10 - z,
		sf_ = sf;

	var z2 = '', x2 = '.';

	while(z != 0) {
		z2 = numToChar((z % scale)).toString() + z2;
		z = Math.floor(z / scale);
	}

	while(sf_ != 0) {
		if(x == 0 && sf_ == sf) { x2 = ''; break; }
		x = x * scale;
		x2 += numToChar(Math.floor(x)).toString();
		x = x - Math.floor(x);
		sf_ -= 1;
	}

	if(f)
		z2 = '-' + z2;

	console.log(z2+x2+'<'+scale+'>');
}

function numToChar(num) {
	switch (num) {
		case 10: return 'A';
		case 11: return 'B';
		case 12: return 'C';
		case 13: return 'D';
		case 14: return 'E';
		case 15: return 'F';
		default: return num;
	}
}

