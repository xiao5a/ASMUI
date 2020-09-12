/**
 * author:chen.xl@neusoft.comchen.xl
 * owner.URL							ajax请求服务地址前缀
 * owner.timeout						ajax超时时间
 * owner.checkStatus					判断ajax返回的状态码
 * owner.token_timeout					token超时时间。需要根据服务器端的token过期期间设置，建议比服务端时间短一些
 * owner.localPath						本地文件存储路径，慎用
 * owner.app_version					版本升级服务端接口。获取数据参考配置表:T_VERSION
 * owner.setState						设置用户状态:account、name、regorg、regorgcn、user_category_code、token、tokenTime
 * owner.getState						获取用户状态
 * owner.removeState					移除用户状态
 * owner.returnLogin					返回登录页
 * owner.isLogin						判断用户是否登录
 * owner.getApiToken					调用后台接口服务时，请先获取api token ，并放入ajax 的header 中的sso-token 字段
 * owner.checkVersion					检查app版本，带有升级功能
 * owner.sleep							休眠
 * owner.isEmpty						判断是否为空
 * owner.isNotEmpty						判断不为空
 * owner.getDtPicker					封装日历控件
		用法：HTML页面添加元素：	<input id="myDtPickerId" type="text" class="myDtPicker mui-input-clear" placeholder="请选择承诺时间" data-default="" data-options='{"type":"date","beginYear":2019,"endYear":2030}'>
		JS里面初始化：			mui('.myDtPicker').each(function(i, btn) {
									btn.addEventListener('tap', function() {
										baseUtils.getDtPicker(this);
									}, false);
								});
		JS设置初始值：      		document.querySelector("#myDtPickerId").value = "2020-07-23";
		JS获取值：				var value = document.querySelector("#myDtPickerId").value.trim();
 * owner.getPopPicker					封装选择控件
  		用法：HTML页面添加元素：	<input id="myPopPickerId" type="text" class="myPopPicker" placeholder=""  data-default="" data-options="" on-Change="回调方法">
  			 JS里面初始化：		var data = [{text:"测试一", value:"测试一value"}];
								document.querySelector("#myPopPickerId").setAttribute('data-options', JSON.stringify(data));
								document.querySelector("#myPopPickerId").addEventListener("tap", function() {
									baseUtils.getPopPicker(this);
								});
			 JS设置初始值：      document.querySelector("#myPopPickerId").value = baseUtils.getCodeListText(data, "测试一value");
			 JS获取值：			var text = document.querySelector("#myPopPickerId").value;
								var value = baseUtils.getCodeListValue(data, text);
 * owner.formatDate						格式化时间，如"yyyy-MM-dd hh:mm:ss"
 * owner.getDateStr						时间差
 * owner.compareDate					比较时间大小：等于=0，大于=1，小于=-1
 * owner.getStringlength				计算字节长度
 * owner.isPoneAvailable				校验电话号码
 * owner.identityCodeValid 				校验身份证
 * owner.encode							明文加密
 * owner.initPage						初始化分页
 * owner.nextPage						下一页
 * owner.isFirstPage					第一次进入分页
 * 			分页：上拉刷新。请参考：App-H5plus\models\job\zryt\zrytList.html ~ zrytList.js  再文件中查询注释：【适用于需要分页的功能】
 * 
 * 
 */
