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



****/

function Images() {
    this.data = '';
    this.images = $('#images');
    this.layer = $('#layer');
    this.showed_img = $('#layer #showed_img');

    this.hash = new Hash();

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
        var i;

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
    },
    readHash: function(url) {
        this.hash.read(request, this, url, this.init, imgData);
    }
}


function Blog() {
    this.data = '';
    this.blog = $('#blog');
    this.blog_main = $('#blog_main');
    this.cid = '';

    this.prev = $('#blog #prev_b');
    this.next = $('#blog #next_b');

    this.hash = new Hash();
    this.PREFIX = 'blog';

    this.model = '<div class="blog_header"><h1 id="article_title"></h1><span id="article_time"></span></div><div id="article_content" class="blog_content"></div>';
}
Blog.prototype = {
    constructor: Blog,
    init: function(data) {
        this.blog_main.html(this.model);

        this.prev.unbind('click');
        this.next.unbind('click');

        this.showArticle(data);
        this.changeArticle();
    },
    readHash: function(url) {
        this.hash.read(request, this, url, this.init, blogData)
    },
    showArticle: function(data) {
        this.data = data[0];

        var date = new Date(parseInt(this.data.time) * 1000),
            time = date.getFullYear() + '/' + (date.getMonth() + 1)+ '/' + date.getDate();

        this.cid = this.data.column_id;

        this.blog_main.find('#article_title').html(this.data.title);
        this.blog_main.find('#article_time').html(time);
        this.blog_main.find('#article_content').html(this.data.content);
        this.blog_main.attr('data-id', this.data.id);

        this.hash.change(this.PREFIX, this.data.column_id, this.data.id);

    },
    changeArticle: function() {
        var _this = this;
        var data;

        this.prev.click(function() {
            var id = parseInt(_this.blog_main.attr('data-id')) - 1;

            data = {
                "column_id": _this.cid,
                "id": id.toString(),
                "btn": -1
            }
            /*** ajax ***/
            request(_this, blogRequestURL, data, _this.showArticle, blogData2)
        });

        this.next.click(function() {
            var id = parseInt(_this.blog_main.attr('data-id')) + 1;

            data = {
                "column_id": _this.cid,
                "id": id.toString(),
                "btn": 1
            }
            /*** ajax ***/
            request(_this, blogRequestURL, data, _this.showArticle, blogData3)
        });
    },
    warning: function() {

    }
}


function Index() {
    this.data = '';
    this.item_group = $('#index #item_group');

    this.config = {
            auto: true,
            speed: 7000 
        };

    this.hash = new Hash();

    this.model = '<div class="vp_item"><a class="vp_link" href=""><img class="vp_img" src="./img/code.png"></a><div class="vp_words"><h1 class="vp_title">This is the first picture.</h1><p class="vp_desc">This is a paragraph.</p></div></div>';
}
Index.prototype = {
    constructor: Index,
    init: function(data) {
        this.data = data;

        if(this.item_group.find('.vp_item').length == 0) {

            for(var i=0; i<this.data.length; i++) {
                this.item_group.append(this.model);
            }

            this.showImage();
            this.launch(this.config);
        }

    },
    readHash: function(url) {
        this.hash.read(request, this, url, this.init, indexData)
    },
    showImage: function() {
        var data = this.data;
        var i;

        i=0;
        this.item_group.find('.vp_img').each(function() {
            $(this).attr('src', data[i++].path);
        });

        i=0;
        this.item_group.find('.vp_title').each(function() {
            $(this).html(data[i++].name);
        });

        i=0;
        this.item_group.find('.vp_desc').each(function() {
            $(this).html(data[i++].description);
        });

        i=0;
        this.item_group.find('.vp_link').each(function() {
            if(data[i++].link != '') {
                $(this).attr('herf', data[i].link);
            } else {
                $(this).attr('herf', '#');
            }
        })
    },
    launch: function(config) {
        $().viewpager(config);
    }
}


function Hash() {
    this.cid = '';
    this.id = '';
    this.lo = window.location;
    this.CONNECTER = '-';
}
Hash.prototype = {
    constructor: Hash,
    change: function(prefix, cid, id) {
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
    read: function(callback, _this, url, callback2, jiadata) {
        var hash = this.lo.hash.replace(/#/g, '');
        var idArr = hash.split(this.CONNECTER);
        console.log(hash)

        var cid = idArr[0],
            id = idArr[1];

        var data;

        if(id) {
            data = {
                column_id: cid,
                id: id
            };
            console.log('cid-id')
            callback(_this, url, data, callback2, jiadata);

        } else if (cid != '') {
            data = {gid: cid};
            console.log('cid')
            callback(_this, url, data, callback2, jiadata);

        } else if(cid == '') {
            callback(_this, url, {}, callback2, jiadata);
        }

    }
}


function Nav() {
    this.data = '';
}
Nav.prototype = {
    constructor: Nav,
    init: function(data) {
        this.data = data;

        this.show();
    },
    show: function() {
        var data = this.data;
        
        
    }
}


function request(_this, url, data, callback, jiadata) {

    var request = $.ajax({
        url: url,
        method: "POST",
        data: data,
        dataType: "json"
    });

    request.success(function(data) {
        if(data == 0) {
            ifError();
        } else {

            callback.call(_this, data);
        }
    });

    request.error(function(jqXHR, textStatus) {
        callback.call(_this, jiadata);
        throw new Error('Request failed! This is the test data.');
    });
}

function initSite() {
    var hash = window.location.hash
    var pageClass = hash.replace(/#|\d*|-*/g, ''),
        cid = hash.replace(/#|-.|\D/g, ''),
        id = hash.replace(/#\w*-?|[^\d*]/g, '');


    var a = $('.user_nav a[href=#'+cid+']');

    if (pageClass == 'index' && pageClass == '') {
        cid = '';
    } 
    a.trigger('click');

    if(id != '') {
        window.location.hash = 'blog' + cid + '-' + id;
    }
}

function ifError() {
    alert('404');
}


var aImages = new Images(),
    aBlog = new Blog(),
    aHash = new Hash(),
    aIndex = new Index();

var imgRequestURL = '/Design/ajaxGetGalleryList',
    blogRequestURL = '/Design/ajaxGetOneBlog',
    indexRequestURL = '/Design/ajaxGetIndexPic';


$('.user_nav a').click(function() {
    var page = $(this).attr('data-page');

    $('.user_nav a').removeClass('active');
    $(this).addClass('active');
    pageControl.show('#'+page, 300);

    aHash.change(page, $(this).attr('href').replace(/#/g, ''))

    if(page == 'images') {

        aImages.readHash(imgRequestURL);

    } else if(page == 'blog') {

        aBlog.readHash(blogRequestURL);

    } else if(page == 'index') {
        aIndex.readHash(indexRequestURL);
    }


    return false;
});

initSite();