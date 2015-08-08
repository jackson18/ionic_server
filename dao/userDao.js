/**
 * Created by 58 on 2015/7/29.
 */
var ObjectID = require('mongodb').ObjectID;
var userModel = require('../model/userModel');
var conf = require('../util/conf');

/**
 * 新增用户
 * @param option
 * @param callback
 */
var addUser = function(option, callback) {
    var newUser = new userModel({
        name: option.name,
        password: option.password
    });
    newUser.save(function(err, user) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, user);
        }
    });
};

/**
 * 根据id删除用户
 * @param id
 * @param callback
 */
var deleteUserById = function(id, callback) {
    findUserById(id, function(err, doc) {
        if (err) {
            callback(err);
        } else {
            doc.remove();
            callback(null);
        }
    });
};

/**
 * 更新用户信息
 * @param option
 * @param callback
 */
var updateUser = function(option, callback) {
    findUserById(option.id, function(err, doc) {
        if (err) {
            callback(err);
        } else {
            doc.name = option.name;
            doc.password = option.password;
            doc.save(function(err, user) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, user);
                }
            });
        }
    });
};

/**
 * 根据id查找用户
 * @param id
 * @param callback
 */
var findUserById = function(id, callback) {
    userModel.findOne({_id: id}, function(err, doc) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, doc);
        }
    });
};

/**
 * 查找所有用户信息
 * @param callback
 */
var findAllUser = function(callback) {
    userModel.find({}, callback);
};

/**
 * 返回某一页所有用户
 * @param pageNum
 * @param pageSize
 * @param callback
 */
var findUserByPage = function(pageNum, pageSize, callback) {
    userModel.find({}).skip((pageNum - 1) * pageSize).limit(pageSize).exec(function(err, docs) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, docs);
        }
    });
};

/**
 *
 * @param pageNum
 * @param pageSize
 * @param sortType
 * @param callback
 */
var getUserByPageAndIdSort = function(pageNum, pageSize, sortType, callback) {
    userModel.find({}).sort({_id: sortType}).skip((pageNum - 1) * pageSize).limit(pageSize).exec(function(err, docs) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, docs);
        }
    });
};

/**
 *
 * @param pageNum
 * @param pageSize
 * @param id
 * @param sortType
 * @param loadType
 * @param callback
 */
var getUserByLoading = function(pageNum, pageSize, id, sortType, loadType, callback) {
  if (!id) {
      userModel.find({}).sort({_id: sortType}).skip((pageNum - 1) * pageSize).limit(pageSize).exec(function(err, docs) {
          if (err) {
              callback(err, null);
          } else {
              callback(null, docs);
          }
      });
  } else {
      var queryStr = {};
      if (loadType === conf.load_up) {
          queryStr.$lt = ObjectID(id);
      } else {
          queryStr.$gt = ObjectID(id);
      }
      userModel.find({_id: queryStr}).sort({_id: sortType}).skip((pageNum - 1) * pageSize).limit(pageSize).exec(function(err, docs) {
          if (err) {
              callback(err, null);
          } else {
              callback(null, docs);
          }
      });
  }
};

/**
 *
 * @param id
 * @param callback
 */
var getUserById = function(id, callback) {
    userModel.find({_id: ObjectID(id)}, function(err, doc) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, doc);
        }
    });
};


exports.addUser = addUser;
exports.findUserById = findUserById;
exports.deleteUserById = deleteUserById;
exports.updateUser = updateUser;
exports.findAllUser = findAllUser;
exports.findUserByPage = findUserByPage;
exports.getUserByPageAndIdSort = getUserByPageAndIdSort;
exports.getUserByLoading = getUserByLoading;
exports.getUserById = getUserById;