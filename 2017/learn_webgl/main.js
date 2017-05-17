/******* START *******/
var canvas = document.getElementById('glcanvas')
var width = canvas.width,
    height = canvas.height

var gl = canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' )

/*** init gl context ***/

// set clear color
gl.clearColor( 0.0, 0.0, 0.0, 1.0 )
// enable depth testing
gl.enable( gl.DEPTH_TEST )
// near things obscure far things
gl.depthFunc( gl.LEQUAL )
// clear color and depth buffer
gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT )

// resize the webgl context
gl.viewport(0, 0, canvas.width, canvas.height)

/******* CREATE 2D CONTENT *******/
var vertexPositionAttribute
var shaderProgram
var horizAspect = height / width
var squareVerticesBuffer

start()

function start () {
    initShaders()
    initBuffers()
    //setInterval( drawScene, 15 )
    drawScene()
}

function initShaders () {
    var fragmentShader = getShader( gl, 'shader-fs' ),
        vertexShader = getShader( gl, 'shader-vs' )

    // create shader progrem
    shaderProgram = gl.createProgram()
    // attach the two shaders to it
    gl.attachShader( shaderProgram, vertexShader )
    gl.attachShader( shaderProgram, fragmentShader )
    // link the shader program
    gl.linkProgram( shaderProgram )

    // check the LINK_STATUS parameter to sure the program linked successfully
    if ( !gl.getProgramParameter( shaderProgram, gl.LINK_STATUS ) )
        console.log( 'Unable to initialize the shader program: '
        + gl.getProgramInfoLog( shaderProgram ))

    gl.useProgram( shaderProgram )

    vertexPositionAttribute = gl.getAttribLocation( shaderProgram, 'aVertexPosition' )
    gl.enableVertexAttribArray( vertexPositionAttribute )
    vertexColorAttribute = gl.getAttribLocation( shaderProgram, 'aVertexColor' )
    gl.enableVertexAttribArray( vertexColorAttribute )
}

// create a shader
function getShader ( gl, id, type ) {
    var shaderScript, theSource, currentChild, shader

    shaderScript = document.getElementById( id )

    if ( !shaderScript )
        return null
    theSource = shaderScript.text

    if ( !type ) {
        if ( shaderScript.type === 'x-shader/x-fragment' ) {
            type = gl.FRAGMENT_SHADER
        } else if ( shaderScript.type = 'x-shader/x-vertex' ) {
            type = gl.VERTEX_SHADER
        } else {
            // unknown shader type
            return null
        }
    }

    shader = gl.createShader( type )
    gl.shaderSource( shader, theSource )

    // compile the shader program
    gl.compileShader( shader )

    // see if it compiled successfully
    if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {
        console.log( 'An error occurred ccompiling the shaders:' 
        + gl.getShaderInfoLog( shader ) )
        gl.deleteShader( shader )
        return null
    }

    return shader
}


function initBuffers () {

    var vertices = [
        1.0, 1.0, 0.0,
        -1.0, 1.0, 0.0,
        1.0, -1.0, 0.0,
        -1.0, -1.0, 0.0,
    ]

    squareVerticesBuffer = gl.createBuffer()
    gl.bindBuffer( gl.ARRAY_BUFFER, squareVerticesBuffer )
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW )

    var colors = [
        1.0, 1.0, 1.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
    ]

    squareVerticesColorBuffer = gl.createBuffer()
    gl.bindBuffer( gl.ARRAY_BUFFER, squareVerticesColorBuffer )
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( colors ), gl.STATIC_DRAW )
}

function drawScene () {
    //gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT )

    perspectiveMatrix = makePerspective( 45, width / height, 0.1, 100.0 )
    loadIdentity()
    mvTranslate( [-0.0, 0.0, -6.0] )

    gl.bindBuffer( gl.ARRAY_BUFFER, squareVerticesBuffer )
    gl.vertexAttribPointer( vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0 )
    setMatrixUniforms()

    gl.bindBuffer( gl.ARRAY_BUFFER, squareVerticesColorBuffer )
    gl.vertexAttribPointer( vertexColorAttribute, 4, gl.FLOAT, false, 0, 0 )
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 )
}

function loadIdentity () {
    mvMatrix = Matrix.I( 4 )
}
function multMatrix ( m ) {
    mvMatrix = mvMatrix.x( m )
}
function mvTranslate( v ) {
    multMatrix( Matrix.Translation( $V( [ v[0], v[1], v[2] ] ) ).ensure4x4() )
}
function setMatrixUniforms() {
    var pUniform = gl.getUniformLocation( shaderProgram, 'uPMatrix' )
    gl.uniformMatrix4fv( pUniform, false, new Float32Array( perspectiveMatrix.flatten() ) )
    var mvUniform = gl.getUniformLocation( shaderProgram, 'uMVMatrix' )
    gl.uniformMatrix4fv( mvUniform, false, new Float32Array( mvMatrix.flatten() ) )
}
