
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
		//document.querySelector("#myPopPickerId1").setAttribute('data-options', JSON.stringify(dcTypeData));
		//document.querySelector("#myPopPickerId2").setAttribute('data-options', JSON.stringify(bjTypeData));
	}
	
	//添加事件
	function addEvent() {
		// document.querySelector("#myPopPickerId1").addEventListener("tap", function() {
		// 	baseUtils.getPopPicker(this);
		// });
		
		// document.querySelector("#myPopPickerId2").addEventListener("tap", function() {
		// 	baseUtils.getPopPicker(this);
		// });
	}
	
	// //初始化年份数字选择
	// function initBjns(){
	// 	document.querySelector("#myPopPickerId3").setAttribute('data-options', JSON.stringify(bjNs));
		
	// 	document.querySelector("#myPopPickerId3").addEventListener("tap", function() {
	// 		baseUtils.getPopPicker(this);
	// 	});
	// }
	//选中值后回调方法
	// function callback(){
	// 	var text = document.querySelector("#myPopPickerId2").value;
	// 	var value = baseUtils.getCodeListValue(bjNs, text);
	// 	console.log('text:'+text+'，value:'+value)
	// 	getHdxx(value)
	// }
	
	// //选中值后回调方法
	// function callback2(){
	// 	var text = document.querySelector("#myPopPickerId3").value;
	// 	var value = baseUtils.getCodeListValue(bjTypeData, text);
	// 	console.log('text:'+text+'，value:'+value)
	// 	console.log("jnd.split(',')>>>"+bjnd.split(','))
	// 	let cz = bjNs.length-parseInt(text)
	// 	let arr = bjnd.split(',')
	// 	arr.splice(0,cz)
	// 	$("#tipMsg").text(arr)
	// }
	
	//选中补缴类型进行核定
	// function getHdxx(value){
	// 	let tran_id = tranIdInfo.getHdxx
	// 	let taxML = {
	// 			"cachekey": vm.cachekey,
	// 			"sbh": vm.sbh,
	// 			"jbjg_dm": vm.jbjg_dm
	// 		}
	// 	console.log("taxML>>>>>"+JSON.stringify(taxML))
	// 	let data = ReqInfo.getReqInfo(tran_id,taxML)
	// 	$http.post(url,data,(res)=>{
	// 		let rs = resResult.setAndGetAttrValue(res)
	// 		console.log("rs:::::"+JSON.stringify(rs))
	// 		if(rs.Code === '000'){
	// 			console.log("taxML.zdbjns:"+rs.taxML.zdbjns)
	// 			for(var i = 1 ; i < parseInt(rs.taxML.zdbjns)+1; i++){
	// 				bjNs.push({text:''+i, value:"1"})
	// 			}
	// 			bjnd = rs.taxML.bjnd
	// 			initBjns()
	// 			console.log("bjNs"+JSON.stringify(bjNs))
	// 		}
	// 		console.log(JSON.stringify(res))
	// 	})
	// }
	
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
