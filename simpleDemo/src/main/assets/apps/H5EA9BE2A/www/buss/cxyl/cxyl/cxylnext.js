
	//url
	var url = baseUtils.URL;
	//超时时间
	var atimeout = baseUtils.timeout;
	//账号
	var nsrmc = UserInfoUtils.getUserInfo().nsrmc
	//身份证号
	var nsrsbh = UserInfoUtils.getUserInfo().nsrsbh
	//补缴年度
	var bjnd
	
	//页面加载
	 function pageload(webview,vm) {
		init(vm);
		addEvent();
	}
	
	// 初始化
	function init(vm) {
		
	}
	
	//添加事件
	function addEvent() {
		
	}
	
	//选择补缴类型发送请求
	function getHdxx(value){
		let tran_id = tranIdInfo.getHdxx
		let taxML = {
				"cachekey": vm.cachekey,
				"sbh": vm.sbh,
				"jbjg_dm": vm.jbjg_dm
			}
		let data = ReqInfo.getReqInfo(tran_id,taxML)
		$http.post(url,data,(res)=>{
			let rs = resResult.setAndGetAttrValue(res)
			if(rs.Code === '000'){
				//一次性补缴
				if(vm.bjlx_value == '1'){
					vm.bjns = rs.taxML.zdbjns
					vm.bjnsArr = []
					vm.date = rs.taxML.bjnd
				}else{
					console.log("taxML.zdbjns:"+rs.taxML.zdbjns)
					vm.bjnsArr = []
					for(var i = 1 ; i < parseInt(rs.taxML.zdbjns)+1; i++){
						vm.bjnsArr.push({text:''+i, value:i})
					}
					console.log("vm.bjnsArr>>>"+JSON.stringify(vm.bjnsArr))
					vm.bjnd = rs.taxML.bjnd
					vm.date = rs.taxML.bjnd
				}
			}
			console.log(JSON.stringify(res))
		})
	}
	
	//城乡居民养老登记信息查询
	function getCxjmylSbdjxx(){
		let tran_id = tranIdInfo.cxjmyl_getSbdjxx
		let taxML = {
				"xm": nsrmc,
				"zjhm": nsrsbh
			}
		let data = ReqInfo.getReqInfo(tran_id,taxML)
		
		$http.post(url,data,(res)=>{
			let rs = resResult.setAndGetAttrValue(res)
			if(rs.Code === '000'){
				vm.cxjgGrid = rs.cxjgGrid
			}else{
				dialog.alert(rs.Message)
			}
		})
	}
	
	//选择补缴年数类型
	function chooseBjns() {
		if(vm.bjlx_value == '1'){
			return
		}
		let picker = new mui.PopPicker(); 
		picker.setData(vm.bjnsArr);
		
		picker.show(function(items) {
			vm.bjns = items[0].text;
			vm.bjns_value = items[0].value;
			console.log("vm.bjnd>>>"+vm.bjnd)
			console.log("bjns_value>>>"+vm.bjns_value)
			let arr = vm.bjnd.split(',')
			arr.splice(vm.bjns_value,arr.length)
			vm.date = arr.join(',')
		});
		
	}
	
	//选择补缴类型
	function chooseBj() {
		let picker = new mui.PopPicker(); 
		//选择缴费类型时候一次性补缴 补缴类型			
		picker.setData([{
			value: '1',
			xzdm:'102011201',
			text: "一次性补缴"
		}, {
			value: '0',
			xzdm:'102031201',
			text: "补缴"
		}]);
		
		picker.show(function(items) {
			vm.bjlx = items[0].text;
			vm.bjlx_value = items[0].value;
			//核定
			getHdxx()
		});
			
	
	}
	
	//选择档次类型
	function chooseDc() {
		let picker = new mui.PopPicker(); 
		let data = []
		for(var i = 1 ; i<vm.dcmc.length+1;i++){
			data.push({"text":vm.dcmc[i-1],"value":i})
		}
		picker.setData(data);
			
		picker.show(function(items) {
			console.log(">>>>"+JSON.stringify(items))
			vm.jfdc = items[0].text;
			vm.jfdc_value = items[0].value;
			console.log("<<<<<<"+items[0].text)
			console.log("<<<<<<"+items[0].value)
		});
		
	}
	
	//打开缴费页面
	function jk(){
		mui('#jk').popover('toggle')
	}
	
	//去缴费
	function gotoJk(){
		let data = getPayReqData(vm.radioValue)
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
	
	//支付请求数据
	function getPayReqData(payWay){
		let tran_id
		let taxML
		//支付宝快捷支付
		if(payWay == 'aliPayQuick'){
			dialog.alert("暂不支持该支付方式")
			return
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
			tran_id = tranIdInfo.cxjmyl_unionpay
			
			taxML = {
				"kkfs":kkfs,
				"dc": vm.jfdc_value,
				"je": vm.jfdc_value*100,
				"cachekey":vm.cachekey ,
				"jflx": vm.jflx_value, // 0当期 1 补缴
				"bjns": vm.bjns,  // 补缴年数  jflx 为1 时必录项
				"bjlx": vm.bjlx_value  //补缴类型 0 正常补缴 1 一次性补缴  jflx 为1 时必录项
			}
		}
		
		return ReqInfo.getReqInfo(tran_id,taxML)
	}
	