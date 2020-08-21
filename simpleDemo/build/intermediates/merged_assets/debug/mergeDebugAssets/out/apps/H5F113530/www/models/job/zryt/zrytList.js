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
		owner.searchFun();
	}
	
	// 初始化
	owner.myInit = function() {
		baseUtils.initPage();	// 分页初始化 【适用于需要分页的功能】
	}
	
	// 刷新
	owner.refresh = function() {
		owner.myInit();
		owner.getZrytList();
		
		mui('#scrollin').pullRefresh().refresh(true);	// 重新激活分页【适用于需要分页的功能】
	}
	
	//添加事件
	owner.addEvent = function() {
		//左侧滑动删除
		$('#scrollin').on('tap', '.mui-btn', function(event) {
			var elem = this;
			var li = elem.parentNode.parentNode;
			var btnArray = ['确认', '取消'];
			mui.confirm('确认删除该条记录？', '温馨提示', btnArray, function(e) {
				if (e.index == 0) {
					var muicard = li.parentNode.parentNode;
					var _data = muicard.getBinding();
					owner.delZryt(_data);
				} else {
					setTimeout(function() {
						//$.swipeoutClose(li);
					}, 0);
				}
			});
		});
		
		// 点击事件
		mui(".mui-scroll").on('tap', '.mui-card', function() {
			var _data = this.getBinding();
			mui.openWindow({
				url: '../zryt/zrytAdd.html',
				id: "../zryt/zrytAdd.html",
				extras: {
					myData: _data
				}
			});
			
		})
		
		document.getElementById("addBtn").addEventListener("tap", function() {
			mui.openWindow({
				url: '../zryt/zrytAdd.html',
				id: "../zryt/zrytAdd.html",
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
	
	owner.delZryt = function(obj) {
		var param = {};
		param.ID = obj.ID;

		mui.showLoading("操作中...");
		mui.ajax(appUrl + '/com/neusoft/mle/app/action/zryt/zryt.delZryt.svc', {
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
				console.log("---delZryt---:" + JSON.stringify(data));
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
						mui.toast("操作成功！");
						owner.refresh();
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
	
	owner.pullupRefresh = function(obj) {
		owner.getZrytList();
	}
	owner.getZrytList = function() {
		var param = {};
		param.QY_NAME =  $("#searchid").val();
		
		mui.showLoading("操作中...");
		mui.ajax(appUrl + '/com/neusoft/mle/app/action/zryt/zryt.getZrytList.svc', {
			data: {
				condition: param,
				pageInfo: baseUtils.pageInfo  //【适用于需要分页的功能】
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
				console.log("---getZrytList---:" + JSON.stringify(data));
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
						var $container = $("#scrollin").find(".addTemplate");
						if (baseUtils.isFirstPage()){ //【适用于需要分页的功能】
							$container.html("");
						}
						owner.renderCard($container, data.data.pageData);
						
						// 处理分页 【适用于需要分页的功能】
						if (baseUtils.pageInfo.end >= data.data.ttRowCount){
							mui('#scrollin').pullRefresh().endPullupToRefresh(true); //参数为true代表没有更多数据了。
						} else {
							mui('#scrollin').pullRefresh().endPullupToRefresh(false); //参数为false代表有更多数据了。
						}	
						baseUtils.nextPage();
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
				
				if (_key == "QY_CATEGORY_CODE"){
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
}(mui, window.zrytList = {}));