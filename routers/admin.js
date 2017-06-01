/**
 * Created by NewNet on 2017/5/23.
 */

var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Categroy = require('../models/Categroy');
var Content = require('../models/Content');
//router.get('/user',function(req,res,next){
//    res.send('admin-User');
//})
router.use(function (req,res,next) {
    if(!req.userInfo.isAdmin){
        //如果用户不是管理员
        res.send('对不起，只有管理员才能进入后台管理');
        return ;
    }
    next();
});

//后台管理首页
router.get('/', function (req,res,next) {
    res.render('admin/index',{
        userInfo :req.userInfo
    });
})

//分页
router.get('/user',function(req,res){

    //从数据库中读取所有用户数据
    //limit(Number) 限制获取条数
    //skip：忽略数据的条数

    //每页显示2条
    //*1:1-2 skip 0  => (当前页-1) *limit
    //*2:3-4 skip 2

    var page = Number(req.query.page || 1) ;
    var limit = 4 ;
    var pages = 0;
    User.count().then(function(count){
        //console.log(count)
        //计算总页数
        pages = Math.ceil(count/limit);
        //取值不能超过pages
        page = Math.min(page,pages);
        //取值不能小于1
        page = Math.max(page,1)

        var skip = (page - 1) *limit ;

        User.find().limit(limit).skip(skip).then(function (users) {
            res.render('admin/user_index',{
                userInfo:req.userInfo ,
                users:users,
                page:page,
                count:count,
                limit:limit,
                pages:pages
            });
        });
    });


});

//分类首页
router.get('/categroy', function (req,res) {
    var page = Number(req.query.page || 1) ;
    var limit = 4 ;
    var pages = 0;
    Categroy.count().then(function(count){
        //console.log(count)
        //计算总页数
        pages = Math.ceil(count/limit);
        //取值不能超过pages
        page = Math.min(page,pages);
        //取值不能小于1
        page = Math.max(page,1)

        var skip = (page - 1) *limit ;

        //1 升序  -1降序

        Categroy.find().sort({_id:-1}).limit(limit).skip(skip).then(function (categroies) {
            //console.log(categroies)
            res.render('admin/categroy_index',{
                userInfo:req.userInfo ,
                categroies:categroies,
                page:page,
                count:count,
                limit:limit,
                pages:pages
            });
        });
    });
});

//分类添加
router.get('/categroy/add', function (req,res) {
    res.render('admin/categroy_add',{
        userInfo:req.userInfo
    });
});

//分类保存
router.post('/categroy/add',function(req,res){
    //console.log(req.body)
    var name = req.body.name || "";

    if(name == ""){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message :"名称不能为空"
        })
        return ;
    }

    //数据库中是否已经存在相同名称
    Categroy.findOne({
        name :name
    }).then(function (rs) {
        if(rs){
            //数据库中已经存在该分类
            res.render('admin/error',{
                userInfo:req.userInfo,
                message :"分类已存在了"
            })
            return Promise.reject();
        }else{
            //数据库中不存在该分类
            return new Categroy({
                name:name
            }).save();
        }
    }).then(function (newCategroy) {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:"分类保存成功",
            url:"/admin/categroy"
        })
    });
});

//分类修改
router.get('/categroy/edit',function(req,res){
    //获取要修改的分类信息，并且表单形式展示出来

    var id = req.query.id || "";

    //获取要修改分类信息
    Categroy.findOne({
        _id:id
    }).then(function(categroy){

        if(!categroy){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:"分类信息不存在"
            })
            return Promise.reject();
        }else{
            res.render('admin/categroy_edit',{
                userInfo:req.userInfo,
                categroy:categroy
            })
        }
    });
});

