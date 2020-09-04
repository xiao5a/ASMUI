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
	
	var currentPageId = 'main_tab1';
	var aniShow = {};
	owner.pageload = function(webview) {
		if (baseUtils.isNotEmpty(webview) && baseUtils.isNotEmpty(webview.pageId)){
			currentPageId = webview.pageId;
			
			var add_div = document.getElementById("main_tab1");
			add_div.classList.remove("mui-active");
			add_div = document.getElementById("main_tab2");
			add_div.classList.remove("mui-active");
			add_div = document.getElementById("main_tab3");
			add_div.classList.remove("mui-active");
			
			add_div = document.getElementById(currentPageId);
			add_div .classList.add("mui-active");
		}
		
		owner.myInit();
		owner.addEvent();
	}
	
	// 初始化
	owner.myInit = function() {
		// 检查版本信息
		baseUtils.checkVersion();
		
		var subPages = {
			main_tab1: '../../buss/index/index.html',
			main_tab2: '../../buss/login/login.html',
			main_tab3: '../../buss/myinfo/myinfo.html'
		};
		
		var subPageStyle = {
			top: '0',
			bottom: '50px'
		};
		var self = plus.webview.currentWebview();
		for(id in subPages) {
			var sub = plus.webview.create(subPages[id], id, subPageStyle);
			if(id != currentPageId) {
				sub.hide();
			}
			self.append(sub);
		}
	}
	
	// 刷新
	owner.refresh = function() {
		owner.myInit();
	}
	
	//添加事件
	owner.addEvent = function() {
		//绑定监听事件
		mui('.mui-bar-tab').off('tap', 'a');
		mui('.mui-bar-tab').on('tap', 'a', function(e) {
			var pageId = this.getAttribute('page-id');
			// alert(pageId);
			//如果选择的是当前tab
			if(currentPageId == pageId) {
				// mui.fire(tabs[current], 'scroll2top');  //备用
				return;
			}
			
			// 需要登录的业务
			if(pageId == 'main_tab2' || pageId == 'main_tab3') {
				var token = UserInfoUtils.getUserInfo().token;
				if (null == token){
					// 进入登录页面
					mui.openWindow({
						url: '../../buss/login/login.html',
						id: "../../buss/login/login.html",
						extras: {
							pageId: pageId
						}
					});
					
					return;
				}
			}
		
			//显示新的tab
			//若为iOS平台或非首次显示，则直接显示
			if(mui.os.ios || aniShow[pageId]) {
				plus.webview.show(pageId);
			} else {
				//否则，使用fade-in动画，且保存变量
				var temp = {};
				temp[pageId] = "true";
				mui.extend(aniShow, temp);
				plus.webview.show(pageId, "fade-in", 300);
			}
			
			//消息点击重新加载--没啥好方法
			if (pageId == 'main_tab1'){
				//plus.webview.getWebviewById(pageId).reload();
				plus.webview.getWebviewById(pageId).evalJS("reloadData()");
			}
			
			//隐藏上一个tab
			plus.webview.hide(currentPageId);
			//更改当前活跃的选项卡
			currentPageId = pageId;
		});
	}
}(mui, window.main = {}));
