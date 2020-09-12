var payUtils = {
	
	payHandler:function(payWay,res){
		//支付宝
		if(payWay == 'aliPayQuick'){
			console.log("res.body.taxML.signString >>>>>>>>>"+JSON.stringify(res.body.taxML.signString))
			this.alipayHandler(res.body.taxML.signString)
		}
		//微信
		else if(payWay == 'wechatPayQuick'){
			
		}
		//申报缴费
		else{
			if(payWay == 'dsfunion'){
				this.unionPayHandler(res)
			}
		}
	},
	
	//支付宝支付处理
	alipayHandler: function(signString){
		if(window.plus) {
		    plus.Alipay.alipay(signString, function( result ) {
		    //成功之后异步带回来的数据加入判断
			  if(result!=null&&result!=''){
				   this.alipayresult(result);
			  }
			},function(result){
			  window.location.href ="error.html";
			});
		}
	},
	
	//支付宝返回结果处理
	alipayresult: function(result) {
		alert("支付结果,支付宝账户的Id为："+result[0]+result[1]+result[2]);
		if(result[0]=="200"&&result[1]=="9000"){
			alert("支付结果,支付宝账户的Id为："+result[2]);
			$.ajax({
				type: "get",
				url: apis.getAlipayInfo,//调用后台接口根据auth_code取支付宝账户的基本信息
				dataType: "json",
				cache: false, //缓存
				async: true, //异步
				data: {
					'authCode':result[2],
					'appID':result[4],
					'scope':result[3],
					'type': 2
				},
				success: function(result) {
						alert("授权登录成功,支付宝账户的Id为："+result.data.alipayId);
				}
			});
		}else{
	    	mui.toast("取消了支付宝授权");
	    }
	},
	
	//银联支付处理
	unionPayHandler:function(res){
		var payurl = "https://etax.hubei.chinatax.gov.cn/webroot/UnionTipsPay?"
		        + "dzsph="+res.body.taxML.dzsph 
		        + "&nsrsbh="+res.body.taxML.nsrsbh 
		        + "&hsjgdm="+res.body.taxML.swjg||res.body.taxML.hsjgdm 
		        + "&founturl=info.html?tqnrbz=3";
		console.log("银联地址payurl>>>>>"+payurl)
		mui.openWindow({
		  url: payurl,
		  id: payurl,
		  extras: {}
		});
	}
	
	
}