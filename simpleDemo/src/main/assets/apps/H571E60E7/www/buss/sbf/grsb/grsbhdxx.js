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
	
	// 初始化
	function init() {
		var now = new Date();
		var nowYear = now.getFullYear();
		var nowMonth = now.getMonth()+1;
		var minYear = nowYear;
		var maxYear = nowYear+1;
		if(nowMonth < 7){
			minYear = nowYear-1;
			maxYear = nowYear;
		}
		var minYearMonth = new Date(minYear,0);
		var maxYearMonth = new Date(maxYear,11);
		vm.dtoption = {"type":"month","beginDate":minYearMonth,"endDate":maxYearMonth};
	}
	
	// 刷新
	function refresh() {
		myInit();
	}
	
	//添加事件
	function addEvent() {
		
	}
	
	//选择缴费档次
	function chosejfdc() {
		let picker = new mui.PopPicker()
		let data = []
		for(var i = 1; i < vm.dcmc.length+1 ;i++){
			data.push({"text":vm.dcmc[i-1],"value":i})
		}
		picker.setData(data);
		picker.show(function(items) {
			vm.jfdc = items[0].text;
			vm.jfdc_value = items[0].value;
		});
	};
	
	//选择缴费险种
	function chosexzlx() {
		let picker = new mui.PopPicker()
		picker.setData([{
			value: '1',
			xzdm:'102011201',
			text: "养老保险"
		}, {
			value: '2',
			xzdm:'102031201',
			text: "医疗保险"
		}]);
		picker.show(function(items) {
			
			vm.xzlx = items[0].text;
			vm.xzlx_value = items[0].value;
			console.log(">>>"+JSON.stringify(vm.pzmx))
			vm.jfdc = '请选择档次'
			vm.jfdc_value = ''
			//选择医疗保险
			if (vm.xzlx_value == '2') {
				vm.dcmc = vm.pzmx[1].dcmc
			}else{
				vm.dcmc = vm.pzmx[0].dcmc
			}
		});
	};
			
	//选择所属期起
	function chosessqq(){
		vm.ssqqdtPicker= new mui.DtPicker(vm.dtoption);
		var dtPicker = vm.ssqqdtPicker 
		dtPicker.show(function (selectItems) { 
			vm.ssqq=selectItems.y.text+selectItems.m.text;
			console.log(selectItems.y.text); 
			console.log(selectItems.m.text); 
		}) 
	}
		
	//选择所属期止
	function chosessqz(){
		vm.ssqqdtPicker= new mui.DtPicker(vm.dtoption);
		var dtPicker = vm.ssqqdtPicker 
		dtPicker.show(function (selectItems) { 
			vm.ssqz=selectItems.y.text+selectItems.m.text;
			console.log(selectItems.y.text); 
			console.log(selectItems.m.text); 
		}) 
	}
	
	//核定
	function hd(){
		let trand_id = tranIdInfo.sentHeDingDanXX
		let taxML =  {
				"dc": vm.jfdc_value,
				"ssqq": vm.ssqq,
				"cachekey": vm.cachekey,
				"sbh": vm.item.sbh,
				"ssqz": vm.ssqz,
				"jbjg_dm": vm.item.jbjg_dm,
				"xz": vm.xzlx_value//养老1医疗保险2
			}
		let data = ReqInfo.getReqInfo(trand_id,taxML)
		console.log("data>>>"+JSON.stringify(data))
		$http.post(url,data,(res)=>{
			console.log("res>>>"+JSON.stringify(res))
			let rs = resResult.setAndGetAttrValue(res)
			if(rs.Code === '000'){
				gotojkPage(rs.taxML,taxML)
			}else{
				dialog.alert(rs.Message)
			}
		})
	}
	
	//跳转到缴款信息页面
	function gotojkPage(taxML,reqTaxML){
		mui.openWindow({
			url: './jkxx.html',
			id: "jkxx.html",
			extras: {
				"taxML": taxML,
				"reqTaxML":reqTaxML
			}
		});
	}
	

	

		

						

	

		
	