//修改分类保存
router.post('/categroy/edit',function(req,res){
    var id = req.query.id || "";
    //获取post提交过来的名称
    var name = req.body.name || "";

    //获取要修改分类信息
    Categroy.findOne({
        _id:id
    }).then(function(categroy){

        if(!categroy){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:"分类信息不存在"
            })
            return Promise.reject();
        }else{
            //当用户没有任何的修改提交的时候
            if(name == categroy.name){
                res.render('admin/success',{
                    userInfo:req.userInfo,
                    message:"修改成功",
                    url:'/admin/categroy'
                })
                return Promise.reject();
            }
            //要修改的分类名称是否已经在数据库中存在
            else{
                return Categroy.findOne({
                    _id:{$ne:id},
                    name:name
                });
            }

            //res.render('admin/categroy_edit',{
            //    userInfo:req.userInfo,
            //    categroy:categroy
            //})
        }
    }).then(function (sameCategroy) {
        if(sameCategroy){
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: "数据库中已经存在同名分类"
            })
            return Promise.reject();
        }else{
            return Categroy.update({
                _id:id
            },{
                name: name
            })
        }
    }).then(function () {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:"修改成功",
            url:'/admin/categroy'
        })
        return Promise.reject();
    });
});

//分类删除
router.get("/categroy/delete", function (req,res) {
    //获取要删除的分类id
    var id = req.query.id || "";

    Categroy.remove({
        _id:id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: "删除成功",
            url: '/admin/categroy'
        })
    });
})

//内容首页
router.get('/content', function (req,res) {
    var page = Number(req.query.page || 1) ;
    var limit = 4 ;
    var pages = 0;
    Content.count().then(function(count) {
        //console.log(count)
        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min(page, pages);
        //取值不能小于1
        page = Math.max(page, 1)

        var skip = (page - 1) * limit;

        //1 升序  -1降序

        Content.find().sort({addTime:-1}).limit(limit).skip(skip).populate(['categroy','user']).then(function (contents) {
            //console.log(contents)
            res.render('admin/content_index', {
                userInfo: req.userInfo,
                contents: contents,
                page: page,
                count: count,
                limit: limit,
                pages: pages
            });
        });
    });
});

//内容添加页面
router.get('/content/add', function (req,res) {

    Categroy.find().sort({_id:-1}).then(function (categroies) {
        res.render('admin/content_add',{
            userInfo:req.userInfo,
            categroies:categroies
        });
    })
});

//内容保存
router.post('/content/add', function (req,res) {
    if(req.body.categroy == ""){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:"分类内容不能为空"
        });
        return ;
    }
    if(req.body.title == ""){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:"标题不能为空"
        });
        return ;
    }
    //保存到数据库
    new Content({
        categroy:req.body.categroy,
        title:req.body.title,
        user:req.userInfo._id.toString(),
        desc:req.body.desc,
        content:req.body.content
    }).save().then(function (rs) {
            res.render('admin/success',{
                userInfo:req.userInfo,
                message:"内容保存成功",
                url :'/admin/content'
            });
        });
});

//修改内容
router.get('/content/edit', function (req,res) {
    var id = req.query.id || "";

    var categroies = [] ;

    Categroy.find().sort({_id:-1}).then(function (rs) {
        categroies = rs ;
        return Content.findOne({
            _id:id
        }).populate('categroy');
    }).then(function (content) {
        //console.log(content)
        if(!content){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:"指定内容不存在"
            });
            return Promise.reject();
        }else{
            res.render('admin/content_edit',{
                userInfo:req.userInfo,
                categroies:categroies,
                content:content
            });
        }
    });


});

//保存修改内容
router.post('/content/edit', function (req,res) {
    var id = req.query.id || "";

    if(req.body.categroy == ""){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:"分类内容不能为空"
        });
        return ;
    }
    if(req.body.title == ""){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:"标题不能为空"
        });
        return ;
    }

    Content.update({
        _id:id
    },{
        categroy:req.body.categroy,
        title:req.body.title,
        desc:req.body.desc,
        content:req.body.content
    }).then(function(){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:"内容修改成功",
            url:'/admin/content'
        })
    })
});

//内容删除
router.get('/content/delete', function (req,res) {
    var id = req.query.id || "";

    Content.remove({
        _id:id
    }).then(function () {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:"内容删除成功",
            url:'/admin/content'
        })
    });
})

module.exports = router ;