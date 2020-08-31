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
	
	// 详细信息
	owner.getDataOffLine = function(account, temptask_id, target_id, updateFlag, succesCB, errorCB) {
		console.log("---owner.getDataOffLine---" + temptask_id + "---" + target_id);

		mui.ajax(appUrl + '/com/neusoft/mle/app/action/sitecheck/sitecheckoffline.getData4OffLine.svc', {
			data: {
				temptask_id: temptask_id,
				target_id: target_id
			},
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: atimeout, //超时时间
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'Content-Type': 'application/json;charset=utf-8',
				'sso-token': token
			},
			success: function(data) {
				// console.log("---data---:" + JSON.stringify(data));
				
				//判断返回状态码，200-ture
				var stFlag = baseUtils.checkStatus(data);
				if(stFlag) {
					// 缓存数据
					var code = data.code;
					if(code != "1") {
						owner.insertDataError("加载的数据存在错误！", errorCB);
					} else {
						owner.insertUpdateDataOffLine(account, data.data, updateFlag,
						function(d) {
							if (succesCB){
								succesCB(temptask_id, target_id);
							}
						},
						function(e) {
						    owner.insertDataError(e, errorCB);
						});
					}
				} else {
					owner.insertDataError("错误状态码：" + data.status, errorCB);
				}			
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				owner.insertDataError("调用服务接口失败", errorCB);
			}
		});
	}
	
	owner.insertDataError = function(e, errorCB) {
		if (errorCB){
			errorCB("缓存失败！" + JSON.stringify(e));
		}
	}
	
	owner.insertUpdateDataOffLine = function(account, data, updateFlag, succesCB, errorCB) {
		console.log("---owner.insertUpdateDataOffLine data---:" + JSON.stringify(data));

		// temptasklist
		SQLiteDB.insertUpdateDataAccount(account, 'temptasklist', owner.addColAccount(account, data.temptasklist),
		function(d) {
			// console.log("---缓存数据：temptasklist---" + JSON.stringify(d))
			//temptaskdetail
			SQLiteDB.insertUpdateDataAccount(account, 'temptaskdetail', owner.addColAccount(account, data.temptaskdetail),
			function(d) {
				// console.log("---缓存数据：temptaskdetail---" + JSON.stringify(d))
				//task_type
				SQLiteDB.insertUpdateDataAccount(account, 'task_type', owner.addColAccount(account, data.task_type),
				function(d) {
					// console.log("---缓存数据：task_type---" + JSON.stringify(d))
					//task_source
					SQLiteDB.insertUpdateDataAccount(account, 'task_source', owner.addColAccount(account, data.task_source),
					function(d) {
						// console.log("---task_source---" + JSON.stringify(d))
						//task_assignment_type
						SQLiteDB.insertUpdateDataAccount(account, 'task_assignment_type', owner.addColAccount(account, data.task_assignment_type),
						function(d) {
							// console.log("---task_assignment_type---" + JSON.stringify(d))
							//instargetlist
							SQLiteDB.insertUpdateDataAccount(account, 'instargetlist', owner.addColAccount(account, data.instargetlist),
							function(d) {
								// console.log("---缓存数据：instargetlist---" + JSON.stringify(d))
								//instargetdetail
								SQLiteDB.insertUpdateDataAccount(account, 'instargetdetail', owner.addColAccount(account, data.instargetdetail),
								function(d) {
									// console.log("---缓存数据：instargetdetail---" + JSON.stringify(d))
									//target_type
									SQLiteDB.insertUpdateDataAccount(account, 'target_type', owner.addColAccount(account, data.target_type),
									function(d) {
										// console.log("---缓存数据：target_type---" + JSON.stringify(d))
										//ins_result
										SQLiteDB.insertUpdateDataAccount(account, 'ins_result', owner.addColAccount(account, data.ins_result),
										function(d) {
											// console.log("---缓存数据：ins_result---" + JSON.stringify(d))
											if (updateFlag){
												// 更新。不需要更新结果信息																							
												if (data.itemlist.length > 0){
													// 自定义任务有检查项
													//itemlist
													SQLiteDB.insertUpdateDataAccount(account, 'itemlist', owner.addColAccount(account, data.itemlist),
													function(d) {
														// console.log("---缓存数据：itemlist---" + JSON.stringify(d))
														if (succesCB){
															succesCB(d);
														}
													},
													function(e) {
													    if (errorCB){
															errorCB(e);
														}
													});
												} else {
													if (succesCB){
														succesCB(d);
													}
												}												
											} else {
												// 插入
												//resultdetail
												SQLiteDB.insertUpdateDataAccount(account, 'resultdetail', owner.addColAccount(account, data.resultdetail),
												function(d) {
													// console.log("---缓存数据：resultdetail---" + JSON.stringify(d))
													if (data.itemlist.length > 0){  
														// 自定义任务有检查项
														//itemlist
														SQLiteDB.insertUpdateDataAccount(account, 'itemlist', owner.addColAccount(account, data.itemlist),
														function(d) {
															// console.log("---缓存数据：itemlist---" + JSON.stringify(d))
															//itemresultdetaillist
															SQLiteDB.insertUpdateDataAccount(account, 'itemresultdetaillist', owner.addColAccount(account, data.itemresultdetaillist),
															function(d) {
																console.log("---itemresultdetaillist---" + JSON.stringify(d))
																if (succesCB){
																	succesCB(d);
																}
															},
															function(e) {
															    if (errorCB){
																	errorCB(e);
																}
															});
														},
														function(e) {
														    if (errorCB){
																errorCB(e);
															}
														});
													} else {
														if (succesCB){
															succesCB(d);
														}
													}	
												},
												function(e) {
												    if (errorCB){
														errorCB(e);
													}
												});
											}
										},
										function(e) {
										    if (errorCB){
												errorCB(e);
											}
										});
									},
									function(e) {
									    if (errorCB){
											errorCB(e);
										}
									});	
								},
								function(e) {
								    if (errorCB){
										errorCB(e);
									}
								});	
							},
							function(e) {
							    if (errorCB){
									errorCB(e);
								}
							});
						},
						function(e) {
						    if (errorCB){
								errorCB(e);
							}
						});
					},
					function(e) {
					    if (errorCB){
							errorCB(e);
						}
					});	
				},
				function(e) {
				    if (errorCB){
						errorCB(e);
					}
				});	
			},
			function(e) {
			    if (errorCB){
					errorCB(e);
				}
			});	
		},
		function(e) {
		    if (errorCB){
				errorCB(e);
			}
		});
	}
	
	owner.getCachedDataById = function(account, tbName, Id, succesCB, errorCB) {
		var sql = "select * from " + tbName + " where ID='" + Id + "'";
		if (null != account && "" != account){
			sql += (" AND ACCOUNT = '" + account + "'");
		}
		
		SQLiteDB.selectSQL(sql,
		function(d) {
			if (succesCB){
				succesCB(d);
			}
		},
		function(e) {
		    if (errorCB){
		    	errorCB(e);
		    }
		});
	}
	
	owner.getCachedDataByTbName = function(account, tbName, succesCB, errorCB) {
		var sql = 'select * from ' + tbName;
		if (null != account && "" != account){
			sql += (" WHERE ACCOUNT = '" + account + "'");
		}
		
		SQLiteDB.selectSQL(sql,
		function(d) {
			console.log("---owner.getCachedDataByTbName---d:" + JSON.stringify(d));
			if (succesCB){
				succesCB(d);
			}
		},
		function(e) {
		    if (errorCB){
		    	errorCB(e);
		    }
		});
	}
	
	owner.getCachedDataBySql = function(account, sql, succesCB, errorCB) {
		if (null != account && "" != account){
			if (sql.indexOf("where") >= 0 || sql.indexOf("WHERE") >= 0){
				sql += (" AND ACCOUNT = '" + account + "'");
			} else {
				sql += (" WHERE ACCOUNT = '" + account + "'");
			}
		}
	
	    SQLiteDB.selectSQL(sql,
	    function(d) {
	        if (succesCB){
				succesCB(d);
			}
	    },
	    function(e) {
	        if (errorCB){
	        	errorCB(e);
	        }
	    });
	}
	
	// owner.getTaskType = function(tbdata) {
	// 	console.log("---owner.getTaskType---" + JSON.stringify(tbdata));
	// 	var taskType = "";
	// 	for(var i = 0,len = tbdata.length; i < len; i++){
	// 		//使用for in 遍历对象属性
	// 		var obj = tbdata[i];
	// 		for(var key in obj){  
	// 			if (key.toUpperCase() == "TASK_TYPE"){
	// 				taskType = obj[key];
	// 				break;
	// 			}
	// 		}
			
	// 		if ("" != taskType){
	// 			break;
	// 		}
	// 	}
		
	// 	return taskType;
	// }
	
	
	// 更新缓存：
	// 删除不存在任务目标、不存在检查结果项（被重置检查）、已经完成的任务
	// 更新未完成的，但检查结果不更新
	owner.updateCachedData = function(account, succesCB, errorCB) {
		// 测试 开始
		// cachedDataUtils.dropCachedData(
		// 	function(d) {
		// 		cachedDataUtils.getCachedDataAll(account,
		// 			function(data) {
		// 				alert(data);
		// 			},
		// 			function(e) {
		// 				alert(e);
		// 			}
		// 		);
		// 	},
		// 	function(e) {
		// 		alert(e);
		// 		cachedDataUtils.getCachedDataAll(account,
		// 			function(data) {
		// 				alert(data);
		// 			},
		// 			function(e) {
		// 				alert(e);
		// 			}
		// 		);
		// 	}
		// );
		
		// cachedDataUtils.getCachedDataAll(account,
		// 	function(data) {
		// 		alert(data);
		// 		succesCB("更新成功！");
		// 		return;
		// 	},
		// 	function(e) {
		// 		alert(e);
		// 		succesCB("更新成功！");
		// 		return;
		// 	}
		// );
		
		// var objData = {
		// 	INS_RESULT: "测试",
		// 	INS_DEPICTION: "位置"
		// };
		// var colName = "WHERE ID";
		// var colValue = "ee04abff89734528876ef6b4887043d2"
		// var wh = colName +  "=" + colValue;
		// cachedDataUtils.updateCachedDataByColumn(account, "resultdetail", objData, wh, 
		// 	function(data) {
		// 		alert(data);
		// 	},
		// 	function(e) {
		// 		alert(e);
		// 	}
		// );
		
		// 测试 完成
		
		// 获取需要更新的数据
		owner.getTaskStargetId(account,
			function(arr) {
				console.log("taskID---objStarget:" + JSON.stringify(arr));
				
				// 递归更新数据：删除已经完成的，更新未完成的 【网上有结果信息，以网上为准】
				owner.updateCachedDataRecursive(account, arr, 0, succesCB, errorCB);
			},
			function(e) {
			    owner.insertDataError(e, errorCB);
			}
		);
	}
	
	owner.getTaskStargetId = function(account, succesCB, errorCB) {
		var sql = "SELECT TEMPTASK_ID, ID FROM instargetlist";
		if (null != account && "" != account){
			sql += (" WHERE ACCOUNT = '" + account + "'");
		}
		
		SQLiteDB.selectSQL(sql,
		function(stargetList) {
			console.log("---stargetList---" + JSON.stringify(stargetList));
			if (null != stargetList && stargetList.length > 0){
				var arr = [];
				for(var i = 0,len = stargetList.length; i < len; i++){
					var objStarget = stargetList[i];
					var obj = {};
					obj.taskID = objStarget["TEMPTASK_ID"];
					obj.targetID = objStarget["ID"];
					arr.push(obj);
				}
			
				succesCB(arr);
			} else {
				// 正常数据没有此种情况
				owner.insertDataError("本地没有离线任务目标！", errorCB);
			}
		},
		function(e) {
		    owner.insertDataError(e, errorCB);
		});
	}
	
	// 递归更新数据：
	owner.updateCachedDataRecursive = function(account, arr, index,  succesCB, errorCB) {
		console.log("---owner.updateCachedDataRecursive---arr.length=" + arr.length + "---index=" + index + "---arr:" + JSON.stringify(arr));
	
		if (index == arr.length){
			// 退出递归
			succesCB("更新成功！");
			return;
		}

		var temptask_id = arr[index].taskID;
		var target_id = arr[index].targetID;
		++index;
		
		mui.ajax(appUrl + '/com/neusoft/mle/app/action/sitecheck/sitecheckoffline.getTempTaskResults.svc', {
			data: {
				temptask_id: temptask_id,
				target_id: target_id
			},
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: atimeout, //超时时间
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'Content-Type': 'application/json;charset=utf-8',
				'sso-token': token
			},
			success: function(data) {
				console.log("---owner.updateCachedDataRecursive data---:" + JSON.stringify(data));
				
				//判断返回状态码，200-ture
				var stFlag = baseUtils.checkStatus(data);
				if(stFlag) {
					
					// 缓存数据
					if (data.data.tempTaskResults.length == 0 || (data.data.tempTaskResults.length > 0 && (data.data.tempTaskResults[0].INS_STATUS == "2" || data.data.tempTaskResults[0].INS_STATUS == "-1"))){
						// 任务目标不存在、检查结果项不存在（被重置检查）、已经完成，清除本地缓存
						if (data.data.tempTaskResults.length == 0){
							mui.toast("任务已经被修改，需要重新加载任务并删除之前的检查结果！");
						}
						
						owner.deleteCachedData(account, temptask_id, target_id, 
							function(d) {
								owner.updateCachedDataRecursive(account, arr, index, succesCB, errorCB);
							},
							errorCB
						);
					} else {
						// 未完成，更新本地缓存=》如果性能有问题，将来改为，每个页面更新。
						owner.getDataOffLine(account, temptask_id, target_id, true,
							function(d) {
								owner.updateCachedDataRecursive(account, arr, index, succesCB, errorCB);
							},
							errorCB
						);
					}
				} else {
					owner.insertDataError("错误状态码：" + data.status, errorCB);
				}			
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				owner.insertDataError("调用服务接口失败", errorCB);
			}
		});
	}
	
	// 删除数据
	owner.deleteCachedData = function(account, temptask_id, target_id, succesCB, errorCB) {
		console.log("---owner.deleteCachedData---temptask_id=" + temptask_id + "---target_id=" + target_id);
		
		// 首先删除target_id相关数据
		var objArr = [];
		var obj = {};
		obj.tbName = "instargetlist";
		obj.col = "ID";
		obj.val = target_id;
		objArr.push(obj);
		
		obj = {};
		obj.tbName = "instargetdetail";
		obj.col = "id";
		obj.val = target_id;
		objArr.push(obj);
		
		obj = {};
		obj.tbName = "resultdetail";
		obj.col = "INSTARGET_ID";
		obj.val = target_id;
		objArr.push(obj);
		
		obj = {};
		obj.tbName = "itemresultdetaillist";
		obj.col = "INSTARGET_ID";
		obj.val = target_id;
		objArr.push(obj);
		
		obj = {};
		obj.tbName = "resultdetailpic";
		obj.col = "INSTARGET_ID";
		obj.val = target_id;
		objArr.push(obj);
		
		owner.deleteCachedDataRecursive(account, objArr, 0, 
		function(d) {
			// 在删除temptask_id相关数据
			var tbName = "instargetlist";
			var sql = "select * from " + tbName + " where TEMPTASK_ID = '" + temptask_id + "'";
			cachedDataUtils.getCachedDataBySql(account, sql,
			function(d) {
				console.log("获取本地数据-----d--- "+JSON.stringify(d));

				if (d.length == 0){
					// 当前任务没有检查目标
					objArr = [];
					obj = {};
					obj.tbName = "temptasklist";
					obj.col = "ID";
					obj.val = temptask_id;
					objArr.push(obj);
					
					obj = {};
					obj.tbName = "temptaskdetail";
					obj.col = "id";
					obj.val = temptask_id;
					objArr.push(obj);
					
					obj = {};
					obj.tbName = "itemlist";
					obj.col = "TEMPTASK_ID";
					obj.val = temptask_id;
					objArr.push(obj);
					owner.deleteCachedDataRecursive(account, objArr, 0,  succesCB, errorCB);
				} else {
					succesCB("删除成功！");
				}
			},
			errorCB);
		},
		errorCB);
	}
	
	// 删除数据
	owner.deleteResultdetailpic = function(account, target_id, succesCB, errorCB) {
		console.log("---owner.deleteCachedData---target_id=" + target_id);
		var objArr = [];
		obj = {};
		obj.tbName = "resultdetailpic";
		obj.col = "ID";
		obj.val = target_id;
		objArr.push(obj);
		
		owner.deleteCachedDataRecursive(account, objArr, 0, succesCB, errorCB); 
	}

	owner.deleteCachedDataRecursive = function(account, arr, index, succesCB, errorCB) {
		console.log("---owner.deleteCachedDataRecursive---arr.length=" + arr.length + "---index=" + index + "---arr:" + JSON.stringify(arr));

		if (index == arr.length){
			// 退出递归
			succesCB("删除成功！");
			return;
		}
		
		var tbName = arr[index].tbName;
		
		var col = arr[index].col;
		var val = arr[index].val;
		
		var id = arr[index].id;
		++index;
		
		var wh = " WHERE " + col + "='" + val + "'";
		if (null != account && "" != account){
			wh += (" AND ACCOUNT = '" + account + "'");
		}
		
		SQLiteDB.deleteDataWhere(tbName, wh,
		function(d) {
			owner.deleteCachedDataRecursive(account, arr, index, succesCB, errorCB);
		},
		function(e) {
			console.log("---owner.deleteCachedDataRecursive---e:" + JSON.stringify(e));
			owner.deleteCachedDataRecursive(account, arr, index, succesCB, errorCB);
		});
	}

	// 删除本地缓存【表】
	owner.dropCachedData = function(succesCB, errorCB) {
		var tableArr = ["temptasklist", "temptaskdetail", "itemlist", "instargetlist","instargetdetail", "resultdetail",  "itemresultdetaillist", "task_type", "task_source", "task_assignment_type", "target_type", "ins_result", "resultdetailpic"];
		owner.dropCachedDataRecursive(tableArr, 0, succesCB, errorCB);
	}
	
	// 递归
	owner.dropCachedDataRecursive = function(arr, index, succesCB, errorCB) {
		console.log("---owner.dropCachedDataRecursive---arr.length=" + arr.length + "---index=" + index + "---arr:" + JSON.stringify(arr));
		
		if (index == arr.length){
			// 退出递归
			succesCB("删除成功！");
			return;
		}
		
		var tbName = arr[index];
		++index;
		
		SQLiteDB.dropTable(tbName,
			function(data) {
				owner.dropCachedDataRecursive(arr, index, succesCB, errorCB);
			},
			function(e) {
				console.log("---owner.dropCachedDataRecursive---tbName:" + tbName + "---e:" + JSON.stringify(e));
				owner.dropCachedDataRecursive(arr, index, succesCB, errorCB);
			}
		);
	}
	
	// 查询所有数据：主要用于测试
	owner.getCachedDataAll = function(account, succesCB, errorCB) {
		var tableArr = ["temptasklist", "temptaskdetail", "itemlist", "instargetlist","instargetdetail", "resultdetail",  "itemresultdetaillist", "task_type", "task_source", "task_assignment_type", "target_type", "ins_result", "resultdetailpic"];
		owner.getCachedDataAllRecursive(account, tableArr, 0, succesCB, errorCB);
	}
	
	// 递归
	owner.getCachedDataAllRecursive = function(account, arr, index, succesCB, errorCB) {
		console.log("---owner.getCachedDataAllRecursive---arr.length=" + arr.length + "---index=" + index + "---arr:" + JSON.stringify(arr));
		
		if (index == arr.length){
			// 退出递归
			succesCB("查询所有数据成功！");
			return;
		}
		
		var tbName = arr[index];
		++index;
		
		owner.getCachedDataByTbName(account, tbName,
			function(data) {
				console.log("---owner.getCachedDataAllRecursive---【" + tbName + "】---data---:" + JSON.stringify(data));
				owner.getCachedDataAllRecursive(account, arr, index, succesCB, errorCB);
			},
			function(e) {
				console.log("---owner.getCachedDataAllRecursive---【" + tbName + "】---e---" + JSON.stringify(e));
				owner.getCachedDataAllRecursive(account, arr, index, succesCB, errorCB);
			}
		);
	}
	
	owner.updateCachedDataByColumn = function(account, tbname, objData, wh, succesCB, errorCB) {
		if (null != account && "" != account){
			if (wh.indexOf("where") >= 0 || wh.indexOf("WHERE") >= 0){
				wh += (" AND ACCOUNT = '" + account + "'");
			} else {
				wh = " WHERE " + wh + " AND ACCOUNT = '" + account + "'";
			}
		}
		
		SQLiteDB.updateDataWh(tbname, objData, wh,
			function(d) {
				if (succesCB)
					succesCB("更新成功！");
			},
			function(e) {
				if (errorCB)
					errorCB("更新失败！失败原因：" + JSON.stringify(e));
			}
		);
	}
	
	owner.addColAccount = function(account, listData) {
		console.log("---owner.addColAccount---before:" + JSON.stringify(listData));

		if (null != account && "" != account){
			for (var i = 0; i < listData.length; i++) {
				var obj = listData[i];
				obj.ACCOUNT = account;
			}
		}
		
		console.log("---owner.addColAccount---after:" + JSON.stringify(listData));

		return listData;
	}
	
	owner.clearCachedData = function(account, succesCB, errorCB) {
		console.log("---owner.clearCachedData---account=" + account);
	
		var tableArr = ["temptasklist", "temptaskdetail", "itemlist", "instargetlist","instargetdetail", "resultdetail",  "itemresultdetaillist", "task_type", "task_source", "task_assignment_type", "target_type", "ins_result", "resultdetailpic"];
		owner.clearCachedDataRecursive(account, tableArr, 0, succesCB, errorCB);
	}
	
	owner.clearCachedDataRecursive = function(account, arr, index, succesCB, errorCB) {
		console.log("---owner.clearCachedDataRecursive---arr.length=" + arr.length + "---index=" + index + "---arr:" + JSON.stringify(arr));
	
		if (index == arr.length){
			// 退出递归
			succesCB("删除成功！");
			return;
		}
		
		var tbName = arr[index];
		++index;
		var wh = " WHERE ACCOUNT = '" + account + "'";
		SQLiteDB.deleteDataWhere(tbName, wh,
		function(d) {
			owner.clearCachedDataRecursive(account, arr, index, succesCB, errorCB);
		},
		function(e) {
			console.log("---owner.deleteCachedDataRecursive---e:" + JSON.stringify(e));
			owner.clearCachedDataRecursive(account, arr, index, succesCB, errorCB);
		});
	}
	
	owner.insertUpdateDataAccount = function(account, tbName, tbdata, succesCB, errorCB) {
		SQLiteDB.insertUpdateDataAccount(account, tbName, owner.addColAccount(account, tbdata),
		function(d) {
			// console.log("---缓存数据：itemlist---" + JSON.stringify(d))
			if (succesCB){
				succesCB(d);
			}
		},
		function(e) {
		    if (errorCB){
				errorCB(e);
			}
		});
	}

}(mui, window.cachedDataUtils = {}));