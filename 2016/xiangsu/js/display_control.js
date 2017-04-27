var GLOBAL_PATH = '/Public/';


function EventTarget() {
    this.handlers = {};
}
EventTarget.prototype = {
    constructor: EventTarget,
    addHander: function(event, action) {
        if(typeof this.handlers[event] == 'undefined') {
            this.handlers[event] = new Array();
        }
        this.handlers[event].push(action);
    },
    removeHander: function(event, action) {
        if(this.handlers[event] instanceof Array) {
            var actionArr = this.handlers[event];
            for(var i=0; i<actionArr.length; i++) {
                if(actionArr[i] == action) {
                    actionArr.splice(i, 1);
                    break;
                }
            }
        }
    },
    trigger: function(bindConfig) {
        if(!bindConfig.target) {
            bindConfig.target = this;
        }
        if(this.handlers[bindConfig.event] instanceof Array) {
            var actionArr = this.handlers[bindConfig.event];
            for(var i=0; i<actionArr.length; i++) {
                actionArr[i](bindConfig);
            }
        }
    }
}

function extend(subType, superType) {
    var prototype = Object(superType.prototype);
    prototype.constructor = subType;
    subType.prototype = prototype;
}



function PageControl() { //控制页面的切换效果
    EventTarget.call(this);
}
extend(PageControl, EventTarget);
PageControl.prototype.show = function(pageName, time) {
     var a = "$('"+pageName+"').show().removeClass('hide').addClass('show').css('animation-duration', '"+(time/1000)+"s');";

    this.hide('.main_page', time);
    this.delayHide(time, [$('.main_page')], a);

    this.trigger({event: 'haveContent'});
}
PageControl.prototype.hide = function(pageName, time) {
    var page = $(pageName);
    page.removeClass('show').addClass('hide');
}
PageControl.prototype.delayHide = function(time, objArr, callback) {
    setTimeout(function(){
        for(var i=0; i<objArr.length; i++) {
            objArr[i].hide();
        }
        eval(callback);
    }, time+70);
}



/* *
 *
 *
 *
 * */
function Images() { //画廊
    this.data = '';
    this.images = $('#images');

    this.hash = new Hash();

    this.model = '<div class="img_item_box"><a class="fancybox-thumbs" data-fancybox-group="thumb" href="( src )" title="( title )" data-description="( desc )"><div class="img_item" style="background-image:url(( src )@!gallery_thumb)"><div class="img_info"><h1 class="img_title">( title )</h1><p class="img_desc">( desc )</p></div></div></a></div>';
}

Images.prototype = {
    constructor: Images,
    init: function(data) { //初始化画廊

        this.data = data;
        this.images.html('');

        this.showImage();
        this.autoSwitch();
    },
    autoSwitch: function() {
        var _this = this;

        var width = _this.images.find('.img_item_box:last-child').width(),
            windowWidth = this.images.width() - 80;
        if(width <= 100) {
            width = width / 100 * windowWidth;
        }
        this.images.find('.img_item_box').each(function() {
            console.log(width)
            $(this).height(width / 1.33);
        });

        $(window).resize(function() {
            var width = _this.images.find('.img_item_box:last-child').width();
            _this.images.find('.img_item_box').each(function() {
                $(this).height(width / 1.33);
            });
        });
    },
    showImage: function() { //填充数据
        var data = this.data;
        var config = {};
        var num = data.length;

        for(var i = 0; i<data.length; i++) {

            config.src = data[i].path;
            config.title = data[i].name;
            config.desc = data[i].description;

            this.images.append(modelPre(this.model, config));

            if(config.title == '' && config.desc == '') {
                this.images.find('.img_item_box:last-child .img_info').hide()
            }
        }
    },
    readHash: function(url) { //读取hash以拉取数据（只有读到了hash才能拉取数据）
        this.hash.read(request, this, url, this.init, imgData);
        this.hash.read(request, this, imgInfoRequestURL, this.imgInfoCtrl, [{pic_name_visible: '1',pic_des_visible:'0'}])
    },
    imgInfoCtrl: function(data) {
        var data = data[0];

        if(data.pic_name_visible == '0') {
            $('.img_title').hide();

            if(data.pic_des_visible == '0') {
                $('.img_info').hide();
            }
        } else if(data.pic_des_visible == '0') {
            $('.img_desc').hide();
        }
    }
}


