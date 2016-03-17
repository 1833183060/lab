
function hc(num10, scale, sf) {

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

hc(174.06,16,4);
