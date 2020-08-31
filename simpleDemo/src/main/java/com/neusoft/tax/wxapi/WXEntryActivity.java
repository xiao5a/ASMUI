package com.neusoft.tax.wxapi;

import android.app.Activity;
import android.app.Dialog;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import com.alipay.sdk.pay.demo.AlipayFeature;
import com.neusoft.tax.wx.Constants;
import com.tencent.mm.opensdk.constants.ConstantsAPI;
import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.modelbiz.WXLaunchMiniProgram;
import com.tencent.mm.opensdk.modelmsg.SendAuth;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

import org.json.JSONArray;

import java.util.HashMap;
import java.util.Map;

import io.dcloud.common.util.JSUtil;

public class WXEntryActivity extends Activity implements IWXAPIEventHandler{
	
	private static final int TIMELINE_SUPPORTED_VERSION = 0x21020001;
	private Map<String, String> userMap = new HashMap<String, String>();
    private IWXAPI api;
	private Dialog dialog2;
	private String userName = "";
	private String nsrlsh = "";
	private String frsjhm = "";
	private String nsrsbh = "";
	private String msg = "";
	private String type = "";
	private WXEntryActivity wxentryactivity ; 
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
//        setContentView(R.layout.entry);
		Toast.makeText(this, "onCreate", Toast.LENGTH_LONG).show();

		wxentryactivity = this ;
    	api = WXAPIFactory.createWXAPI(this, Constants.APP_ID, false);
        api.handleIntent(getIntent(), this);
    }

	@Override
	protected void onNewIntent(Intent intent) {
		super.onNewIntent(intent);
		Toast.makeText(this, "onNewIntent", Toast.LENGTH_LONG).show();

		setIntent(intent);
        api.handleIntent(intent, this);

	}
	
	 @Override
	    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
		 Toast.makeText(this, "onActivityResult", Toast.LENGTH_LONG).show();

		 super.onActivityResult(requestCode, resultCode, data);
	        api.handleIntent(data,this);
	    }
	@Override
	public void onReq(BaseReq req) {
		Toast.makeText(this, "onReqopenid = " + req.openId, Toast.LENGTH_SHORT).show();
		
		switch (req.getType()) {
		case ConstantsAPI.COMMAND_GETMESSAGE_FROM_WX:
//			goToGetMsg();
			break;
		case ConstantsAPI.COMMAND_SHOWMESSAGE_FROM_WX:
//			goToShowMsg((ShowMessageFromWX.Req) req);
			break;
		case ConstantsAPI.COMMAND_LAUNCH_BY_WX:
			Toast.makeText(this, "", Toast.LENGTH_SHORT).show();
			break;
		default:
			break;
		}
	}

 	@Override
	public void onResp(BaseResp resp) {
		Toast.makeText(this, "onRespopenid = " + resp.openId, Toast.LENGTH_SHORT).show();


		JSONArray newArray = new JSONArray();
		newArray.put(resp.openId);
		newArray.put(resp.openId);
		newArray.put(resp.openId);
//                newArray.put(authResult.getScope());
//                newArray.put(authResult.getUser_id());
		//异步返回到login.js
		JSUtil.execCallback(AlipayFeature.wxiWebview, AlipayFeature.WxJSONArray.optString(0),newArray, JSUtil.OK, false);

		if (resp.getType() == ConstantsAPI.COMMAND_SENDAUTH) {
			Toast.makeText(this, "code = " + ((SendAuth.Resp) resp).code, Toast.LENGTH_SHORT).show();
			Map<String, String> paramsMap = new HashMap();
			paramsMap.put("code", ((SendAuth.Resp) resp).code);
//			getaccess_token(this,paramsMap);
		}
		 String extraData ="";
		
	    if (resp.getType() == ConstantsAPI.COMMAND_LAUNCH_WX_MINIPROGRAM) {
	        WXLaunchMiniProgram.Resp launchMiniProResp = (WXLaunchMiniProgram.Resp) resp;
	          extraData =launchMiniProResp.extMsg; // ��ӦJsApi navigateBackApplication�е�extraData�ֶ�����
	        Toast.makeText(this, "extraData = " + extraData, Toast.LENGTH_SHORT).show();
	        
	    }
		
	 
		int result = 0;
		

		
//		 Intent intent = new Intent(WXEntryActivity.this, NewMainActivity.class);
//         startActivity(intent);
		
		
//		this.loginzfb(logininfo[0], logininfo[1]);

		try{
		 String[] logininfo =  extraData.split("\\+");
//		 Toast.makeText(this, "logininfo[0] = " + logininfo[0]+"logininfo[1]"+logininfo[1], Toast.LENGTH_SHORT).show();
		
		 if(logininfo[logininfo.length-1].equals("wxsmz")){
			 this.wxsmzzc(logininfo[0], logininfo[1],logininfo[2]);

		 }else if (logininfo[logininfo.length-1].equals("fpcx")){
			 this.fpcx();
			 
		 }
		 else if (logininfo[logininfo.length-1].equals("gs12sb")){
			 this.gs12sb(extraData, extraData, extraData);
			 
		 }
		 else if(logininfo[logininfo.length-1].equals("login")) {
		 this.loginzfb(logininfo[0], logininfo[1]);
		 }
		 else if (logininfo[logininfo.length-1].equals("wxsmrz")){
			 this.wxsmrz(logininfo[0], logininfo[1],logininfo[2]);
			 
		 }
		 											//�ﰮ��+420115198312257919+14201770400+20124200000011958577+++cgssbquery					
		 else if (logininfo[logininfo.length-1].equals("cgs")){//  xm +sfzhm+spd+nsrlsh+yzpzlsh+zblsh+ywtype
			 this.cgs(logininfo[0], logininfo[1],logininfo[2],logininfo[3],logininfo[4],logininfo[5],logininfo[6]);
			 
		 }
		 else if (logininfo[logininfo.length-1].equals("cgssbquery")){//  xm +sfzhm+spd+nsrlsh+yzpzlsh+zblsh+ywtype
			 this.cgs(logininfo[0], logininfo[1],logininfo[2],logininfo[3],logininfo[4],logininfo[5],logininfo[6]);
			 
		 }
		 else if (logininfo[logininfo.length-1].equals("fs")){//  xm +sfzhm+spd+nsrlsh+yzpzlsh+zblsh+ywtype
			 this.fs(logininfo[0], logininfo[1],logininfo[2],logininfo[3],logininfo[4],logininfo[5],logininfo[6]);
			 
		 }
		 else{
			 
//			 Intent intent = new Intent();
//				final Activity context = (Activity) this;
//				String  classname  = getTopActivity(context);
//				intent.setClass(context,  Class.forName(classname));
//				intent.putExtra("id", logininfo[logininfo.length-1]);
//				startActivity(intent);
				finish();
		 }
		}catch(Exception e){
			
//			 Intent intent = new Intent();
//				final Activity context = (Activity) this;
//				intent.setClass(context, MenuOneActivity.class);
//				startActivity(intent);
				finish();
		}
//		MyAsyncHttpClient myClient = Utils.instance().getMyHttpClient(
//				(Activity) this);
////		myClient.post(url, params, new AsyncHttpResponseHandler() {

        this.finish();  

       


		}
	
	
