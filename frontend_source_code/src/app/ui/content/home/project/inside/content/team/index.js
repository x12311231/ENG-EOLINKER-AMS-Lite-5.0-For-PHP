(function () {
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
     * @function [环境模块相关js] [Environment module related js]
     * @version  3.1.1
     * @service  $scope [注入作用域服务] [Injection scope service]
     * @service  $rootScope [注入根作用域服务] [Injection tootscope service]
     * @service  ApiManagementResource [注入接口管理接口服务] [inject ApiManagement API service]
     * @service  $state [注入路由服务] [Injection state service]
     * @service  $filter [注入过滤器服务] [Injection filter service]
     * @constant CODE [注入状态码常量] [inject status code constant service]
     */
    'use strict';
    angular.module('eolinker')
        .component('homeProjectInsideTeam', {
            templateUrl: 'app/ui/content/home/project/inside/content/team/index.html',
            controller: homeProjectInsideTeam
        })

    homeProjectInsideTeam.$inject = ['$scope', '$rootScope', 'ApiManagementResource', '$state', 'CODE', 'Authority_CommonService','$filter'];

    function homeProjectInsideTeam($scope, $rootScope, ApiManagementResource, $state,CODE, Authority_CommonService,$filter) {

        var vm = this;
        vm.data = {
            info: {
                search: {
                    submited: false,
                    leave: true,
                    isDisable: false
                },
                power: 2, //0：管理员，1：{{\'403\'|translate}}员，2：普通成员 0: admin, 1: collaboration manager, 2: regular member
                timer: {
                    fun: null
                },
            },
            interaction: {
                request: {
                    projectID: $state.params.projectID,
                    userName: ''
                },
                response: {
                    userInfo: null,
                    adminQuery: [],
                    query: []
                }
            },
            fun: {
                init: null,
                setNickName: null,
                add: null,
                setType: null,
                delete: null,
                search: null,
            }
        }
        vm.service = {
            authority: Authority_CommonService
        }
        /**
         * @function [初始化功能函数] [initialization]
         */
        vm.data.fun.init = function () {
            var template = {
                request: {
                    projectID: vm.data.interaction.request.projectID
                }
            }
            $scope.$emit('$WindowTitleSet', {
                list: [$filter('translate')('403'), $state.params.projectName]
            });

            template.promise=ApiManagementResource.Partner.Query(template.request).$promise;
            template.promise.then(function (response) {
                switch (response.statusCode) {
                    case CODE.COMMON.SUCCESS:
                        {
                            vm.data.interaction.response.adminQuery=[];
                            vm.data.interaction.response.query=[];
                            vm.data.interaction.response.query = response.partnerList;
                            for (var i = 0; i < vm.data.interaction.response.query.length; i++) {
                                switch (vm.data.interaction.response.query[i].userType - 0) { /*0 项目管理员；1 协助管理员；2 普通成员[读写]；3 普通成员[只读]*/
                                    case 0:
                                        {
                                            vm.data.interaction.response.adminQuery.push(vm.data.interaction.response.query[i]);
                                            vm.data.interaction.response.query.splice(i, 1);
                                            i--;
                                            break;
                                        }
                                    case 1:
                                        {
                                            vm.data.interaction.response.adminQuery.push(vm.data.interaction.response.query[i]);
                                            vm.data.interaction.response.query.splice(i, 1);
                                            i--;
                                            break;
                                        }
                                    default:
                                        {}
                                }
                            }
                            break;
                        }
                    default:
                        {
                            vm.data.interaction.response.query = [];
                            break;
                        }
                }
            });
            return template.promise;
        }
        /**
         * @function [设置备注名] [Hide the search box]
         */
        vm.data.fun.setNickName = function (arg) {
            var template = {};
            arg.item.groupName = arg.item.partnerNickName;
            arg.item.required = true;
            template.modal = {
                title: $filter('translate')('197'),
                secondTitle: $filter('translate')('423'),
                data: arg.item
            }
            $rootScope.GroupModal(template.modal, function (callback) {
                if (callback) {
                    ApiManagementResource.Partner.SetNickName({
                            projectID: vm.data.interaction.request.projectID,
                            nickName: callback.groupName,
                            connID: arg.item.connID
                        }).$promise
                        .then(function (response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        $rootScope.InfoModal($filter('translate')('424'), 'success');
                                        arg.item.partnerNickName = callback.groupName;
                                        break;
                                    }
                            }
                        });
                }
            });
        }

        /**
         * @function [设置用户权限] [Set user permissions]
         */
        vm.data.fun.setType = function (arg) {
            arg.item.listIsClick = false;
            var template = {
                request: {
                    projectID: vm.data.interaction.request.projectID,
                    connID: arg.item.connID,
                    userType: arg.userType
                }
            }
            ApiManagementResource.Partner.SetType(template.request).$promise
                .then(function (response) {
                    switch (response.statusCode) {
                        case CODE.COMMON.SUCCESS:
                            {
                                $rootScope.InfoModal($filter('translate')('425'), 'success');
                                arg.item.listIsClick = false;
                                switch (arg.userType - 0) {
                                    case 1:
                                        {
                                            vm.data.interaction.response.adminQuery.push(arg.item);
                                            vm.data.interaction.response.query.splice(arg.$index, 1);
                                            break;
                                        }
                                    case 2:
                                    case 3:
                                        {
                                            if (arg.item.userType < 2) {
                                                vm.data.interaction.response.query.push(arg.item);
                                                vm.data.interaction.response.adminQuery.splice(arg.$index, 1);
                                            }
                                            break;
                                        }
                                }
                                arg.item.userType = arg.userType;
                                break;
                            }
                    }
                });
        }



        /**
         * @function [移除、退出项目] [Remove, exit item]
         */
        vm.data.fun.delete = function (arg) {
            var bol = arg.item.isNow == 1 ? true : false;
            var template = {
                request: {
                    projectID: vm.data.interaction.request.projectID
                }
            }
            if (bol) {
                $rootScope.EnsureModal($filter('translate')('426'), false, $filter('translate')('427'), {}, function (callback) {
                    if (callback) {
                        ApiManagementResource.Partner.Quit(template.request).$promise
                            .then(function (response) {
                                switch (response.statusCode) {
                                    case CODE.COMMON.SUCCESS:
                                        {
                                            $state.go('home.project.default');
                                            break;
                                        }
                                }
                            });
                    }
                });

            } else {
                $rootScope.EnsureModal($filter('translate')('428'), false, $filter('translate')('429'), {}, function (callback) {
                    if (callback) {
                        ApiManagementResource.Partner.Delete({
                                projectID: vm.data.interaction.request.projectID,
                                connID: arg.item.connID
                            }).$promise
                            .then(function (response) {
                                switch (response.statusCode) {
                                    case CODE.COMMON.SUCCESS:
                                        {
                                            if (arg.isAdmin) {
                                                vm.data.interaction.response.adminQuery.splice(arg.$index, 1);
                                            } else {
                                                vm.data.interaction.response.query.splice(arg.$index, 1);
                                            }
                                            $rootScope.InfoModal($filter('translate')('430'), 'success');
                                            break;
                                        }
                                }
                            });
                    }
                });
            }
        }

        /**
         * @function [搜索用户] [searchUse]
         */
        vm.data.fun.add = function () {
            var template = {
                request: {},
                modal: {
                    title: $filter('translate')('193'),
                    request: {
                        params: {
                            projectID: vm.data.interaction.request.projectID,
                        },
                        resource: ApiManagementResource.Partner.QueryUnJoin,
                        responseKey: 'memberList',
                    }
                },
                fun: null
            }
            $rootScope.Common_SelectPersonModal(template.modal, function (callback) {
                if (callback) {
                    template.request = {
                        projectID: vm.data.interaction.request.projectID,
                        userID: JSON.stringify(callback),
                    }
                    ApiManagementResource.Partner.Add(template.request).$promise
                        .then(function (response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        vm.data.fun.init();
                                        break;
                                    }
                            }
                        });

                }
            });
        };
    }
})();