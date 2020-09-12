(function(mui, owner) {
	//url前缀
	var appUrl = baseUtils.URL;
	//纳税人名称（姓名）
	var nsrmc = UserInfoUtils.getUserInfo().nsrmc;
	//纳税人识别号（身份证号）
	var nsrsbh = UserInfoUtils.getUserInfo().nsrsbh;

	owner.pageload = function(webview) {
		owner.myInit();
		owner.addEvent();
	}

	// 初始化
	owner.myInit = function() {
		document.getElementById('nsrmc').innerText = UserInfoUtils.getUserInfo().nsrmc;
		document.getElementById('nsrsbh').innerText = UserInfoUtils.getUserInfo().nsrsbh;
	}

	// 刷新
	owner.refresh = function() {
		owner.myInit();
	}

	//添加事件
	owner.addEvent = function() {
		document.getElementById("serchBtn").addEventListener("tap", function() {
			owner.searchSbxx();
		});
	}

	//搜索查询
	owner.searchFun = function() {
		
	}
	//查询申报数据
	owner.searchSbxx = function() {
		var clsbdm = document.getElementById('clsbdm').value;
		if (clsbdm == "undefined" || clsbdm == null || clsbdm == "") {
			mui.alert("请录入车辆识别代码");
			return;
		}
		mui.openWindow({
			url: 'cgssb_sbxx.html',
			id: "cgssb_sbxx.html",
			extras: {
				clsbdmData: clsbdm
			}
		});
	}
}(mui, window.cgssb_sbxxcx = {}));
