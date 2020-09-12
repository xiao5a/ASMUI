	//请求地址
	var url = baseUtils.URL
	
	//页面加载
	function pageLoad(webview){
		init()
		addEvent()
	}
	
	//初始化
	function init(){
		
	}
	
	//监听事件
	function addEvent(){
		//提交
		document.getElementById("forgetPwd").addEventListener("tap", function() {
			forgetPwd();	
		})
		
	}
	
	function backLogin(){
		//返回登录页面
		mui.openWindow({
			url:"../login/login.html",
			id:"login",
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
	
	//忘记密码
	function forgetPwd(){
		
		let xm = $("#xm").val().trim();
		let zjhm = $("#zjhm").val().trim();
		let phone = $("#phone").val().trim();
		//校验参数
		if(!xm) {
			dialog.toast('请输入姓名！');
			return;
		}
		if(!zjhm) {
			dialog.toast('请输入证件号码！');
			return;
		}
		if(!baseUtils.identityCodeValid(zjhm)) {
			return;
		}
		
		if(!phone) {
			dialog.toast('请输入手机号码！');
			return;
		}
		if(!baseUtils.isPoneAvailable(phone)) {
			return;
		}
		
		let tran_id = tranIdInfo.forgetpsw 
		let taxML = {
			"#xm":xm,
			"zjhm": zjhm,
			"phone":phone
		}
		let data = ReqInfo.getReqInfo(tran_id,taxML)
		console.log("data>>>"+JSON.stringify(data))
		$http.post(url,data,(res)=>{
			console.log("res>>>"+JSON.stringify(res))
			let rs = resResult.setAndGetAttrValue(res)
			if(rs.Code == '000'){
				//校验验证码
				verifycode(res.body.taxML.yzm)
			}else{
				dialog.alert(rs.taxML.message||rs.Message)
			}
		})
	}
	
	function verifycode(yzm){
		mui.openWindow({
			url:"verifycode.html",
			id:"verifycode.html",
			/* styles:{
			top:0px,//新页面顶部位置
			bottom:0px,//新页面底部位置
			width:100%,//新页面宽度，默认为100%
			height:100%,//新页面高度，默认为100%
		  
		}, */
			extras:{
				"yzm":yzm
			}
		})
	}
	
	
	
	
	
