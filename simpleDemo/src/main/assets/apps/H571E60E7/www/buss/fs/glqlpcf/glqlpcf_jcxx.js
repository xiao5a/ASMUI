(function(mui, owner) {
	//url前缀
	var appUrl = baseUtils.URL;
	//超时时间
	var atimeout = baseUtils.timeout;
	//账号
	var account = baseUtils.getState().account;
	//token 同时检查是否过期
	var token = baseUtils.getApiToken();
	
	//执收地
	var zsdPicker =  new mui.PopPicker({
		layer: 2
	});
	
	var fsxmPicker = new mui.PopPicker();
	
	
	owner.pageload = function(webview) {
		// mui.alert("123123");
		owner.myInit();
		owner.addEvent();
	}
	
	// 初始化
	owner.myInit = function() {
		// var data = [{text:"武汉市公路管理局", value:"wh"},
		// 			{text:"黄石市公路管理局", value:"hs"},
		// 			{text:"宜昌市公路管理局", value:"yc"}];
		// document.querySelector("#zsbmPicker").setAttribute('data-options', JSON.stringify(cityData));
		// document.querySelector("#zsbmPicker").addEventListener("tap", function() {
		// 	baseUtils.getPopPicker(this);
		// });
		
		//非税项目city.data-fssb.js
		fsxmPicker.setData(fsxmData);
		document.getElementById('fsxmPicker').value = '公路桥梁赔偿费';
		document.getElementById('fsxmPicker').setAttribute("data-default", '3044290001420001');
		//非税执收地city.data-fssb.js
		zsdPicker.setData(fszsdwData);
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
		
		document.getElementById('zsdPicker').addEventListener('tap', function() {
			zsdPicker.show(function(items) {
				document.getElementById('zsdPicker').value = items[0].text + " " + items[1].text;
				document.getElementById('zsdPicker').setAttribute("data-default", items[0].value+","+items[1].value);
			});
		});
		
		document.getElementById('fsxmPicker').addEventListener('tap', function() {
			fsxmPicker.show(function(items) {
				document.getElementById('fsxmPicker').value = items[0].text;
				document.getElementById('fsxmPicker').setAttribute("data-default", items[0].value);
			});
		});
	}
	//选择器回调方法，联动时用这个
	// owner.onChangePopPicker = function() {
		// mui.alert("onChangePopPicker");
		// owner.getZwcnMb();
	// }
	
	owner.sbsubmit = function() {
		var sbje = document.getElementById('sbje').value;
		var jdsbh = document.getElementById('jdsbh').value;
		var datadefault = document.getElementById('zsdPicker').getAttribute('data-default');
		var fsxmData = document.getElementById('fsxmPicker').getAttribute('data-default');
		var xzqh = datadefault.split(",")[0];
		var swjgdm = datadefault.split(",")[1];
		// mui.alert("sbje:"+sbje+"jdsbh:"+jdsbh+"xzqh:"+xzqh+"swjgdm:"+swjgdm);
		// mui.alert(fsxmData);
		var  reqInfo = {
							"service": {
								"head": {
									"tran_id": "com.neusoft.fs.fssb",
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
										// "xm": xm,
										// "sfzhm": sfzhm,
										"je": sbje,
										"dsbh": jdsbh,
										"countycode": xzqh,
										"swjgdm": swjgdm
									}
								}
							}
						};
		var appUrl = 'http://192.168.1.100:9090/surrservice/fs/fssb';
		var detailPage = null;
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
				if(data != null && data != ''){
					var backinfo = JSON.parse(data);
					var code_head = backinfo.head.rtn_code;
					if(code_head == '0'){
						mui.openWindow({
							url: 'glqlpcf_sb.html',
							id: "glqlpcf_sb.html",
							extras: {
								sbxxjsonstr: JSON.stringify(backinfo.body.taxML.sbxxs[0])
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
				// mui.hideLoading();
				//获取本地数据
				mui.toast("网络连接异常，请确认手机网络状态！");
			}
		});
	}

}(mui, window.glqlpcf_jcxx = {}));
