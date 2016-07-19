define(['app', 'utils'], function (app, utils) {
    'use strict';
    app.controller("sessionCtrl", ["$scope", "$rootScope", "$stateParams", "$location", function ($scope, $rootScope) {
        $rootScope.config.showFooter = true;
        $scope.model = {
            id: 1,
            dateTime: Date.now(),
            name: '我点餐',
            desc: '描述信息测试'
        };
    }]);
});