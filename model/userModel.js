/**
 * Created by 58 on 2015/7/29.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
    name: String,
    password: String
}, {
    collection: 'myuser'
});

module.exports = mongoose.model('User', UserSchema);