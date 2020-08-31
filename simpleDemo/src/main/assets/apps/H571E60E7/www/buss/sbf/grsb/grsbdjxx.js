(function(mui, owner) {
	//url前缀
	var appUrl = baseUtils.URL_HBTAXT;
	
	var fsyzmUrl = baseUtils.URL_HBTAXT_fsYzm;
	var testappUrl = baseUtils.URL_HBTAXT_test;
	
	var cxjmyl_getSbdjxxUrl = baseUtils.URL_HBTAXT_test_cxjmyl_getSbdjxx ;
	
	//超时时间
	var atimeout = baseUtils.timeout;
	//账号
	var account = baseUtils.getState().account;
	//token 同时检查是否过期
	var token = baseUtils.getApiToken();
	
	//console.log("---appUrl=" + appUrl + "---cxjmyl_getSbdjxxUrl=" + cxjmyl_getSbdjxxUrl + "---account=" + account + "---token=" + token );
	//以下编写业务代码
	
	owner.pageload = function(webview,vm) {
		owner.myInit(vm);
		owner.addEvent();
	}
	
	// 初始化
	owner.myInit = function(vm) {
		console.log("muiinit");
		owner.grsbdjxx();
		
		
	}
	
	// 刷新
	owner.refresh = function() {
		owner.myInit();
	}
	
	//添加事件
	owner.addEvent = function() {
		console.log("---addEvent="  );
		
		document.getElementById("ylxxinfo").addEventListener("tap", function() {
			console.log("---addEvent="  );
			
			// var djxxvalue = document.getElementById("djxx").getAttribute('value');
			// console.log(djxxvalue);
			
			// owner.toHdPage();
		});
		
		
	}
	
	//搜索查询
	
	
	owner.grsbdjxx = function() {
		
			console.log("grsbdjxx");
		var testappUrl = baseUtils.URL_HBTAXT_test;
		var getSbdjxxurl = baseUtils.URL_HBTAXT_test_sbf_getSbdjxx;
		
		console.log(testappUrl);
		console.log(testappUrl);
		
		
		vm.$http.get(testappUrl+getSbdjxxurl)
		  .then(function(text) {
			console.log(JSON.stringify(text.body))
			// 							var djxx = text.body;
			var djxx = text.body;
			var head = djxx.service.head.rtn_msg;
			var code = djxx.service.head.rtn_msg.Code;
			var message = djxx.service.head.rtn_msg.Message;
			var body = djxx.service.body.taxML;
			console.log("code", JSON.stringify(code));
	if (code != undefined && code == "N") { //操作失败
				alert(message);
			} else {
				
				if ((body.items != undefined && body.items.length > 0) || (body.zdbjns != undefined && body.zdbjns.length >
						0)) {
		// 				alert(body.cxjgGrid.length);
		// mui("#ylxxinfo")[0].setAttribute("style", "display:block");
					// console.log("this.bjinfo",JSON.stringify(this.$data));
			vm.djxxs = body.items;
	
	
				}
			}
		}, function(res) {
			console.log('请求失败处理',JSON.stringify(res));
		});
	}
	owner.toHdPage = function(event) {
		console.log("11");
			alert(JSON.stringify(event));
			
			 
	mui.openWindow({
		url: './grsbhdxx.html',
		id: "grsbhdxx.html",
		extras: {
			djxx: event,
			cachekey:this.cachekey,
		}
	});
	
	};
	
	
	
	//
		
}(mui, window.grsbdjxx = {}));