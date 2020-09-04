
	//url
	var url = baseUtils.URL;
	//超时时间
	var atimeout = baseUtils.timeout;
	//账号
	var nsrmc = UserInfoUtils.getUserInfo().nsrmc
	//身份证号
	var nsrsbh = UserInfoUtils.getUserInfo().nsrsbh
	//缓存key
	var cachekey
	//页面加载
	 function pageload(webview,vm) {
		init(vm);
		addEvent();
	}
	
	// 初始化
	function init(vm) {
		//获取页面数据
		getCxjmylSbdjxx()
	}
	
	//添加事件
	function addEvent() {
		
	}
	
	//城乡居民养老登记信息查询
	function getCxjmylSbdjxx(){
		let tran_id = tranIdInfo.cxjmyl_getSbdjxx
		let taxML = {
				"xm": nsrmc,
				"zjhm": nsrsbh
			}
		let data = ReqInfo.getReqInfo(tran_id,taxML)
		
		$http.post(url,data,(res)=>{
			let rs = resResult.setAndGetAttrValue(res)
			//响应成功
			if(rs.Code === '000'){
				vm.cxjgGrid = rs.cxjgGrid
				cachekey = rs.cachekey
			}else{
				dialog.autoCloseDialogIfNoData(rs.Message)
			}
		})
	}
	
	//下一步
	function next(cxjgGrid){
		if(vm.jflx_value == ''){
			dialog.alert("请选择缴费类型")
			return
		}
		
		mui.openWindow({
		  url: "cxylnext.html",
		  id: "cxylnext.html",
		  // styles: {                             // 窗口参数 参考5+规范中的WebviewStyle,也就是说WebviewStyle下的参数都可以在此设置
		  //   titleNView: {                       // 窗口的标题栏控件
		  //     titleText:"城乡居民养老",                // 标题栏文字,当不设置此属性时，默认加载当前页面的标题，并自动更新页面的标题
		  //     titleColor:"#000000",             // 字体颜色,颜色值格式为"#RRGGBB",默认值为"#000000"
		  //     titleSize:"17px",                 // 字体大小,默认17px
		  //     backgroundColor:"#F7F7F7",        // 控件背景颜色,颜色值格式为"#RRGGBB",默认值为"#F7F7F7"
		  //     progress:{                        // 标题栏控件的进度条样式
		  //       color:"#00FF00",                // 进度条颜色,默认值为"#00FF00"  
		  //       height:"2px"                    // 进度条高度,默认值为"2px"         
		  //     },
		  //     splitLine:{                       // 标题栏控件的底部分割线，类似borderBottom
		  //       color:"#CCCCCC",                // 分割线颜色,默认值为"#CCCCCC"  
		  //       height:"1px"                    // 分割线高度,默认值为"2px"
		  //     }
		  //   }
		  // },
		  //传到下一个页面的参数
		  extras:{
				"cxjgGrid":cxjgGrid,  //扩展参数
				"jflx_value":vm.jflx_value,
				"cachekey":cachekey
		  }
		});
	}
	
	function chooseJfType() {
		vm.userPicker.setData([{
			value: '0',
			xzdm:'102011201',
			text: "当期"
		}, {
			value: '1',
			xzdm:'102031201',
			text: "补缴"
		}]);
		vm.userPicker.show(function(items) {
			vm.jflx = items[0].text;
			vm.jflx_value = items[0].value;
		});
	}
