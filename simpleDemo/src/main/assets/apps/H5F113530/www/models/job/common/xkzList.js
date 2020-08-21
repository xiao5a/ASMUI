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
	var QY_CATEGORY_CODE = "";
	owner.pageload = function(webview) {
		QY_CATEGORY_CODE = webview.QY_CATEGORY_CODE;
		
		owner.myInit();
		owner.addEvent();
		owner.searchFun();
	}
	
	// 初始化
	owner.myInit = function() {
		owner.getXkzList();
	}
	
	// 刷新
	owner.refresh = function() {
		owner.myInit();
	}
	
	//添加事件
	owner.addEvent = function() {
		// 点击事件
		mui(".mui-scroll").on('tap', '.mui-card', function() {
			var _data = this.getBinding();
			//获取父页面A.html
			var self = plus.webview.currentWebview();
			var parent = self.opener();
			// var parent = plus.webview.getWebviewById("../sfcj/sfcjAdd.html");
			//自定义事件,事件名为changeName
			mui.fire(parent, 'changeName', {data:_data});
			//关闭子页面
			mui.back(false);
		})	
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
	
	owner.getXkzList = function() {
		var param = {};
		param.QY_CATEGORY_CODE = QY_CATEGORY_CODE;
		param.QY_NAME = $("#searchid").val();
		
		var pageInfo = {};
		pageInfo.begin = 0;
		pageInfo.end = 10;
		pageInfo.pageDataName = "pageData";
		
		mui.showLoading("操作中...");
		mui.ajax(appUrl + '/com/neusoft/mle/app/action/common/common.getXkzList.svc', {
			data: {
				condition: param,
				pageInfo: pageInfo
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
				console.log("---getXkzList---:" + JSON.stringify(data));
				mui.hideLoading();
				//判断返回状态码，200-ture
				var stFlag = baseUtils.checkStatus(data);
				if(stFlag) {
					var code = data.code;
					if(code != "1") {
						var msg = data.message;
						mui.toast(msg);
					} else {
						// 更新查询结果
						owner.renderCard($("#scrollin").find(".addTemplate"), data.data.pageData);
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
		$.each(datas, function(i, _data) {
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
				
				if (_key == "QY_CATEGORY_NAME"){
					_val = "企业类别："+ _val;
				}
				_this.html(_val);
			});
			//bind dataSet
			$(card).children(".mui-card")[0].getBinding = () => {
				return nodeData;
			}
		}
	}
	
}(mui, window.xkzList = {}));