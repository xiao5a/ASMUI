	//url
	var url = baseUtils.URL;
	//账号
	var nsrmc = UserInfoUtils.getUserInfo().nsrmc
	//身份证号
	var nsrsbh = UserInfoUtils.getUserInfo().nsrsbh
	
	//页面加载
	 function pageload(webview,vm) {
		init(vm)
		addEvent()
	}
	
	// 初始化
	function init(vm) {
		//获取页面数据
		getOrderList()
	}
	
	//添加事件
	function addEvent() {
	}
	
	function getOrderList(){
		let data = 
		{
			"body": {
				"taxML": {
					"cachekey": "20124200000014548614d3a0ea934d1049829d921909d8c5a42b",
					"djcyList": [{
						"id": "5a61b35ed13f4c1e82dbb323e8a03921",
						"hsjg": "14207900000",
						"jbjg": "鄂州市人力资源和社会保障局",
						"name": "敖玉冰429001198812292969",
						"xm": "敖玉冰",
						"sfzjhm": "429001198812292969",
						"sbh": "100064722577",
						"jbjg_dm": "420704"
					}]
				}
			},
			"head": {
				"tran_date": baseUtils.formatDate(new Date(),'yyyy-MM-dd'),
				"tran_time": new Date().getTime(),
				"tran_seq": "270799db98b548528e7160dd0be73abb",
				"expand": [{
					"name": "identityType",
					"value": "Hbswwb#476"
				},
				{
					"name": "sjry",
					"value": "14200dzswj1"
				},
				{
					"name": "sjjg",
					"value": "14201091400"
				}],
				"tran_id": "com.neusoft.cxjmyb.getHeDingDanXXDj",
				"channel_id": "HBSW.NFWB.DZSWJWB"
			}
		}

		$http.post(url,data,(res)=>{
			let rs = resResult.setAndGetAttrValue(res)
			debugger
			vm.orderList = rs.cxjgGrid
			
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
	
	function createOrder(){
	    mui("#popover").popover('toggle');
	}
	
	function help(){
		mui("#help_popover").popover('toggle');
	}
		
	