/**
 * Created by NewNet on 2017/5/24.
 */
var mongoose = require('mongoose');

var usersSchema = require('../schemas/users');

module.exports = mongoose.model('User',usersSchema);