jQuery(document).ready(function($){
	var isLateralNavAnimating = false;
	//open/close lateral navigation
	$('.input-btn,.cd-nav-trigger').on('click', function(event){
		event.preventDefault();
		//stop if nav animation is running 
		if( !isLateralNavAnimating ) {
			if($(this).parents('.csstransitions').length > 0 ) isLateralNavAnimating = true; 
			
			$('.cd-nav-trigger').toggle(100);
			$('body').toggleClass('navigation-is-open');
			$('.cd-navigation-wrapper').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
				//animation is over
				isLateralNavAnimating = false;
			});
		}
		//$('.cd-nav-trigger').css('background-color','transparent');
	});
});