// User Feedback
// Dependency: js/tools.js/getData
// Written by Sun
// 2017-1-24

// Format:
//[
    //{
        //"avatar" : "img src",
        //"identity" : "",
        //"content" : "",
        //"position" : 0
    //}
//]


;(function( window ) {

    class UserFeedback {
        constructor ( {
            url = null,
            el = '#user_feedback'

        }, Vue ) {
            this.Vue = Vue;
            this.el = el;

            getData({
                url : url,
            }, ( data ) => {
                this.data = data;
                this.generate();
            });
        }

        generate () {
            const self = this;

            new self.Vue( {
                el : self.el,

                data : {
                    items : self.data
                }
            } );

        }
    }

    window.UserFeedback = UserFeedback;

})( window )
