	//url
	var url = baseUtils.URL;
	//账号
	var nsrmc = UserInfoUtils.getUserInfo().nsrmc
	//身份证号
	var nsrsbh = UserInfoUtils.getUserInfo().nsrsbh
	
	function pageload(webview,vm) {
		init(vm);
		addEvent();
	}
	
	function init(){
		
	}
	
	function addEvent(){
		
	}
	
	//缴款
	function jk(){
		let tran_id = tranIdInfo.grsb_jk
		let taxMl = vm.reqTaxML
		let data = ReqInfo.getReqInfo(tran_id,taxMl)
		$http.post(url,data,(res)=>{
			console.log("res>>>"+JSON.stringify(res))
		})
	}
	