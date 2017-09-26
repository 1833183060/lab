;(function() {
    /*** Main ***/
    const Env = Object

    /* Type Defination */
    class Meta {
        constructor (value) {
            this.value = value
        }
    }
    class Sym extends Meta {
        constructor (value) {
            super(value)
        }
    }

    /* Abstraction Syntax Tree */
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
            return new Sym(token)
        } else if (token - temp === 0) {
            return temp
        } else {
            return parseFloat(token)
        }
    }

    /* Environments */
    function standard_env() {
        let env = new Env()
        Env.assign(env, {
            'abs': Math.abs,
            'max': Math.max,
            'min': Math.min,
            'PI': Math.PI,
            'round': Math.round,
            'floor': Math.floor,
            'ceil': Math.ceil,
            '+': (x, y) => x + y,
            '-': (x, y) => x - y,
            '*': (x, y) => x * y,
            '/': (x, y) => x / y,
            '>': (x, y) => x > y,
            '<': (x, y) => x < y,
            '>=': (x, y) => x >= y,
            '<=': (x, y) => x <= y,
            '=': (x, y) => x == y,
            'car': x => x[0],
            'cdr': x => x.slice(1),
            'cons': (x, y) => [x].push(y),
            'eq?': (x, y) => x === y,
            'length': x => x.length,
            'list?': x => x instanceof Array,
            'not': x => ! x,
            'null?': x => x instanceof Array && x.length == 0,
            'number?': x => x instanceof Number,
            'begin': function(){ return Array.prototype.slice(arguments, 1) }
            // begin, append, apply, equal?, list, map, procedure?, symbol?
        })
        return env
    }
    global_env = standard_env()

    function eval(x, env=global_env) {
        if (x instanceof Sym) {
            return env[x.value]
        } else if (! (x instanceof Array)) {
            return x
        } else if (x[0].value == 'if') {
            [sym, test, conseq, alt] = x
            let exp = (eval(test, env) ? conseq : alt)
            return eval(exp, env)
        } else if (x[0].value == 'define') {
            [sym, vari, exp] = x
            env[vari.value] = eval(exp, env)
        } else {
            let proc = eval(x[0], env)
            let args = []
            x.slice(1).forEach(function(arg) {
                args.push(eval(arg, env))
            })
            return proc.apply(this, args)
        }
    }

    /*** Test ***/
    let testProgram = '(begin (define r 10) (* pi (* r r)))'
    //console.log(parse(testProgram))

    eval(parse("(define r 10)"))
    console.log(eval(parse("(* PI (* r r))")))
    console.log(eval(parse('(if (> (* 11 11) 120) (* 7 6) oops)')))
})()
