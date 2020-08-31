package com.neusoft.hbsw.demo;

import org.json.JSONArray;

import io.dcloud.common.DHInterface.IWebview;
import io.dcloud.common.DHInterface.StandardFeature;
import io.dcloud.common.util.JSUtil;

public class LivePlugin extends StandardFeature {
    private IWebview mWebview;
    public String openlive(IWebview webview, JSONArray array){
        mWebview = webview;
        // 这里写你的业务逻辑即可

        return JSUtil.wrapJsVar("success");
    }
}