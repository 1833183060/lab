var gl
var triangleVertexPositionBuffer
// model-view 矩阵
// 初始化为全零矩阵
var mvMatrix = mat4.create()
// 投影矩阵
var pMatrix = mat4.create()
var shaderProgram

var triangleVertexColorBuffer
var squareVertexColorBuffer

webglStart()

function webglStart () {
    // 使用 WebGL 在画布上画一个二维图形的一般步骤：
    // 1. 初始化着色器
    // 2. 初始化缓冲器
    // 3. 画
    var canvas = document.getElementById('glcanvas')

    initGL( canvas )
    initShaders()
    initBuffers()

    gl.clearColor( 0.0, 0.0, 0.0, 1.0 )
    gl.enable( gl.DEPTH_TEST )

    drawScene()
}

function initGL ( canvas ) {
    gl = canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' )
    gl.viewportWidth = canvas.width
    gl.viewportHeight = canvas.height
}

// 初始化着色器
function initShaders () {
    var fragmentShader = getShader( gl, 'shader-fs' )
    var vertexShader = getShader( gl, 'shader-vs' )

    shaderProgram = gl.createProgram()
    gl.attachShader( shaderProgram, vertexShader )
    gl.attachShader( shaderProgram, fragmentShader )
    gl.linkProgram( shaderProgram )

    if ( !gl.getProgramParameter( shaderProgram, gl.LINK_STATUS ) ) {
        console.log( 'Could not initialise shaders' )
    }
    // 一旦上面的设置和着色器绑定完成，便可以得到一个“attribute”
    // 然后将它储存在属性 vertexPositionAttribute 中
    // 这个自定义的属性在函数 drawScene 中被用到
    gl.useProgram( shaderProgram )
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation( shaderProgram, 'aVertexPosition' )
    // 告诉 WebGL 我们想用数组来向这个 attribute 提供值
    gl.enableVertexAttribArray( shaderProgram.vertexPositionAttribute )

    shaderProgram.vertexColorAttribute = gl.getAttribLocation( shaderProgram, 'aVertexColor' )
    gl.enableVertexAttribArray( shaderProgram.vertexColorAttribute )

    // uniform 变量
    // 为了方便储存在 program 对象的属性中
    shaderProgram.pMatrixUniform = gl.getUniformLocation( shaderProgram, 'uPMatrix' )
    shaderProgram.mvMatrixUniform = gl.getUniformLocation( shaderProgram, 'uMVMatrix' )
}

// 获取着色器
function getShader ( gl, id ) {
    // 获取着色器代码（字符串）
    var shaderScript = document.getElementById( id )
    if ( ! shaderScript ) {
        return null
    }
    var str = ''
    var k = shaderScript.firstChild
    while ( k ) {
        if ( k.nodeType === 3 )
            str += k.textContent
        k = k.nextSibling
    }

    // 根据着色器类型创建对应的着色器容器
    var shader
    if ( shaderScript.type === 'x-shader/x-fragment')
        shader = gl.createShader( gl.FRAGMENT_SHADER )
    else if ( shaderScript.type === 'x-shader/x-vertex' )
        shader = gl.createShader( gl.VERTEX_SHADER )
    else
        return null

    // 将着色器代码装入容器
    gl.shaderSource( shader, str )
    // 编译着色器
    gl.compileShader( shader )

    // 检查着色器是否编译成功
    if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {
        console.log( gl.getShaderInfoLog( shader ) )
        return null
    }

    return shader
}

// 初始化缓冲器
function initBuffers () {
    // 创建一个 buffer
    triangleVertexPositionBuffer = gl.createBuffer()
    // 接下来的操作要发生在上面的 buffer 中
    gl.bindBuffer( gl.ARRAY_BUFFER, triangleVertexPositionBuffer )

    // 三角形的顶点信息
    var vertices = [
        0.0, 1.0, 0.0,
        -1.0, -1.0, 0.0,
        1.0, -1.0, 0.0
    ]

    // 用 Float32Array 数组来填充刚才创建的 buffer
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW )

    // 在 buffer 对象上手动创建两个属性
    // itemSize 用以保存坐标的维数
    // numItems 用以保存坐标的个数
    triangleVertexPositionBuffer.itemSize = 3
    triangleVertexPositionBuffer.numItems = 3

    triangleVertexColorBuffer = gl.createBuffer()
    gl.bindBuffer( gl.ARRAY_BUFFER, triangleVertexColorBuffer )
    var colors = [
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
    ]
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( colors ), gl.STATIC_DRAW )
    triangleVertexColorBuffer.itemSize = 4
    triangleVertexColorBuffer.numItems = 3

    // 同理，下面是矩形的
    squareVertexPositionBuffer = gl.createBuffer()
    gl.bindBuffer( gl.ARRAY_BUFFER, squareVertexPositionBuffer )
    vertices = [
        1.0, 1.0, 0.0,
        -1.0, 1.0, 0.0,
        1.0, -1.0, 0.0,
        -1.0, -1.0, 0.0
    ]
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW )
    squareVertexPositionBuffer.itemSize = 3
    squareVertexPositionBuffer.numItems = 4
}

// 使用刚才创建的 buffer 中的数据绘图
function drawScene () {
    // 告诉 WebGL 画布的尺寸
    // 这很重要，在绘制前都要调用一下。但是我现在并不知道为啥。据说以后会讲
    gl.viewport( 0, 0, gl.viewportWidth, gl.viewportHeight )
    //
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUTTER_BIT )

    // 设置视野为 45 度
    // 告知画布宽高比（不知有啥用）
    // 设置使距离视口 0.1 个单位以下和 100 个单位以上的东西消失（就是看不见）
    // 将这个设定变成一个矩阵储存在 pMatrix 中
    mat4.perspective( 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix )

    // 如果要在三维空间绘制一个图形，可能会希望它做一些空间上的变换，比如向右移动若干个单位或者旋转若干角度
    // 上述变换可以使用一个 4*4 的矩阵进行表示，这个矩阵叫做 model-view 矩阵，使用 mvMatrix 储存
    // .identity 方法生成一个单位矩阵，相当于使得绘制“笔尖”移动到了原点
    mat4.identity( mvMatrix )
    // 将单位矩阵和变换矩阵相乘
    mat4.translate( mvMatrix, [-1.5, 0.0, -7.0] )

    // 告诉 WebGL 在 buffer 中的值应被应用于描述顶点位置
    gl.bindBuffer( gl.ARRAY_BUFFER, triangleVertexPositionBuffer )
    gl.vertexAttribPointer( shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0 )
    // This tells WebGL to take account of our current model-view matrix( and also the projection matrix, about which more later ).
    // This is required because all of this matrix stuff isn't built in to WebGL
    setMatrixUniforms()

    // 根据先前给出的顶点信息绘制
    // 顶点信息有效的区间为 0 到 numItem
    gl.drawArrays( gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems )

    // 接着向右移动三个单位绘制矩形，重复上面的步骤
    mat4.translate( mvMatrix, [3.0, 0.0, 0.0] )
    gl.bindBuffer( gl.ARRAY_BUFFER, squareVertexPositionBuffer )
    gl.vertexAttribPointer( shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0 )
    setMatrixUniforms()
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems )

}

function setMatrixUniforms () {
    // 将 pMatrix 和 mvMatrix 传入着色器中对应的两个字段（变量）中
    gl.uniformMatrix4fv( shaderProgram.pMatrixUniform, false, pMatrix )
    gl.uniformMatrix4fv( shaderProgram.mvMatrixUniform, false, mvMatrix )
}
