
	//url
	var url = baseUtils.URL;
		
	//超时时间
	var atimeout = baseUtils.timeout;
	
	//账号
	var nsrmc = UserInfoUtils.getUserInfo().nsrmc
	//身份证号
	var nsrsbh = UserInfoUtils.getUserInfo().nsrsbh
	//登记序号
	var djxh = UserInfoUtils.getUserInfo().djxh
	//cachekey
	var cachekey
	//页面加载
	 function pageload(webview,vm) {
		init(vm);
		addEvent();
	}
	
	// 初始化
	function init(vm) {
		//获取页面数据
		getSbdjxx()
	}
	
	//添加事件
	function addEvent() {
		
	}
	
	function getSbdjxx(){
		let tran_id = tranIdInfo.cxjmyb_getSbdjxx
		let taxML =  {
					"xm": nsrmc,
					"zjhm": nsrsbh
		}
		let data = ReqInfo.getReqInfo(tran_id,taxML)
		
		$http.post(url,data,(res)=>{
			let rs = resResult.setAndGetAttrValue(res)
			console.log(rs)
			if(rs.Code === '000'){
				vm.cxjgGrid = rs.cxjgGrid
				cachekey = rs.cachekey
			}else{
				dialog.autoCloseDialogIfNoData(rs.Message)
			}
		})
	}
	
	//社保核定信息
	function getCxjmHd(sbh,jbjg_dm){
		let tran_id = tranIdInfo.getCxjmHd
		let taxML = {
                "cachekey": cachekey,
                "sbh": sbh,
                "jbjg_dm":jbjg_dm
            }
		let data = ReqInfo.getReqInfo(tran_id,taxML)
		
		$http.post(url,data,(res)=>{
			let rs = resResult.setAndGetAttrValue(res)
			if(rs.Code === '000'){
				gotoHd(rs.cxjgGrid)
			}else{
				dialog.alert(rs.Message)
			}
		})
		
	}
	
	//进入核定页面
	function gotoHd(cxjgGrid){
		console.log(cxjgGrid)
		mui.openWindow({
			url:"cxybhd.html",
			id:"cxybhd.html",
			/* styles:{
			  top:0px,//新页面顶部位置
			  bottom:0px,//新页面底部位置
			  width:100%,//新页面宽度，默认为100%
			  height:100%,//新页面高度，默认为100%
			}, */
			extras:{
				"cxjgGrid":cxjgGrid
			}
		})
	}
