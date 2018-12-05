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
       * @description 分组/表组件
       * @extend {object} authorityObject 权限类{edit}
       * @extend {object} funObject 第一部分功能集类{showVar,btnGroupList{edit:{fun,key,class,showable,icon,tips},sort:{default,cancel,confirm:{fun,key,showable,class,icon,tips}}}}
       * @extend {object} sortObject 排序信息{sortable,groupForm}
       * @extend {object} mainObject 主类{level,extend,query,baseInfo:{name,id,child,fun:{edit,delete},parentFun:{addChild}}}
       */
    angular.module('eolinker')
        .component('sidebarCommonComponent', {
            templateUrl: 'app/component/common/sidebar/index.html',
            controller: indexController,
            bindings: {
                mainObject: '<',
            }
        })

    indexController.$inject = ['$scope', '$state', 'NavbarService', 'Sidebar_CommonService'];

    function indexController($scope, $state, NavbarService,Sidebar_CommonService) {
        var vm = this;
        vm.data = {
            current: null,
            isClick: false
        }
        vm.fun = {};
        vm.service = {
            default: NavbarService,
            sidebar: Sidebar_CommonService
        }
        vm.fun.stopPropagation = function ($event) {
            $event.stopPropagation();
        }
        vm.fun.initMenu = function (arg) {
            if ($state.current.name.indexOf(arg.item.sref) > -1) {
                vm.data.current = arg.item;
                if (arg.item.childList) {
                    vm.service.sidebar.isShrink = false;
                    vm.service.default.info.navigation = {
                        query: vm.mainObject.baseInfo.navigation || [{
                            name: arg.item.name
                        }]
                    }
                    for (var $index = 0; $index < arg.item.childList.length; $index++) {
                        var val = arg.item.childList[$index];
                        if ($state.current.name.indexOf(val.sref) > -1 || $state.current.name.indexOf(val.otherSref) > -1) {
                            vm.service.default.info.navigation.current = val.name;
                            break;
                        }
                    }
                } else {
                    if (arg.item.staticDisplay) {
                        vm.service.sidebar.isShrink = false;
                    } else {
                        vm.service.sidebar.isShrink = true;
                    }
                    vm.service.default.info.navigation = {
                        query: vm.mainObject.baseInfo.navigation || null,
                        current: arg.item.name
                    }
                }
            }
        }
        vm.fun.menu = function (arg, status) {
            window.sessionStorage.removeItem('COMMON_SEARCH_TIP');
            vm.data.mouseenter = false;
            vm.data.isClick = true;
            if (!arg.item.href) {
                vm.data.current = arg.parentItem ? arg.parentItem : arg.item;
                if (arg.item.childList) {
                    vm.service.sidebar.isShrink = false;
                    vm.service.default.info.navigation = {
                        query: vm.mainObject.baseInfo.navigation || [{
                            name: arg.item.name
                        }],
                        current: arg.item.childList[0].name
                    }
                } else {
                    if (arg.parentItem || arg.item.staticDisplay) {
                        vm.service.sidebar.isShrink = false;
                    } else {
                        vm.service.sidebar.isShrink = true;
                    }

                    switch (status) {
                        case 'child':
                            {
                                vm.service.default.info.navigation.current = arg.item.name;
                                break;
                            }
                        default:
                            {
                                vm.service.default.info.navigation = {
                                    query: vm.mainObject.baseInfo.navigation || null,
                                    current: arg.item.name
                                }
                                break
                            }
                    }
                }
            }
            if (arg.item.childSref) {
                if (arg.item.otherChildSref && $state.params.spaceKey) {
                    $state.go(arg.item.otherChildSref, arg.item.otherParams);
                } else {
                    $state.go(arg.item.childSref, arg.item.params);
                }
            } else if (arg.item.sref) {
                $state.go(arg.item.sref, arg.item.params);
            } else {
                window.open(arg.item.href);
            }
        }
        vm.fun.mouseover = function ($event, arg) {
            if (vm.data.isClick && $state.current.name.indexOf(arg.item.sref) > -1) {
                $event.stopPropagation();
            }
        }
        $scope.$on('$stateChangeSuccess', function () {
            if (vm.data.current && $state.current.name.indexOf(vm.data.current.sref) == -1 && $state.current.sidebarIndex) {
                var template = {
                    splitQuery: $state.current.sidebarIndex.split('|')
                }
                try {
                    template.splitQuery.map(function (val, key) {
                        vm.fun.initMenu({
                            item: vm.mainObject.baseInfo.menu[val]
                        });
                    })
                } catch (e) {}
            }
            if ($state.current.navName) {
                try {
                    vm.service.default.info.navigation.current = $state.current.navName;
                } catch (e) {}
            }
            vm.service.default.info.navigation.extra = null;
        })
    }
})();