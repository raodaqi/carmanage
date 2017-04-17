/*!
 * 向后台发送数据
 * url(String):请求链接
 * type(String):请求类型
 * data(Object):请求参数
 */
function sendQuery(url,type,data,para){
   var dfd = $.Deferred(); // 生成Deferred对象
   console.log(data);
   if(data.length){
    var newData = {};
    for(var i = 0; i < data.length;i++){
      newData[data[i].name] = data[i].value;
    }
    data = newData;
   }
   //判断值是否为空
   for(var i in para){
    console.log(data)
       if(para[i] && !data[i]){
           var result = {
               code:302,
               message:"缺少"+i,
               data:[]
           }
           dfd.reject(result);
           return dfd;
       }
   }
   $.ajax({
       type: type,
       url: url,
       data: data,
       dataType: "json"
       }).then(function(result){
           if(result.code == 200){
               dfd.resolve(result);
           }else{
               dfd.reject(result);
           }
       },function(error){
           var result = {
               code:404,
               message:"服务器出错",
               data:[]
           }
           dfd.reject(result);
       })
}
/*!
 *carDelete
 *id(String) :id 必须值
 */
function carDelete(data){
   var url = "http://localhost:3000/car/delete";
   var type = "GET";
   var para = {
    id : 1
   }
   return sendQuery(url,type,data,para);
}
/*!
 *carEdit
 *id(String) :id 必须值
 */
function carEdit(data){
   var url = "http://localhost:3000/car/edit";
   var type = "POST";
   var para = {
    id : 1
   }
   return sendQuery(url,type,data,para);
}
/*!
 *carAdd
 */
function carAdd(data){
   var url = "http://localhost:3000/car/add";
   var type = "POST";
   var para = {
   }
   return sendQuery(url,type,data,para);
}
/*!
 *carDetail
 *id(String) :id 必须值
 */
function carDetail(data){
   var url = "http://localhost:3000/car/detail";
   var type = "GET";
   var para = {
    id : 1
   }
   return sendQuery(url,type,data,para);
}
/*!
 *carList
 *limit(String) :
 *skip(String) :
 */
function carList(data){
   var url = "http://localhost:3000/car/list";
   var type = "GET";
   var para = {
    limit : 0,
    skip : 0
   }
   return sendQuery(url,type,data,para);
}
/*!
 *userLogin
 *username(String) :用户名 必须值
 *password(String) :密码 必须值
 */
function userLogin(data){
   var url = "http://localhost:3000/user/login";
   var type = "POST";
   var para = {
    username : 1,
    password : 1
   }
   return sendQuery(url,type,data,para);
}
/*!
 *userSignup
 *username(String) :用户名 必须值
 *password(String) :密码 必须值
 */
function userSignup(data){
   var url = "http://localhost:3000/user/signup";
   var type = "POST";
   var para = {
    username : 1,
    password : 1
   }
   return sendQuery(url,type,data,para);
}
