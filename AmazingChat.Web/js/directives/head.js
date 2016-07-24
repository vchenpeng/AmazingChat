define(['app'], function (app) {
    'use strict';
    app.directive('head', ['$rootScope', '$compile', function ($rootScope, $compile) {
        return {
            restrict: 'E',
            link: function (scope, elem) {
                var html = '<link rel="stylesheet" ng-repeat="(routeCtrl, cssUrl) in routeStyles" ng-href="{{cssUrl}}" />';
                elem.append($compile(html)(scope));
                scope.routeStyles = {};
                // 拓展head，异步为特殊页面加入样式文件,使用详见route.js,add by chenp 2016-05-04
                $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {
                    if (fromState && fromState.css) {
                        if (!angular.isArray(fromState.css)) {
                            fromState.css = [fromState.css];
                        }
                        angular.forEach(fromState.css, function (sheet) {
                            delete scope.routeStyles[sheet];
                        });
                    }
                    if (toState && toState.css) {
                        if (!angular.isArray(toState.css)) {
                            toState.css = [toState.css];
                        }
                        angular.forEach(toState.css, function (sheet) {
                            scope.routeStyles[sheet] = sheet;
                        });
                    }
                });
            }
        };
    }]);
});