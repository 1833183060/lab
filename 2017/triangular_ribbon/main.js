var ribbon = new TriangularRibbon({})
ribbon.updateWithoutAnimation()

function bindListener ( ribbon ) {
    var b = document.getElementsByTagName('body')[0]
    b.addEventListener( 'mousemove', function( e ) {
        ribbon.updateSinglePoint( e.x, e.y )
    }, false )
}

function updateRibbon ( e ) {
    eval(`
    ribbon.setEquation( function( x ) {
        return ${e}
    } )
        `)
    ribbon.updateWithAnimation()
}

document.getElementById('equation-input')
    .addEventListener( 'keyup', function( e ) {
        e.preventDefault()
        if ( e.keyCode == 13 ) 
            updateRibbon( this.value )
    } )