function Blog() { //博客
    this.data = '';
    this.blog = $('#blog');
    this.blog_main = $('#blog_main');
    this.cid = '';

    this.prev = $('#blog #prev_b');
    this.next = $('#blog #next_b');
    this.prevTitle = $('#blog #prev_b .pageUpTitle');
    this.nextTitle = $('#blog #next_b .pageDownTitle');

    this.warning = $('#warning');

    this.hash = new Hash();
    this.PREFIX = 'blog';

    this.model = '<div class="articleCover" style="background-image: url(( src ))"></div><div class="articleTitle">( title )</div><div class="articleContent">( content )</div>';
}
Blog.prototype = {
    constructor: Blog,
    init: function(data) { //初始化

        this.prev.unbind('click');
        this.next.unbind('click');

        this.showArticle(data);
        this.changeArticle();
    },
    readHash: function(url) { //读取hash以拉取数据（只有读到了hash）才能拉取数据，且应自动拉取最新一篇日志，只需要传栏目id，无须传日志id
        this.hash.read(request, this, url, this.init, blogData)
    },
    showArticle: function(data) { //部署数据

        if(! ( data[0] && (data[0].title || data[0].content) )) {
            this.openWarning('没有了');
        } else {
            document.body.scrollTop = 0;
            this.blog_main.html('');
            this.data = data[0];
            var data = this.data;
            var config = {
                src: 'http://img.snsu.me' + data.cover + '@!blog_cover',
                title: data.title,
                content: data.content
            };
            this.blog_main.append(modelPre(this.model, config));
            this.blog_main.attr('data-id', this.data.id);
            this.prevTitle.html(data.preTitle ? data.preTitle : '没有了');
            this.nextTitle.html(data.nextTitle ? data.nextTitle : '没有了');
            if(data.cover == '') {
                this.blog_main.find('.articleCover').hide();
            } 
            this.cid = this.data.column_id;
            this.hash.change(this.PREFIX, this.data.column_id, this.data.id);
        }
       

    },
    changeArticle: function() { //切换文章（请求时应发送文章id，请求成功后要更改hash）
        var _this = this;
        var data;

        this.prev.click(function() {
            var id = parseInt(_this.blog_main.attr('data-id'));

            data = {
                "column_id": _this.cid,
                "id": id.toString(),
                "btn": -1
            }
            /*** ajax ***/
            request(_this, blogRequestURL, data, _this.showArticle, 0)
        });

        this.next.click(function() {
            var id = parseInt(_this.blog_main.attr('data-id'));

            data = {
                "column_id": _this.cid,
                "id": id.toString(),
                "btn": 1
            }
            /*** ajax ***/
            request(_this, blogRequestURL, data, _this.showArticle, blogData3)
        });
    },
    openWarning: function(words) { //文章在第一篇或最后一篇时的警告
        this.warning.html(words)
            .show()
            .animate({
                opacity: 1
            }, 300, function() {
                var _this = this;
                setTimeout(function() {
                    $(_this).animate({
                        opacity: 0
                    }, 300, function() {
                        $(_this).hide();
                    })
                }, 1000);
            });
    }
}


