define(['app', 'config'], function (app, config) {
    'use strict';
    var myApp = app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
        // 是否使用html5模式，去掉地址栏中的#，纯前端站点需要重写URL，重要!!
        $locationProvider.html5Mode(false);

        //状态路由配置
        /**
         * url              //地址栏链接地址
         * templateUrl      //模板路径
         * controller       //控制器名称
         * controllerUrl    //控制器文件路径
         * dependencies     //依赖特定的js文件,例如需要的特殊插件、服务、指令
         * css              //异步加载样式文件,对特殊页面做样式处理
         */
        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: 'templates/default/index.html',
                controller: 'indexCtrl',
                controllerUrl: 'js/controllers/indexCtrl',
                dependencies: [],
                css: ['libs/assets/css/test.css']
            })
            .state('chat', {
                cache: false,
                url: '/chat/:id',
                templateUrl: 'templates/default/chat.html',
                controller: 'chatCtrl',
                controllerUrl: 'js/controllers/chatCtrl',
                dependencies: [],
            })
            .state('session', {
                cache: false,
                url: '/session',
                templateUrl: 'templates/default/session.html',
                controller: 'sessionCtrl',
                controllerUrl: 'js/controllers/sessionCtrl',
                dependencies: [],
            })
            .state('test2', {
                url: '/test2',
                templateUrl: 'templates/default/test2.html',
                controller: 'indexCtrl',
                controllerUrl: 'js/controllers/indexCtrl',
                dependencies: [],
            });

        $urlRouterProvider.otherwise('/session');
    }]);
    return myApp;
});

