(function(mui, owner) {
	//url前缀
	var appUrl = baseUtils.URL;
	//超时时间
	var atimeout = baseUtils.timeout;
	//djxh
	var djxh = UserInfoUtils.getUserInfo().djxh;


	owner.pageload = function(webview) {
		owner.myInit();
		owner.addEvent();
		
		var fpcheck = webview.datafpcheck;
		var backinfo = JSON.parse(fpcheck);
		//缓存key
		document.getElementById('cacheKey').value = backinfo.body.taxML.cachekey;
		//纳税人信息
		document.getElementById('NSRSBH').innerText = backinfo.body.taxML.NSRXXFORM.NSRSBH;
		document.getElementById('NSRMC').innerText = backinfo.body.taxML.NSRXXFORM.NSRMC;
		document.getElementById('NSRSFZJZLMC').innerText = backinfo.body.taxML.NSRXXFORM.NSRSFZJZLMC;
		document.getElementById('ZJHM').innerText = backinfo.body.taxML.NSRXXFORM.ZJHM;
		document.getElementById('HYMC').innerText = backinfo.body.taxML.NSRXXFORM.HYMC;
		document.getElementById('DZ').innerText = backinfo.body.taxML.NSRXXFORM.DZ;
		document.getElementById('DJXH').innerText = backinfo.body.taxML.NSRXXFORM.DJXH;
		document.getElementById('SPD_SWJGMC').innerText = backinfo.body.taxML.NSRXXFORM.SPD_SWJGMC;
		//发票信息
		document.getElementById('JDCXSTYFPJSHJ').innerText = backinfo.body.taxML.fpxxs[0].JDCXSTYFPJSHJ;
		// document.getElementById('GMFMC').innerText = backinfo.body.taxML.fpxxs[0].GMFMC;
		document.getElementById('FPDM').innerText = backinfo.body.taxML.fpxxs[0].FPDM;
		document.getElementById('JDCXSTYFPHM').innerText = backinfo.body.taxML.fpxxs[0].JDCXSTYFPHM;
		document.getElementById('FPKJRQ').innerText = backinfo.body.taxML.fpxxs[0].FPKJRQ;
		document.getElementById('JDCXSTYFPJG').innerText = backinfo.body.taxML.fpxxs[0].JDCXSTYFPJG;
		//合格证信息
		document.getElementById('JDCZCCCHGZ').innerText = backinfo.body.taxML.hgzxx.JDCZCCCHGZ;
		document.getElementById('CLSCQYMC').innerText = backinfo.body.taxML.hgzxx.CLSCQYMC;
		document.getElementById('CLMC').innerText = backinfo.body.taxML.cshxxMap.CLGZSSBXXFORM.CLMC;
		document.getElementById('CLXH').innerText = backinfo.body.taxML.hgzxx.CLXH;
		document.getElementById('CLSBDH').innerText = backinfo.body.taxML.hgzxx.CLSBDH;
		// document.getElementById('CLYS').innerText = backinfo.body.taxML.hgzxx.CLYS;
		document.getElementById('FDJHM').innerText = backinfo.body.taxML.hgzxx.FDJHM;
		document.getElementById('XNYBS').innerText = backinfo.body.taxML.cshxxMap.CLGZSSBXXFORM.SFXNY=='1'?'是':'否';
		//车辆购置申报-计税信息
		document.getElementById('SBJSJG').innerText = backinfo.body.taxML.sbjsxx.SBJSJG;
		document.getElementById('JSJG').innerText = backinfo.body.taxML.sbjsxx.JSJG;
		document.getElementById('SL1').innerText = backinfo.body.taxML.sbjsxx.SL1;
		document.getElementById('YNSE').innerText = backinfo.body.taxML.sbjsxx.YNSE;
		document.getElementById('MSJSE').innerText = backinfo.body.taxML.sbjsxx.MSJSE;
		document.getElementById('YJSE').innerText = backinfo.body.taxML.sbjsxx.YJSE;
		document.getElementById('YBTSE').innerText = backinfo.body.taxML.sbjsxx.YBTSE;
		document.getElementById('ZNJ').innerText = backinfo.body.taxML.sbjsxx.ZNJ;
		document.getElementById('YJJHJ').innerText = backinfo.body.taxML.sbjsxx.YJJHJ;
	}

	// 初始化
	owner.myInit = function() {
		// mui.alert("1231234");
	}

	// 刷新
	owner.refresh = function() {
		owner.myInit();
	}

	//添加事件
	owner.addEvent = function() {
		document.getElementById("submitBtn").addEventListener("tap", function() {
			owner.submitFun();
		});
	}

	//搜索查询
	owner.searchFun = function() {
		
	}
	
	//申报
	owner.submitFun = function() {
		var cacheKey = document.getElementById('cacheKey').value;
		
		var tran_id = tranIdInfo.cgssb;
		var taxML = {
						"cachekey": cacheKey,
						"DLRDJXH": djxh
					};
		var reqInfo = ReqInfo.getReqInfo(tran_id,taxML);
		mui.showLoading("操作中...");
		$http.post(appUrl,reqInfo,(res)=>{
			mui.hideLoading();
			if(res != null && res != ''){
				console.log(JSON.stringify(res));
				var code_head = res.head.rtn_code;
				if(code_head == '0'){
					mui.openWindow({
						url: 'cgssb_jk.html',
						id: 'cgssb_jk.html',
						extras: {
							sbxxdata: res.body.taxML.sbxxs[0]
						}
					});
				}else{
					mui.alert(res.head.rtn_msg.Message);
				}
				
			}else{
				mui.toast("数据异常！");
			}
		});
		
		
		// var reqInfo={
		// 				"service": {
		// 					"body": {
		// 						"taxML": {
		// 							"cachekey": cacheKey,
		// 							"DLRDJXH": "20124200000011958577"
		// 						}
		// 					},
		// 					"head": {
		// 						"tran_time": "104606000",
		// 						"tran_date": "20190806",
		// 						"tran_seq": "270799db98b548528e7160dd0be73abb",
		// 						"expand": [{
		// 							"name": "identityType",
		// 							"value": "Hbswwb#476"
		// 						},
		// 						{
		// 							"name": "sjry",
		// 							"value": "mobile"
		// 						},
		// 						{
		// 							"name": "sjjg",
		// 							"value": "14200000000"
		// 						}],
		// 						"tran_id": "com.neusoft.cgs.cgssb",
		// 						"channel_id": "HBSW.NFWB.DZSWJWB"
		// 					}
		// 				}
		// 			};
		// var appUrl = 'http://192.168.1.100:9090/surrservice/cgs/cgssb';
		// mui.ajax(appUrl, {
		// 	data: reqInfo,
		// 	// dataType: 'json',
		// 	type: 'post',
		// 	// timeout: atimeout,
		// 	headers: {
		// 		'X-Requested-With': 'XMLHttpRequest',
		// 		'Content-Type': 'application/json;charset=utf-8',
		// 		'sso-token': '6666'
		// 	},
		// 	success: function(data) {
		// 		if (data != null && data != '') {
		// 			var backinfo = JSON.parse(data);
		// 			var code_head = backinfo.head.rtn_code;
		// 			if(code_head == '0'){
		// 				mui.openWindow({
		// 					url: 'cgssb_jk.html',
		// 					id: 'cgssb_jk.html',
		// 					extras: {
		// 						sbxxdata: backinfo.body.taxML.sbxxs[0]
		// 					}
		// 				});
		// 			}else{
		// 				mui.alert(backinfo.head.rtn_msg.Message);
		// 			}
		// 		} else {
		// 			mui.toast("数据异常！");
		// 		}
			
		// 	},
		// 	error: function(xhr, type, errorThrown) {
		// 		// mui.hideLoading();
		// 		//获取本地数据
		// 		mui.toast("网络连接异常，请确认手机网络状态！");
		// 	}
		// });
	}
}(mui, window.cgssbxxqr = {}));
