/**
 * Created by NewNet on 2017/5/24.
 */
var mongoose = require('mongoose');

var categroiesSchema = require('../schemas/categories');

module.exports = mongoose.model('Categroy',categroiesSchema);