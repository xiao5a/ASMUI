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
	
	owner.pageload = function(webview) {
		owner.myInit();
		owner.addEvent();
	}
	
	// 初始化
	owner.myInit = function() {
		console.log("muiinit");
		
		console.log("created");
		var now = new Date();
		var nowYear = now.getFullYear();
		var nowMonth = now.getMonth()+1;
		var minYear = nowYear;
		var maxYear = nowYear+1;
		if(nowMonth < 7){
			minYear = nowYear-1;
			maxYear = nowYear;
		}
		
		var minYearMonth = new Date(minYear,0);
		var maxYearMonth = new Date(maxYear,11);
		vm.dtoption = {"type":"month","beginDate":minYearMonth,"endDate":maxYearMonth};
		console.log("vm.dtoption",JSON.stringify(vm.dtoption));
		
		vm.jfdc_userPicker.setData(vm.dcmc);
		
		
	}
	
	// 刷新
	owner.refresh = function() {
		owner.myInit();
	}
	
	//添加事件
	owner.addEvent = function() {
		console.log("---addEvent="  );
		
		document.getElementById("jklx").addEventListener("tap", function() {
			console.log("---jklx="  );
			chosexzlx();
			// owner.registerUser();	
		});
		// document.getElementById("jfdc").addEventListener("tap", function() {
		// 	console.log("---jfdc="  );
		// 	chosejfdc();
		// 	// owner.registerUser();	
		// });
		// document.getElementById("jklx").addEventListener("tap", function() {
		// 	console.log("---jklx="  );
		// 	chosexzlx();
		// 	// owner.registerUser();	
		// });
		// document.getElementById("jklx").addEventListener("tap", function() {
		// 	console.log("---jklx="  );
		// 	chosexzlx();
		// 	// owner.registerUser();	
		// });
		
	}
	
	//搜索查询
	
	
	
	
	
	
	//
		
}(mui, window.cxylhdxx = {}));


