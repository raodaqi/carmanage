/*!
 * 向后台发送数据
 * url(String):请求链接
 * type(String):请求类型
 * data(Object):请求参数
 */
function sendQuery(url,type,data,para){
   var dfd = $.Deferred(); // 生成Deferred对象
   //兼容form序列化数据提交
   if(data.length){
       var newData = {};
       for(var i = 0; i < data.length;i++){
           newData[data[i].name] = data[i].value;
       }
       data = newData;
   }
   //判断值是否为空
   for(var i in para){
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
   return dfd;}
/*!
 *carDelete
 *id(String) :id 必须值
 */
function carDelete(data){
   var url = "/car/delete";
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
   var url = "/car/edit";
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
   var url = "/car/add";
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
   var url = "/car/detail";
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
   var url = "/car/list";
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
   var url = "/user/login";
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
   var url = "/user/signup";
   var type = "POST";
   var para = {
    username : 1,
    password : 1
   }
   return sendQuery(url,type,data,para);
}
/*!
 *cartypeDelete
 *id(String) :id 必须值
 */
function cartypeDelete(data){
   var url = "/cartype/delete";
   var type = "GET";
   var para = {
    id : 1
   }
   return sendQuery(url,type,data,para);
}
/*!
 *cartypeList
 *limit(String) :
 *skip(String) :
 */
function cartypeList(data){
   var url = "/cartype/list";
   var type = "GET";
   var para = {
    limit : 0,
    skip : 0
   }
   return sendQuery(url,type,data,para);
}
/*!
 *cartypeAdd
 *name(String) :种类名称 必须值
 */
function cartypeAdd(data){
   var url = "/cartype/add";
   var type = "POST";
   var para = {
    name : 1
   }
   return sendQuery(url,type,data,para);
}
/*!
 *cartypeEdit
 *id(String) :id 必须值
 */
function cartypeEdit(data){
   var url = "/cartype/edit";
   var type = "POST";
   var para = {
    id : 1
   }
   return sendQuery(url,type,data,para);
}
/*!
 *cartypeDetail
 *id(String) :id 必须值
 */
function cartypeDetail(data){
   var url = "/cartype/detail";
   var type = "GET";
   var para = {
    id : 1
   }
   return sendQuery(url,type,data,para);
}
/*!
 *carspecAdd
 *type_id(String) :类型id 必须值
 *name(String) :规格名称 必须值
 */
function carspecAdd(data){
   var url = "/carspec/add";
   var type = "POST";
   var para = {
    type_id : 1,
    name : 1
   }
   return sendQuery(url,type,data,para);
}
/*!
 *carspecEdit
 *id(String) :id 必须值
 */
function carspecEdit(data){
   var url = "/carspec/edit";
   var type = "POST";
   var para = {
    id : 1
   }
   return sendQuery(url,type,data,para);
}
/*!
 *carspecDetail
 *id(String) :id 必须值
 */
function carspecDetail(data){
   var url = "/carspec/detail";
   var type = "GET";
   var para = {
    id : 1
   }
   return sendQuery(url,type,data,para);
}
/*!
 *carspecList
 *limit(String) :
 *skip(String) :
 */
function carspecList(data){
   var url = "/carspec/list";
   var type = "GET";
   var para = {
    limit : 0,
    skip : 0
   }
   return sendQuery(url,type,data,para);
}
/*!
 *carspecDelete
 *id(String) :id 必须值
 */
function carspecDelete(data){
   var url = "/carspec/delete";
   var type = "GET";
   var para = {
    id : 1
   }
   return sendQuery(url,type,data,para);
}
