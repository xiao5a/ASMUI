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
	
	var flag = "";
	var searchData = "";
	
	owner.pageload = function(webview) {
		flag = webview.flag;
		document.getElementById("searchid").setAttribute("placeholder","企业名称、统一社会信用代码或注册号");
		switch (flag){
			case "spjd":
				document.getElementById("titleID").innerText = "食品监督抽查不合格";
				break;
			case "xzcf":
				document.getElementById("titleID").innerText = "行政处罚信息";
				break;
			case "jyyc":
				document.getElementById("titleID").innerText = "经营异常名录";
				break;
			case "yzwf":
				document.getElementById("titleID").innerText = "严重违法失信企业名单";
				break;
			case "search":
				document.getElementById("titleID").innerText = "公示信息";
				searchData = webview.searchData;
				document.getElementById("searchid").value = searchData;
				document.getElementById("searchid").style.textAlign="left";
				break;
			default:
				break;
		}
		
		owner.myInit();
		owner.addEvent();
	}
	
	// 初始化
	owner.myInit = function() {
		owner.getData();
	}
	
	// 刷新
	owner.refresh = function() {
		owner.myInit();
	}
	
	//添加事件
	owner.addEvent = function() {
		owner.searchFun();
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
	
}(mui, window.messageList = {}));