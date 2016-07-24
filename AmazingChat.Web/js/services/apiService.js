define(['sModule', 'config', 'utils'], function (sModule, config, utils) {
    'use strict';
    sModule.factory('apiService', ["$http", "$rootScope", "$state", function ($http, $rootScope, $state) {
        var _service = function (ctrlName) {
            var service = {
                /**
                 * 封装调用api  call
                 * @param baseUrl  基础服务器地址
                 * @param action  api地址
                 * @param param  参数，统一为JSON
                 * @param methodType  请求方式，包含get|post|delete|put|jsonp 这5种
                 * @param allowAll  无需登录可以访问的api，加上此参数true则无需授权信息
                 */
                "call": function (baseUrl, action, param, methodType, allowAll) {
                    // TODO 如果存在 获取授权信息JSON or Xml
                    var auth = null;
                    // 允许所有 or 授权信息且未过期
                    if (allowAll || (auth && auth.token && auth.expressTime >= +new Date())) {
                        var result = [];
                        if (!allowAll) {
                            $http.defaults.headers.common.Authorization = 'Bearer ' + auth.token;
                        }
                        var apihost = baseUrl + action;
                        if (methodType == undefined) { methodType = 'post'; }
                        methodType = methodType.toLowerCase();
                        result.$promise = null;
                        if (methodType == 'post') {
                            result.$promise = $http.post(apihost, param);
                        }
                        if (methodType == 'get') {
                            var querystring = '?';
                            for (var k in param) {
                                querystring += k + '=' + escape(param[k]) + '&';
                            }
                            if (querystring == '?') {
                                querystring = '';
                            }
                            querystring = querystring.substr(0, querystring.length - 1);
                            result.$promise = $http.get(apihost + querystring);
                        }
                        if (methodType == 'delete') {
                            result.$promise = $http['delete'](apihost, { params: param });
                        }
                        if (methodType == 'put') {
                            result.$promise = $http.put(apihost, param);
                        }
                        // 支持jsonp,前提后台API支持
                        if (methodType == 'jsonp') {
                            var querystring = '?';
                            //当使用jsonp时，参数无callback属性，默认添加一个
                            if (param.callback == undefined) {
                                param.callback = 'JSON_CALLBACK';
                            }
                            for (var k in param) {
                                querystring += k + '=' + escape(param[k]) + '&';
                            }
                            if (querystring == '?') {
                                querystring = '';
                            }
                            querystring = querystring.substr(0, querystring.length - 1);
                            result.$promise = $http.jsonp(apihost + querystring);
                        }
                        if (result.$promise != null) {
                            result.$promise.then(function (response, status) {
                                if (response && response.data) {
                                    angular.extend(result, response.data);
                                }
                            }, function (response) {
                                if (response.status == 401) {
                                    // 出现401未授权，根据具体业务TODO ...
                                    $state.go('login');
                                }
                                else {
                                    console.error('来自apiService异常:', action, response.status, response.statusText);
                                }
                            });
                            result.$promise.refresh = function (newParam) {
                                result.$promise.then(function () {
                                    _service(ctrlName).call(action, newParam).$promise.then(function (response) {
                                        angular.extend(result, response.data);
                                    });
                                });
                            }
                        }
                        return result.$promise;
                    }
                    else {
                        $state.go('login');
                    }
                }
            }
            return service;
        };
        return _service;
    }]);
});