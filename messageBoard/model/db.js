//封装了所有对数据库的操作
var mongodb = require('mongodb').MongoClient;
var url=require('./url')
function _connectDB(callback) {
    //链接数据库
    mongodb.connect(url.url, function (err, db) {
        if (err) {
            console.log('失败成功');
            return;
        }
        console.log('链接成功');
        callback(err, db);
    });
};

//插入数据 链接的数据库  插入数据  会掉函数
exports.insertOne = function (collecionName, json, callback) {
    _connectDB(function (err, db) {
        //设置链接的数据库  插入数据  会掉函数
        db.collection(collecionName).insertOne(json, function (err, result) {
            //将回调函数扔出来
            callback(err, result);
            db.close();
        });
    })
};
//查找数据 查找所有的数据     数据库名称   查询条件 分页  回调函数
exports.find = function (collecionName, json, fenye, callback) {
    //结果数组
    var result = [];
    //每页几个
    var pageSize=fenye.pageSize;
    //第几页
    var pageIndex=(fenye.pageIndex-1)*20;
    _connectDB(function (err, db) {
        var cursor = db.collection(collecionName).find(json).skip(pageIndex).limit(pageSize).sort({"id":-1});
        cursor.each(function (err, doc) {
            if (err) {
                callback(err, null);
                return;
            }
            if (doc != null) {
                //循环将结果返回
                result.push(doc);
            } else {
                //便利结束
                callback(null, result);
            }
        })
    })
};
//删除
exports.deleteMany=function(collecionName,json,callback){
    _connectDB(function (err, db) {
        db.collection(collecionName).deleteMany(json,function(err,result){
            callback();
        })
    });
};
//修改  数据库名称 找到数据  改变数据  回调函数
exports.updateMany=function(collecionName,json1,json2,callback){
    _connectDB(function (err, db) {
        db.collection(collecionName).updateMany(json1,json2,function(err,result){
            callback();
        })
    });
};