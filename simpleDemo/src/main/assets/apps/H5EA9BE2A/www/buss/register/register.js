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
	
		
		let xm = $("#xm").val()
		let zjhm = $("#zjhm").val()
		let sjhm = $("#sjhm").val()
		let mm = $("#mm").val()
		let rePassword = $("#rePassword").val()
		let verifycode = $("#verifycode").val()
		
		$(".regiBg").nextAll().remove()
		//参数校验
		if(baseUtils.isEmpty(xm)) {
			dialog.toast('请输入姓名！');
			return -1;
		}
	
		if(baseUtils.isEmpty(zjhm)) {
			dialog.toast('请输入身份证号！');
			return -1;
		}
		if(!baseUtils.identityCodeValid(zjhm)){
			return -1;
		}
		if(baseUtils.isEmpty(sjhm)) {
			dialog.toast('请输入手机号！');
			return -1;
		}
		if(!baseUtils.isPoneAvailable(sjhm)){
			dialog.toast('手机号格式输入错误,请重新输入！');
			return -1;
		}
		if(baseUtils.isEmpty(mm)) {
			dialog.toast('请输入密码！');
			return -1;
		}
		if(baseUtils.isEmpty(rePassword)) {
			dialog.toast('请输入确认密码！');
			return -1;
		}	
		if(mm !== rePassword){
			dialog.toast('两次输入的密码不一致，请重新输入！');
			return -1;
		}
		if(baseUtils.isEmpty(verifycode)) {
			dialog.toast('请输入验证码!');
			return -1;
		} 
		mui.showLoading("注册中...")
		let tran_id = tranIdInfo.zrrzc
		let taxML = {
			"xm": xm,
			"zjhm":zjhm,
			"sjhm": sjhm,
			"mm": mm,
			"smz": "1",
			"yzm": verifycode,
			"jssessionid": jssessionid,
			"certify_type": ""
		}
		let data = ReqInfo.getReqInfo(tran_id,taxML)
		$("#register").attr("disabled",true)
		$http.post(url,data,(res)=>{
			let rs = resResult.setAndGetAttrValue(res)
			console.log("rs》》》"+JSON.stringify(rs))
			if(rs.Code== '000'){
				mui.hideLoading()
				dialog.alert("注册成功！")
			}else{
				dialog.toast(rs.Message)
			}
			$("#register").attr("disabled",false)
		})
	}
	
	//获取验证码
	function getVerificationCode(){
		let zjhm = $("#zjhm").val()
		let sjhm = $("#sjhm").val()
		if(!sjhm){
			dialog.alert("请输入手机号")
			return
		}
		if(!baseUtils.isPoneAvailable(sjhm)){
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
					"sjhm": sjhm,
					"zjhm": zjhm,
					"smz": "1"
				}
		let data = ReqInfo.getReqInfo(tran_id,taxML)
		console.log("data>>>"+JSON.stringify(data))
		$http.post(url,data,(res)=>{
			jssessionid = res.body.taxML.jssessionid
		})
	}
	