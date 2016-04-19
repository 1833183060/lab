var lrAction = {
		loginBgShow: function() {
			$('#login_area_container').show().removeClass('login_bg_hiding').addClass('login_bg_showing');
			$('.login_area').show().removeClass('to_zero').addClass('to_one');
			
			logoAction.showW();
		},
		loginBgHide: function() {
			$('#login_area_container').removeClass('login_bg_showing').addClass('login_bg_hiding');
		},
		loginFormShow: function() {
			var callback = "$('#login_area_form').show().removeClass('to_zero').addClass('to_one')";
			//this.hidden('.login_area_form');
			this.registerFormHide();
			this.forgetHide();
			this.hidden('#change_pwd');
			i.delayHide(350, [$('.login_area_form')], callback);
		},
		loginFormHide: function() {
			$('#login_area_form').removeClass('to_one').addClass('to_zero');
		},
		registerFormShow: function() {
			var callback = "$('#register_area_form').show().removeClass('to_zero').addClass('to_one')";
			this.loginFormHide();
			this.forgetHide();
			i.delayHide(370, [$('.login_area_form')], callback);
		},
		registerFormHide: function() {
			$('#register_area_form').removeClass('to_one').addClass('to_zero');
			$('#register1').show();
			$('#register2').hide();
			$('#register_area_form .hint2').removeClass('active');
			$('#register_area_form .hint1').addClass('active');
		},
		register1Hide: function() {
			$('#register1').removeClass('to_one').addClass('to_zero');
			$('#register_area_form .hint1').removeClass('active');
		},
		register2Show: function() {
			var callback = "$('#register2').show().removeClass('to_zero').addClass('to_one')";
			i.delayHide(370, [$('#register1')], callback);
			$('#register_area_form .hint2').addClass('active');
		},
		forgetHide: function() {
			$('#forget_pwd').removeClass('to_one').addClass('to_zero');
			$('#forget_pwd .hint1').addClass('active');
			$('#forget_pwd .hint2').removeClass('active');
			$('#get_code').show();
			$('#write_code').hide();
		},
		forgetShow: function() {
			var callback = "$('#forget_pwd').show().removeClass('to_zero').addClass('to_one')";
			this.loginFormHide();
			i.delayHide(370, [$('#login_area_form')], callback);
		},
		writecodeShow: function() {
			var callback = "$('#write_code').show().removeClass('to_zero').addClass('to_one')";
			this.hidden('#get_code');
			i.delayHide(370, [$('#get_code')], callback);
			$('#forget_pwd .hint2').addClass('active');
			$('#forget_pwd .hint1').removeClass('active');
		},
		hidden: function(hidden) {
			$(hidden).removeClass('to_one').addClass('to_zero');
		},
		changepwdShow: function() {
			var callback = "$('#change_pwd').show().removeClass('to_zero').addClass('to_one')";
			this.hidden('#forget_pwd');
			i.delayHide(370, [$('#forget_pwd')], callback);
		},
		closeForm: function() {
			$('.login_area').removeClass('to_one').addClass('to_zero');
			this.loginBgHide();

			logoAction.showB();
		}
	},
	sbAction = {
		sidebarShow: function() {
			$('#siteinfo').show();
			$('#sidebar_container').show().removeClass('sidebar_container_hiding').addClass('sidebar_container_showing');
			$('#nav_content').removeClass('nav_content_hiding').addClass('nav_content_showing');
			i.closeShow($('#siteinfo_close'));

			logoAction.showW();
		},
		sidebarHide: function() {
			$('#sidebar_container').removeClass('sidebar_container_showing').addClass('sidebar_container_hiding');
			$('#nav_content').removeClass('nav_content_showing').addClass('nav_content_hiding');
		},
		contentShow: function() {
			$('#siteinfo_content').show().removeClass('siteinfo_content_hiding').addClass('siteinfo_content_showing');
		},
		contentHide: function() {
			if($('#siteinfo_content').css('display') != 'none') {
				$('#siteinfo_content').removeClass('siteinfo_content_showing').addClass('siteinfo_content_hiding');
			}
		},
		wordsShow: function(index) {
			if(index == '0') {
				this.close();
			} else {
				var callback = "$('.siteinfo_words[data-index="+index+"]').show().removeClass('to_zero').addClass('to_one')";
				this.wordsHide('1');this.wordsHide('2');this.wordsHide('3');
				i.delayHide(370, [$('.siteinfo_words')], callback);
			}
		},
		wordsHide: function(index) {
			$('.siteinfo_words[data-index='+index+']').removeClass('to_one').addClass('to_zero');
		},
		close: function() {
			var objArr = [$('#siteinfo'), $('#sidebar_container'), $('#siteinfo_content')];
			this.sidebarHide();
			this.contentHide();
			this.wordsHide('1');this.wordsHide('2');this.wordsHide('3');
			i.delayHide(370, [$('.siteinfo_words')]);
			i.delayHide(570, objArr);

			logoAction.showB();
		},
	},
	ssAction = {
		siteShowShow: function() {
			$('#site_show_area').show().removeClass('site_show_hiding').addClass('site_show_showing');
			logoAction.showB();
		},
		siteShowHide: function() {
			$('#site_show_area').removeClass('site_show_showing').addClass('site_show_hiding');
			logoAction.showW();
			i.delayHide(570, [$('#site_show_area')]);
		},
		anotherBgShow: function() {
			$('#title_another_bg').addClass('title_anotherBg_showing');
		},
		anotherBgHide: function() {
			$('#title_another_bg').removeClass('title_anotherBg_showing');
		}
	},
	logoAction = {
		showW: function() {
			$('#logo_w').show().removeClass('to_zero').addClass('to_one');$('header .logo_area').css('color','#fff');
			$('#logo_b').show().addClass('to_zero').removeClass('to_one');$('header .logo_area');
			i.delayHide(370, [$('#logo_b')]);
		},
		showB: function() {
			$('#logo_b').show().removeClass('to_zero').addClass('to_one');$('header .logo_area').css('color','#333');
			$('#logo_w').show().addClass('to_zero').removeClass('to_one');$('header .logo_area');
			i.delayHide(370, [$('#logo_w')]);
		}
	},
	i = {
		delayHide: function(time, objArr, callback) {
			setTimeout(function(){
				for(var i=0; i<objArr.length; i++) {
					objArr[i].hide();
				}
				eval(callback);
			}, time);
		},
		closeShow: function(obj) {
			obj.removeClass('close_hiding').addClass('close_showing');
		},
		closeHide: function(obj) {
			obj.removeClass('close_showing').addClass('close_hiding');
		}
	};


