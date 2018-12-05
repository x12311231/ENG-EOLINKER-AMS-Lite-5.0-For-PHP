(function () {
    'use strict';
    /**
     * @name EOLINKER AMS OPEN SOURCE，EOLINKER AMS开源版本
     * @link https://www.eolinker.com
     * @package EOLINKER AMS
     * @author www.eolinker.com 广州银云信息科技有限公司 2015-2018

     * EOLINKER，业内领先的Api接口管理及测试平台，为您提供最专业便捷的在线接口管理、测试、维护以及各类性能测试方案，帮助您高效开发、安全协作。
     * 如在使用的过程中有任何问题，可通过[图片]http://help.eolinker.com寻求帮助
     *
     *注意！EOLINKER AMS 开源版本遵循 GPL V3开源协议，仅供用户下载试用，禁止“一切公开使用于商业用途”或者“以 EOLINKER AMS开源版本为基础而开发的二次版本”在互联网上流通。。
     * 注意！一经发现，我们将立刻启用法律程序进行维权。
     * 再次感谢您的使用，希望我们能够共同维护国内的互联网开源文明和正常商业秩序。
     *
     * @function [项目内页相关指令js] [The project is related to the instruction js]
     * @version  3.0.2
     * @service  $scope [注入作用域服务] [inject scope service]
     * @service  $state [注入$state服务] [inject state service]
     */
    angular.module('eolinker')
        .config(['$stateProvider', 'RouteHelpersProvider', function ($stateProvider, helper) {
            $stateProvider
                .state('home', {
                    url: '/home',
                    template: '<home></home>'
                });
        }])
        .component('home', {
            template: '<div ng-class="{\'shrink-div\':$ctrl.service.sidebar.isShrink}">' +
                '<eo-navbar2></eo-navbar2>' +
                '<eo-sidebar ng-if="$ctrl.data.info.sidebarShow"></eo-sidebar>' +
                '<div class="home">' +
                '<div ui-view></div>' +
                '<div class="mask"></div>' +
                '</div>' +
                '</div>' +
                '<div id="plug-div-js">' +
                '</div>',
            controller: indexController,
        })
    indexController.$inject = ['$scope', '$state', 'Sidebar_CommonService'];

    function indexController($scope, $state, Sidebar_CommonService) {
        var vm = this;
        vm.data = {
            info: {
                shrinkObject: {},
                sidebarShow: null
            },
            fun: {
                $Home_ShrinkSidebar: null,
                init: null
            }
        }
        vm.service = {
            sidebar: Sidebar_CommonService
        }
        /**
         * @function [初始化功能函数] [initialization]
         */
        vm.data.fun.init = function (arg) {
            if (!/inside/.test(arg.key.toLowerCase())) {
                vm.data.info.sidebarShow = true;
            } else {
                vm.data.info.sidebarShow = false;
            }
        }

        vm.data.fun.init({
            key: window.location.href
        });
        $scope.$on('$locationChangeSuccess', function () {
            if (!/inside/.test($state.current.name.toLowerCase())) {
                vm.data.info.sidebarShow = true;
            } else {
                vm.data.info.sidebarShow = false;
            }
        })
    }
})();