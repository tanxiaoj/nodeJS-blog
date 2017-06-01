/**
 * Created by NewNet on 2017/5/24.
 */
var mongoose = require('mongoose');

var contentsSchema = require('../schemas/contents');

module.exports = mongoose.model('Content',contentsSchema);