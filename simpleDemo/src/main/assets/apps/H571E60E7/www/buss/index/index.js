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
		//监听带有class=onclick的点击事件
		let nodelist = document.getElementsByClassName("onclick")
		for (i = 0; i < nodelist.length; i++) {
		   nodelist[i].addEventListener("tap",function(e){
				click(e)
		   })
		}
	}
	function click(e){
		let isLogin = UserInfoUtils.isLoginOn()
		if(isLogin){
			//判断token是否超时
			let isTokenTimeOut =  UserInfoUtils.isTokenTimeOut()
			if(!isTokenTimeOut){
				dialog.confirm("请先登录!",(e)=>{
					if(e.index){
						UserInfoUtils.gotoLogin()
					}
				})
			}
		}else{
			dialog.confirm("请先登录!",(e)=>{
				if(e.index){
					UserInfoUtils.gotoLogin()
				}
			})
		}
	}
}(mui, window.index = {}));