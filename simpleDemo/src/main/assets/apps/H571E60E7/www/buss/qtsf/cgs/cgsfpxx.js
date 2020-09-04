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
		
		var backinfo = JSON.parse(webview.fpxxdata);
		//发票信息
		document.getElementById('fkje').innerText = backinfo.res.body.taxML.fpxxs[0].je;
		document.getElementById('CLLX').innerText = backinfo.res.body.taxML.fpxxs[0].CLLX;
		document.getElementById('fpdm').innerText = backinfo.res.body.taxML.fpxxs[0].fpdm;
		document.getElementById('fphm').innerText = backinfo.res.body.taxML.fpxxs[0].fphm;
		document.getElementById('kprq').innerText = backinfo.res.body.taxML.fpxxs[0].kprq;
		document.getElementById('fphsje').innerText = backinfo.res.body.taxML.fpxxs[0].je;
		document.getElementById('cjhm').value = backinfo.res.body.taxML.fpxxs[0].CJHM;
		document.getElementById('swjgdm').value = backinfo.swjgdm;
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
		document.getElementById("checkfpxxBtn").addEventListener("tap", function() {
			owner.checkfpxxFun();
		});
	}

	//搜索查询
	owner.searchFun = function() {
		
	}
	
	//申报
	owner.checkfpxxFun = function() {
		var fpdm = document.getElementById('fpdm').innerText;
		var fphm = document.getElementById('fphm').innerText;
		var kprq = document.getElementById('kprq').innerText;
		var clsbdm = document.getElementById('cjhm').value;
		var swjgdm = document.getElementById('swjgdm').value;
		var cgsfpCheck_tran_id = tranIdInfo.cgsfpCheck;
		var cgsfpCheck_taxML = {
						"fpdm": fpdm,
						"fphm": fphm,
						"SPD_SWJG": swjgdm,
						"cdsx": "1",
						"clgzdsxDm": "1",
						"clgzsjsfsDm": "1",
						"clgzssblxDm": "0100",
						"kprq" : kprq,
						"cjhm" : clsbdm
					};
		var cgsfpCheck = ReqInfo.getReqInfo(cgsfpCheck_tran_id,cgsfpCheck_taxML);
		console.log(JSON.stringify(cgsfpCheck));
		mui.showLoading("操作中...");
		$http.post(appUrl,cgsfpCheck,(res)=>{
			mui.hideLoading();
			console.log(JSON.stringify(res));
			if(res != null && res != ''){
				var code_head = res.head.rtn_code;
				if(code_head == '0'){
					mui.openWindow({
						url: 'cgssbxxqr.html',
						id: 'cgssbxxqr.html',
						extras: {
							datafpcheck: JSON.stringify(res)
						}
					});
				}else{
					mui.hideLoading();
					mui.alert(res.head.rtn_msg.Message);
				}
			}else{
				mui.hideLoading();
				mui.toast("数据异常！");
			}
		});
	}
}(mui, window.cgsfpxx = {}));
