var express = require('express');
var router = express.Router();
var url = require('url');
var userDao = require('../dao/userDao');
var conf = require('../util/conf');
var userModel = require('../model/userModel');

router.get('/', function(req, res, next) {
  var pageNum = 1;
  userDao.findAllUser(function(err, docs) {
    if (err) {
      console.log(err);
    } else {
      var pageCount = Math.ceil(docs.length/conf.pageSize);
      userDao.findUserByPage(pageNum, conf.pageSize, function(err, docs) {
        if (err) {
          console.log(err);
        } else {
          res.render('user_list', {users: docs, pageNum: pageNum, pageCount: pageCount});
        }
      });
    }
  });
});

router.get('/page/:pageNum', function(req, res, next) {
  var pageNum = req.params.pageNum;
  var pageCount = 0;
  userDao.findAllUser(function(err, docs) {
    if (err) {
      console.log(err);
    } else {
      pageCount = Math.ceil(docs.length/conf.pageSize);

      if (!pageNum || pageNum < 1) {
        pageNum = 1;
      } else if (pageNum > pageCount) {
        pageNum = pageCount;
      }

      userDao.findUserByPage(pageNum, conf.pageSize, function(err, docs) {
        if (err) {
          console.log(err);
        } else {
          res.render('user_list', {users: docs, pageNum: pageNum, pageCount: pageCount});
        }
      });

    }
  });
});

router.get('/add', function(req, res, next) {
  res.render('user_add', {title: '新增用户'});
});

router.post('/add', function(req, res, next) {
  //TODO
  var newUser = new userModel(req.body.user);
  if (!newUser.name) {
    res.render('error', {message: '用户名是必须的！'});
  } else {
    if (!newUser.password) {
      res.render('error', {message: '密码是必须的！'});
    } else {
      userDao.addUser(newUser, function(err, doc) {
        if (err) {
          console.log(err);
        } else {
          res.redirect('/users/');
        }
      });
    }
  }
});

router.get('/update/:id', function(req, res, next) {
  userDao.findUserById(req.params.id, function(err, doc) {
    if (err) {
      console.log(err);
    } else {
      res.render('user_update', {user: doc, title: '更新信息'});
    }
  });
});

router.post('/update', function(req, res, next) {
  var user = new userModel(req.body.user);
  if (!user.name) {
    res.render('error', {message: '姓名是必须的！'});
  } else {
    if (!user.password) {
      res.render('error', {message: '密码是必须的！'});
    } else {
      userDao.updateUser(user, function(err, doc) {
        if (err) {
          console.log(err);
        } else {
          res.redirect('/users/');
        }
      });
    }
  }
});

router.get('/delete/:id', function(req, res, next) {
  userDao.deleteUserById(req.params.id, function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/users/');
    }
  });
});

/**
 * 对外接口
 * 返回第1页的所有用户信息
 */
router.get('/api', function(req, res, next) {
    userDao.getUserByPageAndIdSort(conf.pageNum, conf.pageSize, conf.sort_desc, function(err, docs) {
        if (err) {
            console.log(err);
        } else {
			var params = url.parse(req.url, true).query;
			var result1 = params.callback + '(' + JSON.stringify({result: docs}) + ')';
			res.send(result1);
        }
    });
});

/**
 * 对外接口
 * 返回小于id的所有用户(取一页数据)
 * 用于上拉刷新
 */
router.get('/api/up/id/:id', function(req, res, next) {
    userDao.getUserByLoading(conf.pageNum, conf.pageSize, req.params.id, conf.sort_desc, conf.load_up, function(err, docs) {
        if (err) {
            console.log(err);
        } else {
            var params = url.parse(req.url, true).query;
			var result1 = params.callback + '(' + JSON.stringify({result: docs}) + ')';
			res.send(result1);
        }
    });
});

/**
 * 对外接口
 * 返回大于id的所有用户(取一页数据)
 * 用于下拉刷新
 */
router.get('/api/down/id/:id', function(req, res, next) {
    userDao.getUserByLoading(conf.pageNum, conf.pageSize, req.params.id, conf.sort_desc, conf.load_down, function(err, docs) {
        if (err) {
            console.log(err);
        } else {
            var params = url.parse(req.url, true).query;
			var result1 = params.callback + '(' + JSON.stringify({result: docs}) + ')';
			res.send(result1);
        }
    });
});

router.get('/api/id/:id', function(req, res, next) {
    userDao.getUserById(req.params.id, function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            var params = url.parse(req.url, true).query;
            var result = params.callback + '(' + JSON.stringify({result: doc}) + ')';
            res.send(result);
        }
    });
});


module.exports = router;
