/* 
已实现：
第一次输入必须为数字；
运算符与小数点不能连续输入；
输入等号后可使本次运算结果参与下一次运算；
可进行相同运算符的连续运算；
清除所有；

尚未解决：
对第二次输入添加小数点；
限制小数点在一个数中的个数；
进行两次以上的异号连续运算；
控制0的输入；
*/

var num1="";/* 储存第一次输入 */
var num2="";/* 储存最后一次输入 */
var num="";/* 储存最后一次输入前的运算结果 */
var oper="";/* 记录输入的符号 */
var m=0;/* 检测是否输入运算符（第一次有效） */
var n=0;/* 控制小数点输入 */
var result="";/* 储存上一次运算结果 */
var l=0;/* 控制运算符输入*/
/*var k=0;控制0的输入*/

function Key(i){
	
	if(i<10){
		if(m==0){
			num1+=i;
			document.getElementById("data").innerHTML=num1;
		}
		if(m==1){
			num2+=i;
			document.getElementById("data").innerHTML=num+oper+num2;	
		}
		n=1; 
		l=1;
	}

	/*if(i<10){
		if(k==0){
			if(i!=0){
				if(m==0){
					num1+=i;
					document.getElementById("data").innerHTML=num1;
				}
				if(m==1){
					num2+=i;
					document.getElementById("data").innerHTML=num+oper+num2;	
				}
			}
			k=1;
		}
		if(k==1){
			if(m==0){
				num1+=i;
				document.getElementById("data").innerHTML=num1;
			}
			if(m==1){
				num2+=i;
				document.getElementById("data").innerHTML=num+oper+num2;	
			}
		}
		n=1;
		l=1;
	}*/


	if(i==plus){
		if(l==1){
			if(m==1){
				num=parseFloat(num)+parseFloat(num2);
				num2="";
			}
			if(m==0){
				num=num1;
			}
			if (m==2){
				document.getElementById("data").innerHTML=result+oper;
				num=result;
			}
			m=1;
			oper="+";
			document.getElementById("data").innerHTML=num+oper;
			l=0;
			/*k=0;*/
		}
	}

	if(i==minus){
		if(l==1){
			if(m==1){
				num=parseFloat(num)-parseFloat(num2);
				num2="";
			}
			if(m==0){
				num=num1;
			}
			if (m==2){
				document.getElementById("data").innerHTML=result+oper;
				num=result;
			};
			m=1;
			oper="-";
			document.getElementById("data").innerHTML=num+oper;
			l=0;
			/*k=0;*/
		}
	}

	if(i==multiply){
		if(l==1){
			if(m==1){
				num=parseFloat(num)*parseFloat(num2);
				num2="";
			}
			if(m==0){
				num=num1;
			}
			if (m==2){
				document.getElementById("data").innerHTML=result+oper;
				num=result;
			}
			m=1;
			oper="x";
			document.getElementById("data").innerHTML=num+oper;
			l=0;
			/*k=0;*/
		}
	}

	if(i==divide){
		if(l==1){
			if(m==1){
				num=parseFloat(num)/parseFloat(num2);
				num2="";
			}
			if(m==0){
				num=num1;
			}
			if (m==2){
				document.getElementById("data").innerHTML=result+oper;
				num=result;
			}
			m=1; 
			oper="÷";
			document.getElementById("data").innerHTML=num+oper;
			l=0;
			/*k=0;*/
		}
	}

	if(i==dot){
		if(n==1){
			if(m==0){
				document.getElementById("data").innerHTML=num1+='.';
			if(m==1){
				num2+='.';
				}
			}
			n=0;
		}
		
	}

	if(i==c){
		m=0;
		n=0;
		l=0;
		num="";
		num1="";
		num2="";
		document.getElementById("data").innerHTML="";
		document.getElementById("res").innerHTML="";
	}

	if(i==equal){
		if(oper=='+'){
			result=document.getElementById("res").innerHTML=parseFloat(num)+parseFloat(num2);
		}
		if(oper=='-'){
			result=document.getElementById("res").innerHTML=parseFloat(num)-parseFloat(num2);
		}
		if(oper=='x'){
			result=document.getElementById("res").innerHTML=parseFloat(num)*parseFloat(num2);
		}
		if(oper=='÷'){
			result=document.getElementById("res").innerHTML=parseFloat(num)/parseFloat(num2);
		}
		m=2;
		num1="";
		num2="";
		num="";
	}


}
