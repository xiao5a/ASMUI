/**
 * UserInfoUtils.setUserInfo  //设置用户信息
 * UserInfoUtils.getUserInfo  //获取用户信息
 * UserInfoUtils.removeUserInfo  //移除用户信息
 * UserInfoUtils.isLoginOn   //判断是否登录,需后端再次校验
 * UserInfoUtils.isTokenTimeOut   //判断token是否过期,需后端再次校验
 * $http.get    //发送get请求
 * $http.post   //发送post请求
 * resResult.setAndGetAttrValue  //设置并获取对返回数据的处理
 * dialog.toast  //h5  toast
 * dialog.alert  //h5  alert
 * dialog.confirm  //h5  confirm
 */

//用户信息
var UserInfoUtils = {
	
	//token过期时间
	 tokenTimeOut:24*60*60*30,
	
	//设置用户信息
	setUserInfo:function(userInfo){
		// let userInfo = {
		// "loginTime": "12412434134"
		// 'djxh':'20124200100006402173',
		// "nsrmc": "李刚",
		// "nsrsbh": "422801195811120210",
		// "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
		// "type":1
		//    }
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
	
	//移除用户信息
	removeUserInfo:function(){
		localStorage.removeItem('userInfo');
		// localStorage.removeItem("spdInfo");//移除代码表信息
		// localStorage.removeItem("zsdwInfo");//移除代码表信息
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
		//没有过期 return true
		if (t > this.tokenTimeOut) {
			return false
		}
		return true
	},
	//跳转到登录页面
	gotoLogin:function(id,extras){
		mui.openWindow({
			url:"../../buss/login/login.html",
			id:"id"
			/* styles:{
			  top:0px,//新页面顶部位置
			  bottom:0px,//新页面底部位置
			  width:100%,//新页面宽度，默认为100%
			  height:100%,//新页面高度，默认为100%
			  
			}, */
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
			taxML:"",
			djxh: "",
			maxnum:"",
			cachekey:"",
			items:[],
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
			
			setAndGetAttrValue: function(res){
				let head = res.head
				let body = res.body
				
				let taxML = body.taxML||"undefined"
				let djxh = taxML.djxh||"undefined"
				let maxnum = taxML.maxnum||"undefined"
				let cachekey = taxML.cachekey||"undefined"
				let cxjgGrid = taxML.cxjgGrid||"undefined"
				let dlxx = taxML.dlxx||"undefined"
				let items = taxML.items||"undefined"
				let code = body.code||"undefined"
				let token = body.token||"undefined"
				
				let rtn_msg = head.rtn_msg
				let{Message,Code,Reason} = rtn_msg
				let{tran_time,tran_date,
				tran_seq,expand,rtn_code,
				tran_id,channel_id} = head
				
				this.taxML = taxML
				this.items = items
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
			   callback(e)
		   }
		},'div')
	},
	//如果没有数据就关闭自动返回上一级页面
	autoCloseDialogIfNoData:function(msg){
		dialog.toast(msg)
		setTimeout(()=>{
			mui.back()
		},1500)
	}
}


var ReqInfo = {
	//获取请求报文
	getReqInfo:function(tran_id,taxML) {
		var reqInfo = {
				"head": {
					"tran_id": tran_id,
					"channel_id": "HBSW.NFWB.DZSWJWB",
					"tran_seq": UUID.getuuid(),
					"tran_date": baseUtils.formatDate(new Date(),'yyyy-MM-dd'),
					"tran_time": new Date().getTime(),
					"expand": [{
							"name": "identityType",
							"value": "Hbswwb#476"
						},
						{
							"name": "sjry",
							"value": "mobile"
						},
						{
							"name": "sjjg",
							"value": "14200000000"
						}
					]
				},
				"body": {
					"taxML": taxML
				}
			};
		return reqInfo;
	}
}

var tranIdInfo ={
	//发票
	"fpzwcx" : "com.neusoft.fp.zwcx", //真伪  
	//灵活个人社保
	"grsb_getSbdjxx" : "com.neusoft.grsb.getSbdjxx", //提取登记 
	"sentHeDingDanXX" : "com.neusoft.grsb.sentHeDingDanXX", //提取核定
	"grsb_jk" : "com.neusoft.grsb.jk", //缴款
	"grsb_jkfk" : "com.neusoft.grsb.jkfk", //缴款反馈
	//城乡居民医保
	"cxjmyb_jxxcx" : "com.neusoft.cxjmyb.jxxcx", //城乡居民医保查询
	"cxjmyb_getSbdjry" : "com.neusoft.cxjmyb.getSbdjry", //社保代缴维护人员信息
	"cxjmyb_getSbdjxxdj" : "com.neusoft.cxjmyb.getSbdjxxdj", //社保代缴登记信息新增（接口查询--保存）
	"delDjry" : "com.neusoft.cxjmyb.delDjry", //社保代缴登记删除
	"getHeDingDanXXDj" : "com.neusoft.cxjmyb.getHeDingDanXXDj", //社保代缴核定信息
	"cxjmyb_jkfk" : "com.neusoft.cxjmyb.jkfk", //缴款反馈
	"cxjmyb_jk" : "com.neusoft.cxjmyb.jk", //申报缴款
	"getCxjmHd" : "com.neusoft.cxjmyb.getCxjmHd", //社保核定信息
	"cxjmyb_getSbdjxx" : "com.neusoft.cxjmyb.getSbdjxx", //社保登记信息
	"alijk" : "com.neusoft.cxjmyb.alijk", //城乡医保申报缴款支付宝
	"cxjmyb_webchatjk" : "com.neusoft.cxjmyb.webchatjk", //城乡医保申报缴款微信
	//城乡居民养老
	"cxjmyl_jxxcx" : "com.neusoft.cxjmyl.jxxcx", //城乡居民养老查询
	"cxjmyl_getSbdjxxdj" : "com.neusoft.cxjmyl.getSbdjxxdj", //城乡居民养老代缴登记信息查询
	"cxjmyl_unionpay" : "com.neusoft.cxjmyl.unionpay", //城乡居民养银联申报缴款
	"cxjmyl_getSbdjxx" : "com.neusoft.cxjmyl.getSbdjxx", //城乡居民养登记信息
	"getHdxx" : "com.neusoft.cxjmyl.getHdxx", //城乡居民养核定信息
	"cxjmyl_webchatjk" : "com.neusoft.cxjmyl.webchatjk", //城乡居民养缴款微信
	//非税
	"fssbcsh" : "com.neusoft.fs.fssbcsh", //非税申报初始化
	"fsunionPay" : "com.neusoft.fs.fsunionPay", //非税银联缴款
	"fssb" : "com.neusoft.fs.fssb", //非税申报
	"getfssbxx" : "com.neusoft.fs.getfssbxx", //查询非税申报信息
	"fssbxxzf" : "com.neusoft.fs.fssbxxzf", //作废申报
	"fsunionPaycyjkzt" : "com.neusoft.fs.fsunionPaycyjkzt", //查验缴款状态
	"getfswszm" : "com.neusoft.fs.getfswszm", //非税完税证明
	//车购税
	"getcgsspd" : "com.neusoft.cgs.getcgsspd", //上牌地选择
	"getcgsfpxx" : "com.neusoft.cgs.getcgsfpxx", //查询发票修信息
	"cgsfpCheck" : "com.neusoft.cgs.cgsfpCheck", //发票核验初始化计税
	"getcgswszm" : "com.neusoft.cgs.getcgswszm", //车购税完税证明你
	"cgssb" : "com.neusoft.cgs.cgssb", //车购税申报
	"cgsunionPay" : "com.neusoft.cgs.cgsunionPay", //车购税银联缴款
	"getcgssbxx" : "com.neusoft.cgs.getcgssbxx", //车购税申报信息查询
	"cgssbxxzf" : "com.neusoft.cgs.cgssbxxzf", //车购税申报作废 
	"cgsunionPaycyjkzt" : "com.neusoft.cgs.cgsunionPaycyjkzt", //车购税 查验缴款状态
	
	"denglu" : "com.neusoft.weixin.denglu", //微信小程序登录
	"zhuce" : "com.neusoft.weixin.zhuce", //微信小程注册
	"payment" : "com.neusoft.weixin.payment", //微信支付
	"addsbdjry" : "com.neusoft.sbf.addsbdjry", //社保代缴人员添加
	"sbf_getsbdjry" : "com.neusoft.sbf.getsbdjry", //社保代缴人员查询
	"delsbdjry" : "com.neusoft.sbf.delsbdjry", //社保代缴人员删除
	"getsbdjrydjxx" : "com.neusoft.sbf.getsbdjrydjxx", //获取维护的社保费代缴人员的登记信息
	"getwszm" : "com.neusoft.sbf.getwszm", //社保费完税证明
	
	"fsyzm" : "com.neusoft.login.fsyzm", //发送手机短信验证码
	"zrrzc" : "com.neusoft.login.zrrzc", //手机端注册,
	"checkYhk" : "com.neusoft.login.checkYhk", //手机端银联注册,
	"validatecode" : "com.neusoft.login.validatecode", //手机端登录刷新验证码图片
	"zrrdl" : "com.neusoft.login.zrrdl" ,//手机端登录
	"dwcj" : "com.neusoft.login.dwcj", //代码表数据
	"modifypsd" : "com.neusoft.login.modifypsd", //修改密码
	"forgetpsw" : "com.neusoft.login.forgetpsw", //忘记密码
	"zzjdl" : "com.neusoft.login.zzjdl" //自助机扫码登录
}

var UUID = {
	getuuid:function(len,radix) {
	  if (len == null) {
		len = 32;

	  }
	  if (radix == null) radix = 16;
	  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
	  var uuid = [],
		i;
	  radix = radix || chars.length;

	  if (len) {
		// Compact form
		for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
	  } else {
		// rfc4122, version 4 form
		var r;

		// rfc4122 requires these characters
		uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
		uuid[14] = '4';

		// Fill in random data.  At i==19 set the high bits of clock sequence as
		// per rfc4122, sec. 4.1.5
		for (i = 0; i < 36; i++) {
		  if (!uuid[i]) {
			r = 0 | Math.random() * 16;
			uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
		  }
		}
	  }

	  return uuid.join('');
	}
}