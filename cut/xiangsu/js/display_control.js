var pageControl = {
    show: function(pageName, time) {
        var a = "$('"+pageName+"').show().removeClass('hide').addClass('show').css('animation-duration', '"+(time/1000)+"s');";
        this.hide('.main_page', time);
        this.delayHide(time, [$('.main_page')], a);
    },
    hide: function(pageName, time) {
        var page = $(pageName);
        page.removeClass('show').addClass('hide');
    },
    delayHide: function(time, objArr, callback) {
        setTimeout(function(){
            for(var i=0; i<objArr.length; i++) {
                objArr[i].hide();
            }
            eval(callback);
        }, time+70);
    }
};


/****

throw new Error('Illegal request!');

****/

function Images() {
    this.data = '';
    this.images = $('#images');
    this.layer = $('#layer');
    this.showed_img = $('#layer #showed_img');

    this.model = '<div class="img_item_box"><div class="img_item"><img class="img_self" src="" alt=""><div class="img_info"><h1 class="img_title"></h1><p class="img_desc"></p></div></div></div>';

    this.changeImage();
}

Images.prototype = {
    constructor: Images,
    init: function(data) {

        this.data = data;
        this.images.html('');

        var num = this.data.length;
        
        for(var i=0; i<num; i++) {
            this.images.append(this.model);
        }

        this.showImage();
        this.launchLayer();
    },
    showImage: function() {
        var data = this.data;
        
        i=0;
        this.images.find('.img_self').each(function() {
            $(this).attr('src', data[i].path).attr('data-index', i);
            i++;
        });
        i=0;
        this.images.find('.img_title').each(function() {
            $(this).html(data[i++].name);
        });
        i=0;
        this.images.find('.img_desc').each(function() {
            $(this).html(data[i++].description);
        });

        this.resetImg();
    },
    resetImg: function() {

        var img_item = $('.img_item'),
            a = img_item.width() / img_item.height();

        $('.img_item .img_self').each(function() {
            var src = $(this).attr('src');
            var img = new Image();
                img.src = src;
            var b = img.width / img.height;

            if(b > a) {
                $(this).removeClass('img_a').addClass('img_b');
            } else {
                $(this).removeClass('img_b').addClass('img_a');
            }
        });
    },
    launchLayer: function() {
        var _this = this;

        $('.img_item .img_self').click(function() {
            var src = $(this).attr('src'),
                index = $(this).attr('data-index');

            _this.deployLayerData(src, index);

            _this.layer
                .show()
                .animate({
                    'opacity': 1
                }, 300);
        });

        this.layer.find('#back').click(function() {
            _this.layer
                .animate({
                    'opacity': 0
                }, 300, function() {
                    $(this).hide();
                })
        })
    },
    deployLayerData: function(src, index) {
        var _this = this;

        this.showed_img.attr('src',src).attr('data-index', index);
        this.layer.find('#title').html(_this.data[index].name);
        this.layer.find('#desc').html(_this.data[index].description);
    },
    changeImage: function() {
        var prev = $('#layer #prev_p'),
            next = $('#layer #next_p');
        var _this = this;

        prev.click(function() {
            var index = parseInt(_this.showed_img.attr('data-index')) - 1,
                src = _this.data[index] ? _this.data[index].path : 0;

            if(src) {
                _this.deployLayerData(src, index);
            } else {
                _this.warning('the first!');
            }
        });

        next.click(function() {
            var index = parseInt(_this.showed_img.attr('data-index')) + 1,
                src = _this.data[index] ? _this.data[index].path : 0;

            if(src) {
                _this.deployLayerData(src, index);
            } else {
                _this.warning('the last!');
            }
        });
    },
    warning: function(warning) {
        $('#warning')
            .html(warning)
            .show()
            .animate({
                'opacity': 1
            }, 1000, function() {
                $(this).animate({
                    'opacity': 0
                }, 1000, function() {
                    $(this).hide();
                });
            });
    }
}