function chosejfdc() {
		console.log("chosejfdc", vm.jfdc_value);
	
		console.log("chosejfdc", vm.dcmc);
		var jfdc = document.getElementById('jfdc');
		// VM.jfdc_userPicker = new mui.PopPicker();
	
		vm.jfdc_userPicker.show(function(items) {
			// userResult.innerText = JSON.stringify(items[0]);
	
	
			vm.jfdc = items[0];
			vm.jfdc_value = items[0];
	
	
			//返回 false 可以阻止选择框的关闭
			//return false;
		});
	
	
	
	};
	
	
	
	 function chosexzlx() {
	
		
		console.log("chosexzlx");
		//选择缴费类型时候重制 补缴类型
	vm.jfdc_userPicker.setData(vm.dcmc);
	
		vm.jfdc = "请选择缴费档次";
		vm.jfdc_value = "";
		var jklx = document.getElementById('jklx');
	
		vm.userPicker.setData([{
			value: '0',
			xzdm:'102011201',
			text: "养老保险"
		}, {
			value: '1',
			xzdm:'102031201',
			text: "医疗保险"
		}]);
		vm.userPicker.show(function(items) {
			// userResult.innerText = JSON.stringify(items[0]);
			vm.xzlx = items[0].text;
			vm.xzlx_value = items[0].value;
	
			if (vm.xzlx_value == '1') {
				console.log("bgethdxx", vm.xzlx_value);
	
				// vm.gethdxx();
			}
	
			//返回 false 可以阻止选择框的关闭
			//return false;
		});
	
	};
					
	function chosessqq(){
		
		console.log("chosessqq");
		vm.ssqqdtPicker= new mui.DtPicker(vm.dtoption);
		var dtPicker = vm.ssqqdtPicker ; 
		dtPicker.show(function (selectItems) { 
			
			vm.ssqq=selectItems.y.text+selectItems.m.text;
			console.log(selectItems.y.text);//{text: "2016",value: 2016} 
			console.log(selectItems.m.text);//{text: "05",value: "05"} 
		})
	};
	function chosessqz(){
		
		console.log("chosessqz");
		vm.ssqzdtPicker= new mui.DtPicker(vm.dtoption);
		var dtPicker = vm.ssqzdtPicker ; 
		dtPicker.show(function (selectItems) { 
			vm.ssqz=selectItems.y.text+selectItems.m.text;
			
			console.log(selectItems.y.text);//{text: "2016",value: 2016} 
			console.log(selectItems.m.text);//{text: "05",value: "05"} 
		})
	};
	
	
	function gotojk() {
			console.log("gotojk", vm.jfdc_value);
			mui.openWindow({
				url: '../cxyl/cxyljk.html',
				id: "cxyljk.html",
				createNew:true,
				extras: {
					jkxx: {
						'jfdc': vm.jfdc,
						'jfdc_value': vm.jfdc_value,
						'xzlx_value': vm.xzlx_value,
						'xzlx': vm.xzlx,
						'bjlx_value': vm.bjlx_value,
						'bjlx': vm.bjlx,
						'bjns': vm.bjns,
						'bjns_value': vm.bjns_value,
						'jfnd': vm.jfnd,
						'jfje': vm.jfje,
						'ckey':vm.cachekey,
						'backurl':'./cxyl.html',
					},
				}
			});
	
		};
		function gethdxx() {
			
			console.log("gethdxx");
			var testappUrl = baseUtils.URL_HBTAXT_test;
			var  sentHeDingDanXXurl= baseUtils.URL_HBTAXT_test_cxjmyl_sentHeDingDanXX;
			console.log(testappUrl + sentHeDingDanXXurl);
			//发送get请求
			vm.$http.get(testappUrl + sentHeDingDanXXurl).then(function(text) {
				// console.log(JSON.stringify(text.body))
				var djxx = text.body;
				var head = djxx.service.head.rtn_msg;
				var code = djxx.service.head.rtn_msg.Code;
				var message = djxx.service.head.rtn_msg.Message;
				var body = djxx.service.body.taxML;
				console.log("code", JSON.stringify(code));
				console.log("body", JSON.stringify(body));
				////////////获取人员添加结果///////////////
				if (code != undefined && code == "N") { //操作失败
					alert(message);
				} else {
					console.log("body.items != undefined && body.items.length > 0", body.ycxbjns != undefined && body.ycxbjns
						.length > 0);
					if (body.items != undefined && body.items.length > 0) {
						
						vm.hdxx = body.items;
							mui('#modal').popover('show');
	
					}
				}
			}, function() {
				//console.log('请求失败处理');
			});
		};
		 function gethdxxnew()  {
			
			console.log("gethdxx");
			var testappUrl = baseUtils.URL_HBTAXT_test;
			var  sentHeDingDanXXurl= baseUtils.URL_HBTAXT_test_cxjmyl_sentHeDingDanXX;
			console.log(testappUrl + sentHeDingDanXXurl);
			//发送get请求
			vm.$http.get(testappUrl + sentHeDingDanXXurl).then(function(text) {
				// console.log(JSON.stringify(text.body))
				var djxx = text.body;
				var head = djxx.service.head.rtn_msg;
				var code = djxx.service.head.rtn_msg.Code;
				var message = djxx.service.head.rtn_msg.Message;
				var body = djxx.service.body.taxML;
				console.log("code", JSON.stringify(code));
				console.log("body", JSON.stringify(body));
				////////////获取人员添加结果///////////////
				if (code != undefined && code == "N") { //操作失败
					alert(message);
				} else {
					console.log("body.items != undefined && body.items.length > 0", body.ycxbjns != undefined && body.ycxbjns
						.length > 0);
					if (body.items != undefined && body.items.length > 0) {
						
						vm.hdxx = body.items;
						
						vm.hdxxshow = true;
		
					}
				}
			}, function() {
				//console.log('请求失败处理');
			});
		};
		
	
	
	
	function hidemodal(){
		vm.hdxxshow = false;
		console.log("hidemodal");
		document.getElementById("modal").classList.remove('mui-active')
	
		
	};
	