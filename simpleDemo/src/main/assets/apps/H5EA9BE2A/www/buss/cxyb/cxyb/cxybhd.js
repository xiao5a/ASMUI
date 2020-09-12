
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
		//getCxjmHd()
	}
	
	//添加事件
	function addEvent() {
		
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
	//缴款
	function jk(){
		mui('#jk').popover('toggle')
		// if(!vm.checkCxjgGrid.length){
		// 	dialog.alert("请选择需要缴款的核定单")
		// 	return
		// }
		// if($("#je"+vm.checkCxjgGrid[0].sfzjhm).text()=='0.00'){
		// 	dialog.alert("请先提取核定")
		// 	return
		// }
		// dialog.confirm("是否去缴款?")
		//  //mui("#popover2").popover('toggle')
	}