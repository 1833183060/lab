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
[
    {
        "index": 0,
        "src": "",
        "title": "",
        "desc": "",
        "time": ""
    }
]
{
    "domain_name": "",
    "images_name": ""
}
****/

/****
{
    "index": 0,
    "time": "",
    "title": "",
    "content": ""
}
{
    "domain_name": "",
    "blog_name": "",
    "index": "",
    "btn": -1
}
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
            _this.showed_img.attr('src', src).attr('data-index', index);
            _this.layer.css('display', 'table');
        });

        // this.layer.click(function() {
        //     $(this).hide();
        // })
    },
    changeImage: function() {
        var prev = $('#layer #prev'),
            next = $('#layer #next');
        var _this = this;

        prev.click(function() {
            console.log(_this.showed_img)
            var index = parseInt(_this.showed_img.attr('data-index')),
                src = _this.data[index-1] ? _this.data[index-1].src : 0;
            if(src) {
                _this.showed_img.attr('src',src);
                _this.showed_img.attr('data-index', index-1);
            } else {
                alert('the first!');
            }
        });

        next.click(function() {
            var index = parseInt(_this.showed_img.attr('data-index')),
                src = _this.data[index+1] ? _this.data[index+1].src : 0;
            if(src) {
                _this.showed_img.attr('src',src);
                _this.showed_img.attr('data-index', index+1);
            } else {
                alert('the last!');
            }
        });
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
        "path": "http://photo2.fanfou.com/v1/mss_3d027b52ec5a4d589e68050845611e68/ff/n0/0b/z8/gp_308612.jpg@596w_1l.jpg",
        "name": "Sevenskey",
        "description": "http://sevenskey.github.io/",
        "status": 1
    }
];
var aImages = new Images();


$('.user_nav a').click(function() {
    var page = '#' + $(this).attr('data-page'),
        id = $(this).attr('id');
    $('.user_nav a').removeClass('active');
    $(this).addClass('active');
    pageControl.show(page, 300);

    if(id == 'image_link') {
        aImages.init(imgData);
    }

    return false;
});

