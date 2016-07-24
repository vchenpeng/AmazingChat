define(['app', 'utils'], function (app, utils) {
    'use strict';
    app.controller("indexCtrl", ["$scope", "$rootScope", "$stateParams", "$location", function ($scope, $rootScope) {
        $rootScope.showFooter = false;
        $scope.model = {
            id: 1,
            dateTime: Date.now(),
            name: '我点餐',
            desc: '描述信息测试'
        };
    }]);
});