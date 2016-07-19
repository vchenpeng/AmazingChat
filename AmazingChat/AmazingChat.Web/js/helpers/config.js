define([], function () {
    'use strict';
    var config = {
        // 版本
        version: '0.9',
        // 原始Api 基础路径，也可为形如：http://www.weetao.net/xx/ 格式
        apiServer: './api/',
        // Web Api配置
        api: {
            'TestApi': 'Test/TestApi'
        },
        // 是否开启按需加载
        isLazyLoad: false
    };
    return config;
});
