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
		
	}
	
	//添加事件
	function addEvent() {
		
	}
	
	//缴费
	function jk(){
		if(!vm.checkCxjgGrid.length){
			dialog.alert("请选择需要缴款的核定单")
			return
		}
		if($("#je"+vm.checkCxjgGrid[0].sfzjhm).text()=='0.00'){
			dialog.alert("请先提取核定")
			return
		}
		dialog.confirm("是否去缴款?")
		 //mui("#popover2").popover('toggle')
	}
	
	