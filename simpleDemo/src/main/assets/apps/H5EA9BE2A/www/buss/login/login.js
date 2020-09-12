	//请求地址
	var url = baseUtils.URL
	//验证码校验标识
	var cssessionid 
	//登录成功后跳转的url
	var gotoUrl
	//页面加载
	function pageLoad(gotourl){
		init(gotourl)
		addEvent()
	}
	
	//初始化
	function init(gotourl){
		gotoUrl = gotourl
		//获取验证码
		getVerificationCode()
	}
	
	//监听事件
	function addEvent(){
		//获取验证码
		document.getElementById("verifycode_img").addEventListener("tap", function() {
			getVerificationCode();	
		})
		
		//登录
		document.getElementById("login").addEventListener("tap", function() {
			login();	
		})
		
		//忘记密码
		document.getElementById("forgetPassword").addEventListener("tap", function() {
			forgetPassword();	
		})
		
		//注册
		document.getElementById("register").addEventListener("tap", function() {
			register()
		})
			
		//第三方登录-支付宝登录
		document.getElementById("aliLogin").addEventListener("tap", function() {
			aliLogin();	
		})
		
		//第三方登录-微信登录
		document.getElementById("wechatLogin").addEventListener("tap", function() {
			wechatLogin();	
		})
		
	}
	
	function getVerificationCode(){
		let tran_id = tranIdInfo.validatecode
		let taxML = {} 
		let data = ReqInfo.getReqInfo(tran_id,taxML)
		
		$http.post(url,data,(res)=>{
			cssessionid = res.body.taxML.cssessionid
			$("#verifycode_img").attr("src","data:image/png;base64,"+res.body.taxML.codeimg)
		})
	}
	
	function login(){
		//校验参数
		if(loginCheck()==-1){
			return
		}
		
		let tran_id = tranIdInfo.zrrdl 
		let taxML = {
			"zh":$("#userName").val(),
			"mm":$("#password").val(),
			"codename":$("#verifycode").val(),
			"cssessionid":cssessionid,
			"encryptFlag":""
		}
		let data = ReqInfo.getReqInfo(tran_id,taxML)
		
		$http.post(url,data,(res)=>{
			console.log("res>>>"+JSON.stringify(res))
			let rs = resResult.setAndGetAttrValue(res)
			if(rs.rtn_code==0){
				let dlxx = rs.dlxx
				dialog.toast("登录成功")
				//本地存储用户信息
				UserInfoUtils.setUserInfo(dlxx)
				console.log("gotoUrl:"+gotoUrl)
				if(gotoUrl == '' || gotoUrl == '#' || !gotoUrl){
					//跳转到主页面
					pageUtils.popToTargetPage(plus.runtime.appid,true,"","")
				}else{
					//跳转到目标url
					gotoDestUrl(gotoUrl)
				}
				
			}else{
				dialog.toast(rs.Message)
			}
		})
	}

	//忘记密码
	function forgetPassword(){
		console.log("忘记密码")
		mui.openWindow({
			url:"forgetPwd.html",
			id:"forgetPwd.html",
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
	
	function register(){
			mui.openWindow({
				url:"../register/register.html",
				id:"../register/register.html",
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
	
	function  gotoDestUrl(gotoUrl){
		mui.openWindow({
			url:gotoUrl,
			id:gotoUrl,
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
	
	function aliLogin(){
	
	
	    if(window.plus) {
	
	  				 plus.Alipay.alipayLogin("", function( result ) {
	                      		         //成功之后异步带回来的数据加入判断
	                      		         if(result!=null&&result!=''){
	                      		              aliLoginresult(result);
	                      		         }
	                      		       },function(result){
	                      		         window.location.href ="error.html";
	                      		       });
	  				}
			
		}
	
	
		function aliLoginresult(result) {
	
	 if(plus.os.name == "iOS"){
	               
	                     aliLoginReq(result);
	                
	               
	            }else if (plus.os.name == "Android"){
	    			             if(result[0]=="200"&&result[1]=="9000"){
	    			             alert("授权登录成功模拟登录,支付宝账户的Id为："+result[2]);
	    			                //授权登录成功
									//支付宝登录请求
									aliLoginReq(result[2])
									
	    			             }else{
	    			               mui.toast("取消了支付宝授权");
	    			             }
	    					}
							}

	
	
	    					function alipayresult(result) {
	                            			             alert("支付结果,支付宝账户的Id为："+result[0]+result[1]+result[2]);
	
	                            			             if(result[0]=="200"&&result[1]=="9000"){
	                            			             alert("支付结果,支付宝账户的Id为："+result[2]);
	                            			                //授权登录成功
	
	                            			                  gotoIndex();
	                            			             	$.ajax({
	                            								type: "get",
	                            								url: apis.getAlipayInfo,//调用后台接口根据auth_code取支付宝账户的基本信息
	                            								dataType: "json",
	                            								cache: false, //缓存
	                            								async: true, //异步
	                            								data: {
	                            									'authCode':result[2],
	                            									'appID':result[4],
	                            									'scope':result[3],
	                            									'type': 2
	                            								},
	                            								success: function(result) {
	                            										alert("授权登录成功,支付宝账户的Id为："+result.data.alipayId);
	                            								}
	                            							});
	                            			             }else{
	                            			               mui.toast("取消了支付宝授权");
	                            			             }
	                            					}
		function wechatLogin(){
			if(window.plus) {
	
	          				 plus.Alipay.alipay("", function( result ) {
	                              		         //成功之后异步带回来的数据加入判断
	                              		         if(result!=null&&result!=''){
	                              		              alipayresult(result);
	                              		         }
	                              		       },function(result){
	                              		         window.location.href ="error.html";
	                              		       });
	          				}
	
		}
	
	//支付宝登录请求
	function aliLoginReq(authcode){
		let tran_id = tranIdInfo.aliauth
		let taxML = {
			"authcode":authcode
		}
		let data = ReqInfo.getReqInfo(tran_id,taxML)
		
		$http.post(url,data,(res)=>{
			let rs = resResult.setAndGetAttrValue(res)
			console.log(rs)
			if(rs.rtn_code==0){
				let dlxx = rs.dlxx
				dialog.toast("登录成功")
				//本地存储用户信息
				UserInfoUtils.setUserInfo(dlxx)
				//页面跳转
				gotoIndex()
			}else{
				dialog.toast(rs.Message)
			}
		})
	}
	
	//登录校验
	function loginCheck(){
		userName = $("#userName").val().trim();
		password = $("#password").val().trim();
		verifycode = $("#verifycode").val().trim();
		if(baseUtils.isEmpty(userName)) {
			dialog.toast('请输入用户名！');
			return -1;
		}
		if(baseUtils.isEmpty(password)) {
			dialog.toast('请输入密码！');
			return -1;
		}

		if(baseUtils.isEmpty(verifycode)) {
			dialog.toast('请输入验证码!');
			return -1;
		} 
	}
	
	
	
