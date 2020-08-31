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
		document.getElementById('SKSSQ').innerText = sbxxdata.SKSSQQ +"至"+ sbxxdata.SKSSQZ;
	}

	// 初始化
	owner.myInit = function() {
		// mui.alert("123123");
	}

	// 刷新
	owner.refresh = function() {
		owner.myInit();
	}

	//添加事件
	owner.addEvent = function() {
		document.getElementById("prtwszmBtn").addEventListener("tap", function() {
			owner.prtwszmFun();	
		});
	}

	//打印完税证明
	owner.prtwszmFun = function() {
		mui.alert('证明在此');
	}
	
}(mui, window.cgssb_sbxx = {}));
