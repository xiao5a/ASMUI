	//请求地址
	var url = baseUtils.URL
	
	//页面加载
	function pageLoad(webview){
		init()
		addEvent()
	}
	
	//初始化
	function init(){
		
	}
	
	//监听事件
	function addEvent(){
		//提交
		document.getElementById("forgetPwd").addEventListener("tap", function() {
			forgetPwd();	
		})
		
	}
	
	function backLogin(){
		//返回登录页面
		mui.openWindow({
			url:"../login/login.html",
			id:"login",
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
	
	//忘记密码
	function forgetPwd(){
		
		let xm = $("#xm").val().trim();
		let zjhm = $("#zjhm").val().trim();
		let phone = $("#phone").val().trim();
		//校验参数
		if(check(xm,zjhm,phone)==-1){
			return
		}
		
		let tran_id = tranIdInfo.forgetpsw 
		let taxML = {
			"#xm":xm,
			"zjhm": zjhm,
			"phone":phone
		}
		let data = ReqInfo.getReqInfo(tran_id,taxML)
		console.log("data>>>"+JSON.stringify(data))
		$http.post(url,data,(res)=>{
			console.log("res>>>"+JSON.stringify(res))
			dialog.alert(res.body.taxML.message||res.head.rtn_msg.Message)
			//let rs = resResult.setAndGetAttrValue(res)
			// if(rs.Code=='000'){
			// 	dialog.alert("修改成功")
			// }else{
			// 	dialog.toast(rs.Message)
			// }
		})
	}
	
	//忘记密码校验
	function check(xm,zjhm,phone){
		
		if(baseUtils.isEmpty(xm)) {
			dialog.toast('请输入姓名！');
			return -1;
		}
		if(baseUtils.isEmpty(zjhm)) {
			dialog.toast('请输入证件号码！');
			return -1;
		}
		if(baseUtils.identityCodeValid(zjhm)) {
			return -1;
		}
		
		if(baseUtils.isEmpty(phone)) {
			dialog.toast('请输入手机号！');
			return -1;
		}
		if(baseUtils.isPoneAvailable(phone)) {
			return -1;
		}
		
		
	}
	
	
	
