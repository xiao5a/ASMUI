/*
 *	加载动画方法 
 * 使用方法：
 * 	// 实例化弹窗
 * 	var loding = new Loding();
 * 	// 开启弹窗
 * 	loding.open();
 * 	// 关闭弹窗
 * 	loding.close();
 * */
var Loding = function() {
	this.loadingHtml =
	'<div class="load-box">'+
		'<div class="spinner">'+
		  '<div class="rect1"></div>'+
		  '<div class="rect2"></div>'+
		  '<div class="rect3"></div>'+
		  '<div class="rect4"></div>'+
		  '<div class="rect5"></div>'+
		'</div>'+
	'</div>'
	this.loadingStyle = 
	'<style type="text/css"> .load-box {position: fixed;width: 100%;height: 100%;z-index: 2000;background: rgba(0,0,0,0.3)}'+
	'.spinner {position: absolute;top: 50%;left: 50%;transform: translate(-50%);width: 50px;height: 60px;text-align: center;font-size: 10px;}'+
	'.spinner > div {background-color: #e8bc32;height: 100%;width: 6px;display: inline-block; -webkit-animation: stretchdelay 1.2s infinite ease-in-out;animation: stretchdelay 1.2s infinite ease-in-out;}'+ 
	'.spinner .rect2 {-webkit-animation-delay: -1.1s;animation-delay: -1.1s;}'+
	'.spinner .rect3 {-webkit-animation-delay: -1.0s;animation-delay: -1.0s;}'+
	'.spinner .rect4 {-webkit-animation-delay: -0.9s;animation-delay: -0.9s;}'+
	'.spinner .rect5 {-webkit-animation-delay: -0.8s;animation-delay: -0.8s;}'+
	'@-webkit-keyframes stretchdelay {0%, 40%, 100% { -webkit-transform: scaleY(0.4) } 20% { -webkit-transform: scaleY(1.0) }}'+
	'@keyframes stretchdelay {0%, 40%, 100% {transform: scaleY(0.4);-webkit-transform: scaleY(0.4);}  20% {transform: scaleY(1.0);-webkit-transform: scaleY(1.0);}}'+
	 '</style>'  

	$('body').append(this.loadingHtml);
	$('head').append(this.loadingStyle);
	this.close();
};
Loding.prototype.open = function(){
	$('.load-box').show();
}
Loding.prototype.close = function(){
	$('.load-box').hide();
}
