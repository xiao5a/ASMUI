	//请求地址
	var url = baseUtils.URL
	//验证码校验标识
	var cssessionid 
	
	//页面加载
	function pageLoad(webview){
		init()
		addEvent()
	}
	
	//初始化
	function init(){
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
		let data  = {
				"head": {
					"tran_id": "com.neusoft.login.validatecode",
					"channel_id": "HBSW.NFWB.DZSWJWB",
					"tran_seq": "270799db98b548528e7160dd0be73abb",
					"tran_date": baseUtils.formatDate(new Date(),'yyyy-MM-dd'),
					"tran_time": new Date().getTime(),
					"expand": [{
						"name": "identityType",
						"value": "Hbswwb#476"
					}, {
						"name": "sjry",
						"value": "webchat"
					}, {
						"name": "sjjg",
						"value": "14201091400"
					}]
				},
				"body": {
					"taxML": {}
				}
		}
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
		let taxML = {
			"zh":$("#userName").val(),
			"mm":$("#password").val(),
			"codename":$("#verifycode").val(),
			"cssessionid":cssessionid,
			"encryptFlag":""
		}
		let data = {
			"head": {
				"tran_id": "com.neusoft.login.zrrdl",
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
						"value": "webchat"
					},
					{
						"name": "sjjg",
						"value": "14201091400"
					}
				]
			},
			"body": {
				"taxML":taxML
			}
		}
		$http.post(url,data,(res)=>{
			let rs = resResult.setAttrValue(res)
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

	function forgetPassword(){
		console.log("忘记密码")
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
			url:"../index/index.html",
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

    			             if(result[0]=="200"&&result[1]=="9000"){
    			             alert("授权登录成功模拟登录,支付宝账户的Id为："+result[2]);
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
	
	
	
