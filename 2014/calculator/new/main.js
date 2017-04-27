;(function() {
    'use strict';

    var testexp = '42*(8.1-sin(1+2)-3!^2+42*(2+4))';

    var symbolTable = {
        'sin': {
            t: 1,
            p: 4,
            f: function( a ) {
                return Math.sin( a );
            }
        },
        '!': {
            t: 1,
            p: 3,
            f: function( a ) {
                var r = 1;
                for( var i=1; i<=a; i++ )
                    r *= i;
                return r;
            }
        },
        '+': {
            t: 2, // type
            p: 1,  // priority
            f: function( a, b ) {
                return a + b;
            }
        },
        '-': {
            t: 2,
            p: 1,
            f: function( a, b ) {
                return b - a;
            }
        },
        '*': {
            t: 2,
            p: 2,
            f: function( a, b ) {
                return a * b;
            }
        },
        '/': {
            t: 2,
            p: 2,
            f: function( a, b ) {
                return b / a;
            }
        },
        '^': {
            t: 2,
            p: 3,
            f: function( a, b ) {
                return Math.pow( b, a );
            }
        },
        '(': {
            t: 0,
            p: 0
        },
        ')': {
            t: 0,
            p: 0
        }
    }

    function Resolver( symbolTable ) {
        this.table = symbolTable;
        this.postfixExp = new Queue();
        this.sStack = new Stack();
        this.activeStack = new Stack();
    }
    Resolver.prototype = {
        constructor: Resolver,

        generateReg: function() {
            var symbolArr = Object.keys( this.table ),
                objReg = '(\\.+\\d*)|(\\d+\\.*\\d*)|(',
                re = '!%^*/-+()@#$&~?\'';

            for( var i=0; i<symbolArr.length; i++ ) {
                if( re.indexOf( symbolArr[i] ) != -1 )
                    objReg += '\\' + symbolArr[i] + '|';
                else
                    objReg += symbolArr[i] + '|';
            }
            objReg = objReg.slice( 0, -1 );
            objReg += ')';

            return objReg;
        },

        preproccess: function( exp ) { // the preproccession of expression, namely from string to array
            exp = exp.replace( ' ', '' );
            var re = new RegExp( this.generateReg(), 'g' );
            
            return exp.match( re );
        },

        toPostfixExp: function( exp ) { // switch nifix expression to postfix expression
            var buffer = this.preproccess( exp );
            
            for( var i=0; i<buffer.length; i++ ) {
                switch ( true ) {
                    case ! isNaN( buffer[i] ) : // is a number, then put it into queue
                        this.postfixExp.add( buffer[i] );
                        break;
                    case buffer[i] == '(' : // is a left bracket, then push the active stack into a stack, and make a new stack be the active stack
                        this.sStack.push( this.activeStack );
                        this.activeStack = new Stack();
                        break;
                    case buffer[i] == ')' : //is a right bracket, then empty the active stack and make the element in the top of the stack that stores a number of stacks be the active stack
                        while( this.activeStack.peek() )
                            this.postfixExp.add( this.activeStack.pop() );
                        this.activeStack = this.sStack.pop();
                        break;
                    case ! this.activeStack.length || this.table[ this.activeStack.peek() ].p < this.table[ buffer[i] ].p : // the active stack is empty or the priority of the current symbol is higher than last one, then push the current symbol into the active stack
                        this.activeStack.push( buffer[i] );
                        break;
                    default: // if not above all, then put the element of the top of active stack into the queue, and push the current symbol into the active stack
                        while( this.activeStack.peek() && this.table[ this.activeStack.peek() ].p >= this.table[ buffer[i] ].p )
                            this.postfixExp.add( this.activeStack.pop() );
                        this.activeStack.push( buffer[i] );
                }
            }

            while( this.activeStack.peek() )
                this.postfixExp.add( this.activeStack.pop() );

        },
        
        evaluate: function( exp ) { // expression evaluation
            this.toPostfixExp( exp );

            var cEle,
                buffer = [];

            while( cEle = this.postfixExp.poll() ) {
                if( ! isNaN( cEle ) )
                    this.activeStack.push( parseFloat( cEle ) );
                else {
                    for( var i=0; i<this.table[ cEle ].t; i++ )
                        buffer.push( this.activeStack.pop() );
                    this.activeStack.push( this.table[ cEle ].f.apply( this, buffer ) );
                    buffer = [];
                }
            }

            return this.activeStack.pop();
        }
    }

    function Stack() {
        this.data = [];
        this.length = 0;
    }
    Stack.prototype = {
        constructor: Stack,

        push: function( ele ) {
            this.length++;
            return this.data.push( ele );
        },

        pop: function() {
            if( this.length ) {
                this.length--;
                return this.data.pop();
            } else {
                return null;
            }
        },

        peek: function() {
            if( this.length )
                return this.data[ this.length - 1 ];
            else 
                return null;
        },
        empty: function() {
            this.data = [];
        }
    }
    
    function Queue() {
        this.data = [];
        this.length = 0;
    }
    Queue.prototype = {
        constructor: Queue,

        add: function( ele ) {
            this.length++;
            return this.data.push( ele );
        },

        poll: function() {
            if( this.length ) {
                this.length--;
                return this.data.shift();
            } else {
                return null;
            }
        },

        peek: function() {
            if( this.length )
                return this.data[0];
            else 
                return null;
        }
    }

    function Calculator( buttonArea, expArea, resultArea ) {
        this.buttonArea = buttonArea;
        this.expArea = expArea;
        this.resultArea = resultArea;

        this.initInterface();
        this.exp = '';
        this.resolver = new Resolver( symbolTable );
        this.result = null;
    }
    Calculator.prototype = {
        constructor: Calculator,

        initInterface: function() {
            buttonArea.addEventListener( 'click', function(e) {
                if( e.target && e.target.nodeName.toLowerCase() == 'button' ){
                    var value = e.target.getAttribute( 'value' );
                    this.makeupExp( value );
                }
            }.bind(this) );
        },

        makeupExp: function( str ) {

            // fu*k your uncle
        },

        display: function( str, num ) {
            this.exp += str;
            this.expArea.innerHTML = num || this.exp;
        }
    }

    //console.log( new Resolver( symbolTable ).evaluate( testexp ) );
    var buttonArea = document.getElementById('buttonArea'),
        expArea = document.getElementById('exp'),
        resultArea = document.getElementById('result');

    new Calculator( buttonArea, expArea, resultArea );

})()
