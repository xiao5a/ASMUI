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
	var g_myData = "";
	var g_CodeList = "";
	owner.pageload = function(webview) {
		if (baseUtils.isNotEmpty(webview.myData)){
			g_myData = webview.myData;
		}
		
		owner.myInit();
		owner.addEvent();
	}
	
	// 初始化
	owner.myInit = function() {
		owner.getZrytById();	
		owner.getCurUserInfo();
		owner.initPopPicker();
	}
	
	// 刷新
	owner.refresh = function() {
		owner.myInit();
	}
	
	//添加事件
	owner.addEvent = function() {

		// 日期控件
		mui('.myDtPicker').each(function(i, btn) {
			btn.addEventListener('tap', function() {
				baseUtils.getDtPicker(this);
			}, false);
		});
		
		document.getElementById("saveBtn").addEventListener("tap", function() {
			if (baseUtils.isEmpty(g_myData)){
				owner.addZryt();
			} else {
				owner.updZryt();
			}
		});
		
		document.getElementById("cancelBtn").addEventListener("tap", function() {
			mui.back(false);
		});
		
		document.getElementById("selectBtn").addEventListener("tap", function() {
			if (baseUtils.isEmpty(document.querySelector("#QY_CATEGORY_CODE").value) ){
				mui.toast("请您选择被约单位类型！");
				return;
			}
			
			mui.openWindow({
				url: '../common/xkzList.html',
				id: "../common/xkzList.html",
				extras: {
					QY_CATEGORY_CODE: baseUtils.getCodeListValue(g_CodeList.QY_CATEGORY_CODE, document.querySelector("#QY_CATEGORY_CODE").value.trim())
				}
			});
		});
		
		//监听自定义事件，用于和B.html页面进行通信
		window.addEventListener("changeName", function(e) {
			document.querySelector("#QY_NAME").value = e.detail.data.QY_NAME;
			document.querySelector("#UNISCID").value = e.detail.data.UNISCID;
			document.querySelector("#XKZBH").value = e.detail.data.XKZBH;
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
	
	owner.getCurUserInfo = function() {
		var param = {};
		param.codeType = "QY_CATEGORY_CODE";
		mui.showLoading("操作中...");
		mui.ajax(appUrl + '/com/neusoft/mle/app/action/common/common.getCurUserInfo.svc', {
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
				console.log("---getCurUserInfo---:" + JSON.stringify(data));
				mui.hideLoading();
				//判断返回状态码，200-ture
				var stFlag = baseUtils.checkStatus(data);
				if(stFlag) {
					var code = data.code;
					if(code != "1") {
						var msg = data.message;
						mui.toast(msg);
					} else {
						document.querySelector("#YT_ORG_NAME").value = data.data.obj.orgName;
						document.querySelector("#YT_ORG_CODE").value = data.data.obj.orgCode;
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
	
	
	owner.initPopPicker = function() {
		owner.getCodeList();
	}
	
	owner.getCodeList = function() {
		var param = {};
		param.codeType = "QY_CATEGORY_CODE";
		mui.showLoading("操作中...");
		mui.ajax(appUrl + '/com/neusoft/mle/app/action/common/common.getCodeList.svc', {
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
				console.log("---getCodeList---:" + JSON.stringify(data));
				mui.hideLoading();

				//判断返回状态码，200-ture
				var stFlag = baseUtils.checkStatus(data);
				if(stFlag) {
					var code = data.code;
					if(code != "1") {
						var msg = data.message;
						mui.toast(msg);
					} else {
						// 选择控件
						g_CodeList = data.data.CodeList; //[{text:"测试一", value:"测试一value"}];
						document.querySelector("#QY_CATEGORY_CODE").setAttribute('data-options', JSON.stringify(g_CodeList.QY_CATEGORY_CODE));
						document.querySelector("#QY_CATEGORY_CODE").addEventListener("tap", function() {
							baseUtils.getPopPicker(this);
						});
						
						if (baseUtils.isNotEmpty(g_myData)){
							document.querySelector("#QY_CATEGORY_CODE").value = g_myData.QY_CATEGORY_CODE;
						}
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
	
	owner.getZrytById = function() {
		if (baseUtils.isEmpty(g_myData)){
			return;	
		}
		
		var param = {};
		param.ID = g_myData.ID;
		mui.showLoading("操作中...");
		mui.ajax(appUrl + '/com/neusoft/mle/app/action/zryt/zryt.getZrytById.svc', {
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
				console.log("---getZrytById---:" + JSON.stringify(data));
				mui.hideLoading();
	
				//判断返回状态码，200-ture
				var stFlag = baseUtils.checkStatus(data);
				if(stFlag) {
					var code = data.code;
					if(code != "1") {
						var msg = data.message;
						mui.toast(msg);
					} else {
						var $container = $("#scrollin").find(".initPage");
						owner.initPage($container, data.data.obj);
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
	
	owner.initPage = function(container, data) {
		var $valNodes = $(container).children().find("[attr-name]");
		$valNodes.each(function(i, node) {
			var _this = $(node);
			var _key = _this.attr("attr-name");
			var _val = data[_key];
			_this.val(_val);
		});
	}
	
	owner.onChangePopPicker = function() {
		
	}
	
	owner.addZryt = function() {			
		var param = owner.checkParam();
		if (null == param){
			return;
		}

		mui.showLoading("操作中...");
		mui.ajax(appUrl + '/com/neusoft/mle/app/action/zryt/zryt.addZryt.svc', {
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
				console.log("---addZryt---:" + JSON.stringify(data));
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
						mui.back(true);
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
	
	owner.updZryt = function() {
		var param = owner.checkParam();
		if (null == param){
			return;
		}
		
		param.ID = g_myData.ID;
		
		mui.showLoading("操作中...");
		mui.ajax(appUrl + '/com/neusoft/mle/app/action/zryt/zryt.updZryt.svc', {
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
				console.log("---updZryt---:" + JSON.stringify(data));
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
	
	owner.checkParam = function() {
		var param = {};
		param.YT_ORG_NAME = document.querySelector("#YT_ORG_NAME").value.trim();
		param.YT_ORG_CODE = document.querySelector("#YT_ORG_CODE").value.trim();
		param.YT_PERSON_NAME = document.querySelector("#YT_PERSON_NAME").value.trim();
		param.QY_CATEGORY_CODE = baseUtils.getCodeListValue(g_CodeList.QY_CATEGORY_CODE, document.querySelector("#QY_CATEGORY_CODE").value.trim());
		param.QY_NAME = document.querySelector("#QY_NAME").value.trim();
		param.UNISCID = document.querySelector("#UNISCID").value.trim();
		param.XKZBH = document.querySelector("#XKZBH").value.trim();
		param.BYT_PERSON_NAME = document.querySelector("#BYT_PERSON_NAME").value.trim();
		param.YT_DATE = document.querySelector("#YT_DATE").value.trim();
		param.YT_CONTENT = document.querySelector("#YT_CONTENT").value.trim();
		
		if (baseUtils.isEmpty(param.YT_ORG_NAME) ){
			mui.toast("请输入约谈单位！");
			return null;
		}
		
		if (baseUtils.isEmpty(param.YT_PERSON_NAME) ){
			mui.toast("请输入约谈人员！");
			return null;
		}
		
		if (baseUtils.isEmpty(param.QY_CATEGORY_CODE) ){
			mui.toast("请选择被约谈单位类型！");
			return null;
		}
		
		if (baseUtils.isEmpty(param.QY_NAME) ){
			mui.toast("请您选择被预约单位！");
			return null;
		}
		
		if (baseUtils.isEmpty(param.BYT_PERSON_NAME) ){
			mui.toast("请输入被约谈人员！");
			return null;
		}
		
		if (baseUtils.isEmpty(param.YT_DATE) ){
			mui.toast("请选择约谈日期！");
			return null;
		}
		
		var date = baseUtils.getDateStr(new Date(), -1);
		if (baseUtils.compareDate(param.YT_DATE, baseUtils.formatDate(new Date(date), "yyyy-MM-dd")) <= 0){
			mui.toast("约谈日期不能早于今天！");
			return null;
		}
		
		if (baseUtils.isEmpty(param.YT_CONTENT) ){
			mui.toast("请输入约谈内容！");
			return null;
		}
		
		if (baseUtils.getStringlength(param.YT_CONTENT) > 1000){
			mui.toast("约谈内容不能多于1000个字节！");
			return false
		}
		return param;
	}
	
}(mui, window.zrytAdd = {}));