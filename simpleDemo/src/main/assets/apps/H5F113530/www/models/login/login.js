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
	
	owner.loginType = "jgry"; // 默认监管人员
	owner.pageId = "";
	owner.pageload = function(webview) {
		owner.pageId = webview.pageId;
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
		document.getElementById("regulatoryId").addEventListener("tap", function() {
			$("#regulatoryId").css('color', '#FFFFFF');
			$("#corporateId").css('color', '#095FA9');
	
			$('#registerDiv').css('display','none');
			owner.loginType = "jgry"; //监管人员
		});
		
		document.getElementById("corporateId").addEventListener("tap", function() {
			$("#corporateId").css('color', '#FFFFFF');
			$("#regulatoryId").css('color', '#095FA9')
			
			$('#registerDiv').css('display','block');
			owner.loginType = "scztyh"; //市场主体用户
		});
		
		document.getElementById("registerFont").addEventListener("tap", function() {
			mui.openWindow({
				id: '../../models/login/register/register.html',
				url: '../../models/login/register/register.html',
				extras: {
				
				}
			});
			
		});
		
		document.getElementById("forgetPassword").addEventListener("tap", function() {
			mui.openWindow({
				id: '../../models/login/register/resetPWD.html',
				url: '../../models/login/register/resetPWD.html',
				extras: {
				
				}
			});
		});
		
	}
	
	
	owner.getData = function() {
	//  mui.toast("查询数据条件：" + $("#searchid").val());
	// 	mui.showLoading("操作中...");
	// 	mui.ajax(appUrl + '/com/neusoft/mle/app/action/collection/collection.getData.svc', {
	// 		data: {
	// 			searchid: $("#searchid").val(),
	// 			regorg: regorg,
	// 			account: account
	// 		},
	// 		dataType: 'json',
	// 		type: 'post',
	// 		timeout: atimeout,
	// 		headers: {
	// 			'X-Requested-With': 'XMLHttpRequest',
	// 			'Content-Type': 'application/json;charset=utf-8',
	// 			'sso-token': token
	// 		},
	// 		success: function(data) {
	// 			console.log("---getData---:" + JSON.stringify(data));
	// 			mui.hideLoading();
	
	// 			//判断返回状态码，200-ture
	// 			var stFlag = baseUtils.checkStatus(data);
	// 			if(stFlag) {
	// 				var code = data.code;
	// 				if(code != "1") {
	// 					var msg = data.message;
	// 					mui.toast(msg);
	// 				} else {
	// 					// 更新查询结果
	// 				}
	// 			}
	// 		},
	// 		error: function(xhr, type, errorThrown) {
	//          mui.hideLoading();
	// 			//获取本地数据
	// 			mui.toast("网络连接异常，请确认手机网络状态！");
	// 		}
	// 	});
	}

}(mui, window.login = {}));