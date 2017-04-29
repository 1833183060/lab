;( function() {
    // reObjec.test( undefined ) == true
    // WTF???

    const tokenDefine = {
        NUMBER : {
            re : /\d/,
            type : 'number',
            // 左闭右开
            option ( r, p ) {
                let c = r[ p.i ];
                while ( this.re.test( c ) && (c = r[ ++p.i ]) ) ;
            },
        },
        WHITESPACE : {
            re : /\s/,
            option ( r, p ) {
                let c = r[ p.i ];
                while ( this.re.test( c ) && (c = r[ ++p.i ]) ) ;
            },
        },
        LParenthesis : {
            re : /\(/,
            type : 'paren',
            option ( r, p ) {
                p.i++;
            },
        },
        RParenthesis : {
            re : /\)/,
            type : 'paren',
            option ( r, p ) {
                p.i++;
            },
        },
        LETTER : {
            re : /[a-z]/i,
            type : 'name',
            option ( r, p ) {
                let c = r[ p.i ];
                while ( this.re.test( c ) && (c = r[ ++p.i ]) ) ;
            },
        },
        QM : {
            re : /"/,
            type : 'string',
            option ( r, p ) {
                while ( ! this.re.test( r[ ++p.i ] ) ) ;
                p.i++;
                p.bi++;
                p.ei = p.i - 1;
            },
        }
    };

    class Tokenizer {
        constructor ( {
            tokenDefine,
            raw,
        } ) {
            this.td = tokenDefine;
            this.r = raw;

            this.t = []; // tokens array

            this.genTokens();
            console.log( this.t );
        }

        genTokens () {
            // begin index, end index, index, current status
            let p = { bi : 0, ei : 0, i : 0, cs : null };
            let value;

            for ( p.i = 0; p.i < this.r.length; ) {
                value = this.cut( p );
                if ( p.cs != undefined )
                    this.t.push( {
                        type : p.cs,
                        value : value,
                    } );
            }
        }

        cut ( p ) {
            p.bi = p.i;
            p.ei = null; // 清除右边界索引

            let flag = 0;

            for ( var item in this.td ) {
                // 从中改变右边界索引
                // 左闭右开
                if ( this.td[item].re.test( this.r[ p.i ] ) ) {
                    this.td[item].option( this.r, p );
                    p.cs = this.td[item].type;
                    break;
                }
                flag++;
            }

            if ( flag == Object.keys( this.td ).length ) {
                throwError( this.r.slice( p.i-5, p.i+6 ) );
            }

            let begin = p.bi;
            let end = p.ei || p.i;

            return this.r.slice( begin, end );
        }
    }

    // 错误处理
    function throwError ( e ) {
        let s = '~~~~~^';
        throw new Error( '\n' + e  + '\n' + s);
    }

    let testCode = '1 "www"a abc 11    \n "\n"()';

    new Tokenizer( {
        tokenDefine : tokenDefine,
        raw : testCode,
    } )

    class Parser {
        constructor () {
        }
    }
} )()
