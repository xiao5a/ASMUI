(function(mui, owner) {
	//url
	var url = baseUtils.URL;
	//账号
	var nsrmc = UserInfoUtils.getUserInfo().nsrmc
	//身份证号
	var nsrsbh = UserInfoUtils.getUserInfo().nsrsbh
	//身份证件类型
	var sfzjlx = UserInfoUtils.getUserInfo().nsrsbh
	//手机号
	var yddh = UserInfoUtils.getUserInfo().yddh

	owner.pageload = function(webview) {
		owner.myInit();
		owner.addEvent();
	}
	
	// 初始化
	owner.myInit = function() {
		$("#XM").text(nsrmc)
		$("#ZJLX").text("居民身份证")
		$("#SFZH").text(nsrsbh)
		$("#CSRQ").text(getBirth(nsrsbh))
		$("#XB").text(getSex(nsrsbh))
		$("#TELEPHONE").text(yddh)
	}
	
	// 刷新
	owner.refresh = function() {
		owner.myInit();
	}
	
	//添加事件
	owner.addEvent = function() {
		document.getElementById("gotoUpdatePwd").addEventListener("tap", function() {
			gotoUpdatePwd()
		})
	}
	
	//进入修改密码页面
	function gotoUpdatePwd(){
		mui.openWindow({
			url:"../login/updatePwd.html",
			id:"../login/updatePwd.html",
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
	
	//取出生日期
	function getBirth(idCard) {
	  	var birthday = "";
		if(idCard != null && idCard != ""){
			if(idCard.length == 15){
				birthday = "19"+idCard.slice(6,12);
			} else if(idCard.length == 18){
				birthday = idCard.slice(6,14);
			}	
			birthday = birthday.replace(/(.{4})(.{2})/,"$1-$2-");
			//通过正则表达式来指定输出格式为:1990-01-01
		}	
		return birthday;
	}
	
	//取性别
	function getSex(idCard) {
		var sexStr = '';
		if (parseInt(idCard.slice(-2, -1)) % 2 == 1) {
			sexStr = '男';
		}
		else {
			sexStr = '女';
		}
		return sexStr;
	}
}(mui, window.myinfo = {}));
