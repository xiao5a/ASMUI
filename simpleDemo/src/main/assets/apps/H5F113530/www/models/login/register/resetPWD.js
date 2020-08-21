(function(mui, owner) {
	//url前缀
	var appUrl = baseUtils.URL;
	//超时时间
	var atimeout = baseUtils.timeout;
	//账号
	var account = baseUtils.getState().account;
	//token 同时检查是否过期
	var token = baseUtils.getApiToken();
	
	console.log("---appUrl=" + appUrl + "---atimeout=" + atimeout + "---account=" + account + "---token=" + token );
	//以下编写业务代码
	
	owner.pageload = function(webview) {
		owner.myInit();
		owner.addEvent();
	}
	
	// 初始化
	owner.myInit = function() {
		
	}
	
	// 刷新
	owner.refresh = function() {
		owner.myInit();
	}
	
	//添加事件
	owner.addEvent = function() {
		document.getElementById("submitBtn").addEventListener("tap", function() {
			owner.resetPWD();	
		});
		
		document.getElementById("closeBtn").addEventListener("tap", function() {
			mui.back(false);
		});
		
		document.getElementById("sendVerificationCode").addEventListener("tap", function() {
			owner.sendVerificationCode();	
		});
		
	}
	
	//搜索查询
	owner.searchFun = function() {
		//监听搜索框变化
		mui(".mui-input-clear")[0].addEventListener('input', function() {
			searchName = document.querySelector('#searchid').value;
			owner.refresh();
		});
		//监听搜索框清除事件--点击清除不能监控到搜索框变化，只能单独监听
		mui(".mui-icon-clear")[0].addEventListener('tap', function() {
			searchName = "";
			owner.refresh();
		});
		//输入法软键盘的搜索
		document.querySelector('#searchid').addEventListener("keydown", function(e) {
			if(13 == e.keyCode) { //点击了“搜索”   
				document.activeElement.blur(); //隐藏软键盘  
				searchName = document.querySelector('#searchid').value;
				owner.refresh();
			}
		}, false);
	}
	
	owner.sendVerificationCode = function() {
		var param = {};
		param.phone = document.getElementById("phone").value;
		param.type = "0";//0是注册、1是修改密码
		
		if (baseUtils.isPoneAvailable(param.phone)){
			
		} else {
			mui.toast("请您输入正确的联系电话！");
			return;
		}
		
		mui.showLoading("操作中...");
		mui.ajax(appUrl + '/com/neusoft/mle/app/action/system/system.sendVerificationCode.svc', {
			data: {
				condition: param
			},
			dataType: 'json',
			type: 'post',
			timeout: atimeout,
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'Content-Type': 'application/json;charset=utf-8',
				'sso-token': token
			},
			success: function(data) {
				console.log("---sendVerificationCode---:" + JSON.stringify(data));
				mui.hideLoading();
	
				//判断返回状态码，200-ture
				var stFlag = baseUtils.checkStatus(data);
				if(stFlag) {
					var code = data.code;
					if(code != "1") {
						var msg = data.message;
						mui.toast(msg);
					} else {
						mui.toast("发送验证码成功！验证码有效时间10分钟。");
					}
				}
			},
			error: function(xhr, type, errorThrown) {
				mui.hideLoading();
				//获取本地数据
				mui.toast("网络连接异常，请确认手机网络状态！");
			}
		});
	}
	
	//
	owner.resetPWD = function() {
		var param = {};
		param.account = document.getElementById("account").value;
		param.psw = document.getElementById("password").value;
		param.phone = document.getElementById("phone").value;
		param.verificationCode = document.getElementById("verificationCode").value;
		
		if (baseUtils.isEmpty(param.account) ){
			mui.toast("请您输入用户名！");
			return;
		}
		
		if (baseUtils.isEmpty(param.psw) ){
			mui.toast("请您输入密码！");
			return;
		}
		
		if (baseUtils.isEmpty(document.getElementById("confirmPassword").value) ){
			mui.toast("请您输入确认密码！");
			return;
		}
		
		if (param.psw != document.getElementById("confirmPassword").value){
			mui.toast("您输入的密码和确认密码不一致！");
			return;
		}
		
		if (baseUtils.isEmpty(param.phone) ){
			mui.toast("请您输入联系电话！");
			return;
		}

		if (!baseUtils.isPoneAvailable(param.phone)){
			mui.toast("请您输入正确的联系电话！");
			return;
		}
		
		if (baseUtils.isEmpty(param.verificationCode) ){
			mui.toast("请您输入短信验证码！");
			return;
		}
		
		mui.showLoading("操作中...");
		
		param.psw = baseUtils.encode(param.psw, '####')
		mui.ajax(appUrl + '/com/neusoft/mle/app/action/system/system.resetPWD.svc', {
			data: {
				condition: param
			},
			dataType: 'json',
			type: 'post',
			timeout: atimeout,
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'Content-Type': 'application/json;charset=utf-8',
				'sso-token': token
			},
			success: function(data) {
				console.log("---resetPWD---:" + JSON.stringify(data));
				mui.hideLoading();
	
				//判断返回状态码，200-ture
				var stFlag = baseUtils.checkStatus(data);
				if(stFlag) {
					var code = data.code;
					if(code != "1") {
						var msg = data.message;
						mui.toast(msg);
					} else {
						mui.toast("操作成功！");
					}
				}
			},
			error: function(xhr, type, errorThrown) {
				mui.hideLoading();
				//获取本地数据
				mui.toast("网络连接异常，请确认手机网络状态！");
			}
		});
	}	
		
}(mui, window.resetPWD = {}));