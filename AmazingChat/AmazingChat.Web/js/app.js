define(['ionic.bundle', 'angular-async-loader', 'utils', 'jquery', 'signalr.hubs'], function (ionicBundle, asyncLoader, utils, $) {
    'use strict';

    $.connection.hub.url = "http://192.168.1.16:8089/signalr";
    $.connection.hub.logging = true;
    var chat = $.connection.ChatHub;

    var app = angular.module('app', ['ui.router', 'ionic', 'ngLocale'])
        .value('ChatHub', chat)
        .constant("$ionicLoadingConfig", {
            template: "default loading template ..."
        })
        .config(['$ionicConfigProvider', function ($ionicConfigProvider) {
            //$ionicConfigProvider.tabs.position('bottom');
        }])
        .run(['$ionicPlatform', '$rootScope', '$location', "$window", '$timeout', '$anchorScroll', '$ionicLoading', '$ionicPopup', '$ionicScrollDelegate', 'ChatHub', function ($ionicPlatform, $rootScope, $location, $window, $timeout, $anchorScroll, $ionicLoading, $ionicPopup, $ionicScrollDelegate, ChatHub) {
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

            ChatHub.client.Notice = function (msg) {
                alert(msg);
            };

            ChatHub.client.Talk = function (msg) {
                var tmp = '<div class="weui_media_box weui_media_text"><h4 class="weui_media_title">{{NAME}}</h4><p class="weui_media_desc">{{CONTENT}}</p></div>';
                tmp = tmp.replace('{{NAME}}', msg.UserName).replace('{{CONTENT}}', msg.Content);
                $('#messages').append(tmp);
                $ionicScrollDelegate.scrollBottom(true);
            };

            ChatHub.client.Pull = function (clients) {
                var tmp = '<div class="weui_cells weui_cells_access"><a class="weui_cell" href="/#/chat/4"><div class="weui_cell_hd"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAMAAABgZ9sFAAAAVFBMVEXx8fHMzMzr6+vn5+fv7+/t7e3d3d2+vr7W1tbHx8eysrKdnZ3p6enk5OTR0dG7u7u3t7ejo6PY2Njh4eHf39/T09PExMSvr6+goKCqqqqnp6e4uLgcLY/OAAAAnklEQVRIx+3RSRLDIAxE0QYhAbGZPNu5/z0zrXHiqiz5W72FqhqtVuuXAl3iOV7iPV/iSsAqZa9BS7YOmMXnNNX4TWGxRMn3R6SxRNgy0bzXOW8EBO8SAClsPdB3psqlvG+Lw7ONXg/pTld52BjgSSkA3PV2OOemjIDcZQWgVvONw60q7sIpR38EnHPSMDQ4MjDjLPozhAkGrVbr/z0ANjAF4AcbXmYAAAAASUVORK5CYII=" alt="" style="width:30px;margin-right:5px;display:block"></div><div class="weui_cell_bd weui_cell_primary"><p>{{NAME}}</p></div><span class="weui_cell_ft"></span></a></div>';
                var allClient = '';
                clients.forEach(function (client) {
                    tmp = tmp.replace('{{NAME}}', client.Name);
                    allClient += tmp;
                });
                $('#sessions').html(allClient);
                $ionicScrollDelegate.scrollBottom(true);
            };

            //$.connection.hub.start({ xdomain: true }).done(function () {
            //    console.log('连接成功');
            //}).fail(function (e) {
            //    console.error('连接成功失败', e);
            //});

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
            utils.clearLocalStorage('__User');
            $rootScope.data.user = JSON.parse(utils.getLocalStorage('__User')) || { UserId: 0, Name: '', ClientId: "" };
            if ($rootScope.data.user.Name == '') {
                utils.prompt($ionicPopup, {
                    template: '<input type="text" ng-model="data.user.Name">',
                    title: '输入昵称',
                    subTitle: '给自己取一个有个性的名字呗',
                    scope: $rootScope,
                    buttons: [
                      //{ text: '取消' },
                      {
                          text: '<b>保存</b>',
                          type: 'button-positive',
                          onTap: function (e) {
                              if ($rootScope.data.user.Name) {
                                  var user = { UserId: 0, Name: $rootScope.data.user.Name, ClientId: "" };
                                  utils.setLocalStorage('__User', JSON.stringify(user));
                                  $rootScope.config.completeText = '完成';
                                  $rootScope.config.showComplete = true;
                                  $timeout(function () {
                                      $rootScope.config.showComplete = false;
                                  }, 2000);
                                  $.connection.hub.start({ xdomain: true }).done(function () {
                                      console.log('连接成功');
                                      ChatHub.server.conn($rootScope.data.user.Name);
                                  }).fail(function (e) {
                                      console.error('连接成功失败', e);
                                  });
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

            $rootScope.title = "IM";
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