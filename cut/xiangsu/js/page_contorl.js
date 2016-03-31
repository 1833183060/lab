var lrAction = {
		loginBgShow: function() {
			$('#login_area_container').show().removeClass('login_bg_hiding').addClass('login_bg_showing');
			$('.login_area').show().removeClass('login_area_hiding').addClass('login_area_showing');
		},
		loginBgHide: function() {
			$('#login_area_container').removeClass('login_bg_showing').addClass('login_bg_hiding');
		},
		loginFormShow: function() {
			var callback = "$('#login_area_form').show().removeClass('login_area_hiding').addClass('login_area_showing')";
			this.registerFormHide();
			i.delayHide(370, [$('#register_area_form')], callback);
		},
		loginFormHide: function() {
			$('#login_area_form').removeClass('login_area_showing').addClass('login_area_hiding');
		},
		registerFormShow: function() {
			var callback = "$('#register_area_form').show().removeClass('login_area_hiding').addClass('login_area_showing')";
			this.loginFormHide();
			i.delayHide(370, [$('#login_area_form')], callback);
		},
		registerFormHide: function() {
			$('#register_area_form').removeClass('login_area_showing').addClass('login_area_hiding');
		},
		closeForm: function() {
			$('.login_area').removeClass('login_area_showing').addClass('login_area_hiding');
			this.loginBgHide();
		}
	},
	sbAction = {
		sidebarShow: function() {
			$('#siteinfo').show();
			$('#sidebar_container').show().removeClass('sidebar_container_hiding').addClass('sidebar_container_showing');
			$('#nav_content').removeClass('nav_content_hiding').addClass('nav_content_showing');
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
				var callback = "$('.siteinfo_words[data-index="+index+"]').show().removeClass('login_area_hiding').addClass('login_area_showing')";
				this.wordsHide('1');this.wordsHide('2');this.wordsHide('3');
				i.delayHide(370, [$('.siteinfo_words')], callback);
			}
		},
		wordsHide: function(index) {
			$('.siteinfo_words[data-index='+index+']').removeClass('login_area_showing').addClass('login_area_hiding');
		},
		close: function() {
			var objArr = [$('#siteinfo'), $('#sidebar_container'), $('#siteinfo_content')];
			this.sidebarHide();
			this.contentHide();
			this.wordsHide('1');this.wordsHide('2');this.wordsHide('3');
			i.delayHide(370, [$('.siteinfo_words')]);
			i.delayHide(570, objArr);
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
		}
	},
	logoAction = {
		showW: function() {
			$('#logo_w').show().removeClass('login_area_hiding').addClass('login_area_showing');$('header .logo_area').css('color','#fff');
			$('#logo_b').show().addClass('login_area_hiding').removeClass('login_area_showing');$('header .logo_area');
			i.delayHide(370, [$('#logo_b')]);
		},
		showB: function() {
			$('#logo_b').show().removeClass('login_area_hiding').addClass('login_area_showing');$('header .logo_area').css('color','#333');
			$('#logo_w').show().addClass('login_area_hiding').removeClass('login_area_showing');$('header .logo_area');
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
		}
	}

$('#title_area').click(function() {
	ssAction.siteShowShow();
	
});
$('#close_site_show').click(function() {
	ssAction.siteShowHide();
})
$('#logo_area').click(function() {
	sbAction.sidebarShow();
});
$('#nav_content a').click(function() {
	if($(this).attr('data-index') != '0') {
		sbAction.contentShow();
	}
	sbAction.wordsShow($(this).attr('data-index'));
	return false;
})


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
$('.login_area_header .close, .submit_btn').click(function() {
	var objArr = [$('#login_area_container'), $('.login_area')];
	lrAction.closeForm();
	i.delayHide(370, objArr);
});

$('#play_btn').click(function() {
	var videoObj = document.getElementById('the_video');
	videoObj.play();
	$('#video_layer').hide();
	$(this).hide();
	videoObj.onended = function() {
		$('#video_layer').show();
		$('#play_btn').show();
	}
	return false;
})