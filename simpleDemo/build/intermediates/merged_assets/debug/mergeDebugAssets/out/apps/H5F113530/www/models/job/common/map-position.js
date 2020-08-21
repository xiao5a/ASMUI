(function(mui, owner) {
	//url前缀
	var appUrl = baseUtils.URL;
	//超时时间
	var atimeout = baseUtils.timeout;
	//账号
	var account = baseUtils.getState().account;
	//token 同时检查是否过期
	var token = baseUtils.getApiToken();
	
	console.log("---appUrl=" + appUrl + "---atimeout=" + atimeout + "---account=" + account + "---token=" + token );
	//以下编写业务代码

	// 经度
	var lng = null;
	// 维度
	var lat = null;
	// 地理坐标（经度纬度地址名称）
	var entPosition = {};
	var geoc;
	var unchanged_bd_pos = {};
	var myData = "";

	owner.load = function(webview) {
		if (null != webview.myData && undefined != webview.myData && "" != webview.myData){
			myData = webview.myData;
		}
		
		if (baseUtils.isNotEmpty(myData.BD_LNG)){
			lng = myData.BD_LNG;
		}
		if (baseUtils.isNotEmpty(myData.BD_LAT)){
			lat = myData.BD_LAT;
		}

		owner.init();
		document.getElementById("saveBtn").addEventListener("tap", function() {
			owner.returnEntPos();
		});
	}

	owner.init = function(position) {

		geoc = new BMap.Geocoder();

		plus.geolocation.getCurrentPosition(
			function(p) {
				var longitude = lng != null ? lng: p.coords.longitude; //获取坐标点经度 
				var latitude = lat != null ? lat: p.coords.latitude; //获取坐标点纬度  
				entPosition.gps_lng = longitude;
				entPosition.gps_lat = latitude;
				
				var BDpoint = new BMap.Point(longitude, latitude);
				owner.initMap(BDpoint)
				
				// var gpsPoint = new BMap.Point(longitude, latitude) //GPS定位点
				// //BMap.Convertor.translate(gpsPoint, 0, owner.initMap); //转换坐标  
				// owner.translate(gpsPoint, owner.initMap);
			},
			function(e) {
				switch (e.code) {
					case e.TIMEOUT:
						alert("定位失败,请求获取用户位置超时");
						break;
					case e.PERMISSION_DENIED:
						alert("定位失败,用户拒绝请求地理定位");
						break;
					case e.POSITION_UNAVAILABLE:
						alert("抱歉，暂时无法为您所在的星球提供位置服务");
						break;
					case e.UNKNOWN_ERROR:
						alert("定位失败,定位系统失效");
						break;
					default:
						alert(e.message);
						break;
				}
			}, {
				//指示浏览器获取高精度的位置，默认false  
				enableHighAcuracy: false,
				//指定获取地理位置的超时时间，默认不限时，单位为毫秒  
				//timeout:5000,  
				//最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置  
				maximumAge: 2000
			}
		);
	}

	owner.translate = function(GPSpoint, callback) {

		var url = "http://api.map.baidu.com/geoconv/v1/";
		url = url + "?coords=" + GPSpoint.lng + "," + GPSpoint.lat + "&from=3&to=5&ak=y5Th0MGGKHbbRmdGjjx4eYv63igjNWqO"
		mui.ajax(url, {
			dataType: 'json',
			type: 'get',
			timeout: atimeout,
			success: function(data) {
				var result = data.result[0];
				unchanged_bd_pos.lng = result.x;
				unchanged_bd_pos.lat = result.y;
				var BDpoint = new BMap.Point(result.x, result.y);
				typeof callback === 'function' && callback(BDpoint);
			},
			error: function(xhr, type, errorThrown) {
				console.log("百度坐标转换接口错误");
			}
		});

	}

	owner.bd09ToWgs = function(posData, callback) {

		var bd_pos = {
			BD_LNG: entPosition.lng,
			BD_LAT: entPosition.lat,
		}
		var url = baseUtils.URL + "/com/neusoft/mle/app/action/common/common.bd09ToWgs.svc";
		mui.ajax(url, {
			dataType: 'json',
			data: {
				posData: bd_pos
			},
			type: 'post',
			timeout: atimeout,
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'Content-Type': 'application/json;charset=utf-8',
				'sso-token': token
			},
			success: function(data) {
				var stFlag = baseUtils.checkStatus(data);
				if (stFlag) {
					var _data = data.data;
					var convert_gps_lng = _data.convert_gps_lng;
					var convert_gps_lat = _data.convert_gps_lat;
					posData.GPS_LNG = convert_gps_lng;
					posData.GPS_LAT = convert_gps_lat;
					typeof callback === "function" && callback(posData);
				}
			},
			error: function(xhr, type, errorThrown) {
				console.log(JSON.stringify(xhr));
				console.log(JSON.stringify(type));
				console.log(JSON.stringify(errorThrown));
			}
		});
	}

	/**
	 * 绘制地图
	 */
	owner.initMap = function(point) {

		entPosition.lng = point.lng; //经度
		entPosition.lat = point.lat; //维度
		map = new BMap.Map("map"); //创建地图实例


		//自定义搜索控件
		var myZoomCtrl = new ZoomControl();
		map.addControl(myZoomCtrl);
		var ac = new BMap.Autocomplete( //建立一个自动完成的对象
			{
				"input": "suggestId",
				"location": map
			});

		var myValue;
		ac.addEventListener("onconfirm", function(e) {
			$("#suggestId").blur();
			var _value = e.item.value;
			myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
			setPlace();
		});


		function setPlace() {
			map.clearOverlays();
			var local = new BMap.LocalSearch(map, { //智能搜索
				onSearchComplete: _onSearchComplete
			});
			local.search(myValue);

			function _onSearchComplete() {
				var _poi = local.getResults().getPoi(0);
				var pp = _poi.point;
				var pt = _poi.title;
				map.centerAndZoom(pp, 16);
				//保证和初始化逆地理解析一致
				geoc.getLocation(pp, function(rs) {
					var addComp = rs.addressComponents;
					var mapdetail = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber +
						pt;
					entPosition.lng = pp.lng;
					entPosition.lat = pp.lat;
					entPosition.titile = mapdetail; //设置title值
					document.getElementById("mapdom").innerHTML = mapdetail;
				});
				var _marker = new BMap.Marker(pp);
				_marker.enableDragging();
				_marker.addEventListener("dragend", onMarkerDragend);
				map.addOverlay(_marker); //添加标注
			}
		}
		//搜索控件end


		map.addControl(new BMap.NavigationControl({
			type: BMAP_NAVIGATION_CONTROL_LARGE,
			anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
			offset: new BMap.Size(15, 120)
		}));
		map.addControl(new BMap.ScaleControl({
			anchor: BMAP_ANCHOR_BOTTOM_LEFT,
			offset: new BMap.Size(15, 120)
		}));
		map.addControl(new BMap.OverviewMapControl());
		map.centerAndZoom(point, 16);
		var marker = new BMap.Marker(point);
		map.addOverlay(marker);
		//设置标注可拖拽
		marker.enableDragging();
		//标注拖拽事件监听
		marker.addEventListener("dragend", onMarkerDragend);

		function onMarkerDragend(e) {
			entPosition.lng = e.point.lng;
			entPosition.lat = e.point.lat;
			point.lng = entPosition.lng;
			point.lat = entPosition.lat;
			geoc.getLocation(point, function(rs) {
				var addComp = rs.addressComponents;
				var mapdetail = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
				if (rs.surroundingPois != null && rs.surroundingPois != "") {
					mapdetail += rs.surroundingPois[0].title;
				}
				entPosition.titile = mapdetail;
				document.getElementById("mapdom").innerHTML = mapdetail;
			});
		}

		var location = $('.location')[0];
		location.addEventListener('click', function() {
			point.lng = entPosition.lng; //重新设置经度
			point.lat = entPosition.lat; //重新设置维度
			var num = map.getZoom(); //取得当前地图级别
			map.centerAndZoom(point, num); //回到标记点为屏幕中心
		});
		//页面初始化对坐标点进行反地址解析
		geoc.getLocation(point, function(rs) {
			var addComp = rs.addressComponents; //结构化的地址描述
			//省市区街道门牌号码
			var mapdetail = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
			if (rs.surroundingPois != null && rs.surroundingPois != "") {
				//附近的POI点
				mapdetail += rs.surroundingPois[0].title;
			}
			entPosition.titile = mapdetail; //设置title值
			document.getElementById("mapdom").innerHTML = mapdetail; //设置id为mapdom的值
		});
	}

	owner.returnEntPos = function() {
		var posData = {
			titile: entPosition.titile,
			NS_LOCATIONS: entPosition,
			myData: myData
		};

		if (entPosition.lng != unchanged_bd_pos.lng || entPosition.lat != unchanged_bd_pos.lat) {
			owner.bd09ToWgs(posData, back);
		} else {
			back(posData);
		}

		function back(_posData) {
			console.log("_posData=" + JSON.stringify(_posData));
			var opener = plus.webview.currentWebview().opener();
			mui.fire(opener, 'setPositionInfo', _posData);
			mui.back();
		}

	}

}(mui, window.mapPosition = {}));