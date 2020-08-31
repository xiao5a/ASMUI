//TODO dom操作放到mui.ready中；  依赖plus api的业务放到mui.plusReady中？   目前考虑用户手速没有 plusReady快  先不修改了。
$(function() {

	// 验证码超时处理 单位秒
	var wait = 60;

	// 定时器，确保验证码超时
	var i = setInterval(function() {
		wait--;
	}, 1000);

	// 如果超时，则重新刷新验证码
	function checkVeryCode() {
		console.log("wait:" + wait);
		if(wait <= 0) {
			resetCode();
			document.getElementById('verifycode').value = '';
		}
	}

	// 光标落在验证码的文本框时进行检查
	document.getElementById('verifycode').onfocus = function() {
		checkVeryCode();
	}

	// 控件聚焦
	function focusItem(Ojbect) {
		Ojbect.focus();
	}

	// h5 方式弹出信息提示框
	function mytoast(msg) {
		mui.toast(msg, {
			duration: 'short',
			type: 'div'
		});
	}

	// 明文加密
	function encode(password, keyCode) {
		keyCode = keyCode + keyCode + keyCode + keyCode;
		var key = CryptoJS.enc.Utf8.parse(keyCode);
		var decrypted = CryptoJS.AES.encrypt(password, key, {
			mode: CryptoJS.mode.ECB,
			padding: CryptoJS.pad.Pkcs7
		});
		return decrypted.ciphertext.toString();
	}

	// 登录业务逻辑前台校验
	var userName;
	var password;

	function loginCheck() {
		userName = $("#userName").val().trim();
		password = $("#password").val().trim();
		VerifyCode = $("#VerifyCode").val().trim();
		if(!userName) {
			mytoast('请输入登录账号！');
			focusItem($("#userid"));
			return -1;
		}
		if(!password) {
			mytoast('请输入登录密码！');
			focusItem($("#password"));
			return -1;
		}

		if(!VerifyCode) {
			mytoast('请输入验证码！');
			focusItem($("#verifycode"));
			return -1;
		} 
	}

	// 登录后台校验
	document.getElementById('loginBtn').onclick = function() {
		if(loginCheck() == 0) {
			mui.showLoading("登录中...");
			$.ajax({
				url: baseUtils.URL + '/login?type=appajaxType',
				type: 'POST',
				crossDomain: true,
				xhrFields: {
					withCredentials: true
				},
				headers: {
					"X-Requested-With": "XMLHttpRequest",
					"Content-Type": "application/json;charset=utf-8"
				},
				dataType: 'json',
				contentType: 'application/json;charset=utf-8',
				//async: true,
				data: JSON.stringify({
					account: userId,
					captcha: '####',
					password: encode(passWd, '####'),
					simNum: simsernumber
				}),
				success: function(data) {
					mui.hideLoading();
					console.log("data:" + JSON.stringify(data));
					if(data.state == 1 || data.state == 513 || data.state == 4097) {
						//默认监管人员登录
						var user_category_code = "officer"; 
						//登录类型： "scztyh"市场主体用户;"jgry";默认监管人员
						if (window.login.loginType == "scztyh"){
							//市场主体用户
							user_category_code = "entity"; //用户类别（admin：管理员；officer：监管人员；entity：市场主体用户；licence：许可证用户）
						} 
						
						//设置本地信息
						baseUtils.setState(data.account, 
										   data.username,
										   data.orgCode,
										   data.orgName,
										   user_category_code, //正常业务，此数据来源于服务
										   data.apitoken);
						
						$("#userid").val('');
						$("#password").val('');
						$("#verifycode").val('');

						var login_state_msg = login_state_msgs[data.state];
						if( login_state_msg!= null){
							mui.alert(login_state_msg,null,"确认",function(){
								goPage();
							});
						}else{
							goPage();
						}
					} else {
						mui.alert(data.message);
					}
				},
				error: function(xhr, type, errorThrown) {
					//异常处理；
					mui.hideLoading();
					mui.toast("网络连接异常！错误信息：" + type);
				}
			});
		}
	}
	
	var goPage = function(){
		// setTimeout(()=>{
		//   plus.runtime.restart(); //重启app
		// },100)
			
		var all = plus.webview.all();  
		var current = plus.webview.currentWebview().id;  
		for(var i=0,len=all.length;i<len;i++){  
		    if(all[i].id!==current){  
		        all[i].close();  
		    }  
		}  
			
		mui.openWindow({
			id: '../../models/main/main.html',
			url: '../../models/main/main.html',
			extras: {
				pageId: window.login.pageId
			}
		});
	}

});