class Test {
    constructor ( {
        a = 1,
        b = 2
    }, c) {
        console.log(a, b, c);
    }
    aMethod () {
        console.log('I\'m a method');
    }
}

Test.property1 = 1;

new Test ({
    a : 0
})
