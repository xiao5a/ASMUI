package com.alipay.sdk.pay.demo.util;

//
//import com.loopj.android.http.AsyncHttpClient;
//import com.loopj.android.http.AsyncHttpResponseHandler;
//import com.loopj.android.http.RequestParams;
//import com.neusoft.tax.base.PbUtils;
//import com.neusoft.tax.base.Utils;
//import com.neusoft.tax.newfragment.menu_two.MenuTwoTab1_1Fragment;

public class Aliauth {
	private String url ;
	private String response;
	public Aliauth(String url) {
		super();
		this.url = url;
	}
	public   String sfzh ="";
	
//public String getAliinfo(final Activity context,Map<String, String> paramsMap){
//
//		AsyncHttpClient mClient = Utils.instance().getHttpClient(context);
//		Map<String, Object> map = new HashMap<String, Object>();
//
////		map.put("params",paramsMap);
//
//		String jsonText = JSONValue.toJSONString(paramsMap);
//		try {
//			jsonText = URLEncoder.encode(jsonText, "utf-8");
//		} catch (UnsupportedEncodingException e1) {
//			e1.printStackTrace();
//		}
//
//		RequestParams params = new RequestParams();
//		params.put("json", jsonText);
//
//		mClient.post(context, url, params,new AsyncHttpResponseHandler(){
//			@Override
//			public void onSuccess(int arg0, org.apache.http.Header[] arg1,
//					byte[] arg2) {
//				try {
//					response = new String(arg2, "UTF-8");
//				} catch (UnsupportedEncodingException e) {
//					e.printStackTrace();
//				}
//
//				Log.i("111", "֧������Ӧ��" + response);
//				Object obj = JSONValue.parse(response);
//				JSONObject resultObj = (JSONObject) obj;
//
//				JSONArray jsonArray = (JSONArray) resultObj.get("items");
//				if(jsonArray.size()>0){
//				//---------------------------------------------
//				for (int i = 0; i < jsonArray.size(); i++) {
//					resultObj = (JSONObject) jsonArray.get(i);
//					String flog = (String) resultObj.get("flog");//����ƷĿ
//					 if (flog.equals("Y")){
////							((PayDemoActivity)context).pd2.dismiss();
//
//							JSONObject	 userinfo =  (JSONObject) resultObj.get("userInfo");
//
//						String isCertified= 	(String) userinfo.get("isCertified");
//						if (isCertified.equals("T")){
//
//
//							String sfzh = (String)userinfo.get("certNo") ;
//							String xm = (String) userinfo.get("userName");
////							((PayDemoActivity)context).sfzh=sfzh ;
////							((PayDemoActivity)context).xm= xm ;
//        					PbUtils.Prompt(context, "֧�����˻�������"+xm);
//        					Fragment fragment=new  MenuTwoTab1_1Fragment();
//////        					FragmentTransaction ft = ((PayDemoActivity)context).getSupportFragmentManager().beginTransaction();
////        					ft.replace(R.id.Tab1Content, fragment);
////        					ft.addToBackStack(null);
////        					ft.commit();
//							// �����첽����
////						TODO�����
//						}else {
////							((PayDemoActivity)context).pd2.dismiss();
//        					PbUtils.Prompt(context, "֧�����˻�δ��ʵ������֤�����ȵ�֧��������ʵ����֤");
//                        }
//
//					 }else {
////							((PayDemoActivity)context).pd2.dismiss();
//							PbUtils.Prompt(context, (String)resultObj.get("message"));
//
//				 			}
//
//
//				}
//			}else {
////					((PayDemoActivity)context).pd2.dismiss();
//					PbUtils.Prompt(context, "�����������");
//				}
//
//			}
//			public void onFailure(int arg0, org.apache.http.Header[] arg1,
//					byte[] arg2, Throwable arg3) {
//				Log.i("111", "֧������Ӧ��" + arg3.getMessage());
//				super.onFailure(arg0, arg1, arg2, arg3);
////				((PayDemoActivity)context).pd2.dismiss();
//
//			}
//
//	});
//		Log.i("111", "���֤���룺" + sfzh);
//
//		return sfzh ;
//
//	}


}
