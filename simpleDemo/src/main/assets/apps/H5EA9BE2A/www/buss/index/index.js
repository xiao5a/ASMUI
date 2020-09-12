(function(mui, owner) {
	// 首页轮播
	var gallery = mui('.indexCarousel .mui-slider');
	
	gallery.slider({
	  interval:5000//自动轮播周期，若为0则不自动播放，默认为0；
	});
	
	owner.pageload = function(){
		owner.init()
		owner.addEvent()
	}
	
	owner.init = function(){
		console.log("init")
	}
	
	owner.addEvent = function(){
		document.getElementById("searchInput").addEventListener('tap',function(e){
			mui.openWindow({
				url: '../app/searchAppUrl.html',
				id: "../app/searchAppUrl.html",
				extras: {
				}
			});
		});
	}
}(mui, window.index = {}));