function Index() { //首页
    this.data = '';
    this.item_group = $('#index #item_group');

    this.config = {
            auto: true,
            speed: 5000 
        };

    this.hash = new Hash();

    this.model = '<div class="vp_item"><a class="vp_link" target="_blank" href="( url )"><div class="vp_img" style="background-image: url(( src )@!designIndex)"></div></a><div class="vp_words"><h1 class="vp_title">( title )</h1><p class="vp_desc">( desc )</p></div></div>';
}
Index.prototype = {
    constructor: Index,
    init: function(data) {
        this.data = data;

        if(this.item_group.find('.vp_item').length == 0) {

            this.showImage();
            this.launch(this.config);
        }

    },
    readHash: function(url) { //读取hash拉取数据
        this.hash.read(request, this, url, this.init, indexData)
    },
    showImage: function() { //部署数据
        var data = this.data;
        var config = {};
       
        for(var i=0; i<data.length; i++) {
            config.url = data[i].link;
            config.src = data[i].path;
            config.title = data[i].name || '<em>暂未添加标题</em>';
            config.desc = data[i].description || '<em>暂未添加描述</em>';

            this.item_group.prepend(modelPre(this.model, config));

        }
        this.item_group.find('.vp_link').each(function() {
            console.log($(this).attr('href'))
            if(!$(this).attr('href')) {
                $(this).css('cursor', 'default')
                    .click(function() {
                    return false;
                });
            }
        });
    },
    launch: function(config) { //开启轮播
        $().viewpager(config);
    }
}


