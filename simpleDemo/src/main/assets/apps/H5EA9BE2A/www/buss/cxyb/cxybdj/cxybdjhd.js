	//url
	var url = baseUtils.URL;
	//账号
	var nsrmc = UserInfoUtils.getUserInfo().nsrmc
	//身份证号
	var nsrsbh = UserInfoUtils.getUserInfo().nsrsbh
	//登记序号
	var djxh = UserInfoUtils.getUserInfo().djxh
	
	
	//页面加载
	 function pageload(webview,vm) {
		init(vm)
		addEvent()
	}
	
	// 初始化
	function init(vm) {
		
	}
	
	//添加事件
	function addEvent() {
		document.getElementById("gotoJk").addEventListener("tap", function() {
		 	gotoJk();
		})
	}
	
	//打开缴费页面
	function jk(){
		if(!vm.checkCxjgGrid.length){
			dialog.alert("请选择需要缴款的数据")
			return
		}
		mui('#jk').popover('toggle')
	}
	
	//去缴费
	function gotoJk(){
		let data = getPayReqData(vm.radioValue,vm.checkCxjgGrid,vm.cachekey)
		console.log("缴费请求数据>>>>>>>>>>>>"+JSON.stringify(data))
		
		$http.post(url,data,(res)=>{
			console.log("缴费返回数据 >>>>>>>>>"+JSON.stringify(res))
			let rs = resResult.setAndGetAttrValue(res)
			if(rs.Code == '000'){
				payUtils.payHandler(vm.radioValue,res)
			}else{
				mui('#jk').popover('toggle')
				dialog.alert(rs.Message)
			}
		})
	}
	
	//获取支付请求数据
	function getPayReqData(payWay,checkedData,cachekey){
		let tran_id
		let taxML
		//支付宝快捷支付
		if(payWay == 'aliPayQuick'){
			tran_id = tranIdInfo.alijk
			taxML = {
				"hdbhs":checkedData,
				"cachekey":cachekey
			}
		}
		//微信快捷支付
		else if(payWay == 'wechatPayQuick'){
			dialog.alert("暂不支持该支付方式")
			return
		}
		//申报缴款
		else{
			let  kkfs
			//银联
			if(payWay == 'dsfunion'){
				kkfs = 'dsfunion'
			}
			//支付宝
			if(payWay == 'dsfali'){
				kkfs = 'dsfali'
			}
			//微信
			if(payWay == 'dsfwx'){
				kkfs = 'dsfwx'
			}
			tran_id = tranIdInfo.cxjmyb_jk
			taxML = {
				"kkfs":kkfs,
				"hdbhs":checkedData,
				"cachekey":cachekey
			}
		}
		
		return ReqInfo.getReqInfo(tran_id,taxML)
	}
	
	
	