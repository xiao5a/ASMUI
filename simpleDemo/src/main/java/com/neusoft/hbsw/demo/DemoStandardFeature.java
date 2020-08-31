package com.neusoft.hbsw.demo;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.os.Handler;
import android.os.Message;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Toast;

import com.alipay.sdk.app.AuthTask;
import com.alipay.sdk.pay.demo.AuthResult;
import com.alipay.sdk.pay.demo.PayResult;
import com.alipay.sdk.pay.demo.util.OrderInfoUtil2_0;

import org.json.JSONArray;

import java.util.Map;
import java.util.concurrent.CountDownLatch;

import io.dcloud.common.DHInterface.IWebview;
import io.dcloud.common.DHInterface.StandardFeature;
import io.dcloud.common.util.JSUtil;

public class DemoStandardFeature extends StandardFeature {
    private IWebview mWebview;
    public static final String APPID = "2017033106498311";

    /** 支付宝账户登录授权业务：入参pid值 */
    public static final String PID = "2088621604927669";
    /** 支付宝账户登录授权业务：入参target_id值 */
    public static final String TARGET_ID = "hbdzswj091125";

    /**
     * ���ߵ�ַ��https://doc.open.alipay.com/docs/doc.htm?treeId=291&articleId=106097&docType=1
     */
    public static final String RSA2_PRIVATE = "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDQNLevgSIyBXuHpUWkXpaYctlPWOxSvljbpOkh+y+DWW1pzEC14byDVlqPpa+RCwj1V7Fmc5gDpx4s209b2xJThphDdIcb/s9HkvGGREZPUdjqy5zjDr+9XXoZk11zzT4iT6O1cNePiV/lj4dVzoJ32Uu4uBDFfWmCXhszT4ybOrWciNh8cwoAJVFfwA8fVJBJL4K3PrPgwuTZQwObXFahx8lWXsYe71F2I4MGgLXBJjt6mtf96ZvdRGiKvL2Ja8A2TaA2HrcXy47DAeYqWGkTv+ZIKBN8TrQY3amLP53NoRm7Iapgm8r0IxKDesaEFHQ6V0/oV20OlpcABvNiv0mlAgMBAAECggEBAMuYoX53kk7D2bYdQWqoLC9LL4FN/Vo0VIQEUQ0vqZiR3FI2r5ir80GjMc+CP5pf5hSz+f+rTZ1U0Ecg9gtmwBb5aO+dhXk0xNDCuneHUBHEgY+oJ/RIueqc/AcCecIBk57NrdKBU+lCdonuvnKEDETSMh+hrpTQPFqFV6fnRCGNlffT7Td+kUcD0v1YLCKnskFIOiVBEeZTezfYV7MUc0zayURyDoYkg4eKDQGloOGtznUYq9vabkUWTHau+tMSHgBTHexGHtur6bLvkCWPChh94cWBOzxzServylPlOtUShplNWPdgF+03nHDAPxj0UrTXYzjbb6UZZjhI7eM550kCgYEA6bQ2U1v7C+ADpFNiUlW59rZIRJE3Sy5cU9euCaAiYmNenZCV9KczM4wEWoLroZpvCI40Js4Prmy87/+gwhMiA6T2uuK5ZtMFZMXiVCT2xe9dAa60X2GYzfrsNPWdWvqYSa9rg5UWHeWE8f5bDhQy1S2zeYKM6407j5PZJzT1AFcCgYEA5BHDWSXzQYZNRftsnZQBLazHUeh3gHGBnrHJc6kAEgGvH98lI2eh35kasKkGhi9NJBFa30hqx8WpF2wGeiXK3N/iqsA7u58IoRTSiqR3hXCetSExjKmg3qNbaXb2/gUEkE7el5Wldcg54xjbz/Pf0Stbu++qyVe2G/z6zzTIGGMCgYB9sZ9GVkI/sMxEpVRMVC8gsglMV44VsWmW7nl8U9Qqdqd8tzbvzr2LC9OLmr6AvD7bqyABfvKQLYuwyRv9Ra0VqLPK8AYnd3d/K67+8qKG8qZjMUNxyVwV7M797NwlAoLFnsOEkbrDeZ53SQZQHCz62wmcYMrKJbvTDQHORH1BIQKBgG5J2LmnjHbHR17sMp4REHDR+KE3VXKbcR8Ywl5X/1y1y8YR1pfEaZcDJtD/K9R/00H50oPfNSPeBeL5rjgrRmqBKc+AnmIgib+7ngTFe7bfux/EKX3oGY8QWAgsK0yziH1wZlvPVfAbH0Mepk1tlXJFEVtUjrZG4B2wvGivEYQZAoGBALNWNj6hsvHpAHAhhM6lRTkbPIbVm+FqrMTJGuzup4pVFWRqanAaHq1AgNc8YoIHYUIoyD4t5ozxXbEP6MNWGHewaRhAChbhmiUZqvxIFB+KbDH1E3JHKwTXKDJyHq2yhcY1/WZwgPbYOPg4Xca3YgwbKlibBSGOljjeEnu0+X8d";
    public static final String RSA_PRIVATE = "";

