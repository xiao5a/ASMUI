package com.neusoft.hbsw.demo;

import java.util.ArrayList;

import io.dcloud.common.DHInterface.IWebview;
import io.dcloud.feature.internal.sdk.SDK;

public class Demo {
    private IWebview mWebview;

    public static String getResult() {
        return "ok";
    }

    public static void callbaResult() {
        ArrayList<IWebview> weblist = SDK.obtainAllIWebview();
        for (int i = 0; i < weblist.size(); i++) {
            weblist.get(i).evalJS("testCallBack('testCallBack')");
        }
    }
}
