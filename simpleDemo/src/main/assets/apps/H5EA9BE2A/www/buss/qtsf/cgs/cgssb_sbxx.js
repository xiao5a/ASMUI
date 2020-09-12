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
		document.getElementById("gotoJk").addEventListener("tap", function() {
		 	owner.payFun();
		});
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
	owner.payFun = function() {
		var item = checksbxxGrid;
		var kkfs_radio = document.querySelector('[name="radio"]:checked');
		var kkfs = "";
		if(kkfs_radio == null || kkfs_radio == "undefined" || kkfs_radio==""){
			mui.alert("请选择付款方式");	
		}else{
			kkfs = kkfs_radio.value;
		}
		var tran_id = tranIdInfo.cgsunionPay;
		var taxML = {
						"SPD_SWJG": item.SPD_SWJG,
						"djxh": item.DJXH,
						"nsrsbh": item.ZJHM,
						"yzpzxh": item.yzpzlsh,
						"zblsh": item.zblsh,
						"kkfs": kkfs
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
					var taxinfo = res.body.taxML.taxinfo;
					if(kkfs == 'dsfunion'){
						//银联支付
						var payurl = "https://etax.hubei.chinatax.gov.cn/webroot/UnionTipsPay?"
									+ "dzsph="+res.body.taxML.dzsph 
									+ "&nsrsbh="+res.body.taxML.nsrsbh 
									+ "&hsjgdm="+res.body.taxML.hsjgdm 
									+ "&founturl=info.html?tqnrbz=3";
						mui.openWindow({
							url: payurl,
							id: payurl,
							extras: {}
						});
					}else{
						//判断是android还是ios
						if(mui.os.ios){
							alert("ios");
						}else if(mui.os.android){
							var Intent = plus.android.importClass("android.content.Intent");
							var Uri = plus.android.importClass("android.net.Uri");
							var main = plus.android.runtimeMainActivity();
							var uri = Uri.parse(taxinfo);
							var intent1 = new Intent(Intent.ACTION_VIEW,uri);
							main.startActivity(intent1);
						}else{
							mui.alert("app版本有问题，只能使用安卓和苹果手机缴费！");
						}
					}
					owner.refresh();
				}else{
					mui.alert(res.head.rtn_msg.Message);
					owner.refresh();
				}
				
			}else{
				mui.alert("数据异常！");
			}
		});
	}
	//打印完税证明
	owner.prtwszmFun = function(cjhm) {
		var tran_id = tranIdInfo.getcgswszm;
		var taxML = {
						"cjhm": cjhm
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
