define(['app', 'utils', 'jquery'], function (app, utils, $) {
    'use strict';
    app.controller("sessionCtrl", ["$scope", "$rootScope", "ChatHub", "$ionicScrollDelegate", "$ionicPopup", "$window", "$stateParams", "$location", function ($scope, $rootScope, ChatHub, $ionicScrollDelegate, $ionicPopup, $window) {
        $rootScope.config.showFooter = true;
        $rootScope.config.showSendTextArea = false;
        $scope.model = {
            qq: ''
        };

        utils.changeTitle('用户列表');

        $scope.reSetUser = function () {
            utils.prompt($ionicPopup, {
                template: '<input type="text" maxlength="10" ng-model="data.user.Name">',
                title: '输入昵称',
                subTitle: '给自己取一个有个性的名字呗',
                scope: $rootScope,
                buttons: [
                  //{ text: '取消' },
                  {
                      text: '<b>改名</b>',
                      type: 'button-positive',
                      onTap: function (e) {
                          if ($rootScope.data.user.ID) {
                              var user = { ID: $rootScope.data.user.ID, Name: $rootScope.data.user.Name };
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
        };

        $window.reSetAvatar = function () {
            $rootScope.data.user = JSON.parse(utils.getLocalStorage('__User')) || { ID: 0, Name: '' };
            utils.prompt($ionicPopup, {
                template: '<input type="text" maxlength="10" ng-model="model.qq">',
                title: '输入任意QQ号',
                subTitle: '将该QQ头像默认为当前头像',
                scope: $scope,
                buttons: [
                  //{ text: '取消' },
                  {
                      text: '<b>保存</b>',
                      type: 'button-positive',
                      onTap: function (e) {
                          if ($scope.model.qq) {
                              $rootScope.config.completeText = '完成';
                              $.connection.hub.start({ xdomain: true }).done(function () {
                                  console.log('连接成功');
                                  ChatHub.server.conn($rootScope.data.user.ID, $rootScope.data.user.Name);
                                  var avatar = 'http://q.qlogo.cn/headimg_dl?dst_uin=' + $scope.model.qq + '&spec=100';
                                  ChatHub.server.setAvatar(avatar);
                              }).fail(function (e) {
                                  console.error('连接成功失败', e);
                              });
                          } else {

                          }
                      }
                  },
                ]
            });
        };


        $.connection.hub.start({ xdomain: true }).done(function () {
            console.log('连接成功');
            ChatHub.server.conn($rootScope.data.user.ID, $rootScope.data.user.Name);
            ChatHub.server.pullAll();
        }).fail(function (e) {
            console.error('连接成功失败', e);
        });
        //console.log(connection.state());
        //var connection = $.connection.hub.start();

        //console.log(connection.state());
        //debugger;
        //setTimeout(function () {
        //    ChatHub.server.pullAll();
        //},2000);


        ChatHub.client.AddNewUser = function (client) {
            var tmp = '<div class="weui_cells weui_cells_access"><a class="weui_cell" href="/#/chat/4"><div class="weui_cell_hd"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAMAAABgZ9sFAAAAVFBMVEXx8fHMzMzr6+vn5+fv7+/t7e3d3d2+vr7W1tbHx8eysrKdnZ3p6enk5OTR0dG7u7u3t7ejo6PY2Njh4eHf39/T09PExMSvr6+goKCqqqqnp6e4uLgcLY/OAAAAnklEQVRIx+3RSRLDIAxE0QYhAbGZPNu5/z0zrXHiqiz5W72FqhqtVuuXAl3iOV7iPV/iSsAqZa9BS7YOmMXnNNX4TWGxRMn3R6SxRNgy0bzXOW8EBO8SAClsPdB3psqlvG+Lw7ONXg/pTld52BjgSSkA3PV2OOemjIDcZQWgVvONw60q7sIpR38EnHPSMDQ4MjDjLPozhAkGrVbr/z0ANjAF4AcbXmYAAAAASUVORK5CYII=" alt="" style="width:30px;margin-right:5px;display:block"></div><div class="weui_cell_bd weui_cell_primary"><p>{{NAME}}</p></div><span class="weui_cell_ft"></span></a></div>';
            tmp = tmp.replace('{{NAME}}', client.Name);
            $('#sessions').append(tmp);
            $ionicScrollDelegate.scrollBottom(true);
        };
    }]);
});