/**
 * Created by NewNet on 2017/5/23.
 */

var mongoose = require('mongoose');

//�û���ṹ
module.exports = new mongoose.Schema({

    //�û���
    username :String ,
    //����
    password :String ,
    //�Ƿ��ǹ���Ա
    isAdmin : {
        type :Boolean,
        default: false
    }
});

