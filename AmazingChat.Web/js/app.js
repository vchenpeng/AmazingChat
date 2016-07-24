define(['ionic.bundle', 'config', 'angular-async-loader', 'utils', 'jquery', 'dialogsManager', 'signalr.hubs'], function (ionicBundle, config, asyncLoader, utils, $) {
    'use strict';

    $.connection.hub.url = config.socketServer;
    $.connection.hub.logging = config.isSocketLogging;
    var chat = $.connection.ChatHub;

    var app = angular.module('app', ['ui.router', 'ionic', 'ngLocale'])
        .value('ChatHub', chat)
        .constant("$ionicLoadingConfig", {
            template: "default loading template ..."
        })
        .config(['$ionicConfigProvider', function ($ionicConfigProvider) {
            //$ionicConfigProvider.tabs.position('bottom');
        }])
        .run(['$ionicPlatform', '$rootScope', '$state', '$location', "$window", '$timeout', '$anchorScroll', '$ionicLoading', '$ionicPopup', '$ionicScrollDelegate', 'ChatHub', 'dialogsManager',
            function ($ionicPlatform, $rootScope, $state, $location, $window, $timeout, $anchorScroll, $ionicLoading, $ionicPopup, $ionicScrollDelegate, ChatHub, dialogsManager) {
                //console.debug('Device Infos (From Ionic):', ionic.Platform);

                $rootScope.config = {
                    showFooter: true,
                    showSendTextArea: false,
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
                    dialogsManager.showMessage(msg);
                };

                ChatHub.client.Talk = function (msg) {
                    //var tmp = '<div class="weui_media_box weui_media_text"><h4 class="weui_media_title">{{NAME}}</h4><p class="weui_media_desc">{{CONTENT}}</p><ul class="weui_media_info"><li class="weui_media_info_meta"></li><li class="weui_media_info_meta">{{TIME}}</li><li class="weui_media_info_meta weui_media_info_meta_extra"></li></ul></div>';
                    var tmp = '<div class="message {{ISMINE}}"><img class="avatar" src="{{AVATAR}}"><div class="content"><div class="nickname">' +
                                '<span class="time">{{NAME}}  &nbsp; {{TIME}}</span></div><div class="bubble bubble_primary {{ISRIGHT}}"><div class="bubble_cont"><div class="plain">' +
                                '<pre>{{CONTENT}}</pre></div></div></div></div></div>';

                    tmp = tmp.replace('{{NAME}}', msg.SenderName).replace('{{CONTENT}}', msg.Content).replace('{{AVATAR}}', msg.SenderAvatar || '/images/default.jpg').replace('{{TIME}}', msg.CreateDate.substr(11, 8)).replace('{{ISMINE}}', $rootScope.data.user.ID == msg.SenderID ? 'me' : '').replace('{{ISRIGHT}}', $rootScope.data.user.ID == msg.SenderID ? 'right' : 'left');

                    if ($state.current.name == 'chat') {
                        $rootScope.data.user = JSON.parse(utils.getLocalStorage('__User')) || { ID: 0, Name: '', Avatar: '' };
                        var sender = $state.params.id;
                        if (sender == msg.SenderID || $rootScope.data.user.ID == msg.SenderID) {
                            $('#messages').append(tmp);
                        }
                        ChatHub.server.setMsgReaded(sender);
                        $ionicScrollDelegate.scrollBottom(true);
                    }
                };

                ChatHub.client.AllTalk = function (msgs) {
                    var allMsg = '';
                    msgs.forEach(function (msg) {
                        //var tmp = '<div class="weui_media_box weui_media_text"><h4 class="weui_media_title">{{NAME}}</h4><p class="weui_media_desc">{{CONTENT}}</p></div>';
                        var tmp = '<div class="message {{ISMINE}}"><img class="avatar" src="{{AVATAR}}"><div class="content"><div class="nickname">' +
                                '<span class="time">{{NAME}} &nbsp; {{TIME}}</span></div><div class="bubble bubble_primary {{ISRIGHT}}"><div class="bubble_cont"><div class="plain">' +
                                '<pre>{{CONTENT}}</pre></div></div></div></div></div>';

                        tmp = tmp.replace('{{NAME}}', msg.SenderName).replace('{{CONTENT}}', msg.Content).replace('{{AVATAR}}', msg.SenderAvatar || '/images/default.jpg').replace('{{TIME}}', msg.CreateDate.substr(11, 8)).replace('{{ISMINE}}', $rootScope.data.user.ID == msg.SenderID ? 'me' : '').replace('{{ISRIGHT}}', $rootScope.data.user.ID == msg.SenderID ? 'right' : 'left');
                        allMsg += tmp;
                        $('#messages').html(allMsg);
                    });
                    $ionicScrollDelegate.scrollBottom(true);
                };

                ChatHub.client.PullFromClient = function () {
                    ChatHub.server.pullAll();
                };

                ChatHub.client.Pull = function (clients) {
                    console.log(clients);
                    var allClient = '';
                    $rootScope.data.user = JSON.parse(utils.getLocalStorage('__User')) || { ID: 0, Name: '', Avatar: '' };
                    clients.forEach(function (client) {
                        var tmp = '';
                        //var tmp = '<div class="weui_cells weui_cells_access"><a class="weui_cell" href="/#/chat/{{ID}}"><div class="weui_cell_hd"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAMAAABgZ9sFAAAAVFBMVEXx8fHMzMzr6+vn5+fv7+/t7e3d3d2+vr7W1tbHx8eysrKdnZ3p6enk5OTR0dG7u7u3t7ejo6PY2Njh4eHf39/T09PExMSvr6+goKCqqqqnp6e4uLgcLY/OAAAAnklEQVRIx+3RSRLDIAxE0QYhAbGZPNu5/z0zrXHiqiz5W72FqhqtVuuXAl3iOV7iPV/iSsAqZa9BS7YOmMXnNNX4TWGxRMn3R6SxRNgy0bzXOW8EBO8SAClsPdB3psqlvG+Lw7ONXg/pTld52BjgSSkA3PV2OOemjIDcZQWgVvONw60q7sIpR38EnHPSMDQ4MjDjLPozhAkGrVbr/z0ANjAF4AcbXmYAAAAASUVORK5CYII=" alt="" style="width:30px;margin-right:5px;display:block"></div><div class="weui_cell_bd weui_cell_primary"><p>{{NAME}} {{STATUS}}</p></div><span class="weui_cell_ft"></span></a></div>';
                        if (client.ID != $rootScope.data.user.ID) {
                            tmp = '<a href="/#/chat/{{ID}}" class="weui_media_box weui_media_appmsg"><div class="weui_media_hd"><img class="weui_media_appmsg_thumb" src="{{AVATAR}}" alt=""></div><div class="weui_media_bd"><h5 class="weui_media_title">{{STATUS}} {{NAME}}</h5><p class="weui_media_desc">{{NOTREADCOUNT}}</p></div></a>';
                            var flagCount = client.NotReadCount > 0 ? (client.NotReadCount || 0) + ' 条消息未读' : '';
                            tmp = tmp.replace('{{NOTREADCOUNT}}', " <b style='color:red;'>" + flagCount + "</b>");
                        } else {
                            tmp = '<a href="javascript:;" onclick="reSetAvatar()" class="weui_media_box weui_media_appmsg"><div class="weui_media_hd"><img class="weui_media_appmsg_thumb" src="{{AVATAR}}" alt=""></div><div class="weui_media_bd"><h5 class="weui_media_title">{{STATUS}} {{NAME}}[自己]</h5><p class="weui_media_desc"></p></div></a>';
                        }
                        var status = client.IsValid ? '<i class="weui_icon_success_circle"></i>' : '<i class="weui_icon_waiting_circle"></i>';
                        var avatar = client.Avatar ? client.Avatar : '/images/default.jpg';
                        tmp = tmp.replace('{{NAME}}', client.Name).replace('{{ID}}', client.ID).replace('{{STATUS}}', status).replace('{{AVATAR}}', avatar);
                        allClient += tmp;
                    });
                    $('#sessions').html(allClient);
                    //$ionicScrollDelegate.scrollBottom(true);
                };

                ChatHub.client.SetUserInfo = function (client) {
                    //$rootScope.config.showComplete = true;
                    //$timeout(function () {
                    //    $rootScope.config.showComplete = false;
                    //}, 2000);
                    utils.setLocalStorage('__User', JSON.stringify(client));
                };

                ChatHub.client.CallModule = function (client) {
                    auth();
                };

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
                auth();
                function auth() {
                    $rootScope.data.user = JSON.parse(utils.getLocalStorage('__User')) || { ID: 0, Name: '' };
                    if (!$rootScope.data.user.ID) {
                        utils.prompt($ionicPopup, {
                            template: '<input type="text" maxlength="10" ng-model="data.user.Name">',
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
                                          var user = { ID: 0, Name: $rootScope.data.user.Name };
                                          $rootScope.config.completeText = '完成';

                                          $.connection.hub.start({ xdomain: true }).done(function () {
                                              console.log('连接成功');
                                              ChatHub.server.conn(user.ID, user.Name);
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