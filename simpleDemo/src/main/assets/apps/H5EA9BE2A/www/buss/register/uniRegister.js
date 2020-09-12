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
		let xm = $("#xm").val()
		let zjhm = $("#zjhm").val()
		let sjhm = $("#sjhm").val()
		let yhkh = $("#yhkh").val()
		
		//参数校验
		if(baseUtils.isEmpty(xm)) {
			dialog.toast('请输入姓名！');
			return -1;
		}
		
		if(baseUtils.isEmpty(zjhm)) {
			dialog.toast('请输入身份证号！');
			return -1;
		}
		if(!baseUtils.identityCodeValid(zjhm)){
			return -1;
		}
		if(baseUtils.isEmpty(sjhm)) {
			dialog.toast('请输入手机号！');
			return -1;
		}
		if(!baseUtils.isPoneAvailable(sjhm)){
			dialog.toast('手机号格式输入错误,请重新输入！');
			return -1;
		}
		if(baseUtils.isEmpty(yhkh)) {
			dialog.toast('请输入银行卡号！');
			return -1;
		}
		
		let tran_id = tranIdInfo.checkYhk
		let taxML =  {
			"xm":xm,
			"zjhm":zjhm,
			"sjhm":sjhm,
			"yhkh":yhkh
		}
		let data = ReqInfo.getReqInfo(tran_id,taxML)
		$http.post(url,data,(res)=>{
			let rs = resResult.setAndGetAttrValue(res)
			if(rs.rtn_code==0){
				//进入验证码界面
				dialog.alert("认证成功！",()=>{
					gotoVerifyCode(xm,zjhm,sjhm)
				})
			}else{
				dialog.toast(rs.Message)
			}
		})
	}
	
	//进入设置密码页面
	function gotoVerifyCode(xm,zjhm,sjhm){
		mui.openWindow({
			url:"verifyCode.html",
			id:"verifyCode.html",
			/* styles:{
			top:0px,//新页面顶部位置
			bottom:0px,//新页面底部位置
			width:100%,//新页面宽度，默认为100%
			height:100%,//新页面高度，默认为100%
		  
		}, */
			extras:{
				"xm":xm,
				"zjhm":zjhm,
				"sjhm":sjhm
			}
		})
	}
	
	