    private static final int SDK_PAY_FLAG = 1;
    private static final int SDK_AUTH_FLAG = 2;

    private String code = "初始值";
    public  CountDownLatch countDownLatch ;

    public String test(IWebview webview, JSONArray array) throws InterruptedException {
        countDownLatch =new CountDownLatch(1);
        Log.i("cxl", "test");
        mWebview = webview;
        authV2(mWebview.getActivity());
        countDownLatch.await();

        return JSUtil.wrapJsVar("DemoStandardFeature --- success"+code);
    }



    public void authV2(final Context context2 ) throws InterruptedException {

        /**
         * 这里只是为了方便直接向商户展示支付宝的整个支付流程；所以Demo中加签过程直接放在客户端完成；
         * 真实App里，privateKey等数据严禁放在客户端，加签过程务必要放在服务端完成；
         * 防止商户私密数据泄露，造成不必要的资金损失，及面临各种安全风险；
         *
         * authInfo的获取必须来自服务端；
         */
        boolean rsa2 = (RSA2_PRIVATE.length() > 0);
        Map<String, String> authInfoMap = OrderInfoUtil2_0.buildAuthInfoMap(
                PID, APPID, TARGET_ID, true);
        String info = OrderInfoUtil2_0.buildOrderParam(authInfoMap);
//        info = "biz_type=openservice&scope=kuaijie&product_id=APP_FAST_LOGIN&auth_type=AUTHACCOUNT&apiname=com.alipay.account.auth&sign_type=RSA2&pid=2088621604927669&app_id=2017033106498311&app_name=mc&target_id=hbdzswj091125";
        String privateKey = rsa2 ? RSA2_PRIVATE : RSA_PRIVATE;
        String sign = OrderInfoUtil2_0.getSign(authInfoMap, privateKey, rsa2);
//        String sign = "sign=ZJyPO5rmFm1SSQJWsJa%2F0rFIyFmimn9hpdxzbysQOWPE5thYAb738JZNa0YW59CwYsAk%2BsyMLg0zqIXl3rWkpdYnSTyv7nFi%2F7V5mSRW%2BEhKRP0e8bg5h9rshU2%2FZp2qnTmoElyeUQoDuxAjhw95pYE7J4aLdZa3CjwW8CzK4EiXsDBn5N8q9%2Fxt%2BpwYlf09n3Edz4aXwnDNwi8kEjd1WF33g97Mu2hnyEv6xPFVYoYIhTpxLQt4qw04tv9NEMZ6tP0xIWgew4yD9K%2BIpJFOUXjpmYBQg0IFwnXF%2BUDuwU6660vilCPgBoUhcmbY%2Fp0ZEdEvHtKet%2B3FIfKho4sZoQ%3D%3D";
        final String authInfo = info + "&" + sign;

//        final String authInfo ="biz_type=openservice&scope=kuaijie&product_id=APP_FAST_LOGIN&auth_type=AUTHACCOUNT&apiname=com.alipay.account.auth&sign_type=RSA2&pid=2088621604927669&app_id=2017033106498311&app_name=mc&target_id=hbdzswj091125&sign=ZJyPO5rmFm1SSQJWsJa%2F0rFIyFmimn9hpdxzbysQOWPE5thYAb738JZNa0YW59CwYsAk%2BsyMLg0zqIXl3rWkpdYnSTyv7nFi%2F7V5mSRW%2BEhKRP0e8bg5h9rshU2%2FZp2qnTmoElyeUQoDuxAjhw95pYE7J4aLdZa3CjwW8CzK4EiXsDBn5N8q9%2Fxt%2BpwYlf09n3Edz4aXwnDNwi8kEjd1WF33g97Mu2hnyEv6xPFVYoYIhTpxLQt4qw04tv9NEMZ6tP0xIWgew4yD9K%2BIpJFOUXjpmYBQg0IFwnXF%2BUDuwU6660vilCPgBoUhcmbY%2Fp0ZEdEvHtKet%2B3FIfKho4sZoQ%3D%3D";
        Runnable authRunnable = new Runnable() {

            @Override
            public void run() {
                // 构造AuthTask 对象
                AuthTask authTask = new AuthTask((Activity) context2);
                // 调用授权接口，获取授权结果
                Map<String, String> result = authTask.authV2(authInfo, true);



                AuthResult authResult = new AuthResult(result, true);
                String resultStatus = authResult.getResultStatus();
                // 判断resultStatus 为“9000”且result_code
                // 为“200”则代表授权成功，具体状态码代表含义可参考授权接口文档
                if (TextUtils.equals(resultStatus, "9000") && TextUtils.equals(authResult.getResultCode(), "200")) {
                    // 获取alipay_open_id，调支付时作为参数extern_token 的value
                    // 传入，则支付账户为该授权账户
                    Log.e("authV2","授权成功");
                } else {
                    // 其他状态值则为授权失败
                    Log.e("authV2","授权失败");
                  code =  "返回值"+authResult.getResultCode();
                    countDownLatch.countDown();
                }
//                Message msg = new Message();
//                msg.what = SDK_AUTH_FLAG;
//                msg.obj = result;
//                mHandler.sendMessage(msg);


            }
        };

        // 必须异步调用
        Thread authThread = new Thread(authRunnable);
        authThread.run();
    }
    @SuppressLint("HandlerLeak")

