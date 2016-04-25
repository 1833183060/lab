;(function(factory){
    if(typeof define === "function" && define.amd) {
        // AMD 模式
        define([ "jquery" ], factory);
    } else {
        // 全局模式
        factory(jQuery);
    }

}(function($){

	function Viewpager(options){  //公用变量的钩子
		this.options = options;
		this.speed = options.speed ? options.speed : 2000;
		this.wordsIsOpen = 0;

		this.vp_body = $('#index');
		this.vp_img = $('.vp_img');

		this.resetStyle();
		this.openWords();
	}

	Viewpager.prototype.publicUse = {  //存放公用变量
		index : 0,  //item索引
		itemList : $('.vp_item')  //item数量
	}

	Viewpager.prototype.launchImgScroll = function(index) {
		var _this = this;

		if(this.vp_body.css('display') != 'none') {

			if(this.isHeight(this.vp_img.eq(index))) {

				this.vp_img.eq(index).each(function() {
					_this.imgScrollX($(this));
				});
			} else {
				this.vp_img.eq(index).each(function() {
					_this.imgScrollY($(this));
				});
			}
		}
	}

	Viewpager.prototype.imgScrollX = function(obj) {
		var vp_bodyWidth = this.vp_body.width();
		var vp_imgWidth = obj.width();
		var _this = this;

		obj.animate({
			marginLeft: vp_bodyWidth - vp_imgWidth,
		}, _this.speed, function() {
			$(this).animate({
				marginLeft: 0
			}, _this.speed)
		});
	}

	Viewpager.prototype.imgScrollY = function(obj) {
		var vp_bodyHight = this.vp_body.height();
		var vp_imgHeight = obj.height();
		var _this = this;

		obj.animate({
			marginTop: vp_bodyHight - vp_imgHeight,
		}, _this.speed, function() {
			$(this).animate({
				marginTop: 0
			}, _this.speed)
		});
	}

	Viewpager.prototype.openWords = function() {
		var _this = this;
		$('#show_info_btn').click(function() {

			if(!$(this).hasClass('btn_toblack')) {
				clearTimeout(_this.timer)
				_this.wordsIsOpen = 1;
				$('.vp_item .vp_words').eq(_this.publicUse.index).addClass('words_open').removeClass('words_close');
			} else {
				$('.vp_item .vp_words').eq(_this.publicUse.index).removeClass('words_open').addClass('words_close');
				_this.wordsIsOpen = 0;
				_this.autoSwitch(_this.speed);
			}
			$(this).toggleClass('btn_toblack').toggleClass('btn_towhite');
		});
	}

	Viewpager.prototype.resetStyle = function() {
		var body = $('body'),
			header = $('header');
		var _this = this;

		this.vp_body.height($(window).height()-header.height()-parseInt(body.css('padding-bottom'))*2 - parseInt(header.css('margin-bottom')));

		this.vp_img.each(function() {
			
			if(_this.isHeight($(this))) {
				$(this).height('100%');
			} else {
				$(this).width('100%');
			}
		})
	}

	Viewpager.prototype.isHeight = function(obj) {
		var _this = this;
		var a = _this.vp_body.width() / _this.vp_body.height();

		var src = obj.attr('src');
		var img = new Image();
			img.src = src;
		var imgWidth = img.width,
			imgHeight = img.height;

		var b = imgWidth / imgHeight;

		if(b > a) {
			return 'true';
		} else {
			return false;
		}
	}

	Viewpager.prototype.autoSwitch = function(time){  //自动播放
		var _this = this;

		_this.launchImgScroll(_this.publicUse.index)

		if(time){
			this._time = time;
			this.timer = setTimeout(function(){
				if(_this.publicUse.index == _this.vp_img.length-1){
					_this.publicUse.index = -1;
				}
				_this.publicUse.index++;
				showContent(_this.publicUse.index);  //切换item
				changeActiveBtn(_this.publicUse.index);  //点亮当前item对应的下方圆点
				if(!_this.wordsIsOpen) {
					_this.autoSwitch(time);  //结束一次播放后循环
				}
			}, time)
		}
	}

	Viewpager.prototype.vpControl = function(){ 
		var _this = this;
		var btnNum = _this.vp_img.length;

		_this.createItemBtn(btnNum); //生成圆点
		showContent(0);  //打开页面后显示第一个item

		this.vp_body.find('#pre').click(function(){  //显示前一个item
			clearTimeout(_this.timer);  //点击后清除定时器
			if(_this.publicUse.index == 0){
				_this.publicUse.index = _this.vp_img.length;
			}
			_this.publicUse.index--;
			showContent(_this.publicUse.index);
			changeActiveBtn(_this.publicUse.index);

			_this.autoSwitch(_this._time); //重新启动定时器
		}) 
		this.vp_body.find('#next').click(function(){  //显示后一个item
			clearTimeout(_this.timer);
			if(_this.publicUse.index == _this.vp_img.length-1){
				_this.publicUse.index = -1;
			}
			_this.publicUse.index++;
			showContent(_this.publicUse.index);
			changeActiveBtn(_this.publicUse.index);

			_this.autoSwitch(_this._time);
		})

		changeActiveBtn(_this.publicUse.index);
	}

	Viewpager.prototype.createItemBtn = function(btnNum){  //生成下方圆点
		var _this = this;

		for(var i=0; i<btnNum; i++){
			document.getElementById('vp_item_btn_group').innerHTML += '<a class="vp_item_btn" data-num="'+i+'" href="#"></a>';
		}
		$('.vp_item_btn').click(function(){  //点击圆点跳转至其所对应item
			clearTimeout(_this.timer);

			_this.publicUse.index = this.dataset.num;
			changeActiveBtn(_this.publicUse.index);
			showContent(_this.publicUse.index);

			_this.autoSwitch(_this._time);
		})
	}

	function showContent(index){  //切换item
		var itemList = $('.vp_item');

		itemList.fadeOut(500);
		itemList.eq(index).fadeIn(500);
	}

	function changeActiveBtn(index){  //切换圆点状态
		var _this = this;
		var itemBtnList = $('.vp_item_btn');

		itemBtnList.removeClass('active');
		itemBtnList.eq(index).addClass('active');
	}

	$.fn.extend({ viewpager : function(options){

		var vp = new Viewpager(options);
		vp.vpControl(); 

		if(options.auto == true){
			if(options.speed){
				vp.autoSwitch(options.speed);
			} else {
				vp.autoSwitch(2000);
			}
		}

	}});

}));