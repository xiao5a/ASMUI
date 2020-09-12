	//url
	var url = baseUtils.URL;
	//账号
	var nsrmc = UserInfoUtils.getUserInfo().nsrmc
	//身份证号
	var nsrsbh = UserInfoUtils.getUserInfo().nsrsbh
	//登记序号
	var djxh = UserInfoUtils.getUserInfo().djxh
	//缓存key
	var cachekey
	
	//页面加载
	 function pageload(webview,vm) {
		init(vm)
		addEvent()
	}
	
	// 初始化
	function init(vm) {
		//获取页面数据
		getSbdjry()
	}
	
	//添加事件
	function addEvent() {
		
	}
	
	//刷新
	function refresh(){
		getSbdjry()
	}
	
	//获取人员信息
	function getSbdjry(){
		let tran_id = tranIdInfo.cxjmyb_getSbdjry
		let taxML = {
					"xm": nsrmc,
					"zjhm": nsrsbh
				} 
		let data = ReqInfo.getReqInfo(tran_id,taxML)
		
		$http.post(url,data,(res)=>{
			console.log("res>>>>>"+JSON.stringify(res))
			let rs = resResult.setAndGetAttrValue(res)
			cachekey = rs.cachekey
			//将返回的列表数据绑定到vue中的cxjgGrid属性
			vm.cxjgGrid = rs.cxjgGrid
			if(!rs.cxjgGrid.length){
				$("#app").hide()
				addDjry()
					
			}
		})
	}
	//打开新增页面
	function addDjry(){
		mui.openWindow({
			url:"cxybdjAdd.html",
			id:"cxybdjAdd.html",
			/* styles:{
			  top:0px,//新页面顶部位置
			  bottom:0px,//新页面底部位置
			  width:100%,//新页面宽度，默认为100%
			  height:100%,//新页面高度，默认为100%
			}, */
			extras:{
				
			}
		})
	}
	
	//选择证件类型
	function choose(){
		let picker = new mui.PopPicker()
		picker.setData([{
			value: '201',
			text: "身份证"
		}, {
			value: '202',
			text: "军官证"
		}]);
		picker.show(function(items) {
			vm.cardType = items[0].text;
			vm.cardType_value = items[0].value;
		});
	}
	//新增代缴人员
	function submitDdry(){
		let xm = $("#userName").val()
		let zjhm = $("#idCard").val()
		let tran_id = tranIdInfo.cxjmyb_getSbdjxxdj
		let taxMl = {
					"xm": xm,
					"zjhm":zjhm,
					"djxh": djxh
				}
		let data = ReqInfo.getReqInfo(tran_id,taxMl)
		
		//校验
		if(baseUtils.isEmpty(xm)){
			dialog.alert("请输入用户名")
			return
		}
		if(baseUtils.isEmpty(zjhm)){
			dialog.alert("请输入身份证")
			return
		}
		if(!baseUtils.identityCodeValid(zjhm)){
			return
		}
		
		$http.post(url,data,(res)=>{
			let rs = resResult.setAndGetAttrValue(res)
			if(rs.Code === '000'){
				vm.cxjgGrid.push(rs.cxjgGrid)
				mui("#popover").popover('toggle')
			}else{
				dialog.toast(rs.Message)
			}
		})
	}
	
	//提取核定
	function tqhd(){
		if(!vm.checkCxjgGrid.length){
			dialog.alert("请选择一条数据")
			return
		}
		let tran_id = tranIdInfo.getHeDingDanXXDj
		let taxML = {
			"cachekey": cachekey,
			"djcyList": vm.checkCxjgGrid
		}
		let data = ReqInfo.getReqInfo(tran_id,taxML)
		console.log("提取核定请求数据>>>>>>>>>>>>"+JSON.stringify(data))
		$http.post(url,data,(res)=>{
			console.log("提取核定返回数据 >>>>>>>>>"+JSON.stringify(res))
			let rs = resResult.setAndGetAttrValue(res)
			if(rs.Code === '000'){
				next(rs.cxjgGrid,rs.cachekey)
			}else{
				dialog.alert(rs.Message)
			}
		})
	}	
	
	//下一步
	function next(cxjgGrid,cachekey){
		mui.openWindow({
			url:"cxybdjhd.html",
			id:"cxybdjhd.html",
			/* styles:{
			  top:0px,//新页面顶部位置
			  bottom:0px,//新页面底部位置
			  width:100%,//新页面宽度，默认为100%
			  height:100%,//新页面高度，默认为100%
			}, */
			extras:{
				"cxjgGrid":cxjgGrid,
				"cachekey":cachekey
			}
		})
	}
	
	
	
	//删除代缴人员
	function delDjry(id){
		if(vm.checkCxjgGrid.length > 1 || !vm.checkCxjgGrid.length){
			dialog.alert("请选择一条数据进行删除")
			return
		}
		let tran_id = tranIdInfo.delDjry
		let taxML ={
					"id": vm.checkCxjgGrid[0].id
				}
		let data = ReqInfo.getReqInfo(tran_id,taxML)
		dialog.confirm("是否要删除?",(e)=>{
			if(e.index){
				$http.post(url,data,(res)=>{
					console.log(res)
					let r = resResult.setAndGetAttrValue(res)
					if(r.Code === '000'){
						dialog.alert("删除成功",()=>{
							vm.checkCxjgGrid = []
							refresh()
						})
					}else{
						dialog.alert(r.Message)
					}
				})
			}
		})
	}
	//复选框勾选添加样式
	function check(index){
	  if(vm.active.length && vm.active.indexOf(index)!=-1){
		vm.active.splice(vm.active.indexOf(index),1)
	  }else{
		vm.active.push(index)
	  }
	   console.log(".....:"+vm.active)
	 }
	
	//打开帮助页面 
	 function getHelp(){
		 mui("#popover3").popover('toggle')
	}