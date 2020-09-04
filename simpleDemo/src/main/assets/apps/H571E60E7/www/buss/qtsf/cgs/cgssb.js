(function(mui, owner) {
	//url前缀
	var appUrl = baseUtils.URL;
	//超时时间
	var atimeout = baseUtils.timeout;
	//纳税人名称（姓名）
	var nsrmc = UserInfoUtils.getUserInfo().nsrmc;
	//纳税人识别号（身份证号）
	var nsrsbh = UserInfoUtils.getUserInfo().nsrsbh;
	
	//上牌地
	var spdPicker =  new mui.PopPicker({
		layer: 2
	});
	
	
	
	owner.pageload = function(webview) {
		owner.myInit();
		owner.addEvent();
	}
	
	// 初始化
	owner.myInit = function() {
		document.getElementById('nsrmc').innerText = "姓名："+UserInfoUtils.getUserInfo().nsrmc;
		document.getElementById('nsrsbh').innerText = "身份证号："+UserInfoUtils.getUserInfo().nsrsbh;
		
		//退出的时候要清除代码表缓存数据
		// localStorage.removeItem("spdInfo");
		
		//获取代码表缓存，如果有，则不再调用初始化代码表方法，如果有调用方法初始化数据
		var spdInfo = localStorage.getItem("spdInfo");
		if (spdInfo != "undefined" && spdInfo != null && spdInfo != "" && spdInfo != '{}') {
			spdPicker.setData(JSON.parse(spdInfo));
		} else{
			owner.initSpdData();
		}
		
	}
	
	// 刷新
	// owner.refresh = function() {
	// 	owner.myInit();
	// }
	
	//添加事件
	owner.addEvent = function() {
		document.getElementById("nextBtn").addEventListener("tap", function() {
			owner.nextbtn();
		});
		document.getElementById("searchBtn").addEventListener("tap", function() {
			owner.searchSbxx();
		});
		document.getElementById('spdPicker').addEventListener('tap', function() {
			spdPicker.show(function(items) {
				document.getElementById('spdPicker').value = items[0].text + " " + items[1].text;
				document.getElementById('spdPicker').setAttribute("data-default", items[0].value+","+items[1].value);
			});
		});
	}
	//选择器回调方法，联动时用这个
	// owner.onChangePopPicker = function() {
		// mui.alert("onChangePopPicker");
		// owner.getZwcnMb();
	// }
	//初始上牌地
	owner.initSpdData = function() {
		var tran_id = tranIdInfo.dwcj;
		var taxML = {
						"query_id" : "cgs"
					};
		var reqInfo = ReqInfo.getReqInfo(tran_id,taxML);
		
		$http.post(appUrl,reqInfo,(res)=>{
			console.log(JSON.stringify(res));
			if(res != null && res != ''){
				var code_head = res.head.rtn_code;
				if(code_head == '0'){
					spdPicker.setData(res.body.taxML.dwcj);
					//把数据放到缓存中
					localStorage.setItem("spdInfo", JSON.stringify(res.body.taxML.dwcj));
				}else{
					mui.alert(res.head.rtn_msg.Message);
				}
				
			}else{
				mui.toast("数据异常！");
			}
		});
	}
	//下一步
	owner.nextbtn = function() {
		var clsbdm = document.getElementById('clsbdm').value;
		var datadefault = document.getElementById('spdPicker').getAttribute('data-default');
		var xzqh = datadefault.split(",")[0];
		var swjgdm = datadefault.split(",")[1];
		var getcgsfpxx_tran_id = tranIdInfo.getcgsfpxx;
		var getcgsfpxx_taxML = {
						"cjhm" : clsbdm
					};
		var getcgsfpxx = ReqInfo.getReqInfo(getcgsfpxx_tran_id,getcgsfpxx_taxML);
		mui.showLoading("操作中...");
		$http.post(appUrl,getcgsfpxx,(res)=>{
			mui.hideLoading();
			console.log(JSON.stringify(res));
			if(res != null && res != ''){
				var code_head = res.head.rtn_code;
				if(code_head == '0'){
					var fpxx = {
						"swjgdm" : swjgdm,
						"res" : res
					}
					mui.openWindow({
						url: 'cgsfpxx.html',
						id: 'cgsfpxx.html',
						extras: {
							fpxxdata: JSON.stringify(fpxx)
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
	//查询申报数据
	owner.searchSbxx = function() {
		var clsbdm = document.getElementById('clsbdm').value;
		mui.openWindow({
			url: 'cgssb_sbxx.html',
			id: "cgssb_sbxx.html",
			extras: {
				clsbdmData: clsbdm
			}
		});
	}
}(mui, window.cgssb = {}));
