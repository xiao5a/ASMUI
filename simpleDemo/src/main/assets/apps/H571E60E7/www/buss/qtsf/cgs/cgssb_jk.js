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
		document.getElementById('SB_JE').innerText = sbxxdata.SB_JE;
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
		
		var tran_id = tranIdInfo.cgsunionPay;
		var taxML = {
					"nsrsbh": ZJHM,
					"yzpzxh": yzpzlsh,
					"djxh": djxh,
					"SPD_SWJG": SPD_SWJG,
					"zblsh": zblsh
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
