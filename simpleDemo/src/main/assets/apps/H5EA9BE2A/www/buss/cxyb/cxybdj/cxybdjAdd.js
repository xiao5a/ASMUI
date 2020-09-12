
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
	
	// //城乡居民医保代缴提交
	function submitYldj(){
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
		console.log("社保代缴登记信息新增（接口查询--保存）请求>>>>>"+JSON.stringify(data))
		$http.post(url,data,(res)=>{
				console.log("社保代缴登记信息新增（接口查询--保存）返回>>>>>"+JSON.stringify(res))
			let rs = resResult.setAndGetAttrValue(res)
			if(rs.Code === '000'){
				gotoCxybdj()
			}else{
				dialog.toast(rs.Message)
			}
		})
	}
	
	//进入代缴信息页面
	function gotoCxybdj(){
		mui.openWindow({
		  url: "cxybdj.html",
		  id: "cxybdj.html",
		  extras:{
			
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
	
	
	
