(function(mui, owner) {
	// 首页轮播
	var gallery = mui('.indexCarousel .mui-slider');
	gallery.slider({
	  interval:5000//自动轮播周期，若为0则不自动播放，默认为0；
	});
	
}(mui, window.index = {}));