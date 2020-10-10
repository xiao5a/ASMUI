package com.neusoft.tax.wxapi;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.WindowManager;

import com.neusoft.tax.R;
import com.neusoft.tax.wx.Constants;
import com.tencent.mm.opensdk.modelbiz.WXLaunchMiniProgram;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

import org.json.JSONArray;

import io.dcloud.common.util.JSUtil;

public class MuiActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
//        Toast.makeText(this, "MuiActivityonCreate", Toast.LENGTH_LONG).show();
        super.onCreate(savedInstanceState);
        setContentView(R.layout.login);

        getWindow().addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);



        processExtraData();
    }


    @Override
    protected void onNewIntent(Intent intent) {
        // TODO Auto-generated method stub
        super.onNewIntent(intent);
//        Toast.makeText(this, "MuiActivityonNewIntent", Toast.LENGTH_LONG).show();

        setIntent(intent);//must store the new intent unless getIntent() will return the old one

        processExtraData();

    }


    private void processExtraData(){
//        Toast.makeText(this, "MuiActivityprocessExtraData", Toast.LENGTH_LONG).show();

        Intent intent = getIntent();

        String id = intent.getStringExtra("id");
        if (id!=null &&id.equals("goback")) {
//            Toast.makeText(this, "goback", Toast.LENGTH_LONG).show();
            JSONArray newArray = new JSONArray();
            newArray.put("事事顺遂");
            JSUtil.execCallback(WXEntryActivity.wxiWebview, WXEntryActivity.WxJSONArray.optString(0),newArray, JSUtil.OK, false);

            this.finish();
//            String sfzh = (String) intent.getStringExtra("certNo");
//            String xm = (String) intent.getStringExtra("userName");
//            String sjh = (String) intent.getStringExtra("sjh");


        }else if (id == null){
            String appId = Constants.APP_ID;
            IWXAPI api = WXAPIFactory.createWXAPI(MuiActivity.this, appId);

            WXLaunchMiniProgram.Req req = new WXLaunchMiniProgram.Req();
            req.userName = Constants.MINI_APP_ID;
            req.path = "pages/wxml/appindex?type=login";
            req.miniprogramType = WXLaunchMiniProgram.Req.MINIPTOGRAM_TYPE_RELEASE;// ��ѡ���� �����棬����������ʽ��
            api.sendReq(req);
        }

    }

}
