'use strict';
var router = require('express').Router();
var AV = require('leanengine');
var Promise = require("bluebird");

var fs = require('fs');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

function sendError(res,code,message){
	var result = {
		code:code,
		message:message,
		data:[]
	}
	res.send(result);
}

function validate(res,req,data){
	for(var i in data){
		if(req.method == 'GET'){
			var value = req.query[i];
		}else{
			var value = req.body[i];
		}
		if(data[i]){
			//必须值
			if(!value){
				var result = {
					code : '302',
					message : '缺少'+data[i],
					data : []
				}
				res.send(result);
				return '';
			}
		}
		data[i] = value;
	}
	return data;
}

var CarInfo = AV.Object.extend('CarInfo');
router.post('/fileup',multipartMiddleware, function(req, res, next){
	var photo = req.files.photo;
	var url;
	fs.readFile(photo.path, function(err, data){
        if(err)
            return res.send("读取文件失败");
        var base64Data = data.toString('base64');
        var theFile = new AV.File(photo.name, {base64: base64Data});
        theFile.save().then(function(theFile){
        	url = theFile.url();
           	// console.log(theFile.url());
            res.send(url);
        });
    });
})

function saveFile(i,fileArray,filePartData,callback){
		if(i >= fileArray.length){//判断是否是最后一个文件
			return callback.success(filePartData);//返回成功上传
		}
		var fileData = fileArray[i];//获取一个文件信息
		fs.readFile(fileData.path, function(err, data){//读取文件
	        if(err){//读取失败判断
				var data = "读取文件失败";
				return callback.error(data);//返回读取失败
			}
	        var base64Data = data.toString('base64');//将文件转为base64
	        var theFile = new AV.File(fileData.name, {base64: base64Data});//新建文件信息
	        theFile.save().then(function(theFileData){//保存文件信息
	        	var url = theFileData.attributes.url;//获取成功保存后的文件链接
				filePartData[fileData.fieldName] = url;//将文件name保存到数据
				saveFile(i+1,fileArray,filePartData,callback);//递归代用该方法
	        },function(error){
				console.log(error);
				return callback.error(data);//返回保存失败
			});
	    });
}

// 新增
router.post('/add',multipartMiddleware,function(req, res, next) {
	var data = {
		spec_id : '规格id',
		discount : '优惠信息',
		num :'库存'
    }
		// console.log(req.body);
		var data = validate(res,req,data);
		if(!data){
			return;
		}
	// var photo = req.files.photo;
	var fileData = {};
	var files = [];
	for(var i in req.files){
		files.push(req.files[i]);
	}
	saveFile(0,files,fileData,{
		success:function(fileData){
			if(!fileData || (fileData && !fileData.photo)){
				var result = {
					code : '302',
					message : '缺少车型图片',
					data : []
				}
				res.send(result);
				return;
			}else if(fileData && !fileData.car_spec){
				var result = {
					code : '302',
					message : '缺少配置图片',
					data : []
				}
				res.send(result);
				return;
			}
			data.url = fileData.photo;
			data.car_spec = fileData.car_spec;
			console.log(data);
			var query = new AV.Query(CarInfo);
			query.equalTo('url',data.url);
			query.find().then(function(results) {
				//判断是否存在
				if(results.length){
					//存在
					var result = {
				   		code : 601,
				    	message : '项目已存在'
					}
					res.send(result);
				}else{
					//不存在
					//创建应用
					var addObj = new CarInfo();
					for(var key in data){
						addObj.set(key,data[key]);
					}
					var car_all_img = [];
					addObj.set("car_all_img",car_all_img);
					addObj.save().then(function (addResult) {
				    	var result = {
				    		code : 200,
				    		data : addResult,
				    		message : '保存成功'
				    	}
				    	res.send(result);
					}, function (error) {
				    	var result = {
				    		code : 500,
				    		message : '保存出错'
				    	}
				    	res.send(result);
					});
				}
			}, function(err) {
				if (err.code === 101) {
					res.send(err);
		  		} else {
		      		next(err);
		    	}
			}).catch(next);
		},
		error:function(error){
			console.log(error);
		}
	});
	// console.log(req.body);
	// console.log(fileData);
	// return;
	// var data = validate(res,req,data);
	// if(!data){
	// 	return;
	// }
	// var query = new AV.Query(CarInfo);
	// query.equalTo('url',data.url);
	// query.find().then(function(results) {
	// 	//判断是否存在
	// 	if(results.length){
	// 		//存在
	// 		var result = {
	// 	   		code : 601,
	// 	    	message : '项目已存在'
	// 		}
	// 		res.send(result);
	// 	}else{
	// 		//不存在
	// 		//创建应用
	// 		var addObj = new CarInfo();
	// 		for(var key in data){
	// 			addObj.set(key,data[key]);
	// 		}
	// 		addObj.save().then(function (addResult) {
	// 	    	var result = {
	// 	    		code : 200,
	// 	    		data : addResult,
	// 	    		message : '保存成功'
	// 	    	}
	// 	    	res.send(result);
	// 		}, function (error) {
	// 	    	var result = {
	// 	    		code : 500,
	// 	    		message : '保存出错'
	// 	    	}
	// 	    	res.send(result);
	// 		});
	// 	}
	// }, function(err) {
	// 	if (err.code === 101) {
	// 		res.send(err);
  // 		} else {
  //     		next(err);
  //   	}
	// }).catch(next);
})

