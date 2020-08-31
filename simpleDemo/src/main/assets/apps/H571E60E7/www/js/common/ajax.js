//ajax封装
function ajax(url, headers, data, success, error) {

	if(data == null || data == undefined) data = {};
	return $.ajax({
		url: url,
		type: 'POST',
		crossDomain: true,
		xhrFields: {
			withCredentials: true
		},
		headers: headers,
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		//async: true,
		data: typeof data == "string" ? data : JSON.stringify(data),
		success: function() {
			if(success && typeof success == "function") {
				success.apply(this, Array.prototype.slice.call(arguments));
			}
		},
		error: function() {
			if(error && typeof error == "function") {
				error.apply(this, Array.prototype.slice.call(arguments));
			}
		}
	});
}

//获取返回结果
function getResult(data) {
	return data.data;
}

window.c = {
	ajax: function(opts) {
		return ajax(opts.url, opts.headers, opts.data, opts.success, opts.error);
	}
}