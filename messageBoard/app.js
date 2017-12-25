var express = require("express");
var ejs =require('ejs');
var db=require('./model/db');
var multer = require('multer');
//post获取参数
var bodyParser = require('body-parser');

var app = express();
//获取post参数要放在前面
//通过这个bodyParser 得到post的参数
//使用这个中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//修改 views默认文件夹
app.set("views","webapp");
app.set("view engine","ejs");


app.use(express.static("./webapp"));


var index=0;
var whoSay="me";
var theMaxSize=0;
//获取总个数
db.find("text", {},{ "pageSize": 0, "pageIndex": 1},function (err,result) {
    theMaxSize = result.length;
    console.log(theMaxSize);
});
//查询数据
app.post("/find", function (req, res) {
    db.find("text", {}, { "pageSize": 20, "pageIndex": req.body.pageIndex}, function (err, result) {
        res.json(result);
    })
});
//插入
app.get("/insert", function (req, res) {
    index++;
    if(index%2==0){
        whoSay="you";
    }else{
        whoSay="me";
    }
    db.insertOne("text", { "who": whoSay, "say": "今天天气怎么样"+index,"id":index},function (err,result) {
        res.send('插入成功');
    })
});

//插入自定义数据
app.get('/insert1',function (req,res) {
    theMaxSize++;
    var theText=req.query.text;
    db.insertOne("text", { "who": "you", "say": theText+'____' + theMaxSize, "id": theMaxSize }, function (err, result) {
        //插入成功后 跳转到第一页
        db.find("text", {}, { "pageSize": 20, "pageIndex": 1 }, function (err, result) {
            res.json(result);
        })
    })
});
//删除
app.post('/delete',function (req,res) {
    var theId = parseInt(req.body.theId);
    db.deleteMany('text', { "id": theId},function (err,result) {
        console.log('删除成功');
        //删除成功后 跳转到第一页
        db.find("text", {}, { "pageSize": 20, "pageIndex": 1 }, function (err, result) {
            res.json(result);
        })        
    });
});


app.listen(3000);