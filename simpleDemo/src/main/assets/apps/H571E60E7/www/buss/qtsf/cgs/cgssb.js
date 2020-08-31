(function(mui, owner) {
	//url前缀
	var appUrl = baseUtils.URL;
	//超时时间
	var atimeout = baseUtils.timeout;
	//账号
	var account = baseUtils.getState().account;
	//token 同时检查是否过期
	var token = baseUtils.getApiToken();
	
	//上牌地
	var gpdPicker =  new mui.PopPicker({
		layer: 2
	});
	
	
	
	owner.pageload = function(webview) {
		owner.myInit();
		owner.addEvent();
	}
	
	// 初始化
	owner.myInit = function() {
		//
		gpdPicker.setData(cityData);
	}
	
	// 刷新
	// owner.refresh = function() {
	// 	owner.myInit();
	// }
	
	//添加事件
	owner.addEvent = function() {
		//绑定监听事件
		document.getElementById("nextBtn").addEventListener("tap", function() {
			owner.sbsubmit();
		});
		
		document.getElementById('gpdPicker').addEventListener('tap', function() {
			gpdPicker.show(function(items) {
				document.getElementById('gpdPicker').value = items[0].text + " " + items[1].text;
				document.getElementById('gpdPicker').setAttribute("data-default", items[0].value+","+items[1].value);
			});
		});
	}
	//选择器回调方法，联动时用这个
	// owner.onChangePopPicker = function() {
		// mui.alert("onChangePopPicker");
		// owner.getZwcnMb();
	// }
	
	owner.sbsubmit = function() {
		// mui.alert('111111');
		var clsbdm = document.getElementById('clsbdm').value;
		var datadefault = document.getElementById('gpdPicker').getAttribute('data-default');
		var xzqh = datadefault.split(",")[0];
		var swjgdm = datadefault.split(",")[1];
		// mui.alert("clsbdm:"+clsbdm+"xzqh:"+xzqh+"swjgdm:"+swjgdm);
		// mui.alert(fsxmData);
		var  getcgsfpxx = {
						"service": {
							"head": {
								"tran_id": "com.neusoft.cgs.getcgsfpxx",
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
										"sfzhm": "422126197505122056",
										"cjhm": "LA9BF3L87K8YJH090",
										"djbj": "1"
									}
								}
							}
						};
		var appUrl = 'http://192.168.1.100:9090/surrservice/cgs/getcgsfpxx';						
		var fpCheckappUrl = 'http://192.168.1.100:9090/surrservice/cgs/cgsfpCheck';
		mui.ajax(appUrl, {
			data: getcgsfpxx,
			// dataType: 'json',
			type: 'post',
			// timeout: atimeout,
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'Content-Type': 'application/json;charset=utf-8',
				'sso-token': '6666'
			},
			success: function(data) {
				if(data != null && data != ''){
					var backinfo = JSON.parse(data);
					var code_head = backinfo.head.rtn_code;
					if(code_head == '0'){
						var fphm = backinfo.body.taxML.fpxxs[0].fphm;
						var fpdm = backinfo.body.taxML.fpxxs[0].fpdm;
						// mui.alert(fphm);
						var  cgsfpCheck = {
											"service": {
												"head": {
													"tran_id": "com.neusoft.cgs.cgsfpCheck",
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
														"fpdm": fpdm,
														"fphm": fphm,
														"SPD_SWJG": swjgdm,
														"cdsx": "1",
														"clgzdsxDm": "1",
														"clgzsjsfsDm": "1",
														"clgzssblxDm": "0100"
													}
												}
											}
										};
						mui.ajax(fpCheckappUrl, {
							data: cgsfpCheck,
							// dataType: 'json',
							type: 'post',
							// timeout: atimeout,
							headers: {
								'X-Requested-With': 'XMLHttpRequest',
								'Content-Type': 'application/json;charset=utf-8',
								'sso-token': '6666'
							},
							success: function(datafpcheck) {
								if(datafpcheck != null &&datafpcheck != ''){
									var fpcheckinfo = JSON.parse(datafpcheck);
									var fpcheckcode_head = fpcheckinfo.head.rtn_code;
									// mui.alert(datafpcheck);
									if(fpcheckcode_head == '0'){
											mui.openWindow({
												url: 'cgssbxxqr.html',
												id: 'cgssbxxqr.html',
												extras: {
													datafpcheck: datafpcheck
												}
											});
										}else{
											mui.alert(fpcheckinfo.head.rtn_msg.Message);
										}
									}else{
										mui.toast("数据异常！");
									}
							},
							error: function(xhr, type, errorThrown) {
								mui.hideLoading();
								//获取本地数据
								mui.toast("网络连接异常，请确认手机网络状态！");
							}
						});
						
					}else{
						mui.alert(backinfo.head.rtn_msg.Message);
					}
				}else{
					mui.toast("数据异常！");
				}
			},
			error: function(xhr, type, errorThrown) {
				mui.hideLoading();
				//获取本地数据
				mui.toast("网络连接异常，请确认手机网络状态！");
			}
		});
	}

}(mui, window.cgssb = {}));
