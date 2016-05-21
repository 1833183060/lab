/*
*******
2016-3-18 debug
2016-3-5(C)Sevenskey
*******
data = {
	0: {
		song_src: '',
		song_name: '',
		artist_name: '',
	}
}
data3_ = {
	0: {
		mpath: '',
		mtitle: '',
		mtime: '00:37',
		mtime_id: '10',
		status: '1'
	}
}
*/
function Player(config) {
	var _this = this;

	this.config = config;

	this.audio = this.fun.aObject(this.config.audioObj);
	this.playList = [];
	this.index = window.localStorage.index?parseInt(window.localStorage.index):0;
	this.pauseTime = 0; //记录暂停时间点
	this.tempPauseTime = 0; //暂停时间点的备份

	this.pEle = { //page element
		playBtn: this.fun.aObject(this.config.playBtn),
		pauseBtn: this.fun.aObject(this.config.pauseBtn),
		prevBtn: this.fun.aObject(this.config.prevBtn),
		nextBtn: this.fun.aObject(this.config.nextBtn),
		songName: this.fun.aObject(this.config.songName),
		singer: this.fun.aObject(this.config.singer),
		progressWrapper: this.fun.aObject(this.config.progressWrapper),
		progressing: this.fun.aObject(this.config.progressing),
		volSliderWrapper: this.fun.aObject(this.config.volSliderWrapper),
		volSlider: this.fun.aObject(this.config.volSlider),
		curTime: this.fun.aObject(this.config.curTime),
		totalTime: this.fun.aObject(this.config.totalTime),
		bgImg: this.fun.aObject(this.config.bgImg),
		discImg: this.fun.aObject(this.config.discImg)
	}

	this.userTimeList = {}; //用户设置的定时播放时间
	//this.checkTime();
	this.willPlay = null; //记录将要通过定时播放来播放的音乐索引

	this.init();
	this.bindBtn();
}

Player.prototype.init = function() { //初始化播放器，设置一些必要的事件监听
	var _this = this;

	this.audio.volume = 0.5;
	this.audio.preload = 'auto';

	this.audio.onended = function() {
		if(_this.tempPauseTime == 0) {
			_this.index += 1;

			if(_this.index == _this.playList.length) {
				_this.stop();
				_this.pauseTime = 0;
				_this.index = 0;
			} else {
				_this.pauseTime = 0;
				_this.load();
			}	
		} else {
			_this.pauseTime = _this.tempPauseTime;
			_this.load();
		}
	}

	this.audio.onseeking = function() {
		_this.pauseTime = _this.audio.currentTime; //don't forget empty it when change a song!!!
	}

	this.audio.onplaying = function() {
		_this.pEle.playBtn.style.display = 'none';
		_this.pEle.pauseBtn.style.display = 'inline';
	} //update

	this.audio.onpause = function() {
		_this.pEle.playBtn.style.display = 'inline';
		_this.pEle.pauseBtn.style.display = 'none';
	} //update
	this.audio.onerror = function() {
		_this.index += 1;
		_this.next();
	}

	window.onbeforeunload = function() {
		window.localStorage.index = _this.index; //record the last you have listened.
	}

}

Player.prototype.clear = function() { //重置播放器所有参数，包括播放列表
	var _this = this;

	this.playList = [];
	this.index = 0;
	this.pauseTime = 0; 
	this.tempPauseTime = 0;
	if(this.audio.readyState != 0 && this.audio.paused == true) {
		this.audio.currentTime = 0;		
	} //update
	
}

