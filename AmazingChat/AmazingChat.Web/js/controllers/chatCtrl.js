define(['app', 'utils', 'jquery'], function (app, utils, $) {
    'use strict';
    app.controller("chatCtrl", ["$scope", "$rootScope", "ChatHub", "$ionicScrollDelegate", "$stateParams", "$location", function ($scope, $rootScope, ChatHub, $ionicScrollDelegate) {
        $rootScope.config.showFooter = false;
        $scope.model = {
            id: 1,
            dateTime: Date.now(),
            name: '我点餐',
            desc: '描述信息测试'
        };

        ChatHub.client.Talk = function (msg) {
            var tmp = '<div class="weui_media_box weui_media_text"><h4 class="weui_media_title">{{NAME}}</h4><p class="weui_media_desc">{{CONTENT}}</p></div>';
            tmp = tmp.replace('{{NAME}}', msg.UserName).replace('{{CONTENT}}', msg.Content);
            $('#messages').append(tmp);
            $ionicScrollDelegate.scrollBottom(true);
        };

        $.connection.hub.start({ xdomain: true }).done(function () {
            console.log('连接成功');
        }).fail(function (e) {
            console.error('连接成功失败', e);
        });

        $scope.send = function () {
            var user = JSON.parse(utils.getLocalStorage('__User')) || { id: 0, name: '', clientId: 0 };
            var content = $('#content').val();
            var msg = { UserName: user.name, Content: content };
            ChatHub.server.sendMessage(msg);
            $('#content').val('');
        };
    }]);
});