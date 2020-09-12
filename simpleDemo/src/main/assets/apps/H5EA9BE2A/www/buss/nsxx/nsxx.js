
	//url
	var url = baseUtils.URL;
	//超时时间
	var atimeout = baseUtils.timeout;
	//账号
	var nsrmc = UserInfoUtils.getUserInfo().nsrmc
	//身份证号
	var nsrsbh = UserInfoUtils.getUserInfo().nsrsbh
	//缓存key
	var cachekey
	//页面加载
	 function pageload(webview,vm) {
		init(vm);
		addEvent();
	}
	
	// 初始化
	function init(vm) {
		getCxjmyb();
		getCxjmyl();
	}
	
	//添加事件
	function addEvent() {
		
	}
	
	//医保信息查询
	function getCxjmyb(){
		let tran_id = tranIdInfo.cxjmyb_jxxcx
		let taxML = {
				"xm": nsrmc,
				"zjhm": nsrsbh,
				"ssqq": new Date().getFullYear()+"-01-01",
				"ssqz": new Date().getFullYear()+"-12-31"
			}
		let data = ReqInfo.getReqInfo(tran_id,taxML)
		console.log("data>>>>"+JSON.stringify(data))
		$http.post(url,data,(res)=>{
			console.log(">>>>"+JSON.stringify(res))
			let rs = resResult.setAndGetAttrValue(res)
			//响应成功
			if(rs.Code === '000'){
				vm.cxjgGrid = rs.cxjgGrid
				cachekey = rs.cachekey
			}else{
				dialog.alert(rs.Message)
			}
		})
	}
	//养老信息查询
	function getCxjmyl(){
		let tran_id = tranIdInfo.cxjmyl_jxxcx
		let taxML = {
				"xm": nsrmc,
				"zjhm": nsrsbh,
				"ssqq": new Date().getFullYear()+"-01-01",
				"ssqz": new Date().getFullYear()+"-12-31"
			}
		let data = ReqInfo.getReqInfo(tran_id,taxML)
		console.log("data>>>>"+JSON.stringify(data))
		$http.post(url,data,(res)=>{
			console.log(">>>>"+JSON.stringify(res))
			let rs = resResult.setAndGetAttrValue(res)
			//响应成功
			if(rs.Code === '000'){
				vm.cxjgGrid = rs.cxjgGrid
				cachekey = rs.cachekey
			}else{
				dialog.alert(rs.Message)
			}
		})
	}
	
	
	
	