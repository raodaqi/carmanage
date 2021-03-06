'use strict';
var router = require('express').Router();
var AV = require('leanengine');
var AS = require('api-send');
// AS.config.APPID = "58f369a3a0bb9f006a9e2e2a";
// // AS.config.HOST = "http://carmanage.leanapp.cn";
// AS.config.HOST = "http://localhost:3000";
// AS = new AS();

function sendError(res,code,message){
	var result = {
		code:code,
		message:message,
		data:[]
	}
	res.send(result);
}

function validate(res,req,data){

	// if(!AS.add(req,data)){
	// 	res.send("123");
	// 	return;
	// }

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

var CarSpec = AV.Object.extend('CarSpec');

// 新增
router.post('/add', function(req, res, next) {
	var data = {
		type_id : "类型id",
		name    : "规格名称",
		price   : "价格"
    }
	var data = validate(res,req,data);
	if(!data){
		return;
	}
	var query = new AV.Query(CarSpec);
	query.equalTo('name',data.name);
	query.find().then(function(results) {
		//判断是否存在
		if(results.length){
			//存在
			var result = {
		   		code : 601,
		    	message : '规格已存在'
			}
			res.send(result);
		}else{
			//不存在
			//创建应用
			var addObj = new CarSpec();
			for(var key in data){
				addObj.set(key,data[key]);
			}
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
	var delObj = AV.Object.createWithoutData('CarSpec', data.id);
	delObj.destroy().then(function (success) {
		// 删除成功
		var result = {
		   	code : 200,
		   	data : [],
		    message : '项目已存在'
		}
		res.send(result);
	}, function(error) {
		res.send(error);
	}).catch(next);
})

// 编辑
router.post('/edit', function(req, res, next) {
	var data = {
		id  : 'id',
		price : "价格"
    }
	var data = validate(res,req,data);
	if(!data){
		return;
	}
	var editObj = AV.Object.createWithoutData('CarSpec', data.id);
	for(var key in data){
		editObj.set(key,data[key]);
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
		limit   : '',
       	skip    : '',
       	type_id : '类型id'
    }
	var data = validate(res,req,data);
	if(!data){
		return;
	}
	var limit = data.limit ? data.limit : 1000;
	var skip  = data.skip ? data.skip : 0;
	var query = new AV.Query('CarSpec');
	query.skip(skip);
	query.limit(limit);
	query.equalTo("type_id",data.type_id);
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

// 详情
router.get('/detail', function(req, res, next) {
	var data = {
		id  : 'id'
    }
	var data = validate(res,req,data);
	if(!data){
		return;
	}
	var query = new AV.Query('CarSpec');
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
router.get('/search', function(req, res, next) {
    var data = {
        keyword  : '关键字'
    }
    var data = validate(res,req,data);
    if(!data){
        return;
    }
    var query = new AV.Query('CarSpec');
    query.contains('name', data.keyword);
    query.find().then(function(results){
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

// AS.build("/carspec",router);
module.exports = router;