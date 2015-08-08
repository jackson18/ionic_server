/**
 * Created by 58 on 2015/7/29.
 */
var config = {
    dburl: 'mongodb://192.168.10.109/test',
    poolSize: 10,
    pageNum: 1,
    pageSize: 10,
    sort_asc: 1,    //升序
    sort_desc: -1,   //降序
    load_up: 1,     //下拉刷新
    load_down: -1   //上拉刷新
};

module.exports = config;