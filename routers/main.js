/**
 * Created by NewNet on 2017/5/23.
 */

var express = require('express');
var router = express.Router();
var Categroy = require('../models/Categroy');
var Content = require('../models/Content');

var data ;
//处理通用数据
router.use(function (req, res, next) {
    data = {
        userInfo:req.userInfo,
        categroies:[]
    };

    Categroy.find().then(function (categroies){
          data.categroies = categroies ;
          next();
    })
});
//首页
router.get('/',function(req,res,next){
    //console.log
    //data ={
    //    categroy:req.query.categroy || "",
    //    page : Number(req.query.page || 1) ,
    //    limit : 2 ,
    //    pages : 0 ,
    //    count : 0,
    //}
    data.categroy = req.query.categroy || "";
    data.page = Number(req.query.page || 1);
    data.limit = 2 ;
    data.pages = 0;
    data.count = 0 ;

    var where = {} ;
    if(data.categroy){
        where.categroy = data.categroy ;
    }

    Content.where(where).count().then(function (count) {

        data.count = count ;
        //计算总页数
        data.pages = Math.ceil(data.count / data.limit);
        //取值不能超过pages
        data.page = Math.min(data.page, data.pages);
        //取值不能小于1
        data.page = Math.max(data.page, 1)

        var skip = (data.page - 1) * data.limit;

        return Content.where(where).find().sort({_id: -1}).limit(data.limit).skip(skip).populate(['categroy','user']).sort({addTime:-1});

    }).then(function (contents) {
        //console.log(contents)
        data.contents = contents ;
        res.render('main/index',data)
    });
})

//内容详情页
router.get('/view', function (req,res) {
    var contentId = req.query.contentid || "";

    Content.findOne({
        _id:contentId
    }).populate(['user']).then(function (content) {
        //console.log(content)
        data.content = content ;

        content.views ++ ;

        content.save();
        //console.log(data)
        res.render('main/view',data);
    });
});

module.exports = router ;