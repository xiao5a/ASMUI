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
		
		var sbxxdata = webview.sbxxdata;
		document.getElementById('SBJKZT').innerText = sbxxdata.sbzt +"|"+sbxxdata.jkzt;
		document.getElementById('NSRMC').innerText = sbxxdata.NSRMC;
		document.getElementById('ZJHM').innerText = sbxxdata.ZJHM;
		document.getElementById('clsbdm').innerText = sbxxdata.clsbdm;
		document.getElementById('fpdm').innerText = sbxxdata.fpdm;
		document.getElementById('fphm').innerText = sbxxdata.fphm;
		document.getElementById('sbsj').innerText = sbxxdata.sbsj;
		document.getElementById('SB_JE').innerText = sbxxdata.SB_JE;
		document.getElementById('yzpzlsh').innerText = sbxxdata.yzpzlsh;
		document.getElementById('SKSSQZ').innerText = sbxxdata.SKSSQQ +"至"+ sbxxdata.SKSSQZ;
	}

	// 初始化
	owner.myInit = function() {
		// mui.alert("111");
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
		document.getElementById("sbzf").addEventListener("tap", function() {
			owner.sbzfFun();	
		});
	}

	//搜索查询
	owner.searchFun = function() {
	}
	//缴款
	owner.payFun = function() {
		var reqInfo={
						"service": {
							"head": {
								"tran_id": "com.neusoft.cgs.cgsunionPay",
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
									"SPD_SWJG": "14213770000",
									"djxh": "20114200100011278642",
									"nsrsbh": "420683198410061526",
									"yzpzxh": "10014219000001483062",
									"zblsh": "7e31ea4c23db4af29de61f8c5f5974b1"
								}
							}
						}
					};
		var appUrl = 'http://192.168.1.100:9090/surrservice/cgs/cgsunionPay';
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
						mui.alert('缴款成功，电子税票号码为：'+backinfo.body.taxML.dzsph)
					}else{
						mui.alert(backinfo.head.rtn_msg.Message);
					}
					
					console.log("---getData---:" + JSON.stringify(data));
				} else {
					mui.toast("数据异常！");
				}
			},
			error: function(xhr, type, errorThrown) {
				mui.toast("网络连接异常，请确认手机网络状态！");
			}
		});
	}
	owner.sbzfFun = function() {
		mui.alert('无样例报文');
	}
	
}(mui, window.cgssb_jk = {}));
