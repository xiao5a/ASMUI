	//请求地址
	var url = baseUtils.URL
 
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
			url:"../index/index.html",
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
		mui('#popover').popover('toggle');
		let account = $("#account").val()
		let userName = $("#userName").val()
		let idCard = $("#idCard").val()
		let phone = $("#phone").val()
		let password = $("#password").val()
		let rePassword = $("#rePassword").val()
		let verifycode = $("#verifycode").val()
		
			$(".regiBg").nextAll().remove()
			//参数校验
			if(registerCheck(account,userName,idCard,phone,password,rePassword,verifycode)==-1){
				return 
			}
			let taxML = {
				"zh": account,
				"xm": userName,
				"zjhm":idCard,
				"sjhm": phone,
				"mm": password,
				"smz": "1",
				"yzm": verifycode,
				"jssessionid": "1983c9d5611045ce94ee55779668b2ca",
				"certify_type": ""
			}
			let data = 
			{
				"head": {
					"tran_id": "com.neusoft.login.zrrzc",
					"channel_id": "HBSW.NFWB.DZSWJWB",
					"tran_seq": "270799db98b548528e7160dd0be73abb",
					"tran_date": baseUtils.formatDate(new Date(),'yyyy-MM-dd'),
					"tran_time": new Date().getTime(),
					"expand": [{
						"name": "identityType",
						"value": "Hbswwb#476"
					}, {
						"name": "sjry",
						"value": "webchat"
					}, {
						"name": "sjjg",
						"value": "14201091400"
					}]
				},
				"body": {
					"taxML": taxML
				}
			}
			$http.post(url,data,(res)=>{
				let rs = resResult.setAttrValue(res)
				if(rs.rtn_code==0){
					mui('#popover').popover('toggle')
				}else{
					dialog.toast(rs.Message)
				}
			})
	}
	
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
		
		let taxML = {
					"sjhm": phone,
					"zjhm": idCard,
					"zh": account,
					"smz": "1"
				}
		let data = {
			"head": {
				"tran_id": "com.neusoft.login.fsyzm",
				"channel_id": "HBSW.NFWB.DZSWJWB",
				"tran_seq": "270799db98b548528e7160dd0be73abb",
				"tran_date": baseUtils.formatDate(new Date(),'yyyy-MM-dd'),
				"tran_time": new Date().getTime(),
				"expand": [{
					"name": "identityType",
					"value": "Hbswwb#476"
				}, {
					"name": "sjry",
					"value": "webchat"
				}, {
					"name": "sjjg",
					"value": "14201091400"
				}]
			},
			"body": {
				"taxML": taxML
			}
		}
		$http.post(url,data)
	}
	
	
	//注册校验
	function registerCheck(account,userName,idCard,phone,password,rePassword,verifycode){
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
	}