Player.prototype.bindBtn = function() { //bind some button

	var _this = this;

	//must compatible with IE9- //IE9- can't support Audio tag.
	//I haven't write compatible code.

	this.pEle.playBtn.addEventListener('click', function() {
		_this.play();
	}, false);
	this.pEle.pauseBtn.addEventListener('click', function() {
		_this.pause();
	}, false);
	this.pEle.prevBtn.addEventListener('click', function() {
		_this.prev();
	}, false);
	this.pEle.nextBtn.addEventListener('click', function() {
		_this.next();
	}, false);
	this.pEle.songName.innerHTML = 'Song name';
	this.pEle.singer.innerHTML = 'Singer';
	
	this.launchProgressWrapper(this.pEle.progressWrapper, this.pEle.progressing);

	if(this.pEle.volSliderWrapper) {

		this.launchVolSlider(this.pEle.volSliderWrapper, this.pEle.volSlider);
	}
	if(this.pEle.totalTime) {

		this.showTime();
	}
}

Player.prototype.showTime = function() { //显示歌曲时长和已播放时常
	var _this = this;

	setTimeout(function() {
		if(_this.audio.src != '') {
			var totalTime = parseInt(_this.audio.duration);
				totalTime = parseInt(totalTime/60)+':' + totalTime % 60;
			var curTime = parseInt(_this.audio.currentTime);
				curTime = parseInt(curTime/60)+':' + curTime % 60;
			_this.pEle.totalTime.innerHTML = totalTime;
			_this.pEle.curTime.innerHTML = curTime;
		}

		_this.showTime();
	}, 1000);
}

Player.prototype.launchProgressWrapper = function(wrapper, progressing) { //部署进度条
	var _this = this;
	var left = this.fun.getElementLeft(wrapper),
		wrapperWidth = this.fun.getStyle(wrapper, 'width');

		wrapperWidth = parseInt(wrapperWidth);

	wrapper.addEventListener('click', function(e) {
		if(_this.audio.src != '') {
			var eve = e || window.event;
			var proWidth = eve.clientX - left;
			progressing.style.width = proWidth+'px';
			_this.audio.currentTime = proWidth / wrapperWidth * _this.audio.duration;
		}
	});

	this.audio.ontimeupdate = function() {
		progressing.style.width = _this.audio.currentTime / _this.audio.duration * wrapperWidth + 'px';
	};
}

Player.prototype.launchVolSlider = function(wrapper, progressing) { //部署音量条
	var _this = this;
	var left = this.fun.getElementLeft(wrapper),
		wrapperWidth = this.fun.getStyle(wrapper, 'width');

		wrapperWidth = parseInt(wrapperWidth);

	wrapper.addEventListener('click', function(e) {
		var eve = e || window.event;
		var proWidth = eve.clientX - left;
		progressing.style.width = proWidth+'px';
		_this.audio.volume = proWidth / wrapperWidth;
	});
}

Player.prototype.createPlayList = function(data) { //生成播放列表
	var songsData = data;

	for(song in songsData) {
		this.playList.push(songsData[song]);
	}
}

Player.prototype.add = function(data) { //追加播放列表
	var moreSongsData = data;
	for(song in moreSongsData) {
		this.playList.push(moreSongsData[song]);
	}
}

Player.prototype.load = function(theSong) { //加载音乐
	var theSong = theSong != undefined ? theSong : this.playList[this.index];
	var _this = this;
	this.pEle.songName.innerHTML = theSong.song_name;
	this.pEle.singer.innerHTML = theSong.artist_name;
	this.pEle.bgImg.style.backgroundImage = 'url(' + theSong.img + ')';
	this.pEle.discImg.style.backgroundImage = 'url(' + theSong.img + ')';
	this.audio.src = theSong.song_src;
	this.audio.play();
	
	//这个地方是插入播放功能的一部分，意为恢复定时播放之前所播放歌曲的时间位置，设置定时貌似时为了等待某个回调完成，具体在哪我暂时忘记了。。。这里默认是开启的，就算没有地定时歌曲也不影响其它歌曲的正常播放
	setTimeout(function() {
		if(_this.pauseTime != 0) {
			_this.audio.currentTime = _this.tempPauseTime;
			_this.tempPauseTime = 0;
		}
	},100);	
}

