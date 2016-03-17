jQuery(document).ready(function($){
	//$('#background').addClass('show');
	loadPage(window.location.hash); //第一次进入页面时加载相应图书
	bindHashchange(); //绑定hash加载图书
	interaction();
})

var imgList = ['1.jpg','2.jpg','3.jpg','4.jpg','5.jpg','6.jpg','7.jpg'];

function bindHashchange(){ //绑定浏览器hash
	$(window).bind('hashchange', function(e){  
        loadPage(window.location.hash)
    }); 
}
function loadPage(pageHash) { //读取hash进行跳转
	var bookNum = pageHash.replace(/#!/g, '');
	if(pageHash == '' || bookNum == '' ){
		changeImgTest(-1); //随机推荐
	} else {
		changeImgTest(bookNum); //推荐特定书号的图书
	}
}
function changeImgTest(i){ //图书切换测试
	if(i < 0){
		i = parseInt(Math.random() * imgList.length, 10);
		window.location.hash = '!'+i;
	}
	$('#background').attr('src','img/'+imgList[i]);
	$('#book-img').attr('src','img/'+imgList[i]);
	$('#book-name').text('图书'+i);
	$('title').text('图书'+i);
}

function interaction(){
	$('#change').on('click',function(){
		$('#background').addClass('o-hide').removeClass('o-show');
		//$('#background').addClass('hide').removeClass('show');
		setTimeout('changeImgTest(-1)',500);
		setTimeout("$('#background').addClass('o-show').removeClass('o-hide')",500);
	}); //切换图书背景效果
	$('#open-manu-btn').on('click', function(){
		$('#manu-box').addClass('manu-open');
		return false;
	}) //打开菜单
	$('#main-box').on('click', function(){
		$('#manu-box').removeClass('manu-open');
	}) //关闭菜单
	$('#lend-btn, #borrow, #login-btn, #register-btn, #my-book-btn').on('click', function(){
		$('#layer').css('display','block');
		setTimeout("$('#layer').addClass('open-layer')",100);
		return false;
	}) //打开遮罩层
	$('#lend-btn').on('click', function(){
		$('#lend-book-form').addClass('d-show').removeClass('d-hide');
	}) //打开借出书表单
	$('#borrow').on('click', function(){
		$('#borrow-book-form').addClass('d-show').removeClass('d-hide');
	}) //打开申请借书表单
	$('#login-btn').on('click', function(){
		$('#login-form').addClass('d-show').removeClass('d-hide');
	}) //打开登陆表单
	$('#register-btn').on('click', function(){
		$('#register-form').addClass('d-show').removeClass('d-hide');
	}) //打开注册表单
	$('.c-sta-out, .del-book').on('click', function(){
		var willDel = $(this).parent().parent().parent();
		willDel.css('display','none');
	}) //移除书籍
	$('#avail-btn').on('click', function(){
		$('#avail-btn').addClass('books-list-btn-active');
		$('#unavail-btn').removeClass('books-list-btn-active');
		$('#unavailable').css('display','none');
		$('#available').css('display','block');
	}) //切换至带借出页面
	$('#unavail-btn').on('click', function(){
		$('#unavail-btn').addClass('books-list-btn-active');
		$('#avail-btn').removeClass('books-list-btn-active');
		$('#available').css('display','none');
		$('#unavailable').css('display','block');
	}) //切换至已借出页面
	$('#my-book-btn').on('click', function(){
		$('#my-book-box').addClass('d-show');
	}) //打开我的书页面
	$('#l-cancel1, #l-cancel2, #l-cancel3, #l-cancel4, #close-book-list-btn,#l-submit1,#l-submit2,#register,#login').on('click', function(){
		$('#lend-book-form').addClass('d-hide').removeClass('d-show');
		$('#borrow-book-form').addClass('d-hide').removeClass('d-show');
		$('#login-form').addClass('d-hide').removeClass('d-show');
		$('#register-form').addClass('d-hide').removeClass('d-show');
		$('#my-book-box').removeClass('d-show');
		$('#layer').removeClass('open-layer');
		setTimeout("$('#layer').css('display','none');",300);
	}) //关闭遮罩层和表单及弹出层
}

