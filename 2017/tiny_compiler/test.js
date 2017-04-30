const {
    Tokenizer,
    Parser,
} = require( './main.js' );

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
let testCode = '1 "www"a abc 11    \n "\n"()';

new Tokenizer( {
    tokenDefine : tokenDefine,
    raw : testCode,
} )

