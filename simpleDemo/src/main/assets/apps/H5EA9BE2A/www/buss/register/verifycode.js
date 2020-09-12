	//请求地址
	var url = baseUtils.URL
	//短信验证码标识
	var jssessionid
	
	var  xm
	var  zjhm
	var  sjhm
	
	//页面加载	
	function pageLoad(xm,zjhm,sjhm){
		init(xm,zjhm,sjhm)
		addEvent()
	}
	//初始化
	function init(xm,zjhm,sjhm){
		xm = xm
		zjhm = zjhm
		sjhm = sjhm
	}
	
	//事件监听
	function  addEvent(){
		//注册
		document.getElementById("VerifyCode").addEventListener("tap", function() {
			sendVerificationCode()
		})
		//注册
		document.getElementById("submit").addEventListener("tap", function() {
			register()
		})
	}

	//发送验证码
	function sendVerificationCode(){
		
		let password = $("#password").val()
		let rePassword = $("#rePassword").val()
		
		
		//参数校验
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
						"smz": "0"
					}
			let data = ReqInfo.getReqInfo(tran_id,taxML)
			console.log("data>>>"+JSON.stringify(data))
			$http.post(url,data,(res)=>{
				jssessionid = res.body.jssessionid
			})
		}
		
	//注册	
	function register(){
		
		let password = $("#password").val()
		let rePassword = $("#rePassword").val()
		let verifycode = $("#verifycode").val()
		
		
		//参数校验
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
			"xm": xm,
			"zjhm":zjhm,
			"sjhm": sjhm,
			"mm": password,
			"smz": "0",
			"yzm": verifycode,
			"jssessionid": jssessionid,
			"certify_type": ""
		}
		let data = ReqInfo.getReqInfo(tran_id,taxML)
		$http.post(url,data,(res)=>{
			let rs = resResult.setAndGetAttrValue(res)
			console.log("rs》》》"+JSON.stringify(rs))
			if(rs.Code== '000'){
				$("#submit").attr("disabled",true)
				dialog.alert("注册成功！")
			}else{
				dialog.toast(rs.Message)
			}
		})
	}
	
	
	