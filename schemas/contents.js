/**
 * Created by NewNet on 2017/5/23.
 */

var mongoose = require('mongoose');

//�û���ṹ
module.exports = new mongoose.Schema({

    //�����ֶ� - ���ݷ���id
    categroy:{
        //����
        type:mongoose.Schema.Types.ObjectId,
        //����
        ref: 'Categroy'
    },
    //�������
    title :String ,
    //�����ֶ� - �û�
    user:{
        //����
        type:mongoose.Schema.Types.ObjectId,
        //����
        ref: 'User'
    },
    addTime:{
        type:Date,
        default:new Date()
    },
    //�Ķ���
    views:{
        type:Number,
        default:0
    },
    //���
    desc: {
        type:String,
        default:""
    },
    //����
    content:{
        type:String,
        default:""
    },
    //����
    comments:{
        type:Array,
        default:[]
    }
});