function Blog() {
    this.data = '';
    this.blog = $('#blog');
    this.blog_main = $('#blog_main');

    this.model = '<div class="blog_header"><h1 id="article_title"></h1><span id="article_time"></span></div><div id="article_content" class="blog_content"></div>';
}
Blog.prototype = {
    constructor: Blog,
    init: function(data) {
        this.blog_main.html(this.model);

        this.showArticle(data);
        this.changeArticle();
    },
    showArticle: function(data) {
        this.data = data[0];

        var date = new Date(parseInt(this.data.time) * 1000),
            time = date.getFullYear() + '/' + (date.getMonth() + 1)+ '/' + date.getDate();

        this.blog_main.find('#article_title').html(this.data.title);
        this.blog_main.find('#article_time').html(time);
        this.blog_main.find('#article_content').html(this.data.content);
        this.blog_main.attr('data-id', this.data.id);
    },
    changeArticle: function() {
        var _this = this;
        var prev = $('#blog #prev_b'),
            next = $('#blog #next_b');

        prev.click(function() {
            var id = parseInt(_this.blog_main.attr('data-id')) - 1;

            /*** ajax ***/

            _this.showArticle(blogData2);
        });

        next.click(function() {
            var id = parseInt(_this.blog_main.attr('data-id')) + 1;

            /*** ajax ***/

            _this.showArticle(blogData3);
        })
    },
    warning: function() {

    }
}


var imgData = [
    {
        "id": 0,
        "gid": 1,
        "path": "http://null-42.github.io/sun.png",
        "name": "null-42",
        "description": "http://null-42.github.io/",
        "status": 1
    },
    {
        "id": 1,
        "gid": 1,
        "path": "http://photo2.fanfou.com/v1/mss_3d027b52ec5a4d589e68050845611e68/ff/n0/0b/z8/gp_308612.jpg@596w_1l.jpg",
        "name": "Sevenskey",
        "description": "http://sevenskey.github.io/",
        "status": 1
    },
    {
        "id": 2,
        "gid": 1,
        "path": "http://null-42.github.io/sun.png",
        "name": "null-42",
        "description": "http://null-42.github.io/",
        "status": 1
    },
    {
        "id": 3,
        "gid": 1,
        "path": "../img/code.png",
        "name": "Sevenskey",
        "description": "http://sevenskey.github.io/",
        "status": 1
    },
    {
        "id": 2,
        "gid": 1,
        "path": "http://null-42.github.io/sun.png",
        "name": "null-42",
        "description": "http://null-42.github.io/",
        "status": 1
    },
    {
        "id": 3,
        "gid": 1,
        "path": "../img/code.png",
        "name": "Sevenskey",
        "description": "http://sevenskey.github.io/",
        "status": 1
    }
],

blogData = [
    {
        "id": "2",
        "uid": "23",
        "title": "测试2",
        "sub_title": "测试2",
        "content": "哈哈哈",
        "column_id": "8",
        "time": "1461329106"
    }
],
blogData2 = [
    {
        "id": "1",
        "uid": "23",
        "title": "测试",
        "sub_title": "测试2",
        "content": "哈哈哈哈哈哈哈哈哈",
        "column_id": "8",
        "time": "1461329106"
    }
],
blogData3 = [
    {
        "id": "3",
        "uid": "23",
        "title": "测试3",
        "sub_title": "测试2",
        "content": "哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈",
        "column_id": "8",
        "time": "1461329106"
    }
];


var aImages = new Images();
var aBlog = new Blog();


$('.user_nav a').click(function() {
    var page = '#' + $(this).attr('data-page'),
        id = $(this).attr('id');
    $('.user_nav a').removeClass('active');
    $(this).addClass('active');
    pageControl.show(page, 300);

    if(id == 'image_link') {

        aImages.init(imgData);

    } else if(id == 'blog_link') {

        aBlog.init(blogData);
    }

    return false;
});

