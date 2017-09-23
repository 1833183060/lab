;(function() {
    /* Test */
    let testProgram = '(begin (define r 10) (* pi (* r r)))'
    console.log(parse(testProgram))

    /* Main */
    const Env = Object
    function parse(program) {
        return read_from_tokens(tokenize(program))
    }
    function tokenize(program) {
        return program.replace(/\(/g, ' ( ').replace(/\)/g, ' ) ').split(' ')
    }
    function read_from_tokens(tokens) {
        if (tokens.length === 0) {
            throw new Error('unexpected EOF while reading')
        }
        let token = tokens.shift()
        while (token === '') {
            token = tokens.shift()
        }
        if ('(' === token) {
            let L = []
            while (tokens[0] !== ')') {
                L.push(read_from_tokens(tokens))
                while (tokens[0] === '') {
                    tokens.shift()
                }
            }
            tokens.shift()
            return L
        } else if (')' === token) {
            throw new Error('unexpected )')
        } else {
            return atom(token)
        }
    }
    function atom(token) {
        let temp = parseInt(token)
        if (isNaN(temp)) {   
            return token
        } else if (token - temp === 0) {
            return temp
        } else {
            return parseFloat(token)
        }
    }

})()
