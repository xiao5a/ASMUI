package com.alipay.sdk.pay.demo;

import android.app.Activity;
import android.text.TextUtils;
import android.util.Log;

import com.alipay.sdk.app.AuthTask;
import com.alipay.sdk.pay.demo.util.OrderInfoUtil2_0;
import com.neusoft.tax.wx.Constants;
import com.tencent.mm.opensdk.modelbiz.WXLaunchMiniProgram;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.util.Map;

import io.dcloud.common.DHInterface.IWebview;
import io.dcloud.common.DHInterface.StandardFeature;
import io.dcloud.common.util.JSUtil;
/**
 * 李留新
 * 2018-01-31
 * 说明:桌面角标扩展插件类
 */
public class AlipayFeature extends StandardFeature {
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
    public static IWebview wxiWebview  ;
    public  static JSONArray WxJSONArray;
    AuthResult authResult1=null;
    /**
     * 说明:调用支付宝登录授权的auth方法
     *
     * @param iWebview  使用的页面(固定参数,必须要写)
     * @param jsonArray 显示的角标数量参数 (固定参数,必须要写)
     */


    public  void  wxLogin(IWebview iWebview, JSONArray jsonArray){
        wxiWebview = iWebview;
        WxJSONArray = jsonArray;
        String appId = Constants.APP_ID;
        IWXAPI api = WXAPIFactory.createWXAPI(this.getActivity(), appId);

        WXLaunchMiniProgram.Req req = new WXLaunchMiniProgram.Req();
        req.userName = Constants.MINI_APP_ID;
        req.path = "pages/wxml/appindex?type=login";
         req.miniprogramType = WXLaunchMiniProgram.Req.MINIPROGRAM_TYPE_TEST;// ��ѡ���� �����棬����������ʽ��
        api.sendReq(req);
    }
    public void alipayLogin(IWebview iWebview, JSONArray jsonArray) {
        String url=null;

        JSONObject retJSONObj=null;
        try {
            //授权请求的路径
             url = jsonArray.getString(1);
            //执行支付宝授权方法
            this.authV2(url,this.getActivity(),iWebview,jsonArray);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
    public  void authV2(final String url, final Activity activity, final IWebview iWebview, final JSONArray jsonArray) {
        Log.e("authV2","支付宝方法");

        boolean rsa2 = (RSA2_PRIVATE.length() > 0);
        Map<String, String> authInfoMap = OrderInfoUtil2_0.buildAuthInfoMap(
                PID, APPID, TARGET_ID, true);
        String info = OrderInfoUtil2_0.buildOrderParam(authInfoMap);
//        info = "biz_type=openservice&scope=kuaijie&product_id=APP_FAST_LOGIN&auth_type=AUTHACCOUNT&apiname=com.alipay.account.auth&sign_type=RSA2&pid=2088621604927669&app_id=2017033106498311&app_name=mc&target_id=hbdzswj091125";
        String privateKey = rsa2 ? RSA2_PRIVATE : RSA_PRIVATE;
        String sign = OrderInfoUtil2_0.getSign(authInfoMap, privateKey, rsa2);
//        String sign = "sign=ZJyPO5rmFm1SSQJWsJa%2F0rFIyFmimn9hpdxzbysQOWPE5thYAb738JZNa0YW59CwYsAk%2BsyMLg0zqIXl3rWkpdYnSTyv7nFi%2F7V5mSRW%2BEhKRP0e8bg5h9rshU2%2FZp2qnTmoElyeUQoDuxAjhw95pYE7J4aLdZa3CjwW8CzK4EiXsDBn5N8q9%2Fxt%2BpwYlf09n3Edz4aXwnDNwi8kEjd1WF33g97Mu2hnyEv6xPFVYoYIhTpxLQt4qw04tv9NEMZ6tP0xIWgew4yD9K%2BIpJFOUXjpmYBQg0IFwnXF%2BUDuwU6660vilCPgBoUhcmbY%2Fp0ZEdEvHtKet%2B3FIfKho4sZoQ%3D%3D";
        final String authInfo = info + "&" + sign;
        Thread authRunnable = new Thread() {
           // AuthResult authResult = null;
            @Override
            public void run() {
                // 构造AuthTask 对象
                AuthTask authTask = new AuthTask(activity);
                // 调用授权接口，获取授权结果（返回值即是授权结果）
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
                }
                // 调用方法将原生代码的执行结果返回给js层并触发相应的JS层回调函数
                JSONArray newArray = new JSONArray();
                newArray.put(authResult.getResultCode());
                newArray.put(authResult.getResultStatus());
                newArray.put(authResult.getAuthCode());
//                newArray.put(authResult.getScope());
//                newArray.put(authResult.getUser_id());
                //异步返回到login.js
                JSUtil.execCallback(iWebview, jsonArray.optString(0),newArray, JSUtil.OK, false);
            }
        };



        // 必须异步调用
        Thread authThread = new Thread(authRunnable);
        authThread.start();




    }
    public  Activity getActivity() {
        Class activityThreadClass = null;
        try {
            activityThreadClass = Class.forName("android.app.ActivityThread");
            Object activityThread = activityThreadClass.getMethod("currentActivityThread").invoke(null);
            Field activitiesField = activityThreadClass.getDeclaredField("mActivities");
            activitiesField.setAccessible(true);
            Map activities = (Map) activitiesField.get(activityThread);
            for (Object activityRecord : activities.values()) {
                Class activityRecordClass = activityRecord.getClass();
                Field pausedField = activityRecordClass.getDeclaredField("paused");
                pausedField.setAccessible(true);
                if (!pausedField.getBoolean(activityRecord)) {
                    Field activityField = activityRecordClass.getDeclaredField("activity");
                    activityField.setAccessible(true);
                    Activity activity = (Activity) activityField.get(activityRecord);
                    return activity;
                }
            }
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        } catch (NoSuchFieldException e) {
            e.printStackTrace();
        }
        return null;
    }
    };


