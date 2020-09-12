	//请求地址
	var url = baseUtils.URL
	var flag
	//页面加载
	function pageLoad(flag1=0){
		init(flag1)
		addEvent()
	}
	
	//初始化
	function init(flag1){
		flag = flag1
		if(flag == '1'){
			$("#mycurPwd").remove()
		}
		console.log("flag>>>"+flag)
	}
	
	//监听事件
	function addEvent(){
		//提交
		document.getElementById("updatePwd").addEventListener("tap", function() {
			updatePwd();	
		})
		
	}
	
	//修改密码
	function updatePwd(){
		//证件号码
		let nsrsbh = $("#nsrsbh").val();
		//手机号
		let yddh = $("#yddh").val();
		let curPwd = $("#curPwd").val();
		let newPwd = $("#newPwd").val();
		let rePwd  = $("#rePwd").val();
		//校验参数
		if(!nsrsbh) {
			dialog.toast('请输入证件号码！');
			return;
		}
		if(!baseUtils.identityCodeValid(nsrsbh)) {
			return;
		}
		if(baseUtils.isEmpty(curPwd) && flag == '0') {
			dialog.toast('请输入当前的密码！');
			return;
		}
		if(baseUtils.isEmpty(newPwd)) {
			dialog.toast('请输入修改的密码！');
		}
		if(baseUtils.isEmpty(rePwd)) {
			dialog.toast('请输入确认密码！');
			return;
		}
		if(newPwd !== rePwd){
			dialog.toast('两次密码不一致，请重新输入！');
			return;
		}
		
		let tran_id = tranIdInfo.modifypsd 
		let taxML = {
			"nsrsbh":nsrsbh,
			"yddh":yddh,
			"currenPwd": curPwd,
			"newPwd":newPwd,
			"flag":flag,
		}
		let data = ReqInfo.getReqInfo(tran_id,taxML)
		console.log("data>>>"+JSON.stringify(data))
		$http.post(url,data,(res)=>{
			console.log("res>>>"+JSON.stringify(res))
			let rs = resResult.setAndGetAttrValue(res)
			if(rs.Code=='000'){
				dialog.alert("修改成功")
				gotoIndex()
			}else{
				dialog.toast(res.body.taxML.message||res.head.rtn_msg.Message)
			}
		})
	}
	
	//进入首页
	function gotoIndex(){
		mui.openWindow({
			url:"../../models/main/main.html",
			id:"../../models/main/main.html",
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

	
	
