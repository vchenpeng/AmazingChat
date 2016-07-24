({
    baseUrl: './',
    // 应用程序基础路径
    paths: {
        'ionic.bundle': 'libs/ionic/ionic.bundle.min',
        'angular-async-loader': 'libs/angular-async-loader/angular-async-loader',
        'jquery': 'libs/jquery/jquery-2.1.3.min',
        'zepto': 'libs/zepto/zepto.min',

        'angular-animate': 'libs/angular/angular-animate.min',
        'angular-aria': 'libs/angular/angular-aria.min',
        'angular-cookies': 'libs/angular/angular-cookies.min',
        'angular-loader': 'libs/angular/angular-loader.min',
        'angular-messages': 'libs/angular/angular-messages.min',
        'angular-mocks': 'libs/angular/angular-mocks',
        'angular-resource': 'libs/angular/angular-resource.min',
        'angular-sanitize': 'libs/angular/angular-sanitize.min',
        'angular-scenario': 'libs/angular/angular-scenario',
        'angular-touch': 'libs/angular/angular-touch.min',
        'angular-locale_zh-cn': 'libs/i18n/angular-locale_zh-cn',

        'linq': 'libs/linq/linq.min',
        'route': 'js/route',
        'app': 'js/app',
        'sModule': 'js/services/sModule',
        'head': 'js/directives/head',
        'resize': 'js/directives/resize',
        'config': 'js/helpers/config',
        'utils': 'js/helpers/utils',
        'apiService': 'js/services/apiService',
        'dialogsManager': 'js/services/dialogsManager',

        'signalr.core': 'libs/signalR/jquery.signalR-2.2.0.min',
        //'signalr.hubs': 'http://192.168.0.107:8089/signalr/hubs?',
        'signalr.hubs': 'libs/signalR/hubs'
    },
    shim: {
        'angular': { exports: 'angular' },
        'jquery': { exports: "$" },
        'angular-locale_zh-cn': { deps: ['ionic.bundle'] },
        'angular-aria': { deps: ['ionic.bundle'] },
        'datepicker-zh': { deps: ['datepicker'] },

        "signalr.core": {
            deps: ["jquery"],
            exports: "$.connection"
        },
        "signalr.hubs": {
            deps: ["signalr.core"],
        }
    },
    optimize: "uglify",//uglify
    name: "js/main.js",
    out: 'js/all.js',
    waitSeconds: 12 //模块加载时间，默认值时间为7s
})