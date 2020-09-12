const sourceType = getSourceType();
//时间格式化
function toDate(mescStr) {
	if(mescStr != null && mescStr.length != 0) {
		var n = mescStr;
		var date = new Date(n);
		var Y = date.getFullYear() + '年';
		var M = (date.getMonth() + 1) + '月';
		var D = date.getDate() + '日';
		return(Y + M + D)
	} else {
		return '';
	}
};

function nullToBlank(mescStr) {
	return mescStr == null ? "" : mescStr;
};

//IP地址配置
// function getglobalUrl() {
// 	//return('http://app.gsxt.gov.cn');
// 	return('http://10.9.17.143:8080/MobileLawEnforcement');
// }
//中文乱码转换，样例参考mapdetailinfo.js
function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) {
		return unescape(r[2]);
	} else {
		return null;
	}
}

function sleep(numberMillis) {
	var now = new Date();
	var exitTime = now.getTime() + numberMillis;
	while(true) {
		now = new Date();
		if(now.getTime() > exitTime)
			return;
	}
}

//function getImgUrl(){
//	return "http://172.16.12.29:8280";
//}
//ajax封装
//function ajax(url, data, success, error) {
//				if(data == null || data == undefined)data = {};
//				return $.ajax({
//					url:url,
//					type: 'POST',
//					crossDomain: true,
//					xhrFields: {
//						withCredentials: true
//					},
//					dataType: 'json',
//					contentType: 'application/json;charset=utf-8',
//					//async: true,
//					data: typeof data == "string" ? data : JSON.stringify(data),
//					success: function() {
//						if(success && typeof success == "function") {
//							success.apply(this, Array.prototype.slice.call(arguments));
//						}
//					},
//					error: function() {
//						if(error && typeof error == "function") {
//							error.apply(this, Array.prototype.slice.call(arguments));
//						}
//					}
//				});
//			}
//
//
//	window.c= {
//		ajax:function(opts){
//			return ajax(opts.url,opts.data,opts.success,opts.error);
//		}
//	}

// 定义加载函数
function LodingData({
	el,
	fn
}) {
	this.boxWarp = $(el);
	this.box = this.boxWarp.children('.mui-scroll');
	this.info = '加载中...'
	this.ico = true;
	this.isFn = true;
	this.rader();
	this.loading = this.box.children('.loding');
	var that = this;
	this.boxWarp[0].addEventListener('scrollend', function(e) {
		if(e.detail.y <= e.detail.maxScrollY) {
			that.show();
			if(that.isFn) {
				fn();
			}
		}
	})
}
LodingData.prototype.rader = function() {
	if(this.loading) {
		this.loading.remove();
	}
	var html = `
		<div class="mui-pull-bottom-pocket mui-visibility loding" style="display:none;">
			<div class="mui-pull" >
				<div class="mui-pull-loading mui-icon mui-spinner mui-visibility"></div>
				<div class="mui-pull-caption mui-pull-caption-refresh">${this.info}</div>
			</div>
		</div>
		`
	this.box.append(html);
	this.loading = this.box.children('.loding');
	var loadingIco = this.loading.find('.mui-pull-loading')

	if(this.ico) {
		loadingIco.show();
	} else {
		loadingIco.hide();
	}
}
LodingData.prototype.hidden = function() {
	this.loading.hide();
}
LodingData.prototype.show = function() {
	this.loading.show();
}
LodingData.prototype.changInfo = function(text) {
	this.info = text;
	this.rader();
	this.loading.show();
}
LodingData.prototype.lod = function() {
	this.ico = true;
	this.changInfo('加载中...')
}
LodingData.prototype.end = function() {
	this.ico = false;
	this.isFn = false;
	this.changInfo('已没有更多')
}

//获取访问类型
function getSourceType() {
	if(mui.os.ios) {
		return('I');
	}
	return("A");
}

function log(obj) {
	console.log(JSON.stringify(obj));
}