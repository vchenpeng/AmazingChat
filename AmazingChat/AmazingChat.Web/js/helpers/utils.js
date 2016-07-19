define([], function () {
    'use strict';
    // 工具类
    var utils = {};

    utils = {
        isWeiXin: window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger' ? true : false,
        toNumber: function (text, defaultValue) {
            return +text || defaultValue || NaN;
        },
        setLocalStorage: function (key, value) {
            window.localStorage.setItem(key, value);
        },
        getLocalStorage: function (key) {
            return window.localStorage.getItem(key)
        },
        clearLocalStorage: function (key) {
            return window.localStorage.clear(key)
        },
        setSessionStorage: function (key, value) {
            window.sessionStorage.setItem(key, value);
        },
        getSessionStorage: function (key) {
            return window.sessionStorage.getItem(key)
        },
        clearSessionStorage: function (key) {
            window.sessionStorage.removeItem(key);
        },
        getCookie: function (key) {
            var arr, reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg)) return unescape(arr[2]); else return null;
        },
        setcookie: function (key, value) {
            var expdate = new Date();
            expdate.setTime(expdate.getTime() + 30 * 60 * 1000);
            document.cookie = key + "=" + value + ";expires=" + expdate.toGMTString() + ";path=/";
        },
        rotate: function (callback) {
            if (typeof callback == "function") {
                callback();
            }
        },
        format: function (text, args) {

        },
        showLoading: function ($ionicLoading) {
            $ionicLoading.show({
                template: 'Loading...'
            });
        },
        hideLoading: function ($ionicLoading) {
            $ionicLoading.hide(function () {
                console.log("The loading indicator is now displayed");
            });
        },
        prompt: function ($ionicPopup, options) {
            $ionicPopup.show(options).then(function () {
                //这个函数在弹出框关闭时被调用
            });
        },
        changeTitle: function (title) {
            if (utils.isWeiXin) {
                var body = document.getElementsByTagName('body')[0];
                document.title = title;
                var iframe = document.createElement("iframe");
                iframe.setAttribute("src", "/favicon.ico");
                iframe.style.display = 'none';
                iframe.addEventListener('load', function () {
                    setTimeout(function () {
                        iframe.removeEventListener('load');
                        document.body.removeChild(iframe);
                    }, 0);
                });
                document.body.appendChild(iframe);
            } else {
                document.title = title;
            }
        }
    };

    return utils;
});
