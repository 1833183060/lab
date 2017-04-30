// reObjec.test( undefined ) == true
// WTF???

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


class Parser {
    constructor () {
    }
}

module.exports = {
    Tokenizer,
    Parser,
}
