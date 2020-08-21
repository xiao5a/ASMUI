//TODO dom操作放到mui.ready中；  依赖plus api的业务放到mui.plusReady中？   目前考虑用户手速没有 plusReady快  先不修改了。
$(function() {

	// 验证码超时处理 单位秒
	var wait = 60;

	// 生成验证码的选项--简化操作，只使用数字
	var nums = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
	/*var nums = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", 
		'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 
		'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
	];*/

	// js 生成的图形校验码（登录时与用户输入进行比较)
	var str = '';
	var jsVeryCode = drawCode();
	var login_state_msgs = {
		"513" : "使用初始密码登录,请及时修改密码!",
		"4097" : "密码已过期,请及时修改密码!"
	};
	// 绘制验证码
	function drawCode(str) {
		var canvas = document.getElementById("verifyCanvas"); //获取HTML端画布
		var context = canvas.getContext("2d"); //获取画布2D上下文
		context.fillStyle = "cornflowerblue"; //画布填充色
		context.fillRect(0, 0, canvas.width, canvas.height); //清空画布
		context.fillStyle = "white"; //设置字体颜色
		context.font = "25px Arial"; //设置字体
		var rand = new Array();
		var x = new Array();
		var y = new Array();
		for(var i = 0; i < 4; i++) {
			rand.push(rand[i]);
			rand[i] = nums[Math.floor(Math.random() * nums.length)]
			x[i] = i * 20 + 10;
			y[i] = Math.random() * 20 + 20;
			context.fillText(rand[i], x[i], y[i]);
		}
		str = rand.join('').toUpperCase();
		//画3条随机线
		for(var i = 0; i < 3; i++) {
			drawline(canvas, context);
		}

		// 画30个随机点
		for(var i = 0; i < 30; i++) {
			drawDot(canvas, context);
		}
		convertCanvasToImage(canvas);
		wait = 60;
		return str;
	}

	// 随机线
	function drawline(canvas, context) {
		context.moveTo(Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height)); //随机线的起点x坐标是画布x坐标0位置，y坐标是画布高度的随机数
		context.lineTo(Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height)); //随机线的终点x坐标是画布宽度，y坐标是画布高度的随机数
		context.lineWidth = 0.5; //随机线宽
		context.strokeStyle = 'rgba(50,50,50,0.3)'; //随机线描边属性
		context.stroke(); //描边，即起点描到终点
	}

	// 随机点(所谓画点其实就是画1px像素的线，方法不再赘述)
	function drawDot(canvas, context) {
		var px = Math.floor(Math.random() * canvas.width);
		var py = Math.floor(Math.random() * canvas.height);
		context.moveTo(px, py);
		context.lineTo(px + 1, py + 1);
		context.lineWidth = 0.2;
		context.stroke();
	}

	// 绘制图片
	function convertCanvasToImage(canvas) {
		document.getElementById("verifyCanvas").style.display = "none";
		var image = document.getElementById("code_img");
		image.src = canvas.toDataURL("image/png");
		return image;
	}

	// 点击图片刷新
	document.getElementById('code_img').onclick = function() {
		resetCode();
	}

	// 刷新显示数字校验码
	function resetCode() {
		$('#verifyCanvas').remove();
		$('#code_img').before('<canvas width="100" height="40" id="verifyCanvas"></canvas>')
		jsVeryCode = drawCode();
	}

	// 定时器，确保验证码超时
	var i = setInterval(function() {
		wait--;
	}, 1000);

	// 如果超时，则重新刷新验证码
	function checkVeryCode() {
		console.log("wait:" + wait);
		if(wait <= 0) {
			resetCode();
			document.getElementById('verifycode').value = '';
		}
	}

	// 光标落在验证码的文本框时进行检查
	document.getElementById('verifycode').onfocus = function() {
		checkVeryCode();
	}

	// 控件聚焦
	function focusItem(Ojbect) {
		Ojbect.focus();
	}

	// h5 方式弹出信息提示框
	function mytoast(msg) {
		mui.toast(msg, {
			duration: 'short',
			type: 'div'
		});
	}

	// 明文加密
	function encode(password, keyCode) {
		keyCode = keyCode + keyCode + keyCode + keyCode;
		var key = CryptoJS.enc.Utf8.parse(keyCode);
		var decrypted = CryptoJS.AES.encrypt(password, key, {
			mode: CryptoJS.mode.ECB,
			padding: CryptoJS.pad.Pkcs7
		});
		return decrypted.ciphertext.toString();
	}

	// 登录业务逻辑前台校验
	var userId;
	var passWd;

	function loginCheck() {
		userId = $("#userid").val().trim();
		passWd = $("#password").val().trim();
		veryCode = $("#verifycode").val().trim();
		simsernumber = '1'; //测试数据,个人调试用。上线应去掉此句
		if(simsernumber == null) {
			mytoast('该设备未插入sim卡，请检查sim卡插入后再登录！');
			return -1;
		}
		if(userId == '') {
			mytoast('请输入登录账号！');
			focusItem($("#userid"));
			return -1;
		}
		if(passWd == '') {
			mytoast('请输入登录密码！');
			focusItem($("#password"));
			return -1;
		}

		if(veryCode == '') {
			mytoast('请输入验证码！');
			focusItem($("#verifycode"));
			return -1;
		} else {
			checkVeryCode();
			if(veryCode == '') {
				mytoast('请重新输入验证码！');
				focusItem($("#verifycode"));
				return -1;
			} else {
				console.log(veryCode + ":" + jsVeryCode);
				if(veryCode.toUpperCase() != jsVeryCode.toUpperCase()) {
					checkVeryCode();
					mytoast('验证码输入不正确');
					focusItem($("#verifycode"));
					return -1;
				} else {
					// console.log('验证码输入正确');
					return 0;
				}
			}
		}
	}

	// 登录后台校验
	document.getElementById('loginBtn').onclick = function() {
		if(loginCheck() == 0) {
			mui.showLoading("登录中...");
			$.ajax({
				url: baseUtils.URL + '/login?type=appajaxType',
				type: 'POST',
				crossDomain: true,
				xhrFields: {
					withCredentials: true
				},
				headers: {
					"X-Requested-With": "XMLHttpRequest",
					"Content-Type": "application/json;charset=utf-8"
				},
				dataType: 'json',
				contentType: 'application/json;charset=utf-8',
				//async: true,
				data: JSON.stringify({
					account: userId,
					captcha: '####',
					password: encode(passWd, '####'),
					simNum: simsernumber
				}),
				success: function(data) {
					mui.hideLoading();
					console.log("data:" + JSON.stringify(data));
					if(data.state == 1 || data.state == 513 || data.state == 4097) {
						//默认监管人员登录
						var user_category_code = "officer"; 
						//登录类型： "scztyh"市场主体用户;"jgry";默认监管人员
						if (window.login.loginType == "scztyh"){
							//市场主体用户
							user_category_code = "entity"; //用户类别（admin：管理员；officer：监管人员；entity：市场主体用户；licence：许可证用户）
						} 
						
						//设置本地信息
						baseUtils.setState(data.account, 
										   data.username,
										   data.orgCode,
										   data.orgName,
										   user_category_code, //正常业务，此数据来源于服务
										   data.apitoken);
						
						$("#userid").val('');
						$("#password").val('');
						$("#verifycode").val('');

						var login_state_msg = login_state_msgs[data.state];
						if( login_state_msg!= null){
							mui.alert(login_state_msg,null,"确认",function(){
								goPage();
							});
						}else{
							goPage();
						}
					} else {
						mui.alert(data.message);
					}
				},
				error: function(xhr, type, errorThrown) {
					//异常处理；
					mui.hideLoading();
					mui.toast("网络连接异常！错误信息：" + type);
				}
			});
		}
	}
	
	var goPage = function(){
		// setTimeout(()=>{
		//   plus.runtime.restart(); //重启app
		// },100)
			
		var all = plus.webview.all();  
		var current = plus.webview.currentWebview().id;  
		for(var i=0,len=all.length;i<len;i++){  
		    if(all[i].id!==current){  
		        all[i].close();  
		    }  
		}  
			
		mui.openWindow({
			id: '../../models/main/main.html',
			url: '../../models/main/main.html',
			extras: {
				pageId: window.login.pageId
			}
		});
	}

});