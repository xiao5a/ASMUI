/**
 * @Time 2020-03-23 13:57:21
 * SQLite数据库操作
 * @URL http://www.html5plus.org/doc/zh_cn/sqlite.html
 * @权限 需要在manifest中添加SQLite权限
 */
var SQLiteDB = {
	DBName: 'ydzfAppDb',
	DBPath: '_doc/Database.db',
	init: function() {
		if (window.plus) {
			mui.plusReady(function() {
				setTimeout(function() {
					var ws = plus.webview.currentWebview();
					ws.addEventListener('close', function() { //窗口关闭时，关闭数据库
						SQLiteDB.closeDatabase();
						console.log('webview close---closeDatabase');
					});
				}, 200);
			})
		}
	},
	openDB: function(success, fail) { //打开数据库
		console.log("打开数据库!");
		if (!SQLiteDB.isOpenDatabase()) {
			plus.sqlite.openDatabase({
				name: SQLiteDB.DBName,
				path: SQLiteDB.DBPath,
				success: function(e) {
					console.log('openDatabase success!');
					if (success)
						success(e)
				},
				fail: function(e) {
					console.log('openDatabase failed: ' + JSON.stringify(e));
					if (fail)
						fail(e)
				}
			});
		} else {
			console.log('Database already open!');
			if (success)
				success()
		}
	},
	isOpenDatabase: function() { //检查数据库是否打开
		var options = {
			name: SQLiteDB.DBName,
			path: SQLiteDB.DBPath
		}
		return plus.sqlite.isOpenDatabase(options);
	},
	closeDatabase: function(success, fail) { //关闭数据库
		console.log("关闭数据库!");
		if (SQLiteDB.isOpenDatabase()) {
			var options = {
				name: SQLiteDB.DBName,
				success: success,
				fail: fail,
			}
			plus.sqlite.closeDatabase(options);
		} else {
			if (success)
				success()
		}
	},
	/**
	 * @param {Object} operation  需要执行的事务操作 begin（开始事务）、commit（提交）、rollback（回滚）。
	 */
	transaction: function(operation, success, fail) {
		var options = {
			name: SQLiteDB.DBName,
			operation: operation,
			success: success,
			fail: fail,
		}
		plus.sqlite.transaction(options);
	},
	transactionBegin: function(success, fail) { //开启事务
		SQLiteDB.transaction("begin", success, fail);
	},
	transactionCommit: function(success, fail) { //提交事务
		SQLiteDB.transaction("commit", success, fail);
	},
	transactionRollback: function(success, fail) { //回滚事务
		SQLiteDB.transaction("rollback", success, fail);
	},
	_exec: function(sql, success, fail) {
		plus.sqlite.executeSql({
			name: SQLiteDB.DBName,
			sql: sql,
			success,
			fail
		})
	},
	executeSQL: function(sql, useTran, success, fail, noclose) { //执行语句
		console.log("mySQLite---executeSQL---sql:" + sql);
		
		SQLiteDB.openDB(
			function() { //打开成功
				exec();
			},
			function(e) { //打开失败
				console.log("数据库打开失败");
				if (fail)
					fail(e);
			});

		function exec() {
			if (useTran) { //使用事务
				SQLiteDB.transactionBegin(function() {
					SQLiteDB._exec(
						sql,
						function(data) {
							SQLiteDB.transactionCommit(
								function() { 
									if (!noclose){
										SQLiteDB.closeDatabase(
											function() {
												if (success) //执行回调
													success(data);
											},
											function(e) { 
												if (fail) 
													fail(e);
											}
										);
									} else {
										if (success) //执行回调
											success(data);
									}
								},
								function(e) { 
									if (fail) 
										fail(e);
								}
							);
						},
						function(e) {
							if (fail) //执行回调
								fail(e);
							SQLiteDB.transactionRollback();
							if (!noclose)
								SQLiteDB.closeDatabase();
						}
					)
				});
			} else { //不使用事务
				//console.log(sql)
				SQLiteDB._exec(
					sql,
					function(data) {
						if (!noclose){
							SQLiteDB.closeDatabase(
								function() {
									if (success) //执行回调
										success(data);
								},
								function(e) { 
									if (fail) 
										fail(e);
								}
							);
						} else {
							if (success) //执行回调
								success(data);
						}
					},
					function(e) {
						//console.log('Execute Sql fail')
						if (fail) //执行回调
							fail(e);
						if (!noclose)
							SQLiteDB.closeDatabase();
					}
				)
			}
		}
	},
	selectSQL: function(sql, success, fail) {
		SQLiteDB.openDB(
			function() { //打开成功
				plus.sqlite.selectSql({
					name: SQLiteDB.DBName,
					sql: sql,
					success: function(data) {
						if (success)
							success(data)
					},
					fail: function(e) {
						if (fail)
							fail(e);
					}
				});
			},
			function(e) { //打开失败
				console.log("数据库打开失败");
				if (fail)
					fail(e);
			});

	},
	insertData: function(tableName, tbdata, success, fail) { //插入
		SQLiteDB.openDB(
			function() { //打开成功
				SQLiteDB.createTbSql(tableName, tbdata,
					function() { //创建表成功
						SQLiteDB.insertTbSql(tableName, tbdata, success, fail);
					},
					function() { //创建表失败
						if (fail)
							fail(e);
					});
			},
			function(e) { //打开失败
				if (fail)
					fail(e);
			});
	},
	updateDataWh: function(tbname, objData, wh, success, fail) { //插入
		SQLiteDB.openDB(
			function(d) { //更新表成功
				SQLiteDB.updateTbSql(tbname, objData, wh,
					function(d) { //更新表成功
						if (success)
							success(d);
					},
					function(e) { //更新表失败
						if (fail)
							fail(e);
					}
				);
			},
			function(e) { //更新表失败
				if (fail)
					fail(e);
			}
		);
	},
	insertTbSql: function(tbname, listData, success, fail) { //插入
		if (listData.length > 0) {
			var textC = "";
			var valuE = "";
			for (var i = 0; i < listData.length; i++) {
				var textcl = "";
				var valuel = "";
				for (var ls in listData[i]) {
					var tName = JSON.stringify(ls).replace('"', "'").replace('"', "'");
					
					var val = listData[i][ls];
					val = val == null ? "" : val;
					
					if (textcl == "") {
						textcl += tName;
						valuel += "'" + val + "'";
					} else {
						textcl += "," + tName;
						valuel += ",'" + val + "'";
					}
				}
				
				if ("" == textC){
					textC = "(" + textcl + ")"
				}
				
				valuE += "(" + valuel + "),"
			}
			
			valuE += ";,";
			valuE = valuE.replace(",;,", "");
			
			if (textcl != "") {
				var insertSql = "insert into " + tbname + " " + textC + " values " + valuE;				
				SQLiteDB.executeSQL(insertSql, true, success, fail, true);
			}
		}
	},
	updateTbSql: function(tbname, objData, wh, success, fail) { //更新
		var text = "";
		for (var ls in objData) {
			var tName = JSON.stringify(ls).replace('"', "'").replace('"', "'");
			
			var val = objData[ls];
			val = val == null ? "" : val;
			
			text += (tName + " = " + "'" + val + "',");
		}
		
		text += ";,";
		text = text.replace(",;,", "");
		
		if (text != "") {
			var updateSql = "UPDATE " + tbname + " SET " + text  + " " + wh;	
			SQLiteDB.executeSQL(updateSql, true, success, fail, true);
		}
	},
	createTbSql: function(tbname, listData, success, fail) { //创建表
		var tbsql = "";
		if (listData.length > 0) {
			for (var ls in listData[0]) {
				var tName = JSON.stringify(ls).replace('"', "'").replace('"', "'");
				if (tbsql == "") {
					tbsql += tName + " text null ";
				} else {
					tbsql += "," + tName + " text null ";
				}
			}
		}
		if (tbsql != "") {
			tbsql = "create table if not exists " + tbname + " (" + tbsql + ")";
			SQLiteDB.executeSQL(tbsql, false, success, fail);
		}
	},
	dropTable: function(tbname, success, fail) { //删除表
		var sql = 'drop table if exists  ' + tbname;
		SQLiteDB.executeSQL(sql, false, success, fail);
	},
	clearTable: function(tbname, success, fail) { //清空表
		var sql = 'DELETE FROM ' + tbname;
		SQLiteDB.executeSQL(sql, false, success, fail);
	},
	deleteDataId: function(tbname, Id, success, fail) { //根据ID删除数据'id'
		var sql = "DELETE FROM " + tbname + " WHERE ID = '" + Id + "'";
		SQLiteDB.executeSQL(sql, false,
		function(d) {
			if (success)
				success(d);
		},
		function(e) {
			if (fail)
				fail(e);
		});	
	},
	deleteDataWhere: function(tbname, wh, success, fail) { //根据ID删除数据'id'
		var sql = "DELETE FROM " + tbname + " " + wh;
		SQLiteDB.executeSQL(sql, false,
		function(d) {
			if (success)
				success(d);
		},
		function(e) {
			if (fail)
				fail(e);
		});	
	},
	deleteDataIdIn: function(tbname, Id, success, fail) { //根据ID删除数据:'id1','id2','id3'
		var sql = "DELETE FROM " + tbname + " WHERE ID IN (" + Id + ")";
		SQLiteDB.executeSQL(sql, false,
		function(d) {
			if (success)
				success(d);
		},
		function(e) {
			if (fail)
				fail(e);
		});	
	},
	insertUpdateData: function(tbname, tbdata, success, fail) { //添加数据或者根据ID更新数据
		SQLiteDB.createTbSql(tbname, tbdata,
			function() { //创建表成功
				SQLiteDB.deleteDataIdIn(tbname, SQLiteDB.getIdInfo(tbdata),
				function(d) {
					SQLiteDB.insertData(tbname, tbdata, success, fail);
				},
				function(e) {
					if (fail)
						fail(e);
				});
			},
			function() { //创建表失败
				if (fail)
					fail(e);
			}
		);
	},
	insertUpdateDataAccount: function(account, tbname, tbdata, success, fail) { //添加数据或者根据ID更新数据
		SQLiteDB.createTbSql(tbname, tbdata,
			function() { //创建表成功
				var id = SQLiteDB.getIdInfo(tbdata)
				
				var wh = " WHERE ID IN (" + id + ")";
				if (null != account && "" != account){
					wh += (" AND ACCOUNT = '" + account + "'");
				} 
				
				SQLiteDB.deleteDataWhere(tbname, wh,
				function(d) {
					SQLiteDB.insertData(tbname, tbdata, success, fail);
				},
				function(e) {
					if (fail)
						fail(e);
				});
			},
			function() { //创建表失败
				if (fail)
					fail(e);
			}
		);
	},
	getIdInfo:function(tbdata) {
		var id = "";
		for(var i = 0,len = tbdata.length; i < len; i++){
			//使用for in 遍历对象属性
			var obj = tbdata[i];
			for(var key in obj){  
				if (key.toUpperCase() == "ID"){
					id +=  ("'" + obj[key] + "',");
				}
			}
		}
		
		id += ";,";
		id = id.replace(",;,", "");
		
		return id;
	}
};

