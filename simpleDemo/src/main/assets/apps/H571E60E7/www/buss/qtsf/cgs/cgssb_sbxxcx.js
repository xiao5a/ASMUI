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
		document.getElementById("serchBtn").addEventListener("tap", function() {
			owner.serchFun();
		});
	}

	//搜索查询
	owner.searchFun = function() {
		
	}
	
	//申报
	owner.serchFun = function() {
		var clsbdm = document.getElementById('clsbdm').value;
		var reqInfo={
						"service": {
							"head": {
								"tran_id": "com.neusoft.cgs.getcgssbxx",
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
									"value": "mobile"
								},
								{
									"name": "sjjg",
									"value": "14200000000"
								}]
							},
							"body": {
								"taxML": {
									"DLRDJXH": "20124200000011958577",
									"cjhm": clsbdm,
									"sfzhm": "420683198410061526"
								}
							}
						}
					};
		var appUrl = 'http://192.168.1.100:9090/surrservice/cgs/getcgssbxx';
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
						//申报信息
						mui.openWindow({
							url: 'cgssb_sbxx.html',
							id: 'cgssb_sbxx.html',
							extras: {
								sbxxdata: backinfo.body.taxML.sbxxs[0]
							}
						});
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
}(mui, window.cgssb_sbxxcx = {}));
