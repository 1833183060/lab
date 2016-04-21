
    $('.user_nav a').click(function() {
        var page = '#' + $(this).attr('data-page'),
            id = $(this).attr('id');
        pageControl.show(page, 300);

        //setTimeout(function() {
            if(id == 'image_link') {
                resetImg();
            }
        //},500);


        return false;
    });

    $('.img_item').click(function() {
        $('#layer').css('display', 'table');
    });

    $('#layer').click(function() {
        $(this).hide();
    })



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

function resetImg() {

    var img_item = $('.img_item'),
        a = img_item.width() / img_item.height();
    $('.img_item .img_self').each(function() {
        if($(this).width() / $(this).height() > a) {
            $(this).addClass('img_b');
        } else {
            $(this).addClass('img_a');
        }
    });
}


;(function() {
    /****
    [
        {
            "index": 0,
            "src": "",
            "title": "",
            "desc": ""
        }
    ]
    ****/

    function Images(data) {
        this.data = data;
        this.model = ''
    }

    Images.prototype = {
        constructor: Images,
        showImage: function() {

        },
        launchLayer: function() {

        },
        changeImage: function() {

        }
    }
})()