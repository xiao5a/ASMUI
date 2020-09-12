	//url
	var url = baseUtils.URL;
	//账号
	var nsrmc = UserInfoUtils.getUserInfo().nsrmc
	//身份证号
	var nsrsbh = UserInfoUtils.getUserInfo().nsrsbh
	//cachekey
	var cachekey
	
	function pageload(webview,vm) {
		init(vm);
		addEvent();
	}
	
	// 初始化
	function init(vm) {
		console.log("mui init");
		grsbdjxx();
	}
	
	// 刷新
	function refresh() {
		myInit();
	}
	
	//添加事件
	function addEvent() {
		document.getElementById("ylxxinfo").addEventListener("tap", function() {
			console.log("---addEvent="  );
		});
	}
	
	//查询
	function grsbdjxx() {
		let trand_id = tranIdInfo.grsb_getSbdjxx
		let taxML = {
				"xm": nsrmc,
				"zjhm": nsrsbh
			}
		let data = ReqInfo.getReqInfo(trand_id,taxML)
		$http.post(url,data,(res)=>{
			console.log("..."+JSON.stringify(res))
			let rs = resResult.setAndGetAttrValue(res)
			console.log(res)
			if(rs.Code == '000'){
				vm.djxxs = rs.items
				cachekey = rs.cachekey
			}else{
				dialog.autoCloseDialogIfNoData(rs.Message)
			}
			if(!rs.items.length){
				dialog.autoCloseDialogIfNoData("没有查到登记信息")
			}
		})
		
	}
	
	//核定
	function toHdPage(item){
		mui.openWindow({
			url: './grsbhdxx.html',
			id: "grsbhdxx.html",
			extras: {
				"item": item,
				"cachekey":cachekey,
			}
		});
	}	 
	

	
	

