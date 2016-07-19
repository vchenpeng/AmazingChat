define(['app', 'utils', 'jquery'], function (app, utils, $) {
    'use strict';
    app.controller("sessionCtrl", ["$scope", "$rootScope", "ChatHub", "$ionicScrollDelegate", "$stateParams", "$location", function ($scope, $rootScope, ChatHub, $ionicScrollDelegate) {
        $rootScope.config.showFooter = true;
        $scope.model = {
            id: 1,
            dateTime: Date.now(),
            name: '我点餐',
            desc: '描述信息测试'
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
        //    ChatHub.server.conn($rootScope.data.user.Name);
        //}).fail(function (e) {
        //    console.error('连接成功失败', e);
        //});
    }]);
});