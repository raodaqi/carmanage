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
	for(var i in data){	//遍历所有上传数据
		if(req.method == 'GET'){	//判断GET类型
			var value = req.query[i];	//获取GET请求的值
		}else{
			var value = req.body[i]; //获取POST请求的值
		}
		if(data[i]){ //如果这个键值存在描述，就为必须值
			//必须值
			if(!value){ //是必须值，但为空
				var result = { //设置报错返回值
					code : '302',
					message : '缺少'+data[i],
					data : []
				}
				res.send(result); //返回给前端
				return ''; //返回函数
			}
		}
		data[i] = value; //将data的描述值改为前端对应的值
	}
	return data; //返回函数值
}
// var currentUser = AV.User.current();

// 新建用户
router.post('/signup', function(req, res, next) {
	// console.log(req.currentUser);
	var data = {
		username : "账号",
		password : "密码",
		name 	 : "用户名",
		phone 	 : "联系方式"
    }
	var data = validate(res,req,data);
	if(!data){
		return;
	}
	// console.log(data);
	// 新建 AVUser 对象实例
  	var user = new AV.User();
  	// 设置用户名
  	user.setUsername(data.username);
  	// 设置密码
  	user.setPassword(data.password);
  	// 设置邮箱
    user.set("name",data.name);
    user.set("phone",data.phone);
  	// user.setEmail(data.email);
	user.signUp().then(function (loginedUser) {
		// console.log(loginedUser);
        // var user = new AV.User();
        // // 设置用户名
        // user.setUsername(data.username);
        // // 设置密码
        // user.setPassword(data.password);
        // AV.User.logIn(data.username, data.password).then(function (loginedUser) {
            res.saveCurrentUser(loginedUser);
            var result = {
                code : 200,
                data : loginedUser,
                message : '注册成功'
            }
            res.send(result);
        // }, function (error) {
        //     res.send(error)
        // });
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
  	// // 设置用户名
  	// user.setUsername(data.username);
  	// // 设置密码
  	// user.setPassword(data.password);
  	AV.User.logIn(data.username, data.password).then(function (loginedUser) {
  		console.log(loginedUser);
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
	var manage = req.currentUser ? req.currentUser.get('manage'):"";
    var id = req.currentUser ? req.currentUser.get('objectId'):"";
    // console.log(req.currentUser);
    // console.log(id);
    if(id){
        // res.json({
        //     username: req.currentUser.get('username')
        //   });
        var result = {
            code : 200,
            data : manage,
            user : req.currentUser,
            id : id,
            message : '获取权限成功'
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
router.get('/quit', function(req, res, next) {
    req.currentUser.logOut();
    res.clearCurrentUser();
        var result = {
            code : 200,
            message : '登出成功'
        }
        res.send(result);
})
// AS.build("/user",router);
module.exports = router;

