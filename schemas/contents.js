/**
 * Created by NewNet on 2017/5/23.
 */

var mongoose = require('mongoose');

//用户表结构
module.exports = new mongoose.Schema({

    //关联字段 - 内容分类id
    categroy:{
        //类型
        type:mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'Categroy'
    },
    //分类标题
    title :String ,
    //关联字段 - 用户
    user:{
        //类型
        type:mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'User'
    },
    addTime:{
        type:Date,
        default:new Date()
    },
    //阅读量
    views:{
        type:Number,
        default:0
    },
    //简介
    desc: {
        type:String,
        default:""
    },
    //内容
    content:{
        type:String,
        default:""
    },
    //评论
    comments:{
        type:Array,
        default:[]
    }
});

