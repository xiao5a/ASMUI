package com.alipay.sdk.pay.demo;

public class TestClass {
    private String myTestOne;
    private int myTestTwo;
    private String myTestThree;
    private String myTestFour="回调参数";
    private OnCallBackListener listener;

    //拿到前面页面传来的数据
    public void setData(String testOne,int testTwo,String testThree){
        this.myTestOne=testOne;
        this.myTestTwo=testTwo;
        this.myTestThree=testThree;
//        Log.d("hainan","hainan==="+"参数一"+myTestOne+"参数二"+myTestTwo+"参数三"+myTestThree);
        listener.onCallBackListener(myTestFour);
    }

    //向外暴露接口
    public void setOnCallBackListener(OnCallBackListener listener){
        this.listener=listener;
    }

    //创建一个回调接口
    public  interface OnCallBackListener{
        public void onCallBackListener(String str);

    }

}