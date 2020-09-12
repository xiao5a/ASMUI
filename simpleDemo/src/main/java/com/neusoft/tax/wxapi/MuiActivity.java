package com.neusoft.tax.wxapi;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.WindowManager;

import com.neusoft.tax.wx.Constants;
import com.tencent.mm.opensdk.modelbiz.WXLaunchMiniProgram;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

public class MuiActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
        String appId = Constants.APP_ID;
        IWXAPI api = WXAPIFactory.createWXAPI(this, appId);

        WXLaunchMiniProgram.Req req = new WXLaunchMiniProgram.Req();
        req.userName = Constants.MINI_APP_ID;
        req.path = "pages/wxml/appindex?type=login";
         req.miniprogramType = WXLaunchMiniProgram.Req.MINIPROGRAM_TYPE_TEST;// ��ѡ���� �����棬����������ʽ��
        api.sendReq(req);
        processExtraData();
    }


    @Override
    protected void onNewIntent(Intent intent) {
        // TODO Auto-generated method stub
        super.onNewIntent(intent);
        setIntent(intent);//must store the new intent unless getIntent() will return the old one

        processExtraData();

    }


    private void processExtraData(){

        Intent intent = getIntent();

        String id = intent.getStringExtra("id");
        if (id!=null &&id.equals("goback")) {


            String sfzh = (String) intent.getStringExtra("certNo");
            String xm = (String) intent.getStringExtra("userName");
            String sjh = (String) intent.getStringExtra("sjh");


        }

    }

}
