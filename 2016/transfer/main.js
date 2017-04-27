// 这是一个选择器插件，类似这样：
// |title1     |   |title1    |
// |  content1 |   |  content2|
// |||content2|| > |          |
// |title2     | <
// |  content1 |
// 
// 还未实现的似乎是树的重构？
// 天哪我真的忘了。。为什么我没写注释呢。。。。
// 2017-2-14

;(function() {
    const config = {
        dataMode : 'separation', // or 'non-separation'
        data : {
            class0 : [ 'data0', 'data1' ],
            class1 : [ 'data2', 'data3' ]
        },
        dataDomDef : {
            className : [ 'the_class', 'the_content' ],
            tagName : 'li'
        },
        domStructure : {
            main : 'sev_transfer',
            selectable : 'selectable',
            selected : 'selected',
            addBtn : 'addBtn',
            removeBtn : 'removeBtn',
            saveBtn : 'saveBtn' // optional
        }
    };

    const defaultConfig = {

    };

    class SevTransfer {
        constructor ( config ) {
            if ( config.dataMode == 'separation' )
                new DataDeployer ( config.data, config.dataDomDef || defaultConfig.dataDomDef, config.domStructure.selectable );
            else if ( config.dataMode == 'non-separation' )
                new DataDetacher ( config.dataDomDef, config.domStructure.selectable );
            else
                throw ( new Error ( 'Incorrect data mode.' ) );
        }
    }

    class DataDeployer {
        constructor ( data, dataDomDef, selectableArea ) {
            this.data = data;

            this.tagName = dataDomDef.tagName;
            this.contentClassName = dataDomDef.className[ dataDomDef.className.length - 1 ];
            this.titleClassName = dataDomDef.className.slice ( 0, dataDomDef.className.length - 1 );
            this.selectableArea = toObj ( selectableArea );
        }

        parse ( data, i ) {
            if ( isArray ( data ) )
                data.forEach( content => {
                    this.generateNode ( this.contentClassName, content );
                } );
            else
                for ( item in data ) {
                    generateNode ( this.titleClassName[i], item );
                    this.parse ( data[item], ++i );
                }
        }

        generateNode ( className, content ) {
            new ElementHandle ()
                .new( this.tagName, content )
                .addClass( className )
                .insertTo( this.selectableArea );
        }
    }

    class DataDetacher {
        constructor ( dataDomDef, selectableArea ) {
            this.data = {};
            this.contentClassName = dataDomDef.className[ dataDomDef.className.length - 1 ];
            this.titleClassName = dataDomDef.className.slice ( 0, dataDomDef.className.length - 1 );
            this.selectableArea = toObj ( selectableArea );
            this.dataSet = new ElementSelector ( this.selectableArea ).child();
            this.stack = new Stack();
        }

        detach ( i,  ) {
            var theEle = new ElementHandle ( this.dataSet[i] );
            var theClass = theEle.attr('class'),
                theContent = theEle.text();
            if ( theClass )
        }

        //init () {
        //    this.stack.push ( this.data );

        //    new ElementSelector ( this.selectableArea )
        //        .child ( ele => {
        //            ele = new ElementHandle ( ele );
        //            this.detach ( ele.attr ( 'class' ), ele.text () );
        //        } );
        //}

        //detach ( className, content ) {
        //    if ( isInclude ( className, this.contentClassName ) )
        //        this.stack.top().push( content );
        //    else if ( isInclude ( className, this.titleClassName[ this.titleClassName.length - 1 ] ) )
        //        this.stack.push ( this.stack.top()[content] = [] );
        //    else
        //}

        //trimStack () {
        //}
    }


    class ElementSelector {
        constructor ( stringOrObj ) {
            this.obj = typeof stringOrObj == 'string' ? this.getObj( stringOrObj ) : stringOrObj;
        }

        getObj ( string ) {
            return string;
        }

        child ( callback ) {
            if ( ! callback )
                return this.obj.childNodes;
            else 
                Array.prototype.slice.call ( this.obj.childNodes, 0 ).forEach ( callback ( ele ) );
        }
    }

    class ElementHandle {
        constructor ( ele ) {
            this.ele = ele;
        }

        new ( tagName, content ) {
            var contentNode = content ? document.createTextNode ( content ) : null;
            this.ele = document.createElement ( tagName );

            if ( contentNode )
                this.ele.appendChild ( contentNode );

            return this.ele;
        }

        addClass () {
            var classNameArr = Array.prototype.slice.call ( arguments, 0 );
            
            classNameArr.forEach( className => {
                this.ele.className += ' ' + className;
            } );

            return this.ele;
        }

        attr ( attrName, content ) {
            if ( content != undefined ) {
                this.ele.setAttribute ( attrName, content );
                return this.ele;
            } else {
                return this.ele.getAttribute ( attrName );
            }
        }

        insertTo ( parentEle ) {
            parentEle.appendChild ( this.ele );

            return this.ele;
        }

        text ( newText ) {
            if ( newText != undefined ) {
                this.ele.innerHTML = newText;
                return this.ele;
            } else {
                return this.ele.innerHTML;
            }
        }
    }

    class Stack {
        constructor () {
            this.data = [];
        }

        push ( ele ) {
            return this.data.push ( ele );
        }

        pop () {
            return this.data.pop ();
        }

        top () {
            return this.data[ this.data.length - 1 ];
        }
    }

    function isArray ( obj ) {
        return Object.prototype.toString.call ( obj ) == '[object Array]';
    }
    function toObj ( ele ) {
        return typeof ele == 'obj' ? ele : document.getElementById(ele);
    }
    function isInclude ( classes, aclass ) {
        var classArr = classes.split (' ');
        for ( var i = 0; i < classArr.length; i++ )
            if ( classArr[i] === aclass )
                return true;
        return false;
    }

    window.SevTransfer = SevTransfer;
    new SevTransfer ( config );
})()
