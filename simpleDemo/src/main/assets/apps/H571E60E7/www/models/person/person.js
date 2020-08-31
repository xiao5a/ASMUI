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
		flag = webview.flag;
		owner.myInit();
		owner.addEvent();
	}
	
	// 初始化
	owner.myInit = function() {
		//用户类别（admin：管理员；officer：监管人员；entity：市场主体用户；licence：许可证用户）
		if(baseUtils.getState().user_category_code == "entity" || baseUtils.getState().user_category_code == "licence"){
			// "scztyh"; //市场主体用户
			$(".scztyh").css('display','block');
			$(".jgry").css('display','none');
		} else {
			// "jgry"; // 默认监管人员
			$(".jgry").css('display','block');
			$(".scztyh").css('display','none');
		}
		
		owner.getData();
	}
	
	// 刷新
	owner.refresh = function() {
		owner.myInit();
	}
	
	//添加事件
	owner.addEvent = function() {
		// owner.searchFun();
		document.getElementById("qyrz").addEventListener("tap", function() {
			mui.openWindow({
				url: './qyrz/qyrz.html',
				id: "./qyrz/qyrz.html",
				extras: {
					
				}
			});
		});
		
		document.getElementById("tcxt").addEventListener("tap", function() {
			owner.quit();
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
	
	owner.getData = function() {
	//	mui.toast("查询数据条件：" + $("#searchid").val());
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
	
	/**
	 * 用户退出登录
	 */
	owner.quit = function() {
		var btnArray = ['确认', '取消'];
		mui.confirm('确认退出？', '提示', btnArray, function(e) {
			if (e.index == 0) {
				//发送请求到服务端，让session失效
				// 退出登录返回首页
				baseUtils.returnLogin();
			}
		})
	}
	
}(mui, window.person = {}));