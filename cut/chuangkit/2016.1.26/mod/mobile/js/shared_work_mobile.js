require.config({

	baseUrl: "../../components",
	paths: {

		"jquery": "jquery.2.1.4"

	}

});

require(['jquery'], function ($){

	$('#support_btn').on('click', function(){
		$(this).toggleClass('supported');
		if($(this).hasClass('supported')){
			$('#support_data').text(parseInt($('#support_data').text())+1);
			$('#support_notice').text('已赞过');
		} else {
			$('#support_data').text($('#support_data').text()-1);
			$('#support_notice').text('给个鼓励吧');
		}
	});

});