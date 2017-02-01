// Animation Group
// Written by Sun
// 2017-2-1
//
// Format:
//{
    //id : [status1, status2]
//}


;(function( window ){

    class AnimationGroup {
        constructor ({
            prev = null,
            next = null,
            transition = '',
        }) {
            this.prev = prev;
            this.next = next;
            this.transition = transition;

            this.isMounted = false;
            this.isRollbacked = false;

            this.genObjList();
            this.mountPrevStyle();
            this.mountTransition();
            this.backupOldStyle();
        }

        genObjList () {
            this.objList = {};

            for ( var el in this.next )
                this.objList[el] = document.getElementById(el);
        }

        mountTransition () {
            for ( var el in this.next )
                if ( this.next[el].transition )
                    this.objList[el].style.transition = this.next[el].transition;
                else if ( this.transition )
                    this.objList[el].style.transition = this.transition;
        }

        mountStyle ( styleSet ) {
            var style, obj;

            if ( styleSet )
                for ( var el in styleSet ) {
                    style = styleSet[el];
                    obj = this.objList[el];

                    console.log( style )

                    for ( var property in style )
                        obj.style[property] = style[property];
                }
        }

        mountPrevStyle () {
            this.mountStyle( this.prev );
        }

        mountNextStyle () {
            if ( ! this.isMounted )
                this.mountStyle( this.next );

            this.isMounted = true;
            this.isRollbacked = false;
        }

        backupOldStyle () {
            var temp;
            this.oldStyle = {};

            Object.keys( this.next ).forEach( ( tagName ) => {
                temp = this.oldStyle[tagName] = {};

                Object.keys( this.next[tagName] ).forEach( ( property ) => {
                    if ( property != 'transition' )
                        temp[property] = getComputedStyle( this.objList[tagName], null ).getPropertyValue( property );
                } );
            } );
        }

        rollback () {
            if ( ! this.isRollbacked )
                this.mountStyle( this.oldStyle );

            this.isMounted = false;
            this.isRollbacked = true;
        }
    }

    window.AnimationGroup = AnimationGroup;

})( window )
