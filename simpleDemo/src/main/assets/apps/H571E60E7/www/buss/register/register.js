	//请求地址
	var url = baseUtils.URL
	//短信验证码标识
	var jssessionid
	//页面加载	
	function pageLoad(){
		init()
		addEvent()
	}
	//初始化
	function init(){
		
	}
	
	//事件监听
	function  addEvent(){
		//获取验证码
		document.getElementById("VerifyCode").addEventListener("tap", function() {
			getVerificationCode()
		})
		
		//注册
		document.getElementById("register").addEventListener("tap", function() {
			register()
		})
		
		//点击完成
		document.getElementById("registerSuccess").addEventListener("tap", function() {
			mui('#popover').popover('toggle')
		})
		
		//点击返回首页
		document.getElementById("backHome").addEventListener("tap", function() {
			backHome()
		})
		
	}
	
	//返回首页
	function backHome(){
		mui.openWindow({
			url:"../main/main.html",
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
	
	function register(){
		let account = $("#account").val()
		let userName = $("#userName").val()
		let idCard = $("#idCard").val()
		let phone = $("#phone").val()
		let password = $("#password").val()
		let rePassword = $("#rePassword").val()
		let verifycode = $("#verifycode").val()
		
		$(".regiBg").nextAll().remove()
		//参数校验
		if(baseUtils.isEmpty(account)) {
			dialog.toast('请输入姓名！');
			return -1;
		}
		if(baseUtils.isEmpty(userName)) {
			dialog.toast('请输入用户名！');
			return -1;
		}
		if(baseUtils.isEmpty(idCard)) {
			dialog.toast('请输入身份证号！');
			return -1;
		}
		if(!baseUtils.identityCodeValid(idCard)){
			return -1;
		}
		if(baseUtils.isEmpty(phone)) {
			dialog.toast('请输入手机号！');
			return -1;
		}
		if(!baseUtils.isPoneAvailable(phone)){
			dialog.toast('手机号格式输入错误,请重新输入！');
			return -1;
		}
		if(baseUtils.isEmpty(password)) {
			dialog.toast('请输入密码！');
			return -1;
		}
		if(baseUtils.isEmpty(rePassword)) {
			dialog.toast('请输入确认密码！');
			return -1;
		}	
		if(password !== rePassword){
			dialog.toast('两次输入的密码不一致，请重新输入！');
			return -1;
		}
		if(baseUtils.isEmpty(verifycode)) {
			dialog.toast('请输入验证码!');
			return -1;
		} 
		
		let tran_id = tranIdInfo.zrrzc
		let taxML = {
			"zh": account,
			"xm": userName,
			"zjhm":idCard,
			"sjhm": phone,
			"mm": password,
			"smz": "1",
			"yzm": verifycode,
			"jssessionid": jssessionid,
			"certify_type": ""
		}
		let data = ReqInfo.getReqInfo(tran_id,taxML)
		debugger
		$http.post(url,data,(res)=>{
			let rs = resResult.setAndGetAttrValue(res)
			debugger
			if(rs.rtn_code==0){
				mui('#popover').popover('toggle')
			}else{
				dialog.toast(rs.Message)
			}
		})
	}
	
	//获取验证码
	function getVerificationCode(){
		let account = $("#account").val()
		let idCard = $("#idCard").val()
		let phone = $("#phone").val()
		if(!phone){
			dialog.alert("请输入手机号")
			return
		}
		if(!baseUtils.isPoneAvailable(phone)){
			dialog.alert('手机号格式输入错误,请重新输入！');
			return;
		}
		$("#VerifyCode").text(60)
		dialog.alert("验证码已发送，请注意查收")
		let time = 60
		let timer = setInterval(function(){  
			$("#VerifyCode").attr("disabled",true)
			time--;  
			$("#VerifyCode").text(time)
			if(time == 0){
				$("#VerifyCode").attr("disabled",false)
				$("#VerifyCode").text('发送验证码')
				clearInterval(timer)
			}
		}, 1000);
		let tran_id = tranIdInfo.fsyzm
		let taxML = {
					"sjhm": phone,
					"zjhm": idCard,
					"zh": account,
					"smz": "1"
				}
		let data = ReqInfo.getReqInfo(tran_id,taxML)
		console.log("data>>>"+JSON.stringify(data))
		$http.post(url,data,(res)=>{
			jssessionid = res.body.jssessionid
		})
	}
	