// 删除
router.get('/delete', function(req, res, next) {
	var data = {
		id  : 'id'
    }
	var data = validate(res,req,data);
	if(!data){
		return;
	}
	var delObj = AV.Object.createWithoutData('CarInfo', data.id);
	delObj.destroy().then(function (success) {
		// 删除成功
		var result = {
		   	code : 200,
		   	data : [],
		    message : '删除成功'
		}
		res.send(result);
	}, function(error) {
		res.send(error);
	}).catch(next);
})

// 编辑
router.post('/edit', function(req, res, next) {
	var data = {
		id  : 'id'
  }
	var data = validate(res,req,data);
	if(!data){
		return;
	}
	var editObj = AV.Object.createWithoutData('CarInfo', data.id);
	for(var key in data){
		editObj.set(key,data[key]);
	}
	if(req.body.car_all_img){
		editObj.set("car_all_img",JSON.parse(req.body.car_all_img));
	}
	editObj.save().then(function (editResult) {
		var result = {
		    code : 200,
		    data : editResult,
		    message : 'success'
		}
		res.send(result);
	}, function (error) {
		var result = {
		    code : 500,
		    message : '保存出错'
		}
		res.send(result);
	}).catch(next);
})

// 查找
router.get('/list', function(req, res, next) {
	var data = {
		spec_id : '规格id',
		limit : '',
       skip  : ''
    }
	var data = validate(res,req,data);
	if(!data){
		return;
	}
	var limit = data.limit ? data.limit : 1000;
	var skip  = data.skip ? data.skip : 0;
	var query = new AV.Query('CarInfo');
	query.skip(skip);
	query.limit(limit);
	query.equalTo("spec_id",data.spec_id);
	query.find().then(function (results) {
		// 删除成功
		var result = {
		   	code : 200,
		   	data : results,
		    message : '获取成功'
		}
		res.send(result);
	}, function(error) {
		res.send(error);
	}).catch(next);
})

function saveData(i,spec_data,spec_id_do,callback){
	if(i >= spec_data.length){
		//
		console.log("操作成功");
		callback.success();
		return;
	}
	var addObj = new CarInfo();
	for(var key in spec_data[i].attributes){
		addObj.set(key,spec_data[i].attributes[key]);
	}
	addObj.set("spec_id",spec_id_do);
	addObj.save().then(function (addResult) {
		console.log("保存成功");
		saveData(i+1,spec_data,spec_id_do,callback);
	}, function (error) {
		console.log("保存失败");
	});
}

//通过规格id添加到其他规格内
function doCopy(spec_id,spec_id_do,callback){
	var query = new AV.Query('CarInfo');
	query.equalTo("spec_id",spec_id);
	query.find().then(function (results) {
		// 删除成功
		// console.log(results);
		saveData(0,results,spec_id_do,callback)
	}, function(error) {
		res.send(error);
	});
}
// doCopy("59140a66a0bb9f005fc761b9","59140b2a44d904006c3d418a");

function copyType(i,spec_data,spec_id){
	if(i >= spec_data.length){
		//
		return;
	}
	if(spec_id == spec_data[i].id){
		copyType(i+1,spec_data,spec_id);
		return;
	}
	doCopy(spec_id,spec_data[i].id,{
		success:function(){
			copyType(i+1,spec_data,spec_id);
		}
	})
}

//直接获取种类
function doType(type_id,spec_id){
	var query = new AV.Query('CarSpec');
	query.equalTo("type_id",type_id);
	query.find().then(function (results) {
		// 删除成功
		copyType(0,results,spec_id);
	}, function(error) {
		console.log(error);
	});
}
// doType("591406c044d904006c3d14af","59210797a22b9d005876d1d6");

// 详情
router.get('/detail', function(req, res, next) {
	var data = {
		id  : 'id'
    }
	var data = validate(res,req,data);
	if(!data){
		return;
	}
	var query = new AV.Query('CarInfo');
	query.get(data.id).then(function(results){
		// 删除成功
		var result = {
		   	code : 200,
		   	data : results,
		    message : '获取成功'
		}
		res.send(result);
	}, function(error) {
		res.send(error);
	}).catch(next);
})

module.exports = router;
