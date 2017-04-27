;(function(factory){
    if(typeof define === "function" && define.amd) {
        // AMD 模式
        define([ "jquery" ], factory);
    } else {
        // 全局模式
        factory(jQuery);
    }

}(function($){

	function Viewpager(){  //公用变量的钩子

	}

	Viewpager.prototype.publicUse = {  //存放公用变量
		index : 0,  //item索引
		itemList : $('.vp_item')  //item数量
	}

	Viewpager.prototype.autoSwitch = function(time){  //自动播放
		var _this = this;

		if(time){
			this._time = time;
			this.timer = setTimeout(function(){
				if(_this.publicUse.index == _this.publicUse.itemList.length-1){
					_this.publicUse.index = -1;
				}
				_this.publicUse.index++;
				showContent(_this.publicUse.index);  //切换item
				changeActiveBtn(_this.publicUse.index);  //点亮当前item对应的下方圆点

				_this.autoSwitch(time);  //结束一次播放后循环
			}, time)
		}
	}

	Viewpager.prototype.vpControl = function(){ 
		var _this = this;
		var btnNum = _this.publicUse.itemList.length;

		_this.createItemBtn(btnNum); //生成圆点
		showContent(0);  //打开页面后显示第一个item

		$('#pre').click(function(){  //显示前一个item
			clearTimeout(_this.timer);  //点击后清除定时器
			if(_this.publicUse.index == 0){
				_this.publicUse.index = _this.publicUse.itemList.length;
			}
			_this.publicUse.index--;
			showContent(_this.publicUse.index);
			changeActiveBtn(_this.publicUse.index);

			_this.autoSwitch(_this._time); //重新启动定时器
		}) 
		$('#next').click(function(){  //显示后一个item
			clearTimeout(_this.timer);
			if(_this.publicUse.index == _this.publicUse.itemList.length-1){
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

			return false;
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

		var vp = new Viewpager();
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