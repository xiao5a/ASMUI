
	//url
	var url = baseUtils.URL;
		
	//超时时间
	var atimeout = baseUtils.timeout;
	
	//账号
	var nsrmc = UserInfoUtils.getUserInfo().nsrmc
	//身份证号
	var nsrsbh = UserInfoUtils.getUserInfo().nsrsbh
	
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
		document.getElementById("cxjgGridList").addEventListener("tap", function() {
			nextPage();	
		})
	}
	
	function getSbdjxx(){
		let data = {
			"head": {
				"tran_id": "com.neusoft.cxjmyl.getSbdjxx",
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
					"xm": nsrmc,
					"zjhm": nsrsbh
				}
			}
		}
		$http.get("http://localhost:9090/cxjmyl/getSbdjxx",(res)=>{
			
			vm.cxjgGrid = res.service.body.taxML.cxjgGrid
			
			// 
			// if(rs.Code === '000'){
			// 	vm.cxjgGrid = rs.cxjgGrid
			// }else{
			// 	dialog.alert(rs.Message)
			// }
		})
	}
	
	function nextPage(){
		let value = $("#cxjgGrid").text()
		console.log("value>>>>>>"+value)
		
	}
