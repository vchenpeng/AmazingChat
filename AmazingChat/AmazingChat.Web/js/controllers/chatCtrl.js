define(['app', 'utils', 'jquery'], function (app, utils, $) {
    'use strict';
    app.controller("chatCtrl", ["$scope", "$rootScope", "_chat", "$ionicScrollDelegate", "$stateParams", "$location", function ($scope, $rootScope, _chat, $ionicScrollDelegate) {
        $rootScope.config.showFooter = false;
        $scope.model = {
            id: 1,
            dateTime: Date.now(),
            name: '我点餐',
            desc: '描述信息测试'
        };
        //$.connection.hub.url = "http://192.168.0.107:8089/signalr";
        //var hub = $.connection.ChatHub;

        //$.extend($rootScope._chat.client, {
        //    TalkNew: function (msg) {
        //        var tmp = '<div class="weui_media_box weui_media_text"><h4 class="weui_media_title">{{NAME}}</h4><p class="weui_media_desc">{{CONTENT}}</p></div>';
        //        tmp = tmp.replace('{{NAME}}', msg.UserName + ":").replace('{{CONTENT}}', msg.Content);
        //        $('#messages').append(tmp);
        //    }
        //});

        $scope.send = function () {
            var user = JSON.parse(utils.getLocalStorage('__User')) || { id: 0, name: '', clientId: 0 };
            var content = $('#content').val();
            var msg = { UserName: user.name, Content: content };
            $rootScope._chat.sendMessage(msg);
            $('#content').val('');
        };
    }]);
});