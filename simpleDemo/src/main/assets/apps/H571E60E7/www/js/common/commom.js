//用户信息
var UserInfoUtils = {
	
	//token过期时间
	 tokenTimeOut:24*60*60*30,
	
	//设置用户信息
	setUserInfo:function(userInfo){
		// let userInfo = {
		// 	"MESSAGE": "登录成功",
		// 	"nsrlsh": "20124200000011958577",
		// 	"nsrsbh": "422801195811120210",
		// 	"nsrmc": "李刚",
		// 	"type": "1",
		// 	"FLAG": "success"，
		// 	"token": "12434324",
		// 	"loginTime": "12412434134"
		// }
		localStorage.setItem('userInfo', JSON.stringify(userInfo))
	},
	//获取用户信息
	getUserInfo:function() {
		let userInfo = localStorage.getItem('userInfo')
		if (userInfo == "undefined" || userInfo == null || userInfo == ""||userInfo == '{}') {
			return ''
		} 
		return JSON.parse(userInfo)
	},
	
	//移除用户状态
	removeUserInfo:function(){
		localStorage.removeItem('userInfo')
	},
	
	//判断是否登录,需后端再次校验
	isLoginOn:function(){
		let userInfo = this.getUserInfo()
		if (typeof userInfo == "undefined" || userInfo == null || userInfo == ""||userInfo == '{}') {
			return false
		} 
		return true
	},
	
	//判断token是否过期,需后端再次校验
	isTokenTimeOut:function(){
		let userInfo = this.getUserInfo()
		var t = new Date().getTime() - userInfo.loginTime;
		if (t < tokenTimeOut) {
			return false
		}
		return true
	},
	//跳转到登录页面
	gotoLogin:function(id,extras){
		mui.openWindow({
			url:"../../models/demo/login/login.html",
			id:id,
			/* styles:{
			  top:0px,//新页面顶部位置
			  bottom:0px,//新页面底部位置
			  width:100%,//新页面宽度，默认为100%
			  height:100%,//新页面高度，默认为100%
			  
			}, */
			extras:extras
		})
	}
}

//发送请求
var $http = {
	timeout:60000,
	headers:{
		'token':UserInfoUtils.getUserInfo().token,
		'X-Requested-With': 'XMLHttpRequest',
		'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
		},
	get: function(url,callback,head=this.headers,time=this.timeout){
		mui.ajax({
			url: url,
			type: "get",
			dataType:'json',
			headers: head,
			timeout:time,
			success: function(res) {
				callback(res) 
			},
			error: function(xhr, type, errorThrown) {
				//获取本地数据
				mui.toast("网络连接异常，请确认手机网络状态！");
			} 
		});
	},
	post: function(url,data,callback,head=this.headers,time=this.timeout){
		mui.ajax({
			url: url,
			data:{"json":JSON.stringify(data)},
			type: "post",
			dataType:'json',
			timeout:time,
			headers: head,
			success: function(res) {
				callback(res)
			},
			error: function(xhr, type, errorThrown) {
				//获取本地数据
				mui.toast("网络连接异常，请确认手机网络状态！");
			}
		});
	}
}

//响应结果数据处理
var resResult = {
			djxh: "",
			maxnum:"",
			cachekey:"",
			cxjgGrid:[],
			dlxx:'',
			code:'',
			token:'',
			rtn_msg:"",
			Message:",",
			Code:"",
			Reason: "",
			tran_time:"",
			tran_date:"",
			tran_seq:"",
			expand:"",
			rtn_code:"",
			tran_id:"",
			channel_id:"",
			
			setAttrValue: function(res){
				let head = res.head
				let body = res.body
				
				let taxML = body.taxML||"undefined"
				let djxh = taxML.djxh||"undefined"
				let maxnum = taxML.maxnum||"undefined"
				let cachekey = taxML.cachekey||"undefined"
				let cxjgGrid = taxML.cxjgGrid||"undefined"
				let dlxx = taxML.dlxx||"undefined"
				let code = body.code||"undefined"
				let token = body.token||"undefined"
				
				let rtn_msg = head.rtn_msg
				let{Message,Code,Reason} = rtn_msg
				let{tran_time,tran_date,
				tran_seq,expand,rtn_code,
				tran_id,channel_id} = head
				
				this.djxh = djxh
				this.maxnum = maxnum
				this.cachekey = cachekey
				this.cxjgGrid = cxjgGrid
				this.dlxx = dlxx
				this.code = code
				this.token = token
				this.rtn_msg = rtn_msg
				this.Message = rtn_msg.Message,
				this.Code = rtn_msg.Code,
				this.Reason = rtn_msg.Reason,
				this.tran_time = tran_time
				this.tran_date = tran_date
				this.tran_seq = tran_seq
				this.expand = expand
				this.rtn_code = rtn_code
				this.tran_id = tran_id
				this.channel_id = channel_id
				return this
			}
}
//消息弹窗,h5方式
var dialog = {
	toast:function(msg) {
		mui.toast(msg, {
			duration: 'short',
			type: 'div'
		});
	},
	alert:function(msg,callback){
		mui.alert(msg,' ','',function (e) {
		   if(callback){
			   callback()
		   }
		},'div')
	},
	confirm:function(msg,callback){
		mui.confirm(msg,' ',['取消','确认'],function (e) {
		   if(callback){
			   callback()
		   }
		},'div')
	}
}

