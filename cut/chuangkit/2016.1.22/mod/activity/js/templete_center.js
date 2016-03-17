require.config({

	baseUrl: "../../../components",
	paths: {

		"jquery": "jquery.2.1.4"

	}

});

require(['jquery'], function ($){

	$('.templete_item').on('mouseenter', function(){
		$(this).find('#options').show();
		$(this).find('#click_shade').show();
		$(this).find('#collect').on('click', function(){
			$(this).toggleClass('collected');
			if(window.localStorage.collectNotice != '0' && $(this).hasClass('collected')
) {
				$(this).parent().find('#collect_notice').show();
				$(this).parent().find('#collect_notice #square_check').click(function(){
					$(this).toggleClass('icon-squarecheckfill');
					$(this).toggleClass('icon-square');
				})
			} else {
				$(this).parent().find('#collect_notice').hide();
			}
			$(this).parent().find('#collect_notice #confirm').click(function(){
				if($(this).parent().find('#square_check').hasClass('icon-squarecheckfill')){
					window.localStorage.collectNotice = '0';
				} else {
					window.localStorage.collectNotice = '1';
				}
				$(this).parent().hide();
			});
		})
	}).on('mouseleave', function(){
		$(this).find('#options').hide();
		$(this).find('#click_shade').hide();
		$(this).find('#options #collect_notice').hide();
		$(this).find('#collect').unbind('click');

	});


	/*$('#first_class a').on('click', function(){
		$('#secondary_class').show().html(
			$(this).html() + 
		)
	})*/

	$('#first_class a, #secondary_class a, #tag a, #sort a').on('click', function(){
		$(this).parent().find('a').removeClass('active');
		$(this).addClass('active');
	})
	

});