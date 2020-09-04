	//请求地址
	var url = baseUtils.URL
	//短信验证码标识
	var jssessionid
	//页面加载	
	function pageLoad(){
		init()
		addEvent()
	}
	//初始化
	function init(){
		
	}
	
	//事件监听
	function  addEvent(){
	
		//注册
		document.getElementById("register").addEventListener("tap", function() {
			next()
		})
		
		
		//点击注意事项
		document.getElementById("help").addEventListener("tap", function() {
			getHelp()
		})
		
	}
	
	function getHelp(){
		mui('#help_popover').popover('toggle')
	}
	
	//下一步
	function next(){
		let account = $("#account").val()
		let userName = $("#userName").val()
		let idCard = $("#idCard").val()
		let phone = $("#phone").val()
		let cradNo = $("#cradNo").val()
		
		//参数校验
		if(baseUtils.isEmpty(account)) {
			dialog.toast('请输入姓名！');
			return -1;
		}
		if(baseUtils.isEmpty(userName)) {
			dialog.toast('请输入用户名！');
			return -1;
		}
		if(baseUtils.isEmpty(idCard)) {
			dialog.toast('请输入身份证号！');
			return -1;
		}
		if(!baseUtils.identityCodeValid(idCard)){
			return -1;
		}
		if(baseUtils.isEmpty(phone)) {
			dialog.toast('请输入手机号！');
			return -1;
		}
		if(!baseUtils.isPoneAvailable(phone)){
			dialog.toast('手机号格式输入错误,请重新输入！');
			return -1;
		}
		if(baseUtils.isEmpty(cradNo)) {
			dialog.toast('请输入银行卡号！');
			return -1;
		}
		
		let tran_id = tranIdInfo.checkYhk
		let taxML =  {
			"xm":account,
			"zjhm":idCard,
			"sjhm":phone,
			"yhkh":cradNo
		}
		let data = ReqInfo.getReqInfo(tran_id,taxML)
		$http.post(url,data,(res)=>{
			let rs = resResult.setAndGetAttrValue(res)
			if(rs.rtn_code==0){
				mui('#popover').popover('toggle')
			}else{
				dialog.toast(rs.Message)
			}
		})
	}
	
	