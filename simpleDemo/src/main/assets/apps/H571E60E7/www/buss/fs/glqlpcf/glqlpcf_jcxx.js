(function(mui, owner) {
	//url前缀
	var appUrl = baseUtils.URL;
	//纳税人名称（姓名）
	var nsrmc = UserInfoUtils.getUserInfo().nsrmc;
	//纳税人识别号（身份证号）
	var nsrsbh = UserInfoUtils.getUserInfo().nsrsbh;
	//登记序号
	var djxh = UserInfoUtils.getUserInfo().djxh
	
	
	//执收地
	var zsdPicker =  new mui.PopPicker({
		layer: 2
	});
	
	var fsxmPicker = new mui.PopPicker();
	
	
	owner.pageload = function(webview) {
		owner.myInit();
		owner.addEvent();
	}
	
	// 初始化
	owner.myInit = function() {
		document.getElementById('nsrmc').innerText = "姓名："+UserInfoUtils.getUserInfo().nsrmc;
		document.getElementById('nsrsbh').innerText = "身份证号："+UserInfoUtils.getUserInfo().nsrsbh;
		
		var fsxmData = [{
			"value": "3044290001420001",
			"text": "公路桥梁赔偿费",
			}];
		fsxmPicker.setData(fsxmData);
		document.getElementById('fsxmPicker').value = '公路桥梁赔偿费';
		document.getElementById('fsxmPicker').setAttribute("data-default", '3044290001420001');
		
		//退出的时候要清除代码表缓存数据
		// localStorage.removeItem("zsdwInfo");
		
		//获取代码表缓存，如果有，则不再调用初始化代码表方法，如果有调用方法初始化数据
		var zsdwInfo = localStorage.getItem("zsdwInfo");
		if (zsdwInfo != "undefined" && zsdwInfo != null && zsdwInfo != "" && zsdwInfo != '{}') {
			zsdPicker.setData(JSON.parse(zsdwInfo));
		} else{
			owner.initfszsdwData();
		}
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
		document.getElementById("searchBtn").addEventListener("tap", function() {
			owner.searchSbxx();
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
	//初始化执收单位
	owner.initfszsdwData = function() {
		var tran_id = tranIdInfo.dwcj;
		var taxML = {
						"query_id" : "glql"
					};
		var reqInfo = ReqInfo.getReqInfo(tran_id,taxML);
		
		$http.post(appUrl,reqInfo,(res)=>{
			if(res != null && res != ''){
				var code_head = res.head.rtn_code;
				if(code_head == '0'){
					zsdPicker.setData(res.body.taxML.dwcj);
					//把数据放到缓存中
					localStorage.setItem("zsdwInfo", JSON.stringify(res.body.taxML.dwcj));
				}else{
					mui.alert(res.head.rtn_msg.Message);
				}
				
			}else{
				mui.toast("数据异常！");
			}
		});
	}
	owner.sbsubmit = function() {
		var sbje = document.getElementById('sbje').value;
		var jdsbh = document.getElementById('jdsbh').value;
		var datadefault = document.getElementById('zsdPicker').getAttribute('data-default');
		var xzqh = datadefault.split(",")[0];
		var swjgdm = datadefault.split(",")[1];
		if (sbje == "undefined" || sbje == null || sbje == "") {
			mui.alert("请录入申报金额");
			return;
		}
		if (xzqh == "undefined" || xzqh == null || xzqh == "") {
			mui.alert("请选择执收地");
			return;
		}
		if (swjgdm == "undefined" || swjgdm == null || swjgdm == "") {
			mui.alert("请选择执收地");
			return;
		}
		var tran_id = tranIdInfo.fssb;
		var taxML = {
						"xm": nsrmc,
						"sfzhm": nsrsbh,
						"je": sbje,
						"dsbh": jdsbh,
						"countycode": xzqh,
						"swjgdm": swjgdm
					};
		var reqInfo = ReqInfo.getReqInfo(tran_id,taxML);
		
		mui.showLoading("操作中...");
		$http.post(appUrl,reqInfo,(res)=>{
			mui.hideLoading();
			if(res != null && res != ''){
				var code_head = res.head.rtn_code;
				if(code_head == '0'){
					console.log(JSON.stringify(res.body.taxML.sbxxs[0]));
					mui.openWindow({
						url: 'glqlpcf_sb.html',
						id: "glqlpcf_sb.html",
						extras: {
							sbxxjsonstr: JSON.stringify(res.body.taxML.sbxxs[0])
						}
					});
				}else{
					mui.alert(res.head.rtn_msg.Message);
				}
				
			}else{
				mui.toast("数据异常！");
			}
		});
	}
	//查询申报数据
	owner.searchSbxx = function() {
		mui.openWindow({
			url: 'glqlpcf_sbxx.html',
			id: "glqlpcf_sbxx.html",
			extras: {
			}
		});
	}
}(mui, window.glqlpcf_jcxx = {}));
