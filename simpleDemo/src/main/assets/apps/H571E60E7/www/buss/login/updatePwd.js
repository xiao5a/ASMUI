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
		document.getElementById("updatePwd").addEventListener("tap", function() {
			updatePwd();	
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
	
	//修改密码
	function updatePwd(){
		
		let userName = $("#userName").val().trim();
		let curPwd = $("#curPwd").val().trim();
		let newPwd = $("#newPwd").val().trim();
		let rePwd = password = $("#rePwd").val().trim();
		//校验参数
		if(check(userName,curPwd,newPwd,rePwd)==-1){
			return
		}
		
		let tran_id = tranIdInfo.modifypsd 
		let taxML = {
			"useraccount":userName,
			"currenPwd": curPwd,
			"newPwd":newPwd
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
	
	//修改密码校验
	function check(userName,curPwd,newPwd,rePwd){
		
		if(baseUtils.isEmpty(userName)) {
			dialog.toast('请输入用户名！');
			return -1;
		}
		if(baseUtils.isEmpty(curPwd)) {
			dialog.toast('请输入当前的密码！');
			return -1;
		}
		if(baseUtils.isEmpty(newPwd)) {
			dialog.toast('请输入修改的密码！');
		}
		if(baseUtils.isEmpty(rePwd)) {
			dialog.toast('请输入确认密码！');
			return -1;
		}
		if(newPwd !== rePwd){
			dialog.toast('两次密码不一致，请重新输入！');
			return -1
		}
	}
	
	
	