//	String getTopActivity(Activity context)

//	{
//
//	ActivityManager manager = (ActivityManager)context.getSystemService(ACTIVITY_SERVICE) ;
//
//	List<RunningTaskInfo> runningTaskInfos = manager.getRunningTasks(1) ;
//
//
//	if(runningTaskInfos != null)
//	{
//
//
//		RunningTaskInfo info = manager.getRunningTasks(1).get(0);
//		String shortClassName = info.topActivity.getShortClassName(); //����
//		String className = info.topActivity.getClassName(); //��������
//		String packageName = info.topActivity.getPackageName(); //����
//
//		List list =   ExitUtils.activityList;
//
//	return (list.get(list.size()-1).toString().split("@")[0].toString() );
//	}
//	else
//
//	return null ;
//
//	}

	private void fpcx() {
		// TODO Auto-generated method stub
//		Intent intent = new Intent();
//		final Activity context = (Activity) this;
//		intent.setClass(context, FapiaofangweiActivity.class);
//		startActivity(intent);
//		finish();
	}

	private void wxsmzzc(String xm, String sfzh,String sjh) {
		// TODO Auto-generated method stub
//		Intent intent = new Intent();
//		final Activity context = (Activity) this;
//		intent.setClass(context, MenuOneActivity.class);
//		intent.putExtra("id", "wxsmz");
//		intent.putExtra("certNo", sfzh);
//		intent.putExtra("userName", xm);
//		intent.putExtra("sjh", sjh);
//
//		startActivity(intent);
//		finish();

	}
	
	
	private void wxsmrz(String xm, String sfzh,String sjh) {
		// TODO Auto-generated method stub
//		Intent intent = new Intent();
//		final Activity context = (Activity) this;
//		intent.setClass(context, SmrzresultActivity.class);
//		intent.putExtra("id", "wxsmrz");
//		intent.putExtra("certNo", sfzh);
//		intent.putExtra("userName", xm);
//		intent.putExtra("sjh", sjh);
//
//		startActivity(intent);
//		finish();

	}
	
	// xm +sfzhm+spd+nsrlsh+yzpzlsh+zblsh+ywtype
	private void cgs(String xm, String sfzh,String spd,String nsrlsh,String yzpzlsh,String zblsh ,String ywtype) {
		// TODO Auto-generated method stub
//		Intent intent = new Intent();
//		final Activity context = (Activity) this;
//		intent.setClass(context, MenuTwoActivity.class);
//		intent.putExtra("id", ywtype);
//		intent.putExtra("xm", xm);
//		intent.putExtra("sfzh", sfzh);
//		intent.putExtra("spd", spd);
//		intent.putExtra("nsrlsh", nsrlsh);
//		intent.putExtra("yzpzlsh", yzpzlsh);
//		intent.putExtra("zblsh", zblsh);
//		startActivity(intent);
//		finish();

	}
	private void fs(String xm, String sfzh,String spd,String nsrlsh,String yzpzlsh,String zblsh ,String ywtype) {
		// TODO Auto-generated method stub
//		Intent intent = new Intent();
//		final Activity context = (Activity) this;
//		intent.setClass(context, MenuTwoActivity.class);
//		intent.putExtra("id", ywtype);
//		intent.putExtra("xm", xm);
//		intent.putExtra("sfzh", sfzh);
//		intent.putExtra("spd", spd);
//		intent.putExtra("nsrlsh", nsrlsh);
//		intent.putExtra("yzpzlsh", yzpzlsh);
//		intent.putExtra("zblsh", zblsh);
//		startActivity(intent);
//		finish();

	}
	
	private void gs12sb(String xm, String sfzh,String sjh) {
		// TODO Auto-generated method stub
//		Intent intent = new Intent();
//		final Activity context = (Activity) this;
//		intent.setClass(context, MenuTwoActivity.class);
//		intent.putExtra("id", "gs12sbresult");
//		intent.putExtra("certNo", sfzh);
//		intent.putExtra("userName", xm);
//		intent.putExtra("sjh", sjh);
//
//		startActivity(intent);
//		finish();

	}

	private void loginzfb(String xm, String sfzh) {
		final Activity context = (Activity) this;

		Log.i("TAX", xm);
		Log.i("TAX", sfzh);


	}
	

}