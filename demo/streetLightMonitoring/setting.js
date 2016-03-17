/*
编辑以下属性的参数进行设置，获取地点经纬度可使用百度拾取坐标工具
（http://api.map.baidu.com/lbsapi/getpoint/index.html）
如果不设置则使用默认参数。

可使用的属性：
'centerPointLon' //中心纬度
'centerPointLat' //中心经度
'zoom'           //默认放大倍数
'minZoom'        //最小放大倍数
'workedColor'    //正常工作的路灯的颜色
'brokenColor'    //不能工作的路灯的颜色
*/

var setting = {
	'centerPointLon':116.975030,  //中心纬度
	'centerPointLat':36.619557,   //中心经度
	'zoom':17,                    //默认放大倍数
	'minZoom':17,                 //最小放大倍数
	'workedColor':'#219B44',         //正常工作的路灯的颜色
	'brokenColor':'#DD1F05',      //不能工作的路灯的颜色
}