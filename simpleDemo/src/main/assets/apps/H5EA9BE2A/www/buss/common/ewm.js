(function(mui, owner) {
	//url前缀
	var appUrl = baseUtils.URL;
	//纳税人名称（姓名）
	var nsrmc = UserInfoUtils.getUserInfo().nsrmc;
	//纳税人识别号（身份证号）
	var nsrsbh = UserInfoUtils.getUserInfo().nsrsbh;
	//登记序号
	var djxh = UserInfoUtils.getUserInfo().djxh
	//扫描对象
	var scan = null; 
	

	owner.pageload = function(webview) {
		// mui.alert(nsrmc);
		owner.myInit();
		owner.addEvent();
	}
	
	// 初始化
	owner.myInit = function() {
		startRecognize();
	}
	
	// 刷新
	owner.refresh = function() {
		owner.myInit();
	}
	
	//添加事件
	owner.addEvent = function() {
		//绑定监听事件
		// document.getElementById("nextBtn").addEventListener("tap", function() {
		// 	owner.sbsubmit();
		// });
		
	}
	function startRecognize() {
		try {
			var filter;
			//自定义的扫描控件样式
			var styles = {
				top: '44px',
				left: '0px',
				width: '100%',
				height: '100%',
				position: 'static',
			}
			//扫描控件构造
			scan = plus.barcode.create('bcid', filter, styles);
			scan.onmarked = onmarked;
			scan.onerror = onerror;
			plus.webview.currentWebview().append(scan);
			scan.start();
			//打开关闭闪光灯处理
			var flag = false;
			document.getElementById("turnTheLight").addEventListener('tap', function() {
				if (flag == false) {
					scan.setFlash(true);
					flag = true;
				} else {
					scan.setFlash(false);
					flag = false;
				}
			});
			mui(document.body).on('tap', '.mui-action-back', function(e) {
				scan.close();
			});
		} catch (e) {
			alert("出现错误啦:\n" + e);
		}
	};
	 
	function onerror(e) {
		alert(e);
	};
	 
	function onmarked(type, result) {
		var text = '';
		switch (type) {
			case plus.barcode.QR:
				text = 'QR: ';
				break;
			case plus.barcode.EAN13:
				text = 'EAN13: ';
				break;
			case plus.barcode.EAN8:
				text = 'EAN8: ';
				break;
		}
		//扫描成功之后的处理
		// mui.alert(text + " : " + result);
		// scan.start();
		
		var tran_id = tranIdInfo.zzjdl;
		var taxML = {
					"key": result,
					"djxh":djxh,
					"nsrmc":nsrmc,
					"type":"1",
					"nsrsbh":nsrsbh,
					"smzbj":"1"
				};
		var reqInfo = ReqInfo.getReqInfo(tran_id,taxML);
		mui.showLoading("授权登录中...");
		console.log(JSON.stringify(reqInfo));
		$http.post(appUrl,reqInfo,(res)=>{
			console.log(JSON.stringify(res));
			mui.hideLoading();
			if(res != null && res != ''){
				var code_head = res.head.rtn_code;
				if(code_head == '0'){
					mui.alert("授权登录成功");
				}else{
					scan.start();
					mui.alert(JSON.stringify(res));
				}
				
			}else{
				mui.toast("数据异常！");
			}
		});
	};
	 
	// 从相册中选择二维码图片 
	function scanPicture() {
		plus.gallery.pick(function(path) {
			plus.barcode.scan(path, onmarked, function(error) {
				plus.nativeUI.alert("无法识别此图片");
			});
		}, function(err) {
			plus.nativeUI.alert("Failed: " + err.message);
		});
	}
	//初始化执收单位
	owner.initfszsdwData = function() {
		var tran_id = tranIdInfo.dwcj;
		var taxML = {
						"query_id" : "glql"
					};
		var reqInfo = ReqInfo.getReqInfo(tran_id,taxML);
		
		$http.post(appUrl,reqInfo,(res)=>{
			if(res != null && res != ''){
				var code_head = res.head.rtn_code;
				if(code_head == '0'){
					zsdPicker.setData(res.body.taxML.dwcj);
					//把数据放到缓存中
					localStorage.setItem("zsdwInfo", JSON.stringify(res.body.taxML.dwcj));
				}else{
					mui.alert(res.head.rtn_msg.Message);
				}
				
			}else{
				mui.toast("数据异常！");
			}
		});
	}
	
}(mui, window.ewm = {}));
