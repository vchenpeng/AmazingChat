define(['ionic.bundle', 'angular-async-loader', 'utils', 'jquery', 'signalr.hubs'], function (ionicBundle, asyncLoader, utils, $) {
    'use strict';
    var app = angular.module('app', ['ui.router', 'ionic', 'ngLocale'])
        .value('_chat', null)
        .constant("$ionicLoadingConfig", {
            template: "default loading template ..."
        })
        .config(['$ionicConfigProvider', function ($ionicConfigProvider) {
            //$ionicConfigProvider.tabs.position('bottom');
        }])
        .run(['$ionicPlatform', '$rootScope', '$location', "$window", '$timeout', '$anchorScroll', '$ionicLoading', '$ionicPopup', '_chat', function ($ionicPlatform, $rootScope, $location, $window, $timeout, $anchorScroll, $ionicLoading, $ionicPopup, _chat) {
            console.debug('Device Infos (From Ionic):', ionic.Platform);

            $rootScope.config = {
                showFooter: true,
                showLoading: false,
                showComplete: false,
                completeText: '已完成'
            };
            $rootScope.data = {
                user: {}
            };
            window.addEventListener('orientationchange', function () {

            }, false);


            //$.connection.hub.url = "http://192.168.0.107:8089/signalr";
            //$.connection.hub.logging = true;
            //var chat = $.connection.ChatHub;
            //$.connection.hub.start({ transport: ['webSockets', 'longPolling'] }).done(function () {
            //    console.log('id', $.connection.hub.id);
            //    chat.client.Talk = function (msg) {
            //        var tmp = '<div class="weui_media_box weui_media_text"><h4 class="weui_media_title">{{NAME}}</h4><p class="weui_media_desc">{{CONTENT}}</p></div>';
            //        tmp = tmp.replace('{{NAME}}', msg.UserName).replace('{{CONTENT}}', msg.Content);
            //        $('#messages').append(tmp);
            //    };
            //    $rootScope._chat = chat;
            //});
            var connection = $.hubConnection();
            debugger;
            connection.start({ transport: ['webSockets', 'longPolling'] }).done(function () {
                console.log('id', connection.id);
                connection.Talk = function (msg) {
                    var tmp = '<div class="weui_media_box weui_media_text"><h4 class="weui_media_title">{{NAME}}</h4><p class="weui_media_desc">{{CONTENT}}</p></div>';
                    tmp = tmp.replace('{{NAME}}', msg.UserName).replace('{{CONTENT}}', msg.Content);
                    $('#messages').append(tmp);
                };
                $rootScope._chat = connection;
            });

            if (ionic.Platform.isIOS()) {
                // IOS TODO ...
            }
            if (ionic.Platform.isAndroid()) {
                // Android TODO ...
            }
            // ionic ready
            $ionicPlatform.ready(function () {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }
            });
            //utils.clearLocalStorage('__User');
            $rootScope.data.user = JSON.parse(utils.getLocalStorage('__User')) || { id: 0, name: '', clientId: 0 };
            if ($rootScope.data.user.name == '') {
                utils.prompt($ionicPopup, {
                    template: '<input type="text" ng-model="data.user.name">',
                    title: '输入昵称',
                    subTitle: '给自己取一个有个性的名字呗',
                    scope: $rootScope,
                    buttons: [
                      //{ text: '取消' },
                      {
                          text: '<b>保存</b>',
                          type: 'button-positive',
                          onTap: function (e) {
                              if ($rootScope.data.user.name) {
                                  var user = { id: 0, name: $rootScope.data.user.name, clientId: 0 };
                                  utils.setLocalStorage('__User', JSON.stringify(user));
                                  $rootScope.config.completeText = '完成';
                                  $rootScope.config.showComplete = true;
                                  $timeout(function () {
                                      $rootScope.config.showComplete = false;
                                  }, 2000);
                              } else {
                                  e.preventDefault();
                              }
                          }
                      },
                    ]
                });
            } else {
                //发起请求
            }

            $rootScope.title = "\u524d\u7aef\u6846\u67b6";
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                $rootScope.config.showLoading = true;
                //utils.showLoading($ionicLoading);
            });
            $rootScope.$on('$viewContentLoaded', function (event, viewConfig) {

            });
            $rootScope.$watch('$viewContentLoaded', function (event) {
                //$timeout(function () {
                //    utils.resize();
                //}, 200);
            });
            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                $location.hash(fromParams.id);
                $anchorScroll();
                //utils.hideLoading($ionicLoading);
                $rootScope.config.showLoading = false;
            });
        }]);

    app.config(['$locationProvider', '$httpProvider', '$provide', function ($locationProvider, $httpProvider, $provide) {
        //声明自定义http拦截
        $provide.factory('myHttpInterceptor', ['$q', '$injector', "$location", function ($q, $injector, $location) {
            /**
             * 判断请求url 是否需要过
             * @param excludedAddress
             * @param url
             * @returns {boolean}
             */
            var checkDefaultSetter = function (excludedAddress, url) {
                var defaultItem = ["html", "js", "css", "jpg", "png"];
                var patt = new RegExp(".*.(" + defaultItem.join('|') + "){1}");
                if (patt.test(url) || $.inArray(url, excludedAddress) > -1) {
                    return true;
                } else {
                    return false;
                }
            };
            return {
                'request': function (config) {
                    return config;
                },
                'requestError': function (rejection) {
                    return $q.reject(rejection);
                },

                'response': function (response) {
                    return response;
                },
                'responseError': function (rejection) {
                    return rejection;
                }
            };
        }]);

        $httpProvider.interceptors.push('myHttpInterceptor');
        $httpProvider.interceptors.push(["$q", function ($q) {
            return {
                'response': function (response) {
                    if (typeof (window.MiniProfiler) != 'undefined' && response.config.url.indexOf(".html") < 0) {
                        var stringIds = response.headers('X-MiniProfiler-Ids');
                        if (stringIds) {
                            window.MiniProfiler.fetchResults(angular.fromJson(stringIds));
                        }
                    }
                    return response || $q.when(response);
                }
            };
        }]);
    }]);
    asyncLoader.configure(app);
    return app;
})
;