(function(mui, owner) {
	//ajax请求服务地址前缀
	owner.URL = 'https://etax.hubei.chinatax.gov.cn/webroot/ehbQuery.json';
	
	//ajax超时时间
	owner.timeout = 60000; //60秒
	
	//token超时时间。需要根据服务器端的token过期期间设置，建议比服务端时间短一些
	owner.token_timeout = 4 * 3600 * 1000; //4小时
	
	//本地文件存储路径
	owner.localPath = "/Movies/neusoft/";	
	
	//版本升级服务端接口。获取数据参考配置表:T_VERSION
	owner.app_version = '/com/neusoft/mle/app/action/system/system.getAppVersionInfo.svc';
	
	//判断ajax返回的状态码
	owner.checkStatus = function(data) {
		//获取状态码
		var status = data.status;
		var flag = false;
		if (status == '200') {
			//200成功
			flag = true;
		} else if (status == '401') {
			//401 未授权  token失效
			mui.toast("登录已过期，请重新登录！");
			owner.returnLogin();
		} else if (status == '403') {
			//403
			mui.toast("登录已过期，请重新登录！");
			owner.returnLogin();
		} else if (status == '400') {
			//400
			mui.toast("服务异常，请稍后再试！");
		} else if (status == '404') {
			//404
			mui.toast("服务异常，请稍后再试！");
		} else if (status == '500') {
			//500
			mui.toast("服务异常，请稍后再试！");
		} else {
			mui.toast(status);
		}

		return flag;
	}
	
	//设置用户状态
	owner.setState = function(account, name, regorg, regorgcn, user_category_code, token) {
		var state = owner.getState();
		state.account = account || '';
		state.name = name || '';
		state.regorg = regorg || '';
		state.regorgcn = regorgcn || '';
		state.user_category_code = user_category_code || '';
		state.token = token || '';
		state.tokenTime = token=="" ? "": Date.now(); //token创建时间
		localStorage.setItem('$state', JSON.stringify(state));
		console.log("---baseUtils setState---:" + JSON.stringify(state));
	}
	//获取用户状态
	owner.getState = function() {
		var stateText = localStorage.getItem('$state') || "{}";
		console.log("---baseUtils getState---:" + stateText);
		return JSON.parse(stateText);
	}
	//移除用户状态
	owner.removeState = function() {
		localStorage.removeItem('$state');
		console.log("---baseUtils removeState---:$state");
	}
	
	//返回登录页
	owner.returnLogin = function() {
		mui.plusReady(function() {
			//清除本地缓存
			var account = owner.getState().account;
			localStorage.clear(); 			//清除存储内容
			owner.setState(account, ""); 	// 记住上次登录账号
			plus.runtime.restart(); 		//重启app。这里最好返回登录页面。
		});
	}
	
	//判断用户是否登录
	owner.isLogin = function() {
		var result = false;
		var state = owner.getState();
		if (owner.isNotEmpty(state) && owner.isNotEmpty(state.account) &&　owner.isNotEmpty(state.token)　&&　owner.isNotEmpty(state.tokenTime)) {
			var t = Date.now().getTime() - new Date(state.tokenTime).getTime();
			console.log("---baseUtils isLogin---:token已经存在" + t + "秒---" + JSON.stringify(state));
			if (t < owner.token_timeout) {
				result = true;
			}
		}
		
		return result;
	}
	
	//调用后台接口服务时，请先获取api token ，并放入ajax 的header 中的sso-token 字段
	owner.getApiToken = function() {
		var result = null;
		var state = owner.getState();
		if (owner.isNotEmpty(state) && owner.isNotEmpty(state.account) &&　owner.isNotEmpty(state.token)　&&　owner.isNotEmpty(state.tokenTime)) {
			var t = new Date().getTime() - new Date(state.tokenTime).getTime();
			console.log("---baseUtils getApiToken---:token已经存在" + t + "秒---" + JSON.stringify(state));
			if (t >= owner.token_timeout) {
				// 超时
				alert();
				mui.toast("登录已过期，请重新登录！");
				owner.returnLogin();
			} else {
				result = state.token;
			}
		}
		
		return result;
	}
	
	//检查app版本，带有升级功能
	owner.checkVersion = function() {
		plus.runtime.getProperty(plus.runtime.appid, function(inf) {
			ver = inf.version;
			mui.ajax(owner.URL + owner.app_version, {
				type: "POST",
				dataType: "json", //指定服务器返回的数据类型
				headers: {
					'Content-Type': 'application/json;charset=utf-8'
				},
				timeout: owner.timeout,
				success: function(data) {
					var result = data.data.versionInfo;
					console.log("---baseUtils checkVersion---当前版本:" + inf.versionCode + "---" + JSON.stringify(data));
					var code = data.code;
					if(code != "1") {
						var msg = data.message;
						mui.toast(msg);
					} else {
						var result = data.data.versionInfo;
						if (baseUtils.isNotEmpty(result) && result.verno > inf.versionCode) {
							//if (ver != result.verno) {
							var content = result.vercontent.replace(/,/g, "\n");
							mui.alert(content, "发现新版本（V" + result.verno + "）", "是", function(z) {
								if (z.index == 0) {
									var url = "";
									if (mui.os.ios) {
										url = result.verurl.split(';,;')[1];
									} else {
										url = result.verurl.split(';,;')[0];
									}
									mui.showLoading("正在下载..", "div");
									var dtask = plus.downloader.createDownload(url, {}, function(d, status) {
										if (status == 200) {
											mui.hideLoading();
											clearInterval(i);
											plus.nativeUI.toast("开始准备环境，请稍后！");
											owner.sleep(1000);
											var path = d.filename; //_downloads yijietong.apk
											plus.runtime.install(path); // 安装下载的apk文件
										} else {
											mui.alert('Download failed:' + status);
											mui.hideLoading();
										}
									});
									dtask.start();
									var i = setInterval(function() {
										var totalSize = dtask.totalSize;
										var downloadedSize = dtask.downloadedSize;
										$('#proDownFile').attr('value', downloadedSize);
										$('#proDownFile').attr('max', totalSize);
						
									}, 100); //1000为1秒钟
								}
							});
						} else {
							// mui.toast("当前版本为V" + ver + "，已经是最新版本！");
						}					
					}
				},
				error: function(xhr, type, errorThrown) {
					// 异常处理；
					mui.toast("检测版本失败，请检查手机网络连接状态！");
				}
			});
		})
	}
	
	owner.sleep = function(numberMillis) {
		var now = new Date();
		var exitTime = now.getTime() + numberMillis;
		while (true) {
			now = new Date();
			if (now.getTime() > exitTime)
				return;
		}
	}
	
	// 判断是否为空
	owner.isEmpty = function(obj) {
		if (typeof obj == "undefined" || obj == null || obj == "") {
			return true;
		} else {
			return false;
		}
	}
	
	// 判断不为空
	owner.isNotEmpty = function(obj) {
		return !owner.isEmpty(obj);
	}
	
	// 封装日历控件
	owner.getDtPicker = function(obj) {
		var _self = obj;
		if (_self.picker) {
			_self.picker.show(function(rs) {
				console.log("rs--" + JSON.stringify(rs));
				_self.value = rs.text;
				_self.picker.dispose();
				_self.picker = null;
			});
		} else {
			var optionsJson = obj.getAttribute('data-options') || '{}';
			var options = JSON.parse(optionsJson);
			var id = obj.getAttribute('id');
	
			/*
			 * 首次显示时实例化组件
			 * 示例为了简洁，将 options 放在了按钮的 dom 上
			 * 也可以直接通过代码声明 optinos 用于实例化 DtPicker
			 */
			_self.picker = new mui.DtPicker(options);
			_self.picker.show(function(rs) {
				/*
				 * rs.value 拼合后的 value
				 * rs.text 拼合后的 text
				 * rs.y 年，可以通过 rs.y.vaue 和 rs.y.text 获取值和文本
				 * rs.m 月，用法同年
				 * rs.d 日，用法同年
				 * rs.h 时，用法同年
				 * rs.i 分（minutes 的第二个字母），用法同年
				 */
				_self.value = rs.text;
				/* 
				 * 返回 false 可以阻止选择框的关闭
				 * return false;
				 */
				/*
				 * 释放组件资源，释放后将将不能再操作组件
				 * 通常情况下，不需要示放组件，new DtPicker(options) 后，可以一直使用。
				 * 当前示例，因为内容较多，如不进行资原释放，在某些设备上会较慢。
				 * 所以每次用完便立即调用 dispose 进行释放，下次用时再创建新实例。
				 */
				_self.picker.dispose();
				_self.picker = null;
			});
		}
	
		var defaultData = obj.getAttribute('data-default');
		if ("" != defaultData) {
			_self.picker.setSelectedValue(defaultData);
		}
	}
	
	// 封装选择控件
	owner.getPopPicker = function(obj) {
		var _self = obj;
		if (_self.picker) {
			_self.picker.show(function(rs) {
				console.log("rs--" + JSON.stringify(rs));
				_self.value = rs[0].text;
				_self.setAttribute("data-default", rs[0].value)
				_self.picker.dispose();
				_self.picker = null;
			});
		} else {
			var optionsJson = obj.getAttribute('data-options') || '{}';
			var options = JSON.parse(optionsJson);
			var id = obj.getAttribute('id');
	
			/*
			 * 首次显示时实例化组件
			 * 示例为了简洁，将 options 放在了按钮的 dom 上
			 * 也可以直接通过代码声明 optinos 用于实例化 DtPicker
			 */
			_self.picker = new mui.PopPicker();
			_self.picker.setData(options);
	
			_self.picker.show(function(rs) {
				/*
				 * 可以通过 rs.y.vaue 和 rs.y.text 获取值和文本
				 */
	
	
	
	
	
				_self.value = rs[0].text;
				_self.setAttribute("data-default", rs[0].value)
				console.log("rs[0].text=" + rs[0].text + "----rs[0].value=" + rs[0].value + "---_self.data-default=" + _self.getAttribute(
					"data-default"));
	
				var datalocalStorage = _self.getAttribute("data-localStorage");
				if (null != datalocalStorage && "" != datalocalStorage) {
					localStorage.setItem(datalocalStorage, rs[0].value);
					console.log("变化后：" + localStorage.getItem(datalocalStorage));
				}
				
				// 回调功能
				var onChange = _self.getAttribute("on-Change");
				if (null != onChange && "" != onChange) {
					eval(onChange + '()');
				}
								
				/* 
				 * 返回 false 可以阻止选择框的关闭
				 * return false;
				 */
				/*
				 * 释放组件资源，释放后将将不能再操作组件
				 * 通常情况下，不需要示放组件，new DtPicker(options) 后，可以一直使用。
				 * 当前示例，因为内容较多，如不进行资原释放，在某些设备上会较慢。
				 * 所以每次用完便立即调用 dispose 进行释放，下次用时再创建新实例。
				 */
				_self.picker.dispose();
				_self.picker = null;
			});
		}
	
		var defaultData = obj.getAttribute('data-default');
		if ("" != defaultData) {
			_self.picker.pickers[0].setSelectedValue(defaultData);
		}
	}
	
	owner.getObjectDataText = function(ObjectData, value) {
		var text = "";
		for (var obj of ObjectData) {
			if (value == obj.value) {
				text = obj.text;
			}
		}

		return text
	}
	
	// 格式化时间，如"yyyy-MM-dd hh:mm:ss"
	owner.formatDate = function(date, fmt) {
		return date.format(fmt);
	}
	
	Date.prototype.format = function(fmt) {
		var o = {
			"M+": this.getMonth() + 1, //月份
			"d+": this.getDate(), //日
			"h+": this.getHours(), //小时
			"m+": this.getMinutes(), //分
			"s+": this.getSeconds(), //秒
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度
			"S": this.getMilliseconds() //毫秒
		};
		if (/(y+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		for (var k in o) {
			if (new RegExp("(" + k + ")").test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			}
		}
		return fmt;
	}
	
	//获取AddDayCount天后的日期 
	//昨天：countDay = -1 
	//今天： countDay = 0
	//明天： countDay = 1
	owner.getDateStr = function(myDay, countDay) {
		myDay.setDate(myDay.getDate() + countDay);
		var y = myDay.getFullYear();
		var m = myDay.getMonth() + 1;
		var d = myDay.getDate();
	
		return y + "-" + m + "-" + d;
	}
	
	// 比较时间大小：等于=0，大于=1，小于=-1
	owner.compareDate = function(date1, date2) {
		var oDate1 = new Date(date1);
		var oDate2 = new Date(date2);
		if (oDate1.getTime() > oDate2.getTime()) {
			return 1;
		} else if (oDate1.getTime() == oDate2.getTime()) {
			return 0;
		} else {
			return -1;
		}
	}
	
	owner.getCodeListText = function(arr, value) {
		var text = "";
		for (var obj of arr) {
			if (obj.value == value) {
				text = obj.text;
				break;
			}
		}
	
		return text;
	}
	
	owner.getCodeListValue = function(arr, text) {
		var value = "";
		for (var obj of arr) {
			if (obj.text == text) {
				value = obj.value;
				break;
			}
		}
	
		return value;
	}
	
	// 计算字节长度
	owner.getStringlength = function(str) {
		//先把中文替换成两个字节的英文，在计算长度
		return str.replace(/[\u0391-\uFFE5]/g, "aa").length;
	}
	
	// 校验电话号码
	owner.isPoneAvailable = function(pone) {
		var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
		if (!myreg.test(pone)) {
			return false;
		} else {
			return true;
		}
	}
	
	// 校验身份证
	owner.identityCodeValid = function(code) {
		var city = {
			11: "北京",
			12: "天津",
			13: "河北",
			14: "山西",
			15: "内蒙古",
			21: "辽宁",
			22: "吉林",
			23: "黑龙江 ",
			31: "上海",
			32: "江苏",
			33: "浙江",
			34: "安徽",
			35: "福建",
			36: "江西",
			37: "山东",
			41: "河南",
			42: "湖北 ",
			43: "湖南",
			44: "广东",
			45: "广西",
			46: "海南",
			50: "重庆",
			51: "四川",
			52: "贵州",
			53: "云南",
			54: "西藏 ",
			61: "陕西",
			62: "甘肃",
			63: "青海",
			64: "宁夏",
			65: "新疆",
			71: "台湾",
			81: "香港",
			82: "澳门",
			91: "国外 "
		};
		var tip = "";
		var pass = true;
	
		if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
			tip = "身份证号格式错误";
			pass = false;
		} else if (!city[code.substr(0, 2)]) {
			tip = "地址编码错误";
			pass = false;
		} else {
			//18位身份证需要验证最后一位校验位
			if (code.length == 18) {
				code = code.split('');
				//∑(ai×Wi)(mod 11)
				//加权因子
				var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
				//校验位
				var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
				var sum = 0;
				var ai = 0;
				var wi = 0;
				for (var i = 0; i < 17; i++) {
					ai = code[i];
					wi = factor[i];
					sum += ai * wi;
				}
				var last = parity[sum % 11];
				if (parity[sum % 11] != code[17]) {
					tip = "校验位错误";
					pass = false;
				}
			}
		}
		
		if (!pass) {
			mui.toast(tip);
		}
		
		return pass;
	}
	
	// 明文加密
	owner.encode = function(password, keyCode) {
		keyCode = keyCode + keyCode + keyCode + keyCode;
		var key = CryptoJS.enc.Utf8.parse(keyCode);
		var decrypted = CryptoJS.AES.encrypt(password, key, {
			mode: CryptoJS.mode.ECB,
			padding: CryptoJS.pad.Pkcs7
		});
		return decrypted.ciphertext.toString();
	}
	
	// 分页配置开始
	owner.initPage = function() {
		owner.pageInfo = {};
		owner.pageInfo.first = true;		//初始化
		owner.pageInfo.page_size = 2;	//每页条数
		owner.pageInfo.begin = 1;			//开始条
		owner.pageInfo.end = owner.pageInfo.begin + owner.pageInfo.page_size - 1;		//结束条
		owner.pageInfo.pageDataName = "pageData";		// 服务端返回数据
	}
	owner.nextPage = function() {
		owner.pageInfo.first = false;
		owner.pageInfo.page_size = 2;	//每页条数
		owner.pageInfo.begin += owner.pageInfo.page_size;
		owner.pageInfo.end += owner.pageInfo.page_size;	
	}
	owner.isFirstPage = function() {
		return owner.pageInfo.first;
	}
}(mui, window.baseUtils = {}));
