(function(mui, owner) {
	//url
	var url = baseUtils.URL;
	//账号
	var nsrmc = UserInfoUtils.getUserInfo().nsrmc
	//身份证号
	var nsrsbh = UserInfoUtils.getUserInfo().nsrsbh

	owner.pageload = function(webview) {
		owner.myInit();
		owner.addEvent();
	}
	
	// 初始化
	owner.myInit = function() {
		if(nsrmc){
			$("#loginOrRegisterValue").text(nsrmc)
		}
	}
	
	// 刷新
	owner.refresh = function() {
		owner.myInit();
	}
	
	//添加事件
	owner.addEvent = function() {
		if($("#loginOrRegisterValue").text() == '登录/注册'){
			document.getElementById("loginOrRegister").addEventListener("tap", function() {
				loginOrRegister()
			})
		}
		
		document.getElementById("personalInfo").addEventListener("tap", function() {
			personalInfo()
		})
		
		document.getElementById("logoutLogin").addEventListener("tap", function() {
			logoutLogin()
		})
	}
	
	//退出登录
	function logoutLogin(){
		if(!UserInfoUtils.getUserInfo()){
			dialog.toast("已是退出登录状态！")
			return
		}
		dialog.confirm("是否要退出登录",(e)=>{
			if(e.index){
				$("#loginOrRegisterValue").text("登录/注册")
				UserInfoUtils.removeUserInfo()
				nsrmc = ""
				owner.pageload()
			}
		})
	}
	
	//登录或注册
	function loginOrRegister(){
		mui.openWindow({
			url:"../login/login.html",
			id:"../login/login.html",
			/* styles:{
			top:0px,//新页面顶部位置
			bottom:0px,//新页面底部位置
			width:100%,//新页面宽度，默认为100%
			height:100%,//新页面高度，默认为100%
		  
		}, */
			extras:{ 
				"gotoUrl":''
			}
		})
	}
	
	//个人信息
	function personalInfo(){
		mui.openWindow({
			url:"myinfo.html",
			id:"myinfo.html",
			/* styles:{
			top:0px,//新页面顶部位置
			bottom:0px,//新页面底部位置
			width:100%,//新页面宽度，默认为100%
			height:100%,//新页面高度，默认为100%
		  
		}, */
			extras:{
			}
		})
	}
	
	
}(mui, window.grzx = {}));