    private Handler mHandler = new Handler() {
        @SuppressWarnings("unused")
        public void handleMessage(Message msg) {
            switch (msg.what) {
                case SDK_PAY_FLAG: {
                    @SuppressWarnings("unchecked")
                    PayResult payResult = new PayResult((Map<String, String>) msg.obj);

                    String resultInfo = payResult.getResult();// ͬ��������Ҫ��֤����Ϣ
                    String resultStatus = payResult.getResultStatus();
                    if (TextUtils.equals(resultStatus, "9000")) {

                        Toast.makeText(    mWebview.getActivity()
, "支付成功", Toast.LENGTH_SHORT).show();
                    } else {
                        Toast.makeText( mWebview.getActivity(), "֧支付失败", Toast.LENGTH_SHORT).show();
                    }
                    break;
                }
                case SDK_AUTH_FLAG:
                    @SuppressWarnings("unchecked")
                    AuthResult authResult = new AuthResult(
                            (Map<String, String>) msg.obj, true);
                    String resultStatus = authResult.getResultStatus();

                    // 判断resultStatus 为“9000”且result_code
                    // 为“200”则代表授权成功，具体状态码代表含义可参考授权接口文档
                    if (TextUtils.equals(resultStatus, "9000")
                            && TextUtils.equals(authResult.getResultCode(), "200")) {
                        // 获取alipay_open_id，调支付时作为参数extern_token 的value
                        // 传入，则支付账户为该授权账户
                        // Toast.makeText(
                        // context,
                        // "授权成功\n"
                        // + String.format("authCode:%s",
                        // authResult.getAuthCode()),
                        // Toast.LENGTH_SHORT).show();

//                        PbUtils pb2 = new PbUtils();
//
//                        alicallback(authResult.getAuthCode());
                        Toast.makeText(
                                mWebview.getActivity(),
                                "授权成功"
                                        + String.format("authCode:%s",
                                        authResult.getAuthCode()),
                                Toast.LENGTH_SHORT).show();
                        code=authResult.getAuthCode();
                        JSUtil.wrapJsVar("DemoStandardFeature --- success"+authResult.getAuthCode());


//                        ArrayList<IWebview> weblist = SDK.obtainAllIWebview();
//                        for (int i = 0; i < weblist.size(); i++) {
//                            weblist.get(i).evalJS("testCallBack('testCallBack')");
//                        }


                    } else {
                        // 其他状态值则为授权失败
                        Toast.makeText(
                                mWebview.getActivity(),
                                "授权失败"
                                        + String.format("authCode:%s",
                                        authResult.getAuthCode()),
                                Toast.LENGTH_SHORT).show();
                        code=authResult.getAuthCode();
                        countDownLatch.countDown();

                         JSUtil.wrapJsVar("DemoStandardFeature --- countDownLatch.countDown()"+authResult.getAuthCode());


                    }
                    break;
                default:
                    break;
            }
        }


    };




}
