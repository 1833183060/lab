var test = {
    _protect : 42
};
Object.defineProperty(test, 'protect', {
    get : function() {
        console.log('get');
        return this._protect;
    },
    set : function( value ) {
        console.log('set');
        this._protect = value;
    },
    configurable : true
});

;(function(){

    // When initialize, the Vue instance creates a property that points original object, and creates some cognominal properties with setters and getters to bind the original properties and the properties of the forward objec at the same time, they don't have physical value.

    var data = {
        numbers : [1,1,1,1,1,1,1],
        one : 2,
        seen : true,
        watchtest : '',
        red : true,
        inputValue : 'init',
        checkedValues : []
    };

    // Global registration. And this registration must be registed before instantition.
    Vue.component( 'component-test', {
        template : '<h1>This is a global component!</h1>'
    } );

    var vm = new Vue({
        el : '#test_ele',

        data : data,

        // Vue create a cognominal property on the instance and store the result in it. Every time the function is executed the action will be executed again, namely update the value. 
        // A computed property will re-evaluate when some of its dependencies have changed.
        // Now I can't make guesses to its implementation.
        computed : {
            random : function(){
                // Its dependence data.numbers changed when button is clicked.
                this.numbers;
                console.log( 'I\'m computed.random!' );
                return Math.random();
            }
        },

        // Maybe once the data is modified the functions in filters which be invoked in mustache must be executed, and so computed does.
        filters : {
            getOne : function ( value ) {
                console.log( 'I\'m filters.getOne!' );
                if ( value == 1 )
                    return value;
                else
                    return '';
            }
        },
 
        //The functions in methods can be used on the sub element of el, but the functions in data can only be used on el
        methods : {
            click : function(){
                console.log( 'I\'m methods.click!' );
                this.numbers.shift();
                console.log(this.numbers);
                this.$data.one = 1;
            },
            inputChange : function() {
                console.log( this.inputValue );
            },
            submit : function() {
                console.log( 'I\'m methods.submit!' )
            }
        },

        // Binded with a data's property, and listening its change.
        watch : {
            watchtest : function ( arg ) {
                console.log( 'I\'m watch.watchtest!' );
                console.log( this.watchtest );
            },
        },

        // This is a local component registration.
        components : {
            'another-component-test' : {
                props : ['reciveMsg'],
                template : '<h1>{{reciveMsg}}</h1>'
            }
        }
    });


    // Some tests below.

    console.log( vm.numbers );
    console.log( vm.$data.numbers )

    vm.b = 3;

    vm.$data.c = 5;

    console.log( data )
    console.log(vm.random)


    // The instance properties and methods are prefixed with $ to differentiate them from proxied data properties.
    
    console.log( vm.$data )
    console.log(vm)

})()
