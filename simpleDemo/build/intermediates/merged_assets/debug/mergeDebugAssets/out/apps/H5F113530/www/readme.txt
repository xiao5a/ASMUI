【工程目录】
	工程名
		css				公共的css
		fonts			字体
		img				图片资源,包括浏览App中的图标图片等
		js				公共的js
		models			功能模块,包含功能界面,界面由HTML、CSS和JS三种文件组成,三文件名字一样,扩张名不一样
		unpackage		图标和启动界面时候的启动图片
		index.html		是mainfest.json中默认的最初的入口界面网页文档,可以在mainfest.json下修改
		manifest.json	工程设置
	
【基础工具】
	很重要，优先看看内容：js/common/baseUtils.js

【业务无关表】
	管理版本升级的表：
	CREATE TABLE T_VERSION  (
	  id VARCHAR2(50) primary key,
	  verno VARCHAR2(50),
	  vercontent VARCHAR2(1024),
	  verurl VARCHAR2(512),
	  create_time DATE,
	  create_userid	varchar2(50),  
	  create_name	varchar2(20)
	);
	COMMENT ON table T_VERSION IS 'APP版本表';
	comment on column T_VERSION.id is '主键';
	comment on column T_VERSION.verno is '最新版本号，对应manifest.json的应用版本名称';
	comment on column T_VERSION.vercontent is '版本描述';
	comment on column T_VERSION.verurl is '补丁位置。格式：andriod_url;,;ios_url';
	comment on column T_VERSION.create_time is '操作时间戳';
	comment on column T_VERSION.create_userid is '操作人ID';
	comment on column T_VERSION.create_name is '操作人姓名';


	管理验证码的表：
	CREATE TABLE T_VERIFICATION_CODE
	(
	  id       	VARCHAR2(50) primary key,
	  phone    	VARCHAR2(20),
	  verification_code VARCHAR2(50) NOT NULL,
	  account  	VARCHAR2(50),
	  type   	VARCHAR2(10),
	  create_time DATE
	);
	COMMENT ON table T_VERIFICATION_CODE IS '验证码表。验证码默认10分钟过期';
	comment on column T_VERIFICATION_CODE.id is '主键';
	comment on column T_VERIFICATION_CODE.phone is '一般保存手机号码';
	comment on column T_VERIFICATION_CODE.verification_code is '验证码';
	comment on column T_VERIFICATION_CODE.account is '操作人账号';
	comment on column T_VERIFICATION_CODE.type is '0是注册、1是修改密码';
	comment on column T_VERIFICATION_CODE.create_time is '操作时间戳';
	
【分页：上拉刷新】
	请参考：App-H5plus\models\job\zryt\zrytList.html ~ zrytList.js  再文件中查询注释：【适用于需要分页的功能】

【给父页面传值】
	请参考：App-H5plus\models\job\zryt\xkzList.js ~ zrytAdd.js  再文件中查询"changeName"	