function Hash() { //hash控制器
    this.cid = '';
    this.id = '';
    this.lo = window.location;
    this.CONNECTER = '-';
}
Hash.prototype = {
    constructor: Hash,
    change: function(prefix, cid, id) { //改变hash（前缀（前缀没什么卵用，只是用来标识这个页面的类型），页面id，日志id）
        this.cid = cid;
        this.id = id;
        this.prefix = prefix;

        var hash;

        if(this.id) {
            hash = this.prefix + this.cid + this.CONNECTER + this.id;
        } else {
            hash = this.prefix + this.cid;
        }

        this.lo.hash = hash;
    },
    read: function(callback, _this, url, callback2, jiadata) { //读取hash （读取hash后执行的函数（这里全部为ajax请求函数），调用这个函数的方法所在的类（因为在ajax请求函数中要用到），ajax请求地址，ajax请求成功后的回调函数，用于测试的假数据
        var cid = this.lo.hash.replace(/#|-.*|\D/g, ''),
            id = this.lo.hash.replace(/#\w*-?|[^\d*]/g, ''),
            pageClass = this.lo.hash.replace(/#|-|\d*|/g, '');

        var data;

        if(id) { //如果id不是空字符串便判定为请求日志
            data = {
                column_id: cid,
                id: id
            };
            console.log('cid-id')
            callback(_this, url, data, callback2, jiadata);

        } else if (cid != '' && pageClass == 'images') { //如果id为空，cid不为空，且页面类型为images，则判定为请求图片
            data = {gid: cid};
            console.log('cid')
            callback(_this, url, data, callback2, jiadata);

        } else if(cid != '' && pageClass == 'blog') { //如果id为空，cid不为空，且页面类型为blog，则判定为请求最新一篇日志
            data = {column_id: cid};
            callback(_this, url, data, callback2, jiadata);
        } else if(cid == '') { //如果id和cid均为空，则判定为请求首页轮播图
            callback(_this, url, {}, callback2, jiadata);
        }

    }
}


function Nav() { //导航
    this.data = '';
    this.nav = $('#user_nav');
}
Nav.prototype = {
    constructor: Nav,
    request: function(url) { //请求导航数据
        request(this, url, {}, this.init, navData);
    },
    init: function(data) { //初始化导航
        this.data = data;

        this.show();

        this.bind();

        initSite();

        this.responsive(600);
    },
    show: function() { //部署数据
        var data = this.data;
        
        for(var i=0; i<data.length; i++) {
            if(data[i].status == '1' && data[i].visible == '1') {

                this.nav.append('<a data-page="'+type(data[i].type)+'" href="#'+data[i].id+'">'+data[i].name+'</a>');
            }
            //导航里每个链接里所包含的信息有：页面类型，页面id，页面名称。这些必须是第一组被渲染的数据。
        } 

        function type(a) {
            switch(a) {
                case '1': return 'images';
                case '2': return 'blog';
            }
        }
    },
    bind: function() { //绑定导航条链接事件
        $('.user_nav a').on('click', function() {
            var page = $(this).attr('data-page'); //获取当前链接所对应的页面的类型

            $('.user_nav a').removeClass('active'); //移除导航某链接的active状态
            $(this).addClass('active'); //为当前被点击的链接添加active状态
            pageControl.show('#'+page, 300); //调用页面显示的方法，显示当前被点击的链接所对应的类型的页面

            aHash.change(page, $(this).attr('href').replace(/#/g, '')) //改变hash，因为页面数据的拉取是由hash所驱动的

            if(page == 'images') { //如果是images类型的页面，使用image类的readHash方法请求并部署数据

                aImages.readHash(imgRequestURL);

            } else if(page == 'blog') { //依此类推

                aBlog.readHash(latestBlogRequestURL);

            } else if(page == 'index') {
                aIndex.readHash(indexRequestURL);
            }

            return false;
        });
    },
    responsive: function(width) { //导航响应式，接受的参数为开启响应式的最小宽度(px)
        var nav_box = $('#nav_box');

        if($(window).width() <= width) {
            nav_box.addClass('small_nav');
        } else {
            nav_box.removeClass('small_nav');
        }
        $(window).resize(function() {
            if($(this).width() <= width) {
                nav_box.addClass('small_nav').hide();
            } else {
                nav_box.removeClass('small_nav').removeClass('hide').show();
            }
        });
        $('#si-icon-hamburger-cross').on('touchstart', function() {
            var path = $('.si-icon path');
            if(nav_box.hasClass('small_nav')) {
                if(nav_box.hasClass('show')) {

                    nav_box.removeClass('show').addClass('hide');
                    setTimeout(function() {
                        nav_box.hide();
                    }, 300);
                    path.css('stroke', 'rgb(0, 0, 0)');
                } else {

                    nav_box.css('display', 'table').removeClass('hide').addClass('show');
                    path.css('stroke', 'rgb(255, 255, 255)')
                }
            }
        });
        $('.small_nav a').on('touchstart', function() {

            if(nav_box.css('opacity') == '1') {

                nav_box.removeClass('show').addClass('hide');
                setTimeout(function() {
                    nav_box.hide();
                }, 500);
                window.aSvgIcon.toggle(true);
                $('.si-icon path').css('stroke', '#000');
            }
            
        });
    }
}


function Info() { //站点信息
    this.data = '';

    this.title = $('title');
    this.siteName = $('#site_name');
    this.siteInfo = $('#site_info');
    this.siteLogo = $('.user_avatar');
    this.logoArea = $('#site_logo');
}
Info.prototype = {
    constructor: Info,
    request: function() {
        request(this, infoRequestURL, {}, this.init, [{name: 'www', sub_title: 'www'}]);
    },
    init: function(data) {
        this.data = data[0];
        this.show();
    },
    show: function() {
        var data = this.data;
        var defaultLogo = '/Public/Home/svg/demoAvator.svg'; //默认logo

        this.title.html(data.name + ' - 向素');

        this.siteName.html(data.name);

        this.logoArea.parent().click(function() {
            $('.user_nav a[href=#]').trigger('click');
            return false;
        })

        if(data.sub_title) {
            this.siteInfo.html(data.sub_title);
        } else {
            this.siteInfo.hide();
        }

        if(data.logo_path) {
            this.siteLogo.attr('src', data.logo_path );
            this.logoArea.css('background-image', 'url(' + data.logo_path + ')');
        } else {
            this.siteLogo.css('src', defaultLogo);
            this.logoArea.css('background-image', 'url(' + defaultLogo + ')');
        }
    }
}


function request(_this, url, _data, callback, jiadata) { //ajax请求函数（使用该函数的类的this，请求路径，发送至后端的数据，请求到数据后的回调函数，测试用假数据）

    console.log(_data)
    var request = $.ajax({
        url: url,
        method: "POST",
        data: _data,
        dataType: "json"
    });

    request.success(function(data) {
        if(data == 0) { //非法请求处理。这里的非法请求返回的数据是什么还不确定，暂时使用0代替。
            ifError(data);
            console.log(data)
        } else if(data.errorCode == 0) {
            ifError(data.errorCode);
        } else { //如果请求合法，则调用回调函数
            console.log(data)
            callback.call(_this, data);
        }
    });

    request.error(function(jqXHR, textStatus) { //如果请求失败，则填充假数据，并抛出错误
        callback.call(_this, jiadata);
        console.log(jiadata)
        throw new Error('Request failed! This is the test data.');
    });
}

function initSite() { //在页面刚刚打开时对页面进行初始化
    var hash = window.location.hash
    var pageClass = hash.replace(/#|-|\d*|/g, ''),
        cid = hash.replace(/#|-.*|\D/g, ''),
        id = hash.replace(/#\w*-?|[^\d*]/g, '');

    var a = $('.user_nav a[href=#'+cid+']'); //读取hash中的cid来选择要进行模拟点击的导航链接
    console.log(pageClass.length);
    console.log(pageClass)
    console.log(cid)
    if (pageClass == 'index' || pageClass == '') { //如果页面类型为index或者空字符串，则将a更换为首页的链接
        cid = '';
        a = $('.user_nav a[data-page=index]');
        console.log(a)
    } 
    a.trigger('click');

}

function modelPre(model, config) { //模板渲染函数
    var re_name = /[\(\s*]\w+[\s*\)]/g,
        re_sign = /\(\s*\w+\s*\)/g;

    var arr_name = model.match(re_name),
        arr_sign = model.match(re_sign);

    for(var i=0; i<arr_name.length; i++) {
        arr_name[i] = arr_name[i].replace(/\s*/g, '').replace(/\(|\)/g, '');
        model = model.replace(arr_sign[i], config[arr_name[i]]);
    }
    return model;
}

function ifError(code) { //错误处理，一般为非法请求或者请求不到数据时显示的信息，以后需要改写成错误页面切换
    // alert('404');
    var action = {
        blank: function() {
            $('#warning').html('这里暂时没有内容').show().css('opacity', '1');
        }
    };

    if(code == 0) {

        console.log('codecodecode!')
        action.blank();
    }

    pageControl.addHander('haveContent', function() {
        $('#warning').hide().css('opacity', '0');
    });
}

var aImages = new Images(),
    aBlog = new Blog(),
    aHash = new Hash(),
    aIndex = new Index(),
    aNav = new Nav(),
    aInfo = new Info(),
    pageControl = new PageControl();


var imgRequestURL = '/ajaxGetGalleryList',
    imgInfoRequestURL = '/ajaxGetOneColumnInfo',
    blogRequestURL = '/ajaxGetOneBlog',
    indexRequestURL = '/ajaxGetIndexPic',
    navRequestURL = '/ajaxGetAllColumn',
    infoRequestURL = '/getCurWebsiteInfo',
    latestBlogRequestURL = '/ajaxGetOneBlog';

aInfo.request(infoRequestURL);
aNav.request(navRequestURL); //初始化导航

setTimeout(function() { //打开页面时的过度效果
    $('body').animate({
        opacity: 1
    }, 1000);
}, 500);



/* *
 *
 * 响应式导航按钮
 *
 * */
(function( window ) {
    // initialize all
    
    [].slice.call( document.querySelectorAll( '.si-icons-default > .si-icon' ) ).forEach( function( el ) {
        var svgicon = new svgIcon( el, svgIconConfig );
    } );

    window.aSvgIcon = new svgIcon( document.querySelector( '.si-icon-hamburger-cross' ), svgIconConfig, { easing : mina.backin } );

    setTimeout(function() {
        $('.si-icon path').css('stroke', '#000');

    }, 100)
})( window );

var _hmt = _hmt || [];
(function () {
    var hm = document.createElement("script");
    hm.src = "//hm.baidu.com/hm.js?2a1c5b7e4abd07d2a323807bdab9fa08";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();