var checkInput = {
		email: function(a) {
			var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			if (filter.test(a)) {
				return true;
			} else {
				alert('您的电子邮件格式不正确');
				return false;
			}
		}
	},
	error = {
		emailFormat: function() {
			console.log('this is not a email addr.')
		},
		pwdShort: function() {
			console.log('password too short.')
		},
		pwdLong: function() {
			console.log('password too long.')
		},
		authCodeError: function() {
			console.log('auth code error.')
		},
		loginError: function() {
			console.log('username or password is not correct.')
		},
		emailNotExist: function() {
			console.log('the email is not exist.')
		},
		pwdNotSame: function() {
			console.log('the two passwords are not same.')
		}
	};


//site show
/*$('#title_area').click(function() {
	ssAction.siteShowShow();
	ssAction.anotherBgShow();
});
$('#close_site_show').click(function() {
	ssAction.siteShowHide();
	ssAction.anotherBgHide()
});*/
/*$('#play_btn').click(function() {
	var videoObj = document.getElementById('the_video');
	videoObj.play();
	$('#video_layer').hide();
	$(this).hide();
	videoObj.onended = function() {
		$('#video_layer').show();
		$('#play_btn').show();
	}
	return false;
});*/

//site info
$('#logo_area').click(function() {
	sbAction.sidebarShow();
	
});
$('#nav_content a').click(function() {
	if($(this).attr('data-index') != '0') {
		sbAction.contentShow();
	}
	sbAction.wordsShow($(this).attr('data-index'));
	return false;
});
$('#siteinfo_close').click(function() {
	sbAction.close();
	i.closeHide($(this));
	
});

//login && register
$('#login_btn, #login_switch').click(function() {
	if($('#login_area_container').hasClass('login_bg_hiding'))
		$('.login_area_form').hide();
	lrAction.loginBgShow();
	lrAction.loginFormShow();

	return false;
});
$('#register_btn, #register_switch').click(function() {
	if($('#login_area_container').hasClass('login_bg_hiding'))
		$('.login_area_form').hide();
	lrAction.loginBgShow();
	lrAction.registerFormShow();
	
	return false;
});
$('.login_area_header .close, #r_submit2, #l_submit, #c_submit').click(function() {
	var objArr = [$('#login_area_container'), $('.login_area')];
	lrAction.closeForm();
	i.delayHide(370, objArr);
});

$('#r_submit1').click(function() {
	lrAction.register1Hide();
	lrAction.register2Show();
});

$('#forget_pwd_link').click(function() {
	lrAction.forgetShow();
});
$('#f_submit1').click(function() {
	lrAction.writecodeShow();
});
$('#f_submit2').click(function() {
	lrAction.changepwdShow();
})


;(function(){

	$('#siteinfo').height($('body').height() - $('#footer_bottom').height() - parseInt($('#siteinfo').css('border-top'))*3);

	$(window).resize(function() {
		$('#siteinfo').height($('body').height() - $('#footer_bottom').height() - parseInt($('#siteinfo').css('border-top'))*3);
	});
})();


(function() {
	var colorList = [
		'#ff5100',
		'#ff9200',
		'#ffff00',
		'#5cff00',
		'#00ffef',
		'#00d2ff',
		'#0067ff',
		'#0021ff',
		'#8900ff',
		'#e200ff',
		'#ff006e',
		'#ff0000'
	]
	var zero = document.getElementById('zero');
	var moveTimer;
	var b, c;
	
	isStop(300);
	$(document).mousemove(function(e){
		b = e.pageX;
	});	

	function changeColor() {
		clearTimeout(moveTimer);
		moveTimer = setTimeout(function() {
			zero.style.fill = colorList[Math.floor(Math.random()*colorList.length)];
			changeColor();
		}, 1000);
	}

	function isStop(time) {
		c = b;
		setTimeout(function() {
			if(c == b) {
				changeColor()
			}
			isStop(time);
		}, time)
	}
})()