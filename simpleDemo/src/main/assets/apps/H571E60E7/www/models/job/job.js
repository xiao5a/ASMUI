(function(mui, owner) {
	//url前缀
	var appUrl = baseUtils.URL;
	//超时时间
	var atimeout = baseUtils.timeout;
	//账号
	var account = baseUtils.getState().account;
	//token 同时检查是否过期
	var token = baseUtils.getApiToken();
	
	console.log("---baseUtils.getState()：" + JSON.stringify(baseUtils.getState()));
	//以下编写业务代码
	
	/**
	 * 子页面地址
	 */
	owner.subPages = {
		//自我承诺<br>信息填报
		job_zwcn: './zwcn/zwcnList.html',
		//责任约谈
		job_zryt: './zryt/zrytList.html',
		//坐标采集
		job_zbcj: './zbcj/zbcjList.html',
		//示范创建
		job_sfcj: './sfcj/sfcjList.html'
	};
	
	owner.pageload = function(webview) {
		owner.myInit();
		owner.addEvent();
	}
	
	// 初始化
	owner.myInit = function() {
		//用户类别（admin：管理员；officer：监管人员；entity：市场主体用户；licence：许可证用户）
		if(baseUtils.getState().user_category_code == "entity" || baseUtils.getState().user_category_code == "licence"){
			// "scztyh"; //市场主体用户
			document.getElementById("scztyh").style.display = "";
			document.getElementById("jgry").style.display = "none";
		} else {
			// "jgry"; // 默认监管人员
			document.getElementById("jgry").style.display = "";
			document.getElementById("scztyh").style.display = "none";
		}
		
		owner.initFun();
	}
	
	// 刷新
	owner.refresh = function() {
		owner.myInit();
	}
	
	//添加事件
	owner.addEvent = function() {
		mui('.ex-job-box').on('tap', 'li', function(e) {
			var pageId = this.getAttribute('page-id');
			var pageUrl = owner.subPages[pageId];

			if(baseUtils.isEmpty(pageUrl)){
				mui.alert("该功能暂未开放！");
				return;
			}
			
			mui.openWindow({
				id: pageId,
				url: pageUrl,
				extras: {
					
				}
			});
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
	
	owner.initFun = function() {
		// 将来这里最好改成从服务端获取功能
	}
	
	owner.getData = function() {
	//  mui.toast("查询数据条件：" + $("#searchid").val());
	// 	mui.showLoading("操作中...");
	// 	mui.ajax(appUrl + '/com/neusoft/mle/app/action/collection/collection.getEventList.svc', {
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

}(mui, window.job = {}));