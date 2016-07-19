define(['app', 'utils'], function (app, utils) {
    'use strict';
    app.directive('resize', ['$rootScope', '$compile', function ($rootScope, $compile) {
        return {
            restrict: 'A',
            link: function (scope, elem) {
                function flag() {
                    var footerHeight = $rootScope.config.showFooter ? 55 : 0;
                    var inputAreaHeight = $rootScope.config.showFooter ? 0 : 96;
                    var availHeight = document.body.clientHeight - footerHeight - inputAreaHeight;
                    elem[0].style.height = availHeight + 'px';
                }
                flag();
                window.onresize = flag;
            }
        };
    }]);
});