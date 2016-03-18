function a() {
	var btn = document.querySelectorAll('.qz_like_btn_v3');
	for(var i=0; i<btn.length; i++) {
		if(btn[i].getAttribute('data-clicklog') == 'like')
		btn[i].click();
	}
	document.body.scrollTop = document.body.scrollHeight - window.innerHeight;
	setTimeout(a, 1000);
}