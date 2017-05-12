;(function( window ) {
    class TriangularRibbon {
        constructor ( {
            canvasId = 'mycanvas',
            width = document.documentElement.clientWidth-14,
            height = document.documentElement.clientHeight-4,
        } ) {
            this.c = document.getElementById( canvasId )
            this.c.width = width
            this.c.height = height

            this.w = width
            this.h = height
            this.c = this.c.getContext('2d')

            this.t = 50 // times 色带长度
            this.s = Math.floor( this.w / this.t ) // space

            this.timers = [] // 收集定时器

            this.e = function( i ) {
                return 0
            }

            this.launch()
        }

        launch() {
            this.p = this.makePoint()
        }

        // 设置函数表达式
        setEquation ( e ) {
            this.e = e
        }

        // 生成点序列
        makePoint () {
            var y 
            // points 初始化了色带形态 后期相当于记录了鼠标的轨迹
            // 所以不用初始化影响也不太大
            var points = []
            for ( var i = 0; i <= this.t; i++ ) {
                y = this.e(i) + this.h / 2 + this.randomNumber( Math.random() > 0.3 ? 0.6 : -0.6 )
                points.push( [ this.w - this.s * i, y ] )
            }

            return points
        }

        // 获取随机数
        randomNumber ( i ) {
            return Math.floor( Math.random() * 60 + 15 * i )
        }
        
        // 更新点序列中的一个点并绘制
        updateSinglePoint ( x, y ) {
            var c = this.c,
                p = this.p
            x = x + this.randomNumber( -3 )
            y = y + this.randomNumber( -3 )
            p.shift()
            p.push( [ x, y ] )

            this.paint()
        }

        // 带动画更新画布
        updateWithAnimation () {
            var t = this.makePoint()
            for ( var j = 0; j < this.timers.length; j++ )
                clearTimeout( this.timers[j] )
            this.timers = []
            for ( let i = 0; i < t.length; i++ )
                this.timers.push(setTimeout( () => {
                    this.updateSinglePoint( t[t.length-1-i][0], t[t.length-1-i][1] )
                }, i*70 ))
        }

        // 不带动画更新画布
        updateWithoutAnimation () {
            this.p = this.makePoint()
            this.paint()
        }

        // 根据点序列绘制彩带
        paint () {
            var c = this.c,
                p = this.p
            var color
            c.clearRect( 0, 0, this.w, this.h )

            for ( var i = 0; i < this.t-2; i++ ) {
                c.beginPath()
                // 以附近的四个点为顶点画四边形
                c.moveTo( p[i][0], p[i][1] )
                for ( var j = 1; j < 4; j++ ) 
                    c.lineTo( p[ i+j ][0], p[ i+j ][1] )
                // 色相环逆转
                color = `hsla( ${ 10*i }, 100%, 70%, ${ i/50 } )`
                c.fillStyle = color
                c.strokeStyle = color
                c.lineJoin = 'round'
                c.fill()
                c.stroke()
                c.closePath()
            }
        }

    }

    window.TriangularRibbon = TriangularRibbon;
})( window )
