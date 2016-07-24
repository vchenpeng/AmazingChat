define(['app', 'utils', 'jquery', 'geohash'], function (app, utils, $, geohash) {
    'use strict';
    app.controller("mapCtrl", ["$scope", "$rootScope", "ChatHub", "$ionicScrollDelegate", "$ionicPopup", "$window", "$stateParams", "$location", function ($scope, $rootScope, ChatHub, $ionicScrollDelegate, $ionicPopup, $window) {
        $rootScope.config.showFooter = true;
        $rootScope.config.showSendTextArea = false;
        $scope.model = {
            qq: ''
        };

        utils.changeTitle('陌拜助手');
        var map, ownMarker;

        function init() {
            //设置地图中心点
            var center = new qq.maps.LatLng(loc.lat, loc.lng);
            //定义工厂模式函数
            var myOptions = {
                zoom: 13,               //设置地图缩放级别
                center: center,      //设置中心点样式
                mapTypeId: qq.maps.MapTypeId.ROADMAP  //设置地图样式详情参见MapType
            }
            //获取dom元素添加地图信息
            if (!map) {
                map = new qq.maps.Map(document.getElementById("mapContainer"), myOptions);
            }
        }
        window.init = init;
        loadScript();

        ChatHub.client.GetStore = function (data) {
            var json = JSON.parse(data);
            angular.forEach(json, function (m) {
                var center = new qq.maps.LatLng(m.latitude, m.longitude);
                var marker = new qq.maps.Marker({
                    position: center,
                    animation: qq.maps.MarkerAnimation.DROP,
                    map: map
                });
                //添加到提示窗
                var info = new qq.maps.InfoWindow({
                    map: map
                });
                var opentime = m.opening_hours || [];
                //var img_root = '//fuss10.elemecdn.com/';
                //获取标记的点击事件
                qq.maps.event.addListener(marker, 'click', function () {
                    info.open();
                    //info.setContent('<div style="text-align:center;white-space:nowrap;' + 'margin:10px;">' + m.name + '</div>');
                    info.setContent('<div style="width:200px;padding-top:10px;font-size:12px;">' + '<img style="width:55px;height:55px;float:left;" src="//fuss10.elemecdn.com/' + m.image_path + '"/>'
                        + m.name + '<br />月销量数：' + m.month_sales + '<br />营业时间：' + opentime[0] + '</div>');
                    info.setPosition(center);
                });
            });
        };

        //异步加载地图库函数文件
        function loadScript() {
            //创建script标签
            var script = document.createElement("script");
            //设置标签的type属性
            script.type = "text/javascript";
            //设置标签的链接地址
            script.src = "http://map.qq.com/api/js?v=2.exp&callback=init";
            //添加标签到dom
            document.body.appendChild(script);
        }

        $.connection.hub.start({ xdomain: true }).done(function () {
            console.log('连接成功');
            ChatHub.server.conn($rootScope.data.user.ID, $rootScope.data.user.Name);
            ChatHub.server.pullAll();
        }).fail(function (e) {
            console.error('连接成功失败', e);
        });

        function getStore(lat, lng) {
            var geohash = Geohash.encode(lat, lng);
            ChatHub.server.map(geohash);
        }

        $scope.goBack = function () {
            if (map) {
                alert('回到开始位置');
                map.panTo(new qq.maps.LatLng(loc.lat, loc.lng));
            }
        };
        var loc = { lat: 39.982163, lng: 116.306070 };
        var isMapInit = false;
        var isLoadedCount = 0;
        //监听定位组件的message事件
        window.addEventListener('message', function (event) {
            loc = event.data; // 接收位置信息

            if (loc && loc.module == 'geolocation') { //定位成功,防止其他应用也会向该页面post信息，需判断module是否为'geolocation'
                //alert("坐标：x=" + loc.lat + ",y=" + loc.lng);
                isLoadedCount++;
                if (isLoadedCount == 1) {
                    var center = new qq.maps.LatLng(loc.lat, loc.lng);
                    map.panTo(new qq.maps.LatLng(loc.lat, loc.lng));
                    var anchor = new qq.maps.Point(6, 6),
                    size = new qq.maps.Size(24, 24),
                    origin = new qq.maps.Point(0, 0),
                    icon = new qq.maps.MarkerImage('/images/center.gif', size, origin, anchor);
                    ownMarker = new qq.maps.Marker({
                        position: center,
                        animation: qq.maps.MarkerAnimation.DROP,
                        icon: icon,
                        map: map
                    });
                    getStore(loc.lat, loc.lng);
                }
            } else { //定位组件在定位失败后，也会触发message, event.data为null
                console.log('定位失败');
            }

            /* 另一个使用方式 
            if (!isMapInit && !loc) { //首次定位成功，创建地图
                isMapInit = true;
                createMap(event.data);
            } else if (event.data) { //地图已经创建，再收到新的位置信息后更新地图中心点
                updateMapCenter(event.data);
            }
            */
        }, false);
        //为防止定位组件在message事件监听前已经触发定位成功事件，在此处显示请求一次位置信息
        document.getElementById("geoPage").contentWindow.postMessage('getLocation', '*');

        //设置6s超时，防止定位组件长时间获取位置信息未响应
        setTimeout(function () {
            if (!loc) {
                //主动与前端定位组件通信（可选），获取粗糙的IP定位结果
                document.getElementById("geoPage")
                    .contentWindow.postMessage('getLocation.robust', '*');
            }
        }, 6000); //6s为推荐值，业务调用方可根据自己的需求设置改时间，不建议太短
    }]);
});