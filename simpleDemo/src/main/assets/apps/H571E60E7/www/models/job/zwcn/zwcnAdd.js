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
	owner.pageload = function(webview) {
		if (baseUtils.isNotEmpty(webview.myData)){
			g_myData = webview.myData;
			owner.getZwcnMb();
			document.querySelector("#cn_confirm").checked = true;
			document.querySelector("#cn_name").value = g_myData.CN_NAME;
			document.querySelector("#cn_time").value = g_myData.CN_TIME;
		}
		
		owner.myInit();
		owner.addEvent();
	}
	
	// 初始化
	owner.myInit = function() {
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
			owner.insertXkzbhXx();
		});
		
		document.getElementById("cancelBtn").addEventListener("tap", function() {
			mui.back(false);
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
	
	
	owner.initPopPicker = function() {
		owner.getCodeList();
		owner.getXkzbhCodeList();
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
						var data = data.data.CodeList; //[{text:"测试一", value:"测试一value"}];
						document.querySelector("#qy_category_code").setAttribute('data-options', JSON.stringify(data.QY_CATEGORY_CODE));
						document.querySelector("#qy_category_code").addEventListener("tap", function() {
							baseUtils.getPopPicker(this);
						});
						
						if (baseUtils.isNotEmpty(g_myData)){
							document.querySelector("#qy_category_code").value = baseUtils.getCodeListText(data.QY_CATEGORY_CODE, g_myData.QY_CATEGORY_CODE);
							$("#qy_category_code").attr("readonly","readonly");	
							$("#qy_category_code").attr("disabled","disabled");
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
	
	owner.getXkzbhCodeList = function() {
		var param = {};
		param.codeType = "QY_CATEGORY_CODE";
		mui.showLoading("操作中...");
		mui.ajax(appUrl + '/com/neusoft/mle/app/action/zwcn/zwcn.getXkzbhCodeList.svc', {
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
				console.log("---getXkzbhCodeList---:" + JSON.stringify(data));
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
						var data = data.data.xkzbhCodeListApp; //[{text:"测试一", value:"测试一value"}];
						document.querySelector("#xkzbh").setAttribute('data-options', JSON.stringify(data));
						document.querySelector("#xkzbh").addEventListener("tap", function() {
							baseUtils.getPopPicker(this);
						});
						
						if (baseUtils.isNotEmpty(g_myData)){
							document.querySelector("#xkzbh").value = baseUtils.getCodeListText(data, g_myData.XKZBH);
							$("#xkzbh").attr("readonly","readonly");
							$("#xkzbh").attr("disabled","disabled");
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
	
	owner.onChangePopPicker = function() {
		owner.getZwcnMb();
	}
	
	owner.getZwcnMb = function() {
		var param = {};
		param.qy_category_code = document.querySelector("#qy_category_code").getAttribute("data-default").trim();
		param.xkzbh = document.querySelector("#xkzbh").getAttribute("data-default").trim();
		if (baseUtils.isEmpty(param.qy_category_code) && baseUtils.isNotEmpty(g_myData)){
			param.qy_category_code = g_myData.QY_CATEGORY_CODE;
		} 
		
		if (baseUtils.isEmpty(param.xkzbh) && baseUtils.isNotEmpty(g_myData)){
			param.xkzbh = g_myData.XKZBH;
		} 
	
		if (baseUtils.isEmpty(param.qy_category_code) || baseUtils.isEmpty(param.xkzbh)){
			return;
		}
		mui.showLoading("操作中...");
		mui.ajax(appUrl + '/com/neusoft/mle/app/action/zwcn/zwcn.getZwcnMb.svc', {
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
				console.log("---getZwcnMb---:" + JSON.stringify(data));
				mui.hideLoading();
	
				//判断返回状态码，200-ture
				var stFlag = baseUtils.checkStatus(data);
				if(stFlag) {
					var code = data.code;
					if(code != "1") {
						var msg = data.message;
						mui.toast(msg);
					} else {
						owner.renderCard($("#scrollin").find(".addTemplate"), data.data.zwcnMbList);
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
	owner.renderCard = function($container, datas) {
		$container.html("");
		var title = "";
		var title_sub = "";
		$.each(datas, function(i, _data) {
			if (title != _data.CN_TITLE){
				// 新的主标题
				title = _data.CN_TITLE;
				var html_title = '<br><p class="CN_TITLE">' + _data.CN_TITLE + '</p>';
				
				title_sub = _data.CN_SUB_TITLE;
				if (baseUtils.isNotEmpty(title_sub)){
					var html_title_sub = '<p class="CN_SUB_TITLE">' + title_sub + '</p>';
				}
				$container.append(html_title).append(html_title_sub);
			} else if (baseUtils.isNotEmpty(title_sub) && title_sub != _data.CN_SUB_TITLE){
				// 新的副标题
				title_sub = _data.CN_SUB_TITLE;
				var html_title_sub = '<p class="CN_SUB_TITLE">' + _data.CN_SUB_TITLE + '</p>';
				$container.append(html_title_sub);
			}
			var templateId = document.getElementById("templateId");
			var _card = document.importNode(templateId.content, true);
			renderData(_card, _data);
			$container.append(_card);
		});
	
		function renderData(card, nodeData) {
			var $valNodes = $(card).children().find("[attr-name]");
			$valNodes.each(function(i, node) {
				var _this = $(node);
				var _key = _this.attr("attr-name");
				var _val = nodeData[_key];
				if (_key == "ID"){
					_this.val(_val);
					if (nodeData["CN_CONFIRM"] == 1){
						if (baseUtils.isNotEmpty(g_myData)){
							// 修改功能
							_this.prop("checked", true);
						} else {
							// 新增功能
						}
						
					}
				} else {
					_this.text(_val);
				}
			});
			//bind dataSet
			$(card).children(".bindData")[0].getBinding = () => {
				return nodeData;
			}
		}
	}
	
	owner.insertXkzbhXx = function() {
		var param = owner.checkParam();
		if (null == param){
			return;
		}

		mui.showLoading("操作中...");
		mui.ajax(appUrl + '/com/neusoft/mle/app/action/zwcn/zwcn.insertXkzbhXx.svc', {
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
				console.log("---insertXkzbhXx---:" + JSON.stringify(data));
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
	
	owner.checkParam = function() {
		var param = {};
		param.qy_category_code = document.querySelector("#qy_category_code").getAttribute("data-default").trim();
		param.xkzbh = document.querySelector("#xkzbh").value.trim();
		if (baseUtils.isEmpty(param.qy_category_code) && baseUtils.isNotEmpty(g_myData)){
			param.qy_category_code = g_myData.QY_CATEGORY_CODE;
		} 
		if (baseUtils.isEmpty(param.xkzbh) && baseUtils.isNotEmpty(g_myData)){
			param.xkzbh = g_myData.XKZBH;
		}
		param.cn_confirm = "1";
		param.cn_name = document.querySelector("#cn_name").value.trim();
		param.cn_time = document.querySelector("#cn_time").value.trim();
		
		if (baseUtils.isEmpty(param.qy_category_code) ){
			mui.toast("请您选择承诺企业类别！");
			return null;
		}
		
		if (baseUtils.isEmpty(param.xkzbh) ){
			mui.toast("请您选择许可证编号！");
			return null;
		}
		
		var paramArray = [];
		$('#addTemplate').find(':checkbox').each(function(){
		  if ($(this).is(":checked")) {
		    var paramTemp = {};
			paramTemp.qy_category_code = param.qy_category_code;
			paramTemp.xkzbh = param.xkzbh;
			paramTemp.cn_item_id = $(this).val();
			paramTemp.cn_confirm = param.cn_confirm;
			paramTemp.cn_name = param.cn_name;
			paramTemp.cn_time = param.cn_time;
			paramArray.push(paramTemp)
		  }
		});
		
		if (paramArray.length == 0){
			mui.toast("请您勾选承诺内容！");
			return null;
		}
		
		if (!document.getElementById("cn_confirm").checked) {
			mui.toast("请您勾选承诺真实性！");
			return null;
		}
		
		if (baseUtils.isEmpty(param.cn_name) ){
			mui.toast("请您填写承诺人！");
			return null;
		}
		
		if (baseUtils.isEmpty(param.cn_time) ){
			mui.toast("请您选择承诺时间！");
			return null;
		}
		
		var date = baseUtils.getDateStr(new Date(), -1);
		if (baseUtils.compareDate(param.cn_time, baseUtils.formatDate(new Date(date), "yyyy-MM-dd")) <= 0){
			mui.toast("承诺时间不能早于今天！");
			return null;
		}
		
		return paramArray;
	}
}(mui, window.zwcnAdd = {}));