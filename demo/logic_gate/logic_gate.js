;(function() {
    'use strict';

    class Wire {
        constructor () {
            this.seq = [ function() {} ];
            this._value = undefined; //( value > 0 ) ? 1 : 0;

            Object.defineProperty(this, 'value', {
                get: function() {
                    return this._value;
            },
                set: function(x) {
                    if( this._value != x ) {
                        this._value = x; 

                        for( var i=0; i<this.seq.length; i++ ) {
                            this.seq[i]();
                        }
                    }
            }});
        }
    }

    class Simulator {
        constructor () {
            this.agent = [];
        }
    }

    function GATE ( TYPE, INPUT, OUTPUT )  {
        var INPUT = INPUT instanceof Array ? INPUT : [INPUT],
            action = TYPE.apply(TYPE, INPUT.concat([OUTPUT]));

        action.p = TYPE.p;

        for ( var i=0; i<INPUT.length; i++ ) {
            INPUT[i].seq.forEach(function( currentVal, index, arr ) {
                if ( !(currentVal.p < action.p) ){
                    arr.splice( index, 0, action );
                } else {
                    arr.push( action );
                }
            });
        }
    }

    AND.p = 3;
    OR.p = 2;
    NOT.p = 1;
    XOR.p = 4;
    NOR.p = 5;

    function AND( I1, I2, O ) {
        return function AND() {
            O.value = I1.value & I2.value;
        }
    }
    function OR( I1, I2, O ) {
        return function() {
            O.value = I1.value | I2.value;
        }
    }
    function NOT( I, O ) {
        return function() {
            O.value = (! I.value ) ? 1 : 0;
            console.log()
        }
    }
    function XOR( I1, I2, O ) {
        return function() {
            O.value = I1.value ^ I2.value;
        }
    }
    function NOR( I1, I2, O ) {
        return function() {
            O.value = (! ( I1.value | I2.value ) ) ? 1 : 0;
        }
    }


    /* TEST */

    function halfAdder( a, b, s, cout ) {
        GATE( XOR, [a, b], s );
        GATE( AND, [a, b], cout );
    }

    function adder( a, b, cin, s, cout ) {
        const s1 = new Wire(),
            c1 = new Wire(),
            c2 = new Wire();

        halfAdder( b, cin, s1, c1 );
        halfAdder( a, s1, s, c2 );
        GATE( OR, [c1, c2], cout );
    }

    function fourBitAdder(a3, a2, a1, a0, b3, b2, b1, b0, o3, o2, o1, o0, cin, cout) {
        const co1 = new Wire(),
            co2 = new Wire(),
            co3 = new Wire();

        adder( a0, b0, cin, o0, co1 );
        adder( a1, b1, co1, o1, co2 );
        adder( a2, b2, co2, o2, co3 );
        adder( a3, b3, co3, o3, cout );
    }

    function D( DATA, CLK, Q, _Q ) {
        const _data = new Wire(),
            o1 = new Wire(),
            o2 = new Wire();

        GATE( NOT, [DATA], _data );
        GATE( AND, [_data, CLK], o1 );
        GATE( AND, [DATA, CLK], o2 );
        GATE( NOR, [o1, _Q], Q );
        GATE( NOR, [o2, Q], _Q );
    }

    const w = [];

    //4bit adder test
    //for(var i=0; i<14; i++) {
    //    w.push(new Wire());
    //}

    //fourBitAdder.apply(this, w);

    //for(i=0; i<8; i+=3) {
    //    w[i].value = 1;
    //}
    //console.log(w[13].value +' '+w[8].value+' '+w[9].value+' '+w[10].value+' '+w[11].value);
    

    //D trigger test
    for( var i=0; i<4; i++ )
        w.push( new Wire() );
    D.apply(this, w);
    w[1].value = 1;
    w[0].value = 0

    console.log( w[2].value );
    console.log( w[3].value )
    
    w[1].value = 0;
    w[0].value = 1;
    console.log( w[2].value );
    console.log( w[3].value )

    w[1].value = 1;
    w[0].value = 1;
    console.log( w[2].value );
    console.log( w[3].value )
})()
