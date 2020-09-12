
	//url
	var url = baseUtils.URL;
	//超时时间
	var atimeout = baseUtils.timeout;
	//账号
	var nsrmc = UserInfoUtils.getUserInfo().nsrmc
	//身份证号
	var nsrsbh = UserInfoUtils.getUserInfo().nsrsbh
	//缓存key
	var cachekey
	//页面加载
	 function pageload(webview) {
		init();
		addEvent();
	}
	
	// 初始化
	function init() {
		
	}
	
	//添加事件
	function addEvent() {
		document.getElementById("submitYldj").addEventListener("tap",function(){
			submitYldj()
		})
	}
	
	// //城乡居民养老代缴提交
	function submitYldj(){
		let userName = $("#userName").val()
		let idcard = $("#idCard").val()
		let tran_id = tranIdInfo.cxjmyl_getSbdjxxdj
		let taxML = {
				"xm": nsrmc,
				"zjhm": nsrsbh,
				"bdjzjhm": idcard,
				"bdjxm": userName
			}
		let data = ReqInfo.getReqInfo(tran_id,taxML)
		
		$http.post(url,data,(res)=>{
			let rs = resResult.setAndGetAttrValue(res)
			//响应成功
			if(rs.Code === '000'){
				
				cachekey = rs.cachekey
				next()
			}else{
				dialog.alert(rs.Message)
			}
		})
	}
	
	//下一步
	function next(){
		mui.openWindow({
		  url: "cxyldj.html",
		  id: "cxyldj.html",
		  extras:{
			  "userName":$("#userName").val(),
			  "idCard":$("#idCard").val()
		  }
		});
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
	
	
	
