// Animation Group
// Written by Sun
// 2017-2-1
//
// Compatibility:
// Array.isArray() - IE9
// getComputedStyle() - IE9
//
// New Format
// {
//   id1 : { style },
//   id2 : ['class1', 'class2']
// }
// 可以接受style和class

// Todo: 处理display: none;的情况

;(function( window ){

    class AnimationGroup {
        constructor ({
            prev = null, // 变化前的样式。可选。一般在 prev 中配置 transition
            next = null, //
            transition = '', // 可在此配置默认的 transition 规则，即如果 prev 中找不到 transition 的配置则使用该配置。可选
        }) {
            this.prev = prev;
            this.next = next;
            this.transition = transition;

            this.isMounted = false;
            this.isRollbacked = false;

            this.init();
        }

        init () {
            if ( this.next ) {
                this.genObjList();
                this.separateNext();
                this.separatePrev();
                this.mountPrevStyle();
                this.mountTransition();
                this.backupOldStyle();
                this.backupOldClass();
            }
        }

        // 根据 next 生成待操作的对象的列表
        genObjList () {
            this.objList = {};

            for ( var el in this.next )
                this.objList[el] = document.getElementById(el);
        }

        // 挂载 transition
        mountTransition () {
            var obj, temp;

            for ( var el in this.next ) {
                obj = this.objList[el];

                if ( this.transition && ( getComputedStyle( obj, null ).getPropertyValue( 'transition' ) == 'all 0s ease 0s' ) )
                    obj.style.transition = this.transition;
            }
        }

        // 将样式和样式类分离为两个列表
        separate ( all, styleSet, classSet ) {
            if ( all )
                for ( var item in all ) {
                    if ( Array.isArray( all[item] ) )
                        classSet[item] = all[item];
                    else if ( typeof all[item] == 'object' )
                        styleSet[item] = all[item];
                }
        }

        // 分离 next 列表中的
        separateNext () {
            this.classSet = {};
            this.styleSet = {};

            this.separate( this.next, this.styleSet, this.classSet );
        }

        // 分离 prev 列表中的
        separatePrev () {
            this.classSetPrev = {};
            this.styleSetPrev = {};

            this.separate( this.prev, this.styleSetPrev, this.classSetPrev );
        }

        // 挂载样式类
        mountClass ( classSet, removed ) {
            var el, elem;

            for ( el in classSet ) {
                elem = this.objList[el];
                classSet[el].forEach( ( className ) => {
                    if ( elem.className.indexOf( className ) == -1 )
                        elem.className += ( ' ' + className );
                } );
            }

            if ( removed ) {
                for ( el in removed )
                    elem = this.objList[el];
                    removed[el].forEach( ( className ) => {
                        elem.className = elem.className.replace( className, '' );
                    } );
            }
        }

        // 挂载样式
        mountStyle ( styleSet ) {
            var style, obj;

            for ( var el in styleSet ) {
                style = styleSet[el];
                obj = this.objList[el];

                for ( var property in style )
                    obj.style[property] = style[property];
            }
        }

        // 挂载变化前的样式
        mountPrevStyle () {
            this.mountStyle( this.styleSetPrev );
            this.mountClass( this.classSetPrev );
        }

        // 变身！
        mountNextStyle () {
            if ( ! this.isMounted ) {
                this.mountStyle( this.styleSet );
                this.mountClass( this.classSet );
            }

            this.isMounted = true;
            this.isRollbacked = false;
        }

        // 备份旧的样式类
        
        backupOldClass () {
            var temp;
            this.oldClassSet = {};

            Object.keys( this.classSet ).forEach( (tagName) => {
                temp = this.oldClassSet[tagName] = [];
                var i = 0;

                this.classSet[tagName].forEach( (className) => {
                    temp[i++] = className;
                } );
            } );
        }

        // 备份旧的样式
        backupOldStyle () {
            var temp;
            this.oldStyleSet = {};

            Object.keys( this.styleSet ).forEach( ( tagName ) => {
                temp = this.oldStyleSet[tagName] = {};

                Object.keys( this.styleSet[tagName] ).forEach( ( property ) => {
                    if ( property != 'transition' )
                        temp[property] = getComputedStyle( this.objList[tagName], null ).getPropertyValue( property );
                } );
            } );
        }

        // 回滚！
        rollback () {
            if ( ! this.isRollbacked ) {
                this.mountStyle( this.oldStyleSet );
                this.mountClass( this.classSetPrev, this.classSet );
            }

            this.isMounted = false;
            this.isRollbacked = true;
        }
    }

    class AnimationStatusCtrl {
    }

    window.AnimationGroup = AnimationGroup;

})( window )
