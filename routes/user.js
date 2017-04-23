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

// 新建用户
router.post('/signup', function(req, res, next) {
	var data = {
		username : "用户名",
		password : "密码",
    }
	var data = validate(res,req,data);
	if(!data){
		return;
	}
	// 新建 AVUser 对象实例
  	var user = new AV.User();
  	// 设置用户名
  	user.setUsername(data.username);
  	// 设置密码
  	user.setPassword(data.password);
  	// 设置邮箱
  	// user.setEmail(data.email);
	user.signUp().then(function (loginedUser) {
    	var result = {
		   	code : 200,
		   	data : loginedUser,
		    message : '注册成功'
		}
		res.send(result);
  	}, function (error) {
  		res.send(error)
  	});
})

// 新建登录
router.post('/login', function(req, res, next) {
	var data = {
		username : "用户名",
		password : "密码"
    }
	var data = validate(res,req,data);
	if(!data){
		return;
	}
	// 新建 AVUser 对象实例
  	var user = new AV.User();
  	// 设置用户名
  	user.setUsername(data.username);
  	// 设置密码
  	user.setPassword(data.password);
  	AV.User.logIn(data.username, data.password).then(function (loginedUser) {
  		res.saveCurrentUser(loginedUser);
    	var result = {
		   	code : 200,
		   	data : loginedUser,
		    message : '登录成功'
		}
		res.send(result);
  	}, function (error) {
  		res.send(error)
  	});
})

router.get('/getUser',function(req, res, next){
	var name = req.currentUser.get('username');
	console.log(name);
	if(name){
		// res.json({
  //     username: req.currentUser.get('username')
  //   });
  		var result = {
		   	code : 200,
		   	data : name,
		    message : '获取用户名成功'
		} 
		res.send(result);
	}
    else{
    	var result = {
		   	code : 300,
		    message : '用户未登录'
		} 
		res.send(result);
    }
})

router.get('/detail', function(req, res, next) {
	var data = {
		id : 'id'
    }
	var data = validate(res,req,data);
	if(!data){
		return;
	}
	var query = new AV.Query('_User');
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
router.get('/list', function(req, res, next) {
	var data = {
		limit   : '',
       	skip    : ''     	
    }
	var data = validate(res,req,data);
	if(!data){
		return;
	}
	var limit = data.limit ? data.limit : 1000;
	var skip  = data.skip ? data.skip : 0;
	var query = new AV.Query('_User');
	query.skip(skip);
	query.limit(limit);
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
// AS.build("/user",router);
module.exports = router;

