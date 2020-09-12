
	//url
	var url = baseUtils.URL;
	//超时时间
	var atimeout = baseUtils.timeout;
	//账号
	var nsrmc = UserInfoUtils.getUserInfo().nsrmc
	//身份证号
	var nsrsbh = UserInfoUtils.getUserInfo().nsrsbh
	//登记序号
	var djxh = UserInfoUtils.getUserInfo().djxh
	//缓存key
	var cachekey
	//页面加载
	 function pageload(webview,vm) {
		init(vm);
		addEvent();
	}
	
	// 初始化
	function init(vm) {		
		getCxjmyl();
	}
	
	//添加事件
	function addEvent() {
		
	}
	
	//养老信息查询
	function getCxjmyl(){
		let tran_id = tranIdInfo.cxjmyl_jxxcx
		let taxML = {
				"xm": nsrmc,
				"zjhm": nsrsbh,
				"ssqq": new Date().getFullYear()+"-01-01",
				"ssqz": new Date().getFullYear()+"-12-31"
			}
		let data = ReqInfo.getReqInfo(tran_id,taxML)
		console.log("data>>>>"+JSON.stringify(data))
		$http.post(url,data,(res)=>{
			console.log(">>>>"+JSON.stringify(res))
			let rs = resResult.setAndGetAttrValue(res)
			//响应成功
			if(rs.Code === '000'){
				vm.cxjgGrid = rs.cxjgGrid
				cachekey = rs.cachekey
			}else{
				dialog.alert(rs.Message)
			}
		})
	}
	
	//打印完税证明
	function printTaxCertify(dzsphm){
			var tran_id = tranIdInfo.getfswszm;
			var taxML = {
							"djxh": djxh,
							"dzsphm": dzsphm
						};
			var reqInfo = ReqInfo.getReqInfo(tran_id,taxML);
			console.log(JSON.stringify(reqInfo));
			mui.showLoading("操作中...");
			$http.post(url,reqInfo,(res)=>{
				console.log(JSON.stringify(res));
				mui.hideLoading();
				if(res != null && res != ''){
					var code_head = res.head.rtn_code;
					if(code_head == '0'){
						var url = res.body.taxML.fileName;
						var dtask = plus.downloader.createDownload(url, {}, function(d, status) {
						    if(status == 200) {
						        var fileUrl = d.filename;
						        plus.runtime.openFile(fileUrl, {}, function(e) {
						            alert('打开失败');
						        });
						    } else {
						        alert("Download failed: " + status);
						    }
						});
						dtask.start();
					}else{
						dialog.alert(res.head.rtn_msg.Message);
					}
				}else{
					dialog.toast("数据异常！");
				}
			});
		
	}
	
	
	