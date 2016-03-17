jQuery(document).ready(function($){
	//open the lateral panel
	$('.cd-btn').on('click', function(event){
		if(this.id.indexOf('coding')!=-1 || this.id.indexOf('editing')!=-1){
			$('.cd-panel').removeClass('from-left');
			$('.cd-panel').addClass('from-right');
		} else {
			$('.cd-panel').removeClass('from-right');
			$('.cd-panel').addClass('from-left');
		}
		$('.cd-panel-header h1').html('Works - From ' + this.getAttribute('data-name'))
		// $('.cd-panel-content iframe').attr('src',this.id + '.html');
		createWorksList(this.id);
		event.preventDefault();
		$('.cd-panel').addClass('is-visible');
	});
	//clode the lateral panel
	$('.cd-panel').on('click', function(event){
		if( $(event.target).is('.cd-panel') || $(event.target).is('.cd-panel-close') ) { 
			$('.cd-panel').removeClass('is-visible');
			event.preventDefault();
		}
	});
});

function createWorksList(depart){
	$('.cd-panel-content').empty();
	for(var i=0; i<worksInfoList[depart].length; i++){
		$('.cd-panel-content').append('<a href="'+worksInfoList[depart][i][0]+'" target="_blank" class="works-item"><img src="'+worksInfoList[depart][i][1]+'" class="work-icon"><div class="work-info"><p class="work-name">'+worksInfoList[depart][i][2]+'</p><p class="work-author">'+worksInfoList[depart][i][4]+'</p><p class="work-desc">'+worksInfoList[depart][i][3]+'</p></div></a>')
	}	
}