({
    baseUrl: './',
    // 应用程序基础路径
    baseUrl: './',
    paths: {
        'ionic.bundle': 'libs/ionic/ionic.bundle.min',
        'angular-async-loader': 'libs/angular-async-loader/angular-async-loader',
        'jquery': 'libs/jquery/jquery-2.1.3.min',
        'zepto': 'libs/zepto/zepto.min',
        'bootstrap': 'libs/bootstrap/bootstrap.min',
        'ui-bootstrap': 'libs/angular-ui/ui-bootstrap.min',
        'ui-bootstrap-tpls': 'libs/angular-ui/ui-bootstrap-tpls',
        'datepicker': 'libs/datepicker/bootstrap-datetimepicker',
        'datepicker-zh': 'libs/datepicker/bootstrap-datetimepicker.zh-CN',
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
        'parabola': 'libs/parabola/parabola',
        'swiper': 'libs/swiper/js/swiper.min',
        'template-native': 'libs/template/template-native',
        'linq': 'libs/linq/linq.min',
        'route': 'js/route',
        'app': 'js/app',
        'sModule': 'js/services/sModule',
        'head': 'js/directives/head',
        'resize': 'js/directives/resize',
        'config': 'js/helpers/config',
        'utils': 'js/helpers/utils',
        'apiService': 'js/services/apiService',

        'signalr': 'libs/signalR/jquery.signalR-2.2.0.min',
        //'hubs': 'http://192.168.0.107:8088/socket/signalr/hubs?'
    },
    shim: {
        'angular': { exports: 'angular' },
        'jquery': { exports: "$" },
        'bootstrap': { deps: ['jquery'] },
        'ui-bootstrap': { deps: ['ionic.bundle'] },
        'ui-bootstrap-tpls': { deps: ['ui-bootstrap'] },
        'angular-locale_zh-cn': { deps: ['ionic.bundle'] },
        'angular-aria': { deps: ['ionic.bundle'] },
        'datepicker-zh': { deps: ['datepicker'] },

        "signalr": {
            deps: ["jquery"],
            exports: "$.connection"
        },
        "hubs": {
            deps: ["signalr"],
        }
    },
    optimize: "uglify",//uglify
    name: "js/main.js",
    out: 'js/all.js'
})
