require.config({

	baseUrl: "../../components",
	paths: {

		"jquery": "jquery.2.1.4"

	}

});

require(['jquery'], function ($){

	$('.work_item #support_btn').on('click', function(){
		$(this).toggleClass('supported');
		if($(this).hasClass('supported')){
			$(this).parent().find('#support_data').text(parseInt($(this).parent().find('#support_data').text())+1);
		} else {
			$(this).parent().find('#support_data').text($(this).parent().find('#support_data').text()-1);
		}
	});

	$('#work_img, #workname').on('click', function(){
		$('#work_preview').fadeIn(150);
		resetOptions();
		initImg();
		return false;
	});

	$('#close_preview').on('click', function(){
		$('#work_preview').fadeOut(150);
		return false;
	});

	function resetOptions(){
		var deviceHeight = $('#work_preview').height()/12 * 10;

		$('.work_preview #options').css('bottom', deviceHeight/10);
	}

	function initImg(){
		var imgWidth = $('#work_preview #work').width(),
			imgHeight = $('#work_preview #work').height(),
			deviceWidth = $('#work_preview').width()/12 * 10,
			deviceHeight = $('#work_preview').height()/12 * 10,
			optionsWidth = $('#options').width(),
			optionsHeight = $('#options').height() + parseInt($('#options').css('padding-top'))*2;

		if(imgHeight/imgWidth <= (deviceHeight-optionsHeight)/deviceWidth) {
			$('#work_preview #work').css({
				'width': deviceWidth,
				'left': deviceWidth/10
			}).css({
				'top': deviceHeight/10 + (deviceHeight - optionsHeight - $('#work_preview #work').height())/2,
				'display': 'block'
			})

		} else {
			$('#work_preview #work').css({
				'height': deviceHeight - optionsHeight,
				'top': deviceHeight/10
			}).css({
				'left': deviceWidth/10 + (deviceWidth - $('#work_preview #work').width())/2,
				'display': 'block'
			})
		}

	}
	
});