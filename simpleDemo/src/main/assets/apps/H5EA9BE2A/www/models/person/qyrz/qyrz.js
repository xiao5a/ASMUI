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
	var flag = false; //不是首次认证
	owner.pageload = function(webview) {
		if (!baseUtils.isPoneAvailable(webview.flag)){
			flag = webview.flag;//首次认证
		}
		
		owner.myInit();
		owner.addEvent();
	}
	
	// 初始化
	owner.myInit = function() {
		owner.getQyrz();
	}
	
	// 刷新
	owner.refresh = function() {
		owner.myInit();
	}
	
	//添加事件
	owner.addEvent = function() {
		document.getElementById("refresh").addEventListener("tap", function() {
			owner.getQyrzXkzbh();
		});
		
		document.getElementById("submitBtn").addEventListener("tap", function() {
			owner.saveQyrz();	
		});
		
		document.getElementById("closeBtn").addEventListener("tap", function() {
			mui.back(false);
		});
		
		document.getElementById("addQY").addEventListener("tap", function() {
			var templateId = document.getElementById("templateId");
			var _card = document.importNode(templateId.content, true);
			$(".addTemplate").append(_card);
		});
		
		$('.addTemplate').on('slideleft', '.QYInfo', function(event) {
			var elem = this;
			var btnArray = ['确认', '取消'];
			mui.confirm('确认删除该条记录？', '温馨提示：', btnArray, function(e) {
				if (e.index == 0) {
					elem.parentNode.removeChild(elem);
				} 
			});
		});
		
		$('.addTemplate').on('slideright', '.QYInfo', function(event) {
			var elem = this;
			var btnArray = ['确认', '取消'];
			mui.confirm('确认删除该条记录？', '温馨提示：', btnArray, function(e) {
				if (e.index == 0) {
					elem.parentNode.removeChild(elem);
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
	
	owner.getQyrz = function() {
		mui.showLoading("操作中...");
		mui.ajax(appUrl + '/com/neusoft/mle/app/action/qyrz/qyrz.getQyrz.svc', {
			data: {
				
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
				console.log("---getQyrz---:" + JSON.stringify(data));
				mui.hideLoading();
	
				//判断返回状态码，200-ture
				var stFlag = baseUtils.checkStatus(data);
				if(stFlag) {
					var code = data.code;
					if(code != "1") {
						var msg = data.message;
						mui.toast(msg);
					} else {
						owner.initData(data.data);
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
	
	owner.initData = function(data) {
		if (baseUtils.isNotEmpty(data)){
			var $container = $("#scrollin").find(".initPage");
			owner.initPage($container, data[0]);
			var $container = $("#scrollin").find(".addTemplate");
			owner.renderCard($container, data);
		}
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
				_this.val(_val);
			});
			//bind dataSet
			$(card).children(".bindData")[0].getBinding = () => {
				return nodeData;
			}
		}
	}
	
	owner.getValue = function(arry, className) {
		var el = document.getElementsByClassName(className);
		for (var i=0; i < el.length; ++i){
			var value = el[i].value;
			if ("" == value){
				return false;
			} else {
				arry.push(value)
			}
		}
		
		return true;
	}
	
	owner.getQyrzXkzbh = function() {
		var param = {};
		param.account = account;
		param.uniscid = document.getElementById("uniscid").value;
		mui.showLoading("操作中...");
		mui.ajax(appUrl + '/com/neusoft/mle/app/action/qyrz/qyrz.getQyrzXkzbh.svc', {
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
				console.log("---getQyrzXkzbh---:" + JSON.stringify(data));
				mui.hideLoading();
	
				//判断返回状态码，200-ture
				var stFlag = baseUtils.checkStatus(data);
				if(stFlag) {
					var code = data.code;
					if(code != "1") {
						var msg = data.message;
						mui.toast(msg);
					} else {
						owner.initData(data.data);
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
	
	owner.saveQyrz = function() {
		var param = {};
		param.account = account;
		param.uniscid = document.getElementById("uniscid").value;
		param.fddbr = document.getElementById("fddbr").value;  
		param.qymc = new Array();
		if (!owner.getValue(param.qymc, "qymc")){
			mui.toast("请您输入企业名称！");
			return;
		}
		param.xkzbh = new Array();
		if (!owner.getValue(param.xkzbh, "xkzbh")){
			mui.toast("请您输入许可证号！");
			return;
		}

		mui.showLoading("操作中...");
		
		param.psw = baseUtils.encode(param.psw, '####')
		mui.ajax(appUrl + '/com/neusoft/mle/app/action/qyrz/qyrz.saveQyrz.svc', {
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
				console.log("---saveQyrz---:" + JSON.stringify(data));
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
						
						if (flag){
							setTimeout(()=>{
							  plus.runtime.restart(); //重启app
							},100)
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
		
	
}(mui, window.qyrz = {}));