
jQuery(document).ready(function($){
	renderPage() //渲染页头、页脚内容
	loadPage(window.location.hash) //第一次进入页面时加载当前hash对应的页面
	bindHashchange() //绑定hash加载页面
	createDocLink() //创建文档链接
	loadPageEffects() //加载页面特效
	//showCode() //显示代码
})

function loadPage(pageHash) {
	var page = pageHash.replace(/#/g, '');
	if(pageHash == '' || page == ''){
		$('#doc-content').load('basicPage/' + welcomePage + '.' + fileExtensions);
		$('title').text(indexTitle);
	} else {
		$("#doc-content").load(docIndex + page + '.' + fileExtensions,function(responseTxt,statusTxt,xhr) {
			if(statusTxt == 'error'){
				$('#doc-content').load('basicPage/' + errorPage + '.' + fileExtensions);
				$('title').text(errorTitle);
			} else {
				$('title').text($('h1').text());
			}
		});
	}
}

function bindHashchange(){
	$(window).bind('hashchange', function(e){  
        loadPage(window.location.hash)
    }); 
}

function createDocLink(){
	for(var i=0; i<docList.length; i+=2){
		$('.manu ul').append('<li><a href="#'+docList[i]+'">'+docList[i+1]+'</a></li>')
	}
}

function loadPageEffects(){
	$('.back').click(function(){
        $('.manu').slideToggle('fast');
    })
    $('#doc-content, .manu a').click(function(){
        $('.manu').slideUp('fast');
    })
}

function renderPage(){
	$('.logo').text(indexTitle);
	$('footer').text(footerContent);
}

function showCode(){
	var codeObjList = document.getElementsByTagName('code');
	var codeList = new Array();
	var codeNodeList = new Array();

	for(var i=0; i<codeObjList.length; i++){
		codeList.push(codeObjList[i].innerHTML);
		console.log(codeList[i])
	}
	for(i=0; i<codeList.length; i++){
		//codeNodeList.push(document.createTextNode(codeList[i]));
		codeObjList[i].innerHTML = '';
		codeObjList[i].appendChild(document.createTextNode(codeList[i]));
	}
}