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
		owner.myInit();
		owner.addEvent();
		
		var sbxxs = JSON.parse(webview.sbxxjsonstr);
		document.getElementById('SBJKZT').innerText = sbxxs.sbzt +"|"+sbxxs.jkzt;
		document.getElementById('NSRMC').innerText = sbxxs.NSRMC;
		document.getElementById('ZJHM').innerText = sbxxs.ZJHM;
		document.getElementById('SPD_SWJGMC').innerText = sbxxs.SPD_SWJGMC;
		document.getElementById('sbsj').innerText = sbxxs.sbsj;
		document.getElementById('SB_JE').innerText = sbxxs.SB_JE;
		document.getElementById('yzpzlsh').innerText = sbxxs.yzpzlsh;
		document.getElementById('SKSSQ').innerText = sbxxs.SKSSQQ +"至"+ sbxxs.SKSSQZ;
	}

	// 初始化
	owner.myInit = function() {

	}

	// 刷新
	owner.refresh = function() {
		owner.myInit();
	}

	//添加事件
	owner.addEvent = function() {
		document.getElementById("pay").addEventListener("tap", function() {
			owner.payFun();
		});
		document.getElementById("cyzt").addEventListener("tap", function() {
			owner.cyztFun();
		});
		document.getElementById("sbzf").addEventListener("tap", function() {
			owner.sbzfFun();
		});
	}

	//搜索查询
	owner.searchFun = function() {
		
	}
	//缴款
	owner.payFun = function() {
		// var sbje = document.getElementById('sbje').value;
		// var jdsbh = document.getElementById('jdsbh').value;
		var reqInfo = {
							"service": {
								"head": {
									"tran_id": "com.neusoft.fs.fsunionPay",
									"channel_id": "HBSW.NFWB.DZSWJWB",
									"tran_seq": "270799db98b548528e7160dd0be73abb",
									"tran_date": "20190806",
									"tran_time": "104606000",
									"expand": [{
										"name": "identityType",
										"value": "Hbswwb#476"
									},
									{
										"name": "sjry",
										"value": "14200dzswj1"
									},
									{
										"name": "sjjg",
										"value": "14201091400"
									}]
								},
								"body": {
									"taxML": {
										"nsrsbh": "422801195811120210",
										"yzpzxh": "10014219000001482966",
										"djxh": "20124200000011958577",
										"SPD_SWJG": "14201770000",
										"zblsh": "78987a6e5cc0475bbf4e8e26543a2595"
									}
								}
							}
						};
		var appUrl = 'http://192.168.1.100:9090/surrservice/fs/fsunionPay';
		mui.ajax(appUrl, {
			data: reqInfo,
			// dataType: 'json',
			type: 'post',
			// timeout: atimeout,
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'Content-Type': 'application/json;charset=utf-8',
				'sso-token': '6666'
			},
			success: function(data) {
				if (data != null && data != '') {
					var backinfo = JSON.parse(data);
					var code_head = backinfo.head.rtn_code;
					if(code_head == '0'){
						var dzsph = backinfo.body.taxML.dzsph;
						mui.alert(dzsph);
					}else{
						mui.alert(backinfo.head.rtn_msg.Message);
					}
					
					console.log("---getData---:" + JSON.stringify(data));
				} else {
					mui.toast("数据异常！");
				}
		
			},
			error: function(xhr, type, errorThrown) {
				// mui.hideLoading();
				//获取本地数据
				mui.toast("网络连接异常，请确认手机网络状态！");
			}
		});
	}
	//查验状态
	owner.cyztFun = function() {
		// var sbje = document.getElementById('sbje').value;
		// var jdsbh = document.getElementById('jdsbh').value;
		
		var reqInfo = {
			"service": {
				"head": {
					"tran_id": "com.neusoft.fs.fsunionPaycyjkzt",
					"channel_id": "HBSW.NFWB.DZSWJWB",
					"tran_seq": "270799db98b548528e7160dd0be73abb",
					"tran_date": "20190806",
					"tran_time": "104606000",
					"expand": [{
							"name": "identityType",
							"value": "Hbswwb#476"
						},
						{
							"name": "sjry",
							"value": "14200dzswj1"
						},
						{
							"name": "sjjg",
							"value": "14201091400"
						}
					]
				},
				"body": {
					"taxML": {
						"JKFS": "union",
						"djxh": "20124200000011958577",
						"zblsh": "78987a6e5cc0475bbf4e8e26543a2595"
					}
				}
			}
		};
		var appUrl = 'http://192.168.1.100:9090/surrservice/fs/fsunionPaycyjkzt';
		mui.ajax(appUrl, {
			data: reqInfo,
			// dataType: 'json',
			type: 'post',
			// timeout: atimeout,
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'Content-Type': 'application/json;charset=utf-8',
				'sso-token': '6666'
			},
			success: function(data) {
				if (data != null && data != '') {
					var backinfo = JSON.parse(data);
					var code_head = backinfo.head.rtn_code;
					if(code_head == '0'){
						var message_body = backinfo.body.taxML.message;
						mui.alert(message_body);
					}else{
						mui.alert(backinfo.head.rtn_msg.Message);
					}
					
					console.log("---getData---:" + JSON.stringify(data));
				} else {
					mui.toast("数据异常！");
				}
		
			},
			error: function(xhr, type, errorThrown) {
				// mui.hideLoading();
				//获取本地数据
				mui.toast("网络连接异常，请确认手机网络状态！");
			}
		});
	}
	//申报作废
	owner.sbzfFun = function() {
		// var sbje = document.getElementById('sbje').value;
		// var jdsbh = document.getElementById('jdsbh').value;
		var reqInfo={
							"service": {
								"head": {
									"tran_id": "com.neusoft.fs.fssbxxzf",
									"channel_id": "HBSW.NFWB.DZSWJWB",
									"tran_seq": "270799db98b548528e7160dd0be73abb",
									"tran_date": "20190806",
									"tran_time": "104606000",
									"expand": [{
										"name": "identityType",
										"value": "Hbswwb#476"
									},
									{
										"name": "sjry",
										"value": "14200dzswj1"
									},
									{
										"name": "sjjg",
										"value": "14201091400"
									}]
								},
								"body": {
									"taxML": {
										"DLRDJXH": "20124200000011958577",
										"YZPZXH": "10014219000001482967"
									}
								}
							}
						};
		var appUrl = 'http://192.168.1.100:9090/surrservice/fs/fssbxxzf';
		mui.ajax(appUrl, {
			data: reqInfo,
			// dataType: 'json',
			type: 'post',
			// timeout: atimeout,
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'Content-Type': 'application/json;charset=utf-8',
				'sso-token': '6666'
			},
			success: function(data) {
				if (data != null && data != '') {
					var backinfo = JSON.parse(data);
					var code_head = backinfo.head.rtn_code;
					var message_head = backinfo.head.rtn_msg.Message;
					mui.alert(message_head);
					console.log("---getData---:" + JSON.stringify(data));
				} else {
					mui.toast("数据异常！");
				}
			
			},
			error: function(xhr, type, errorThrown) {
				// mui.hideLoading();
				//获取本地数据
				mui.toast("网络连接异常，请确认手机网络状态！");
			}
		});
	}
}(mui, window.glqlpcf_sb = {}));
