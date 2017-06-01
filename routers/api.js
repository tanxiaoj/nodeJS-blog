/**
 * Created by NewNet on 2017/5/23.
 */

var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Content = require('../models/Content');
//router.get('/user',function(req,res,next){
//    res.send('api-User');
//})


//统一返回格式
var responseData ;
router.use(function (req,res,next) {
    responseData = {
        code: 0,
        message: ''
    }
    next();
})
//用户注册
//注册逻辑
// 1.用户名不能为空
//2.密码为空
//3.两次密码必须一致

//1.用户是否已经被注册了
//  数据库查询
router.post('/user/register', function (req,res,next) {
    //console.log(req.body)
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;

    if(username == ""){
        responseData.code = 1;
        responseData.message = "用户名不能为空";
        res.json(responseData);
        return ;
    }

    if(password == ""){
        responseData.code = 2;
        responseData.message = "密码不能为空";
        res.json(responseData);
        return ;
    }

    if(password != repassword){
        responseData.code = 3;
        responseData.message = "两次输入密码不一致";
        res.json(responseData);
        return ;
    }

    //用户名是否已经注册了，如果数据库中已经有了和我们注册的用户名相同，表示已经注册
    User.findOne({
        username:username
    }).then(function(userInfo){
        //console.log(userInfo)
        if(userInfo){
            //表示数据库中有该记录
            responseData.code = 4 ;
            responseData.message = "用户名已经被注册";
            res.json(responseData);
            return;
        }
        var user = new User({
            username:username,
            password:password
        });
        return user.save();
    }).then(function (newUserInfo) {
        //console.log(newUserInfo)
        responseData.message = "注册成功";
        res.json(responseData);
    });

});

//用户登录
router.post('/user/login', function(req,res){
    var username = req.body.username;
    var password = req.body.password ;

    if(username=="" || password==""){
        responseData.code = 1;
        responseData.message = "用户名和密码不能为空";
        res.json(responseData);
        return ;
    }

    //查询数据库中相同用户名和密码记录是否存在，如果存在则登录成功
    User.findOne({
        username:username,
        password:password
    }).then(function (userInfo) {
        if(!userInfo){
            responseData.code = 2;
            responseData.message = "用户名或密码错误";
            res.json(responseData);
            return ;
        }
        //用户名和密码正确
        responseData.message = "登录成功";
        responseData.userInfo = {
            _id:userInfo._id,
            username:userInfo.username
        };
        req.cookies.set('userInfo',JSON.stringify({
            _id:userInfo._id,
            username:userInfo.username
        }));
        res.json(responseData);
        return ;
    });
});

//退出
router.get('/user/logout', function(req,res){
    req.cookies.set('userInfo',null);
    res.json(responseData);
})

//获取指定文章的所有评论
router.get('/comment',function(req,res){
    var contentId = req.query.contentid || "";

    Content.findOne({
        _id:contentId
    }).then(function (content) {
        responseData.data = content.comments;
        res.json(responseData);
    });
});

//评论提交
router.post('/comment/post', function (req,res) {
    //内容id
    var contentId = req.body.contentid || "";
    //console.log(req.body)
    var postData = {
        username:req.userInfo.username,
        postTime:new Date(),
        content:req.body.content
    };
    //查询这篇文章内容信息
    Content.findOne({
        _id:contentId
    }).then(function (content) {
        content.comments.push(postData);
        return content.save();
    }).then(function (newContent) {
        responseData.message= "评论成功";
        responseData.data = newContent ;
        res.json(responseData);
    });
});

module.exports = router ;