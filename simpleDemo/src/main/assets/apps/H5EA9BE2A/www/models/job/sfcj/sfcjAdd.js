(function(mui, owner) {
	//url前缀
	var appUrl = baseUtils.URL;
	//超时时间
	var atimeout = baseUtils.timeout;
	//账号
	var account = baseUtils.getState().account;
	//token 同时检查是否过期
	var token = baseUtils.getApiToken();
	
	console.log("---appUrl=" + appUrl + "---atimeout=" + atimeout + "---account=" + account + "---token=" + token );
	
	//以下编写业务代码
	var g_myData = "";
	var g_CodeList = "";
	owner.pageload = function(webview) {
		if (baseUtils.isNotEmpty(webview.myData)){
			g_myData = webview.myData;
		}
		
		owner.myInit();
		owner.addEvent();
	}
	
	// 初始化
	owner.myInit = function() {
		owner.getsfcjById();	
		owner.getCurUserInfo();
		owner.initPopPicker();
	}
	
	// 刷新
	owner.refresh = function() {
		owner.myInit();
	}
	
	//添加事件
	owner.addEvent = function() {

		// 日期控件
		mui('.myDtPicker').each(function(i, btn) {
			btn.addEventListener('tap', function() {
				baseUtils.getDtPicker(this);
			}, false);
		});
		
		document.getElementById("saveBtn").addEventListener("tap", function() {
			if (baseUtils.isEmpty(g_myData)){
				owner.addsfcj();
			} else {
				owner.updsfcj();
			}
		});
		
		document.getElementById("cancelBtn").addEventListener("tap", function() {
			mui.back(false);
		});
		
		document.getElementById("selectBtn").addEventListener("tap", function() {
			if (baseUtils.isEmpty(document.querySelector("#QY_CATEGORY_CODE").value) ){
				mui.toast("请您选择示范创建单位类型！");
				return;
			}
			
			mui.openWindow({
				url: '../common/xkzList.html',
				id: "../common/xkzList.html",
				extras: {
					QY_CATEGORY_CODE: baseUtils.getCodeListValue(g_CodeList.QY_CATEGORY_CODE, document.querySelector("#QY_CATEGORY_CODE").value.trim())
				}
			});
		});
		
		//监听自定义事件，用于和B.html页面进行通信
		window.addEventListener("changeName", function(e) {
			document.querySelector("#QY_NAME").value = e.detail.data.QY_NAME;
			document.querySelector("#UNISCID").value = e.detail.data.UNISCID;
			document.querySelector("#XKZBH").value = e.detail.data.XKZBH;
		});
		
		document.getElementById("cameraBtn").addEventListener("tap", function() {
			var c = plus.camera.getCamera();
			c.captureImage(function(e) {
				plus.io.resolveLocalFileSystemURL(e, function(entry) {
					var imgSrc = entry.toLocalURL() + "?version=" + new Date().getTime();
					// document.querySelector("#fileNameId").value = imgSrc;
					owner.saveImgNode("imgs-box", imgSrc);
				}, function(e) {
					console.log("读取拍照文件错误：" + e.message);
				});
			}, function(s) {
				console.log('error:');
				console.log(s);
			}, {
				filename: "_doc/camera/"
			})
		});

		document.getElementById("selectCameraBtn").addEventListener("tap", function() {
			// 从相册中选择图片
			plus.gallery.pick(function(e) {
			    for(var i in e.files) {
			        var fileSrc = e.files[i];
					// document.querySelector("#fileNameId").value = fileSrc;   
					owner.saveImgNode("imgs-box", fileSrc);
			    }
			}, function(e) {
			    if(e.code == 8) { //没有权限 
			        var btnArray = ["确定"];
			        mui.confirm('请在【设置】-【项目名称】中打开相机及相册权限！', '相册权限未开', btnArray, function(e) {
			            if(e.index == 1) {
						
			            } else {
						
			            }
			        })
			    }
			    console.log("取消选择图片");
			}, {
			    filter: "image",
			    multiple: true,
			    maximum: 1,
			    system: false,
			    onmaxed: function() {
			        onAlert('最多只能选择1张图片');
			    }
			});
		});
		
		mui('#imgs-box').on('tap', '.deletepic', function(e) {
			var imgNode = this.nextElementSibling;
			var source = imgNode.getAttribute("picsource");
			var ul_node = this.parentNode.parentNode;
			ul_node.removeChild(this.parentNode);
		});
	}
	
	owner.saveImgNode = function(nodeId, imgSrc) {
		var objArr = document.getElementById(nodeId).querySelector('ul').querySelectorAll("li");
		for (let i=0; i<objArr.length; ++i){
			objArr[i].remove();
		}
		
		var liNode = document.createElement('li');
		liNode.innerHTML = '<img class="deletepic" src="../../../img/job/delete.png">';
		var imgNode = document.createElement('img');
		imgNode.setAttribute('name', 'checkimg');
		imgNode.dataset.picid = owner.getPicId();
		imgNode.setAttribute('picsource', 'new');
		imgNode.src = imgSrc;
		imgNode.dataset.previewSrc = '';
		imgNode.dataset.previewGroup = 'ItemGroup';
		liNode.appendChild(imgNode);
		document.getElementById(nodeId).querySelector('ul').appendChild(liNode);
	};
	
	//搜索查询
	owner.searchFun = function() {
		//监听搜索框变化
		mui(".mui-input-clear")[0].addEventListener('input', function() {
			searchName = document.querySelector('#searchid').value;
			owner.refresh();
		});
		//监听搜索框清除事件--点击清除不能监控到搜索框变化，只能单独监听
		mui(".mui-icon-clear")[0].addEventListener('tap', function() {
			searchName = "";
			owner.refresh();
		});
		//输入法软键盘的搜索
		document.querySelector('#searchid').addEventListener("keydown", function(e) {
			if(13 == e.keyCode) { //点击了“搜索”   
				document.activeElement.blur(); //隐藏软键盘  
				searchName = document.querySelector('#searchid').value;
				owner.refresh();
			}
		}, false);
	}
	
	owner.getCurUserInfo = function() {
		var param = {};
		param.codeType = "QY_CATEGORY_CODE";
		mui.showLoading("操作中...");
		mui.ajax(appUrl + '/com/neusoft/mle/app/action/common/common.getCurUserInfo.svc', {
			data: {
				condition: param
			},
			dataType: 'json',
			type: 'post',
			timeout: atimeout,
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'Content-Type': 'application/json;charset=utf-8',
				'sso-token': token
			},
			success: function(data) {
				console.log("---getCurUserInfo---:" + JSON.stringify(data));
				mui.hideLoading();
				//判断返回状态码，200-ture
				var stFlag = baseUtils.checkStatus(data);
				if(stFlag) {
					var code = data.code;
					if(code != "1") {
						var msg = data.message;
						mui.toast(msg);
					} else {
						document.querySelector("#MM_ORG_NAME").value = data.data.obj.orgName;
						document.querySelector("#MM_ORG_CODE").value = data.data.obj.orgCode;
					}
				}
			},
			error: function(xhr, type, errorThrown) {
				mui.hideLoading();
				//获取本地数据
				mui.toast("网络连接异常，请确认手机网络状态！");
			}
		});
	
	}
	
	
	owner.initPopPicker = function() {
		owner.getCodeList();
		owner.getNDCodeList();
	}
	
	owner.getNDCodeList = function() {
		var param = {};
		mui.showLoading("操作中...");
		mui.ajax(appUrl + '/com/neusoft/mle/app/action/sfcj/sfcj.getNDCodeList.svc', {
			data: {
				condition: param
			},
			dataType: 'json',
			type: 'post',
			timeout: atimeout,
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'Content-Type': 'application/json;charset=utf-8',
				'sso-token': token
			},
			success: function(data) {
				console.log("---getCodeList---:" + JSON.stringify(data));
				mui.hideLoading();
	
				//判断返回状态码，200-ture
				var stFlag = baseUtils.checkStatus(data);
				if(stFlag) {
					var code = data.code;
					if(code != "1") {
						var msg = data.message;
						mui.toast(msg);
					} else {
						// 选择控件
						document.querySelector("#MM_YEAR").setAttribute('data-options', JSON.stringify(data.data.ndCodeList).replace(/label/g,"text"));
						document.querySelector("#MM_YEAR").addEventListener("tap", function() {
							baseUtils.getPopPicker(this);
						});
						
						if (baseUtils.isNotEmpty(g_myData)){
							document.querySelector("#MM_YEAR").value = g_myData.MM_YEAR;
						}
					}
				}
			},
			error: function(xhr, type, errorThrown) {
				mui.hideLoading();
				//获取本地数据
				mui.toast("网络连接异常，请确认手机网络状态！");
			}
		});
	}
	
	owner.getCodeList = function() {
		var param = {};
		param.codeType = "QY_CATEGORY_CODE,SF_CATEGORY_CODE";
		mui.showLoading("操作中...");
		mui.ajax(appUrl + '/com/neusoft/mle/app/action/common/common.getCodeList.svc', {
			data: {
				condition: param
			},
			dataType: 'json',
			type: 'post',
			timeout: atimeout,
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'Content-Type': 'application/json;charset=utf-8',
				'sso-token': token
			},
			success: function(data) {
				console.log("---getCodeList---:" + JSON.stringify(data));
				mui.hideLoading();
				//判断返回状态码，200-ture
				var stFlag = baseUtils.checkStatus(data);
				if(stFlag) {
					var code = data.code;
					if(code != "1") {
						var msg = data.message;
						mui.toast(msg);
					} else {
						g_CodeList = data.data.CodeList; //[{text:"测试一", value:"测试一value"}];
						
						// 选择控件
						document.querySelector("#QY_CATEGORY_CODE").setAttribute('data-options', JSON.stringify(g_CodeList.QY_CATEGORY_CODE));
						document.querySelector("#QY_CATEGORY_CODE").addEventListener("tap", function() {
							baseUtils.getPopPicker(this);
						});
						
						if (baseUtils.isNotEmpty(g_myData)){
							document.querySelector("#QY_CATEGORY_CODE").value = g_myData.QY_CATEGORY_CODE;
						}
						
						// 选择控件
						document.querySelector("#SF_CATEGORY_CODE").setAttribute('data-options', JSON.stringify(g_CodeList.SF_CATEGORY_CODE));
						document.querySelector("#SF_CATEGORY_CODE").addEventListener("tap", function() {
							baseUtils.getPopPicker(this);
						});
						
						if (baseUtils.isNotEmpty(g_myData)){
							document.querySelector("#SF_CATEGORY_CODE").value = g_myData.SF_CATEGORY_CODE;
						}
					}
				}
			},
			error: function(xhr, type, errorThrown) {
				mui.hideLoading();
				//获取本地数据
				mui.toast("网络连接异常，请确认手机网络状态！");
			}
		});
	}
	
	owner.getsfcjById = function() {
		if (baseUtils.isEmpty(g_myData)){
			return;	
		}
		
		var param = {};
		param.ID = g_myData.ID;
		mui.showLoading("操作中...");
		mui.ajax(appUrl + '/com/neusoft/mle/app/action/sfcj/sfcj.getsfcjById.svc', {
			data: {
				condition: param
			},
			dataType: 'json',
			type: 'post',
			timeout: atimeout,
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'Content-Type': 'application/json;charset=utf-8',
				'sso-token': token
			},
			success: function(data) {
				console.log("---getsfcjById---:" + JSON.stringify(data));
				mui.hideLoading();
	
				//判断返回状态码，200-ture
				var stFlag = baseUtils.checkStatus(data);
				if(stFlag) {
					var code = data.code;
					if(code != "1") {
						var msg = data.message;
						mui.toast(msg);
					} else {
						var $container = $("#scrollin").find(".initPage");
						owner.initPage($container, data.data.obj);

						owner.renderImgs("imgs-box", data.data.obj.FILE_LIST);
					}
				}
			},
			error: function(xhr, type, errorThrown) {
				mui.hideLoading();
				//获取本地数据
				mui.toast("网络连接异常，请确认手机网络状态！");
			}
		});
	}
	
	owner.initPage = function(container, data) {
		var $valNodes = $(container).children().find("[attr-name]");
		$valNodes.each(function(i, node) {
			var _this = $(node);
			var _key = _this.attr("attr-name");
			var _val = data[_key];
			_this.val(_val);
		});
	}
	
	owner.onChangePopPicker = function() {
		
	}
	
	owner.getPicId = function() {
		function S4() {
			return(((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		};
		return (new Date()).getTime().toString() + S4();
	};
	
	owner.addsfcj = function() {			
		var param = owner.checkParam();
		if (null == param){
			return;
		}
		
		mui.showLoading("操作中...");
		var task = plus.uploader.createUpload(appUrl + '/com/neusoft/mle/app/action/sfcj/sfcj.addsfcj.svc', {
				timeout: baseUtils.timeout
			},
			function(data, status) {
				mui.hideLoading();
				if ( status == 200 ) { 
					mui.toast("操作成功！");
					mui.back(true);
				} else {
					mui.toast('操作失败！失败原因：'+ (status == null ? "网络连接异常，请确认手机网络状态。": status));
				}
			});
		task.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		task.setRequestHeader('sso-token', token);
		task.addData('condition', JSON.stringify(param));
		mui.each(param.filePaths, function(i, filePath) {
			task.addFile(filePath, {
				key: owner.getPicId()
			});
		});
		task.start();
	}
	
	owner.updsfcj = function() {
		var param = owner.checkParam();
		if (null == param){
			return;
		}
		param.ID = g_myData.ID;
		mui.showLoading("操作中...");
		var task = plus.uploader.createUpload(appUrl + '/com/neusoft/mle/app/action/sfcj/sfcj.updsfcj.svc', {
				timeout: baseUtils.timeout
			},
			function(data, status) {
				mui.hideLoading();
				if ( status == 200 ) { 
					mui.toast("操作成功！");
					mui.back(true);
				} else {
					mui.toast('操作失败！失败原因：'+ (status == null ? "网络连接异常，请确认手机网络状态。": status));
				}
			});
		task.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		task.setRequestHeader('sso-token', token);
		task.addData('condition', JSON.stringify(param));
		mui.each(param.filePaths, function(i, filePath) {
			task.addFile(filePath, {
				key: owner.getPicId()
			});
		});
		task.start();
	}
	
	owner.checkParam = function() {
		var param = {};
		param.QY_CATEGORY_CODE = baseUtils.getCodeListValue(g_CodeList.QY_CATEGORY_CODE, document.querySelector("#QY_CATEGORY_CODE").value.trim());
		param.QY_NAME = document.querySelector("#QY_NAME").value.trim();
		param.UNISCID = document.querySelector("#UNISCID").value.trim();
		param.XKZBH = document.querySelector("#XKZBH").value.trim();
		param.SF_CATEGORY_CODE = baseUtils.getCodeListValue(g_CodeList.SF_CATEGORY_CODE, document.querySelector("#SF_CATEGORY_CODE").value.trim());
		param.MM_ORG_NAME = document.querySelector("#MM_ORG_NAME").value.trim();
		param.MM_ORG_CODE = document.querySelector("#MM_ORG_CODE").value.trim();
		param.MM_YEAR = document.querySelector("#MM_YEAR").value.trim();
		param.MM_DATE = document.querySelector("#MM_DATE").value.trim();
		param.MM_DESCRIPTION = document.querySelector("#MM_DESCRIPTION").value.trim();
		
		// 上传文件
		var filePaths = [];
		var newImgsNodes = document.getElementById("imgs-box").querySelectorAll('img[picsource=new]');
		if(newImgsNodes.length != 0) {
			mui.each(newImgsNodes, function(i, n) {
				filePaths.push(n.src);
			});
		} 
		param.filePaths = filePaths;
		
		if (baseUtils.isEmpty(param.QY_CATEGORY_CODE) ){
			mui.toast("请选择示范创建单位类型！");
			return null;
		}
		if (baseUtils.isEmpty(param.QY_NAME) ){
			mui.toast("请选择示范创建单位！");
			return null;
		}
		if (baseUtils.isEmpty(param.SF_CATEGORY_CODE) ){
			mui.toast("请选择示范创建类别！");
			return null;
		}
		if (baseUtils.isEmpty(param.MM_ORG_NAME) ){
			mui.toast("请输入命名单位！");
			return null;
		}
		if (baseUtils.isEmpty(param.MM_YEAR) ){
			mui.toast("请选择年度！");
			return null;
		}
		if (baseUtils.isEmpty(param.MM_DATE) ){
			mui.toast("请选择命名日期！");
			return null;
		}

		if (baseUtils.getStringlength(param.MM_DESCRIPTION) > 1000){
			mui.toast("命名说明不能多于1000个字节！");
			return false
		}
		
		return param;
	}
	
	owner.renderImgs = function(_node, fileList) {
		let ulNode = document.getElementById(_node).querySelector("ul");
		ulNode.innerHTML = "";
		mui.each(fileList, function(i, file) {
			if (file.FILETYPE == "jpg"){
				var liiNode = document.createElement('li');
				liiNode.innerHTML = '<img class="deletepic" src="../../../img/job/delete.png">';
				
				var imgNode = document.createElement('img');
				if (_node == "imgs-box"){
					imgNode.setAttribute('data-preview-src', '');
					imgNode.setAttribute('data-preview-group', '1');
				}
				imgNode.name = 'checkimg';
				imgNode.dataset.picid = file.FILE_ID;
				imgNode.setAttribute('picsource', 'original');
				imgNode.setAttribute('class', 'displayNode');
				imgNode.src = file.FILE_PATH;
				// console.log(img.ENPATH);
				liiNode.appendChild(imgNode);
				var ulNode = document.querySelector("#" + _node + " ul");
				ulNode.appendChild(liiNode);
			}
			
		});
	}
	
	
	
	
	
}(mui, window.sfcjAdd = {}));