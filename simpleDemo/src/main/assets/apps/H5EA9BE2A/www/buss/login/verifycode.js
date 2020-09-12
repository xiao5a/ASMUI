	//请求地址
	var url = baseUtils.URL
	//短信验证码标识
	var jssessionid
	
	var  yzm
	
	//页面加载	
	function pageLoad(y){
		init(y)
		addEvent()
	}
	//初始化
	function init(y){
		yzm = y
		
	}
	
	//事件监听
	function  addEvent(){
		
		//提交
		document.getElementById("submit").addEventListener("tap", function() {
			verify()
		})
	}

	
	
		
	//注册	
	function verify(){
		let verifycode = $("#verifycode").val()
		console.log("....>>>"+yzm)
		if(verifycode != yzm){
			dialog.toast('验证码错误，请重新输入！');
			return -1;
		}
	
		mui.openWindow({
			url:"updatePwd.html",
			id:"updatePwd.html",
			/* styles:{
			top:0px,//新页面顶部位置
			bottom:0px,//新页面底部位置
			width:100%,//新页面宽度，默认为100%
			height:100%,//新页面高度，默认为100%
		  
		}, */
			extras:{
				"flag":1
			}
		})
		
	}
	
	
	