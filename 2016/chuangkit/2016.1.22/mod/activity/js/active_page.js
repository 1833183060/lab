require.config({

	baseUrl: "../../../components",
	paths: {

		"jquery": "jquery.2.1.4"

	}

});

require(['jquery'], function ($){

	$('.work_item').on('mouseenter', function(){
		$(this).find('#support_btn').show();
		$(this).find('#support_btn').on('click', function(){
			$(this).toggleClass('supported');
			if($(this).hasClass('supported')) {
				$(this).parent().find('#support_data').text(parseInt($(this).parent().find('#support_data').text()) + 1);
			} else {
				$(this).parent().find('#support_data').text($(this).parent().find('#support_data').text() - 1);
			}
		})
	}).on('mouseleave', function(){
		$(this).find('#support_btn').hide();
		$(this).find('#support_btn').unbind('click');

	});

});