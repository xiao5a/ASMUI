(function(mui, owner) {
	//url前缀
	var appUrl = baseUtils.URL;
	//djxh
	var djxh = UserInfoUtils.getUserInfo().djxh;
	
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
		document.getElementById('SB_JE').innerText = sbxxdata.SB_JE+"元";
		document.getElementById('yzpzlsh').innerText = sbxxdata.yzpzlsh;
		document.getElementById('SKSSQ').innerText = sbxxdata.SKSSQQ +"至"+ sbxxdata.SKSSQZ;
		
		document.getElementById('zblsh').value = sbxxdata.zblsh;
		document.getElementById('SPD_SWJG').value = sbxxdata.SPD_SWJG;
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
		var ZJHM = document.getElementById('ZJHM').innerText;
		var yzpzlsh = document.getElementById('yzpzlsh').innerText;
		var SPD_SWJG = document.getElementById('SPD_SWJG').value;
		var zblsh = document.getElementById('zblsh').value;
		var kkfs_radio = document.querySelector('[name="radio"]:checked');
		var kkfs = "";
		if(kkfs_radio == null || kkfs_radio == "undefined" || kkfs_radio==""){
			mui.alert("请选择付款方式");	
		}else{
			kkfs = kkfs_radio.value;
		}
		var tran_id = tranIdInfo.cgsunionPay;
		var taxML = {
					"nsrsbh": ZJHM,
					"yzpzxh": yzpzlsh,
					"djxh": djxh,
					"SPD_SWJG": SPD_SWJG,
					"zblsh": zblsh,
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
	//申报作废
	owner.sbzfFun = function() {
		var yzpzlsh = document.getElementById('yzpzlsh').innerText;
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
					document.getElementById('sbzf').classList.add('mui-hidden');
					document.getElementById('pay').classList.add('mui-hidden');
					mui.alert(res.body.taxML.message);
				}else{
					mui.alert(res.head.rtn_msg.Message);
				}
			}else{
				mui.toast("数据异常！");
			}
		});
	}
	
}(mui, window.cgssb_jk = {}));