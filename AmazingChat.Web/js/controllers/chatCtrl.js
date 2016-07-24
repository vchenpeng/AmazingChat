define(['app', 'utils', 'jquery'], function (app, utils, $) {
    'use strict';
    app.controller("chatCtrl", ["$scope", "$rootScope", "ChatHub", "$ionicScrollDelegate", "$stateParams", "$location", function ($scope, $rootScope, ChatHub, $ionicScrollDelegate, $stateParams) {
        $rootScope.config.showFooter = false;
        $rootScope.config.showSendTextArea = true;
        $scope.model = {
            id: 1,
            dateTime: Date.now(),
            name: '我点餐',
            desc: '描述信息测试'
        };
        var uid = $stateParams.id || 0;

        var title = uid == 1000000000000000000 ? '机器人' : (uid == 0 ? '群聊' : '私聊');
        utils.changeTitle(title);

        $scope.send = function () {
            var user = JSON.parse(utils.getLocalStorage('__User')) || { UserId: 0, Name: '', ClientId: 0 };
            var content = $('#content').val();
            if (content) {
                var msg = { Type: uid == 0 ? 0 : 1, Content: content, ReceiverID: uid };
                ChatHub.server.sendMessage(msg);
                $('#content').val('');
            }
        };

        $.connection.hub.start({ xdomain: true }).done(function () {
            console.log('连接成功');
            ChatHub.server.conn($rootScope.data.user.ID, $rootScope.data.user.Name);
            if (uid == '1000000000000000000') {
                ChatHub.server.sayHello();
            } else {
                ChatHub.server.pullAllMessage(uid);
            }
        }).fail(function (e) {
            console.error('连接成功失败', e);
        });
    }]);
});