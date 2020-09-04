(function(mui, owner) {
	//url前缀
	var appUrl = baseUtils.URL;
	//登记序号
	var djxh = UserInfoUtils.getUserInfo().djxh;
	//纳税人识别号（身份证号）
	var nsrsbh = UserInfoUtils.getUserInfo().nsrsbh;
	//车架号
	var clsbdm = "";

	owner.pageload = function(webview) {
		clsbdm = webview.clsbdmData;
		owner.myInit();
		owner.addEvent();
	}

	// 初始化
	owner.myInit = function() {
		owner.initSbxx();
	}

	// 刷新
	owner.refresh = function() {
		owner.myInit();
	}

	//添加事件
	owner.addEvent = function() {
		// document.getElementById("prtwszmBtn").addEventListener("tap", function() {
		// 	owner.prtwszmFun();	
		// });
	}


	// 初始化申报信息
	owner.initSbxx = function() {
		var tran_id = tranIdInfo.getcgssbxx;
		var taxML = {
					"DLRDJXH": djxh,
					"cjhm": clsbdm,
					"sfzhm": nsrsbh
				};
		var reqInfo = ReqInfo.getReqInfo(tran_id,taxML);
		mui.showLoading("获取数据中...");
		console.log(JSON.stringify(reqInfo));
		$http.post(appUrl,reqInfo,(res)=>{
			console.log(JSON.stringify(res));
			mui.hideLoading();
			if(res != null && res != ''){
				var code_head = res.head.rtn_code;
				if(code_head == '0'){
					vm.sbxxGrid = res.body.taxML.sbxxs;
				}else{
					mui.alert(res.head.rtn_msg.Message);
					vm.sbxxGrid = null;
				}
				
			}else{
				mui.toast("数据异常！");
			}
		});
	}
	//缴款
	owner.payFun = function(item) {
		mui.alert(JSON.stringify(item));
		var tran_id = tranIdInfo.cgsunionPay;
		var taxML = {
						"SPD_SWJG": item.SPD_SWJG,
						"djxh": item.DJXH,
						"nsrsbh": item.ZJHM,
						"yzpzxh": item.yzpzlsh,
						"zblsh": item.zblsh
					};
		var reqInfo = ReqInfo.getReqInfo(tran_id,taxML);
		mui.alert("缴款成功，打开对应的注释代码");
		// mui.showLoading("获取数据中...");
		// console.log(JSON.stringify(reqInfo));
		// $http.post(appUrl,reqInfo,(res)=>{
		// 	console.log(JSON.stringify(res));
		// 	mui.hideLoading();
		// 	if(res != null && res != ''){
		// 		var code_head = res.head.rtn_code;
		// 		if(code_head == '0'){
		// 			mui.alert("调用缴款接口成功，打开对应的注释代码");
		// 			//安卓支付宝，需要加if判断是android还是ios
		// 			// var Intent = plus.android.importClass("android.content.Intent");
		// 			// var Uri = plus.android.importClass("android.net.Uri");
		// 			// var main = plus.android.runtimeMainActivity();
		// 			// // var uri = Uri.parse('weixin:\/\/dl\/business\/?ticket=t617b498b65a698b9e165565e8e71f04c');
		// 			// var uri = Uri.parse('alipays:\/\/platformapi\/startapp?appId=10000007&sourceId=420000&actionType=route&codeContent=tips%3A%2F%2Fbt%3D02%26ea%3D01%26ck%3D42%26ed%3DG31bpiDEIypPbancFzpVYjgHKRKYV4Ej%2FmFI6aAB7bO%2BrNwvXieXoSbWmLW6Go8E7Xbo%2F%2BGHpqiSpkjRNCgluz7nph2sI%2FGI%2Bki35DxcZ%2Bw%3D%26sa%3D01%26ek%3D00%26sn%3D8mtfCqaolMBgxFSqKTdpgT4IZBjRLDQbwSxfJKUCYq9oBaa6vKxTtCdDCapJ27SLZb04XtuYNFsvEmKOTbUDZA%3D%3D&biz_return_url=hbtaxapp%3A%2F%2Fpay%2Fresult%3Fbqtu%3D442016200500043706%26ywlx%3DCXYBSBF');
		// 			// var intent1 = new Intent(Intent.ACTION_VIEW,uri);
		// 			// main.startActivity(intent1);
					
		// 			//银联支付
		// 			// var payurl = "https://etax.hubei.chinatax.gov.cn/webroot/UnionTipsPay?"
		// 			// 			+ "dzsph="+res.body.taxML.dzsph 
		// 			// 			+ "&nsrsbh="+res.body.taxML.nsrsbh 
		// 			// 			+ "&hsjgdm="+res.body.taxML.hsjgdm ;
		// 			// mui.openWindow({
		// 			// 	url: payurl,
		// 			// 	id: payurl,
		// 			// 	extras: {}
		// 			// });
		// 		}else{
		// 			mui.alert(res.head.rtn_msg.Message);
		// 		}
				
		// 	}else{
		// 		mui.toast("数据异常！");
		// 	}
		// });
	}
	//打印完税证明
	owner.prtwszmFun = function(clsbdm1) {
		var tran_id = tranIdInfo.getcgswszm;
		var taxML = {
						"cjhm": clsbdm1
					};
		var reqInfo = ReqInfo.getReqInfo(tran_id,taxML);
		console.log(JSON.stringify(reqInfo));
		mui.showLoading("操作中...");
		$http.post(appUrl,reqInfo,(res)=>{
			console.log(JSON.stringify(res));
			mui.hideLoading();
			if(res != null && res != ''){
				var code_head = res.head.rtn_code;
				if(code_head == '0'){
					var url = res.body.taxML.fileName;
					var dtask = plus.downloader.createDownload(url, {}, function(d, status) {
					    if(status == 200) {
					        var fileUrl = d.filename;
					        plus.runtime.openFile(fileUrl, {}, function(e) {
					            alert('打开失败');
					        });
					    } else {
					        alert("Download failed: " + status);
					    }
					});
					dtask.start();
				}else{
					mui.alert(res.head.rtn_msg.Message);
				}
			}else{
				mui.toast("数据异常！");
			}
		});
	}
	//申报作废
	owner.sbzfFun = function(yzpzlsh) {
		var tran_id = tranIdInfo.cgssbxxzf;
		var taxML = {
						"DLRDJXH": djxh,
						"YZPZXH": yzpzlsh
					};
		var reqInfo = ReqInfo.getReqInfo(tran_id,taxML);
		
		mui.showLoading("操作中...");
		$http.post(appUrl,reqInfo,(res)=>{
			console.log(JSON.stringify(res));
			mui.hideLoading();
			if(res != null && res != ''){
				console.log(JSON.stringify(res));
				var code_head = res.head.rtn_code;
				if(code_head == '0'){
					mui.alert(res.body.taxML.message);
					owner.refresh();
				}else{
					mui.alert(res.head.rtn_msg.Message);
				}
			}else{
				mui.toast("数据异常！");
			}
		});
	}
	//查验状态
	owner.cyztFun = function(item) {
		var tran_id = tranIdInfo.cgsunionPaycyjkzt;
		var taxML = {
						"SPD_SWJG": item.SPD_SWJG,
						"djxh": item.DJXH,
						"nsrsbh": item.ZJHM,
						"yzpzxh": item.yzpzlsh,
						"zblsh": item.zblsh,
						"skssqq": item.SKSSQQ,
						"skssqz": item.SKSSQZ,
						"jkbz": "union"
					};
					
		var reqInfo = ReqInfo.getReqInfo(tran_id,taxML);
		console.log("请求报文："+JSON.stringify(reqInfo));
		mui.showLoading("操作中...");
		$http.post(appUrl,reqInfo,(res)=>{
			mui.hideLoading();
			if(res != null && res != ''){
				console.log(JSON.stringify(res));
				var code_head = res.head.rtn_code;
				if(code_head == '0'){
					mui.alert(res.body.taxML.message);
				}else{
					mui.alert(res.head.rtn_msg.Message);
				}
			}else{
				mui.toast("数据异常！");
			}
		});
	}
}(mui, window.cgssb_sbxx = {}));
