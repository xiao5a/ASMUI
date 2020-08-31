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
		getSbdjry()
	}
	
	//添加事件
	function addEvent() {
	}
	
	function getSbdjry(){
		let data = {
			"head": {
				"tran_id": "com.neusoft.cxjmyb.getSbdjry",
				"channel_id": "HBSW.NFWB.DZSWJWB",
				"tran_seq": "270799db98b548528e7160dd0be73abb",
				"tran_date": baseUtils.formatDate(new Date(),'yyyy-MM-dd'),
				"tran_time": new Date().getTime(),
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
					}
				]
			},
			"body": {
				"taxML": {
					"xm": "李刚",
					"zjhm": "422801195811120210"
				}
			}
		}
		$http.post(url,data,(res)=>{
			let rs = resResult.setAndGetAttrValue(res)
			//将返回的列表数据绑定到vue中的cxjgGrid属性
			vm.cxjgGrid = rs.cxjgGrid
		})
	}
	
	function addDjry(){
		mui("#popover").popover('toggle')
	}
	
	// function getSbdjryList(){
	// 	let url = 'http://localhost:9090/cxjmyb/getSbdjry'
	// 	$http.get(url,(res)=>{
	// 		let r = resResult.setAndGetAttrValue(res)
	// 		vm.cxjgGrid = r.cxjgGrid
	// 		if(!vm.cxjgGrid.length){
	// 			mui.confirm('暂无代缴人员信息','',['取消','新增代缴人员'],
	// 			function (e) {
	// 				if(e.index){
	// 					vm.addDj()
	// 				}
	// 			},'div')
	// 		}
	// 	})
	// }
	function addDj(){
		mui("#popover").popover('toggle');
	}
	
	//缴费
	function  dj(){
		mui.openWindow({
			url:"OrderDj.html",
			id:"OrderDj",
			/* styles:{
			  top:0px,//新页面顶部位置
			  bottom:0px,//新页面底部位置
			  width:100%,//新页面宽度，默认为100%
			  height:100%,//新页面高度，默认为100%
			  
			}, */
			extras:{
			  name:'李明'//自定义扩展参数，可以用来处理页面间传值
			}
		})
	}
	//删除代缴人员
	function delDjry(){
		let url = "http://192.168.11.110:9090/surrservice/cxjmyb/delDjry"
		let data = {"service":{"body":{"taxML":{"id":"f4549a038a8f49138892d13c50b50ea7"}},"head":{"tran_time":"104606000","tran_date":"20190806","tran_seq":"270799db98b548528e7160dd0be73abb","expand":[{"name":"identityType","value":"Hbswwb#476"},{"name":"sjry","value":"14200dzswj1"},{"name":"sjjg","value":"14201091400"}],"tran_id":"com.neusoft.cxjmyb.delDjry","channel_id":"HBSW.NFWB.DZSWJWB"}}}
		$http.get(url,(res)=>{
			let r = resResult.setAndGetAttrValue(res)
			console.log(r.tran_id)
			mui.alert("删除成功",function(){
				vm.getSbdjryList()
			})
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