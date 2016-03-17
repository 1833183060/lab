<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UJN学生证件照片墙生成器</title>

    <style type="text/css">
        h3 {
            text-align: center;
            color: #333;    
        }
        #userinput {
            width: 400px;
            margin: 0 auto;
            text-align: center;
        }
        .usertext {
            width: 300px;
            height: 30px;
            font: 16px 微软雅黑;
            margin: 10px;
            padding-left: 6px;
            padding-top:2px;
            padding-bottom:2px;
    
        }
        #userbutton {
            margin: 10px;
            height: 40px;
            font: 14px 微软雅黑;
            color: #fff;
            background: #437078;
            border: 0px;
            transition: all 0.5s;
            -moz-transition: all 0.5s;
            -webkit-transition: all 0.5s;
            -o-transition: all 0.5s;
        }
        #userbutton:hover {
            opacity: 0.8;
        }
        #photos {
            margin: 0 auto;
            width: 700px;
            text-align: center;
            padding-top: 20px;
            display:none;
        }
        #photos2 {
            margin: 0 auto;
            width: 700px;
            text-align: center;
            padding-top: 20px;
            transition: all 0.5s;
            -moz-transition: all 0.5s;
            -webkit-transition: all 0.5s;
            -o-transition: all 0.5s;
        }
        #footer {
            margin: 0 auto;
            width: 100%;
            text-align: center;
            color: #ccc;
            font-size: 12px;
            padding-top: 20px;
        }
    
        @media screen and (max-width: 700px){
            #photos {
                width: 90%;
            }
            #photos2 {
                width: 90%;
            }
        }
        @media screen and (max-width: 500px) {
            #userinput {
                width: 100%;
            }
            .usertext {
                width: 80%;
            }
            #userbutton {
                width: 40%;
            }
            #photos {
                width: 90%;
            }
            #photos2 {
                width: 90%;
            }
    
        }
    </style>
    
    <script>
        function removeSpace(str, content){
            if(str.length != 0){
                while(str.lastIndexOf(" ")>=0){
                    str = str.replace(" ","");
                }
                if(str.length == 0){
                    alert("用空格来糊弄人是不好的哟(￣Д￣)ﾉ（摸头");
                    return true;
                }else{
                    return false;
                }
            }else{
                alert("要填"+ content +"哟(￣Д￣)ﾉ（摸头");
                return true;
            }
        }//检查一项输入
        function check(){
            if(removeSpace(userform.year.value, "入学年份")){
                userform.year.focus();
                return false;
            }
            else if (removeSpace(userform.college.value, "专业代号")){
                userform.college.focus();
                return false;
            }
            else if (removeSpace(userform.start.value, "开始代号")){
                userform.start.focus();
                return false;
            }
            else if (removeSpace(userform.finish.value, "结束代号")){
                userform.finish.focus();
                return false;
            }
            else {
                i = 1;
                return true;
            }
        }//检查每项输入
        function onloading(){
            var photos = document.getElementById('photos');
            photos.id = 'photos2';
            document.getElementsByTagName('p')[0].style.display = 'none';
        }//当照片全部下载后再显示
        function check2(){
            if(check()){
                var onloadWords = document.getElementsByTagName('p')[0];
                onloadWords.style.display = '';
                
                return true;
            }else{
                return false;
            }
        }//当输入符合要求时显示“少女祈祷中”
    </script>
</head>
<body onload="onloading();" >
    <h3>UJN学生证件照片墙生成器</h3>
    <div id="userinput">
        <form action="UJNphotosWall.php" method="POST" name="userform" onsubmit="return check2()">
            <input class="usertext" type="text" name="year" placeholder="入学年份（如2013）" autocomplete="off"/><br>
            <input class="usertext" type="text" name="college" placeholder="专业代号（学号5~8位）" autocomplete="off"/><br>
            <input class="usertext" type="text" name="start" placeholder="开始（如1）" autocomplete="off"/><br>
            <input class="usertext" type="text" name="finish" placeholder="结束（如2）" autocomplete="off"/><br>
            <input id="userbutton" type="submit" name="submit" value="偷瞄他们的证件照！"/>
        </form>
    </div>
    <p style="text-align:center;font:14px 微软雅黑;display:none;">少女祈祷中...</p>
<?php
if (@$_POST['submit']) {

    @$START = intval($_POST['start']);//字符串
    @$FINISH = intval($_POST['finish']);
    @$CLASS = $_POST['year'];
    @$COLLEGE = $_POST['college'];

    echo "<div id='photos'>";
	echo "<script type='text/javascript'>document.getElementsByTagName('p')[0].style.display = '';</script>";

    while ($START <= $FINISH) {
        $strSTART = (string)$START;

        if ($START < 10) $url = "http://iplat.ujn.edu.cn/showperson.asp?yktkh=2".$CLASS.$COLLEGE."00".$strSTART;
        elseif ($START < 100) $url = "http://iplat.ujn.edu.cn/showperson.asp?yktkh=2".$CLASS.$COLLEGE."0".$strSTART;
        else $url = "http://iplat.ujn.edu.cn/showperson.asp?yktkh=2".$CLASS.$COLLEGE.$strSTART;

        @$html = file_get_contents($url);
        if (@eregi('src="(.*)"></div>', $html, $content))
            echo '<img width=80 src="http://iplat.ujn.edu.cn/'.$content[1].'"/>';

        else break;

        $START += 1;
    }
	echo "<script type='text/javascript'>document.getElementsByTagName('p')[0].style.display = 'none';</script>";
	echo "</div>";
}
?>

    <div id="footer">
        <p>声明：本页面仅供娱乐，请勿用此恐吓同学，一切后果作者概不负责。</p>
        <p>2015.4.23</p>
    </div>
</body>
</html>