Player.prototype.play = function(index, theSong) { //播放控制
	if(this.audio.paused == true && this.pauseTime != 0) {
		this.audio.play();
	} else if(this.playList.length != 0) {

		//点击物理播放列表中的任意一首歌曲时需要将暂停时间清零
		if(index != undefined && this.index != index) {
			this.pauseTime = 0;
		} 

		this.index = index != undefined ? index : this.index;
		this.load(theSong);
	}
}

Player.prototype.pause = function() {
	this.pauseTime = this.audio.currentTime;
	this.audio.pause();
}

Player.prototype.stop = function() {
	this.audio.pause();
	this.audio.currentTime = 0;
}

Player.prototype.prev = function() {
	if(this.audio.src != '') {
		if(this.index != 0) {
			this.pauseTime = 0;
			this.index -= 1;
			this.load();
		} else {
			this.index = this.playList.length - 1;
			this.pauseTime = 0;
			this.load();
		}
	}
}

Player.prototype.next = function() {
	if(this.audio.src != '') {
		if(this.index < this.playList.length - 1) {
			this.pauseTime = 0;
			this.index += 1;
			this.load();
		} else {
			this.index = 0;
			this.pauseTime = 0;
			this.load();
		}
	}
}

//以下为定时播放功能，这块功能已经全部完成，不过觉得有些鸡肋就暂时注释掉了，如果以后有需要会再启用
/*
Player.prototype.insert = function(songData) {
	this.pause();
	this.willPlay = null;

	this.tempPauseTime = this.pauseTime;
	this.pauseTime = 0;

	this.load(songData);
}

Player.prototype.createAnotherPlayList  = function(data) {
	var songsData = [],
		i = 0;

	for(song in data) {
		songsData[i] = {};
		songsData[i].song_name = data[song].mtitle;
		songsData[i].song_src = data[song].mpath;
		songsData[i].artist_name = '';
		i++;
	}
	this.playList = songsData;
}

Player.prototype.checkTime = function() {
	var _this = this;
	var perTime = new Date();
	setTimeout(function() {
		for(time in _this.userTimeList) {
			if(_this.userTimeList[time].mtime <= perTime && _this.userTimeList[time].mtime - perTime>-20000) {
				_this.willPlay = parseInt(_this.userTimeList[time].index);
				_this.insert(_this.userTimeList[time]);
				delete _this.userTimeList[time];
			}
		}
		_this.checkTime();
	},15000);
}

Player.prototype.createUserTimeList = function(songsData) { 
	//var timeList = {};
	var perTime = new Date();
	var i = 0;

	for(song in songsData) {
		if(songsData[song].mtime != null) {
			this.userTimeList[i] = {};
			this.userTimeList[i].index = i;
			this.userTimeList[i].mtime = songsData[song].mtime;
			this.userTimeList[i].song_src = songsData[song].mpath;
			this.userTimeList[i].song_name = songsData[song].mtitle;
		}
		i++;
	}

	for(time in this.userTimeList) {
		var userTime = perTime.getFullYear().toString() + '/' +(perTime.getMonth()+1).toString() + '/' + perTime.getDate().toString() +  ' ' + this.userTimeList[time].mtime;
			userTime = new Date(Date.parse(userTime));
		this.userTimeList[time].mtime = userTime;
	}
}*/

Player.prototype.fun = {
	aObject: function(a) { //return a object
		return typeof a == 'object' ? a : document.getElementById(a);
	},
	getElementLeft: function(element){ //获取某元素上某点相对浏览器窗口左边缘的横轴坐标
		var actualLeft = element.offsetLeft;
		var current = element.offsetParent;
		while (current !== null){
			actualLeft += current.offsetLeft;
			current = current.offsetParent;
		}
		return actualLeft;
	},
	getStyle: function(obj, attr) {
		return  window.getComputedStyle(obj, null).getPropertyValue(attr);
	}

}