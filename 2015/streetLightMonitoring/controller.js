var defaultSetting = {
	'centerPointLon':116.975030,
	'centerPointLat':36.619557,
	'zoom':17,
	'minZoom':17,
	'workedColor':'#219B44',
	'brokenColor':'#DD1F05',
} //默认参数设置

/*百度地图API功能*/
var map = new BMap.Map("l-map"); // 创建地图实例
var point = new BMap.Point(
	setting.centerPointLon ? setting.centerPointLon : defaultSetting.centerPointLon,
	setting.centerPointLat ? setting.centerPointLat : defaultSetting.centerPointLat
); // 创建点坐标
map.centerAndZoom(point, 
	setting.zoom ? setting.zoom : defaultSetting.zoom
); // 初始化地图，设置中心点坐标和地图级别
map.enableScrollWheelZoom();
map.setMinZoom(
	setting.minZoom ? setting.minZoom : defaultSetting.minZoom
); //设置最小放缩级别
map.addControl(new BMap.NavigationControl()); //添加默认缩放平移控件


/*var streetLightData = 
{
	"data":[
		[1,1234],[0,1235]
	],
	"date":"2015.08.24"
}
var coodinate = {
	'1234':[116.975030, 36.619557],
	'1235':[116.975730, 36.619557]
}*/

var streetLightData = {
	'data':[]
} //储存路灯状态数据
var coodinate = new Object(); //储存路灯坐标信息
var toBeClearedMark = []; //储存待清除跳动标注

function createData(){ //生成伪数据
    var longitude = 116.964418,
		lattitude = 36.622955; //生成伪数据的初始参考坐标

    for(var i=0; i<20; i++){
    	longitude += 0.0002;
    	lattitude -= 0.00002;
    	streetLightData.data.push([Math.round(Math.random()),i]);
    	coodinate[i] = [longitude,lattitude];
    } //生成
}

function drawLightDot(){ //在地图上绘制路灯点
	if (document.createElement('canvas').getContext) { 
		var lightNum;
		var worked = [], broken = [];
		var brokenPoint, brokenLabel;

		for (var i=0; i<streetLightData.data.length; i++){
			lightNum = streetLightData.data[i][1];
		    if(streetLightData.data[i][0] == 1){
		    	worked.push(new BMap.Point(coodinate[lightNum][0],coodinate[lightNum][1]));
		    }else{
		    	broken.push(new BMap.Point(coodinate[lightNum][0],coodinate[lightNum][1]));
		    	brokenPoint = new BMap.Point(coodinate[lightNum][0],coodinate[lightNum][1]);
		    	brokenLabel = new BMap.Label(lightNum+"号路灯",{offset:new BMap.Size(0,0)});
		    	addMarker(brokenPoint,brokenLabel);
		    	addNotice(lightNum, coodinate[lightNum][0], coodinate[lightNum][1])
		    }
		}
		var workedOptions = {
	        size: BMAP_POINT_SIZE_NORMAL,
	        shape: BMAP_POINT_SHAPE_CIRCLE,
	        color: setting.workedColor ? setting.workedColor : defaultSetting.setting
	    }
	    var brokenOptions = {
	    	size: BMAP_POINT_SIZE_NORMAL,
	        shape: BMAP_POINT_SHAPE_CIRCLE,
	        color: setting.brokenColor ? setting.brokenColor : defaultSetting.brokenColor
	    }
	    var workedPointCollection = new BMap.PointCollection(worked, workedOptions);
	    var brokenPointCollection = new BMap.PointCollection(broken, brokenOptions);

	    map.addOverlay(workedPointCollection); 
	    map.addOverlay(brokenPointCollection); 
    } else {
        alert('请在chrome、safari、IE8+以上浏览器查看本页面');
    }
}

function addMarker(presentPoint,label){ //添加标签
	var marker = new BMap.Marker(presentPoint);
	map.addOverlay(marker);
	marker.setLabel(label);
}

function addNotice(lightNum, a, b){ //向侧边栏添加故障信息
	$("#notice").append('<p><a href="#" onclick="findLight('+a+', '+b+');return false">'+lightNum+'号路灯</a></p>');
}

function findLight(a, b){ //找到故障路灯
	point = new BMap.Point(a,b);
	map.centerAndZoom(point, 19);

	for(var i=0; i<toBeClearedMark.length; i++){
		map.removeOverlay(toBeClearedMark[i]);
	} //清除之前添加的跳动标注
	var brokenLightMarker = new BMap.Marker(point);  // 创建标注
	map.addOverlay(brokenLightMarker);               // 将标注添加到地图中
	brokenLightMarker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
	toBeClearedMark.push(brokenLightMarker); //将创建的mark加入待清除数组
}

/*按钮与边栏*/
function btnAndSidebar(){
	$("#open").click(function(){
		$("#tool").hide('fast');
		$("#sidebar-content").show('fast');
		$("#close").show('fast');
		$("#sidebar").toggle(500);
	})
	$("#close").click(function(){
		$("#sidebar-content").hide('fast');
		$("#close").hide('fast');
		$("#sidebar").toggle(500)
		$("#tool").show('fast');
	})
	$("#restore").click(function(){
		point = new BMap.Point(116.975030,36.619557);
		map.centerAndZoom(point, 17);
		for(var i=0; i<toBeClearedMark.length; i++){
			map.removeOverlay(toBeClearedMark[i]);
		} //清除之前添加的跳动标注
	})
}

window.onload=function(){
	createData();
	drawLightDot();
	btnAndSidebar();
}