var l = 100000000;
var x = 0;
var start = new Date();
xa(b);
a(b);

function xa(callback) {
	setTimeout(function() {
		for(var i=0; i < l; i++ ) {
			x++;
		}
		callback.call(x);
	}, 100);
}
function a(callback) {
	for(var i=0; i < l; i++ ) {
		x++;
	}
	callback.call(x);
}

function b() {
	console.log(new Date() - start);
}