setTimeout(function() {
	SQLiteDB.init();
}, 100);

/*
使用方法：
引入：<script src="js/common/mySQLite.js"></script>
参考代码：
function clearTable() {
    SQLiteDB.clearTable('testTb',
    function(data) {
        console.log(JSON.stringify(data))
    },
    function(e) {
        console.log(JSON.stringify(e))
    });
}
function deleteTb() {
    SQLiteDB.dropTable('testTb',
    function(data) {
        console.log(JSON.stringify(data))
    },
    function(e) {
        console.log(JSON.stringify(e))
    });
}

function select() {
    SQLiteDB.selectSQL('select * from testTb',
    function(data) {
        console.log(JSON.stringify(data))
    },
    function(e) {
        console.log(JSON.stringify(e))
    });
}
function insert() {
    var tbdata = [{
        fldGuid: guid(),
        name: '12345',
        sex: '1',
        state: '3',
        remark: '456789789',
    },
    {
        fldGuid: guid(),
        name: '123452232',
        sex: '2',
        state: '3',
        remark: '456789789',
    }]

    SQLiteDB.insertData('testTb', tbdata,
    function(e) {
        console.log(123123123);
    },
    function(e) {
        console.log(e)
    });
}

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
    function(c) {
        var r = Math.random() * 16 | 0,
        v = c == 'x' ? r: (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
*/
