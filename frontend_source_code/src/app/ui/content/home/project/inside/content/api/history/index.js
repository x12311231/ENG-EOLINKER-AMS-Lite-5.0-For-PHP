(function () {
    /**
     * @name API版本
     * @author 广州银云信息科技有限公司 
     */
    'use strict';
    angular.module('eolinker')
        .component('homeProjectInsideApiHistory', {
            templateUrl: 'app/ui/content/home/project/inside/content/api/history/index.html',
            controller: indexController
        })

    indexController.$inject = ['$scope','ENSURE_WARNIMG', 'ApiManagementResource', '$state', 'CODE', '$rootScope', 'HomeProjectApi_Service', 'Authority_CommonService','$filter'];

    function indexController($scope,ENSURE_WARNIMG,ApiManagementResource, $state, CODE, $rootScope, HomeProjectApi_Service, Authority_CommonService,$filter) {
        var vm = this;
        vm.data = {
            info: {
                apiName: '',
                pagination: {
                    pages: '',
                    maxSize: 5,
                    pageSize: 15,
                    page: 1,
                    msgCount: 0,
                    jumpPage: ""
                },
            },
            interaction: {
                request: {
                    spaceKey: $state.params.spaceKey,
                    projectID: $state.params.projectID,
                    groupID: $state.params.groupID,
                    childGroupID: $state.params.childGroupID,
                    grandSonGroupID: $state.params.grandSonGroupID,
                    apiID: $state.params.apiID
                },
                response: {
                    query: null
                }
            },
            fun: {
                init: null, //初始化功能函数
                deleteHistory: null, //{{\'471\'|translate}}
                toggleHistory: null, //切换{{\'453\'|translate}}记录
            }
        }
        vm.service= {
            default: HomeProjectApi_Service,
            authority: Authority_CommonService,
        }
        vm.component = {
            menuObject: {
                list: null
            },
        }
        var data = {
            historyInfo: null
        }
        var assistantFun = {};
        vm.data.fun.pageChanged = function () {
            $scope.$broadcast('$Init_LoadingCommonComponent');
        }
        vm.data.fun.init = function () {
            var template = {
                request: {
                    spaceKey: vm.data.interaction.request.spaceKey,
                    projectID: vm.data.interaction.request.projectID,
                    apiID: vm.data.interaction.request.apiID,
                    page: vm.data.info.pagination.page,
                    pageSize: vm.data.info.pagination.pageSize
                }
            }
            $rootScope.global.ajax.HistoryList_Api = ApiManagementResource.Api.HistoryList(template.request);
            $rootScope.global.ajax.HistoryList_Api.$promise.then(function (response) {
                switch (response.statusCode) {
                    case CODE.COMMON.SUCCESS:
                        {
                            vm.data.interaction.response.query = response.apiHistoryList;
                            vm.data.info.pagination.pages = response.pageCount;
                            vm.data.info.pagination.msgCount = response.historyCount;
                            break;
                        }
                }
                vm.data.info.apiName = response.apiName;
                $scope.$emit('$WindowTitleSet', {
                    list: [$filter('translate')('470') + response.apiName, $filter('translate')('448'), $state.params.projectName, $filter('translate')('405')]
                });
            })
            return $rootScope.global.ajax.HistoryList_Api.$promise;
        }
        vm.data.fun.deleteHistory = function (arg) {
            var template = {
                request: {
                    spaceKey: vm.data.interaction.request.spaceKey,
                    projectID: vm.data.interaction.request.projectID,
                    apiHistoryID: arg.item.historyID,
                    apiID: arg.item.apiID
                }
            }
            $rootScope.EnsureModal($filter('translate')('471'), false, ENSURE_WARNIMG.DELETE, {}, function (callback) {
                if (callback) {
                    ApiManagementResource.Api.DeleteHistory(template.request).$promise
                        .then(function (response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        vm.data.interaction.response.query.splice(arg.$index, 1);
                                        $rootScope.InfoModal($filter('translate')('472'), 'success');
                                        break;
                                    }
                                default:
                                    {
                                        $rootScope.InfoModal($filter('translate')('473'), 'error');
                                        break;
                                    }
                            }
                        })
                }
            });
        }
        vm.data.fun.showUpdateDesc = function (arg) {
            $rootScope.MessageModal($filter('translate')('256'), '<pre style="overflow:auto">' + arg.item.updateDesc + '</pre>');

        }
        vm.data.fun.toggleHistory = function (arg) {
            switch (arg.origin) {
                case 'compare-component':
                    {
                        arg.item = data.historyInfo;
                        break;
                    }
            }
            var template = {
                request: {
                    spaceKey: vm.data.interaction.request.spaceKey,
                    projectID: vm.data.interaction.request.projectID,
                    apiHistoryID: arg.item.historyID,
                    apiID: arg.item.apiID
                }
            }
            if ($rootScope.global.ajax.toggleHistory_Api) $rootScope.global.ajax.toggleHistory_Api.$cancelRequest();
            $rootScope.global.ajax.toggleHistory_Api = ApiManagementResource.Api.toggleHistory(template.request);
            $rootScope.global.ajax.toggleHistory_Api.$promise.then(function (response) {
                switch (response.statusCode) {
                    case CODE.COMMON.SUCCESS:
                        {
                            for (var i = 0; i < vm.data.interaction.response.query.length; i++) {
                                if (vm.data.interaction.response.query[i].isNow == 1) {
                                    vm.data.interaction.response.query[i].isNow = 0;
                                    break;
                                }
                            }
                            arg.item.isNow = 1;
                            $rootScope.InfoModal($filter('translate')('474'), 'success');
                            break;
                        }
                }
            })
            return $rootScope.global.ajax.toggleHistory_Api.$promise;
        }

        vm.$onInit = function () {
            var template = {
                array: []
            }
            template.array = [{
                type: 'btn',
                class: 'btn-group-li pull-left',
                authority: 'edit',
                btnList: [{
                    name: $filter('translate')('324'),
                    icon: 'bianji',
                    fun: {
                        default: vm.service.default.navbar.menu,
                        params: '\'edit\',' + JSON.stringify(vm.data.interaction.request)
                    }
                }]
            }, {
                type: 'fun-list',
                class: 'btn-li sort-btn-li pull-left',
                authority: 'edit',
                name: $filter('translate')('449'),
                icon: 'caidan',
                click: true,
                funList: [{
                    name: $filter('translate')('452'),
                    icon: 'renwuguanli',
                    fun: {
                        default: vm.service.default.navbar.menu,
                        params: '\'copy\',' + JSON.stringify(vm.data.interaction.request)
                    }
                }, {
                    name: $filter('translate')('259'),
                    icon: 'shanchu',
                    fun: {
                        default: vm.service.default.navbar.delete,
                        params: JSON.stringify(vm.data.interaction.request)
                    }
                }]
            }]
            vm.component.menuObject.list = [{
                type: 'btn',
                class: 'margin-left-li-20 btn-group-li pull-left',
                btnList: [{
                    name: $filter('translate')('454'),
                    icon: 'xiangzuo',
                    fun: {
                        default: vm.service.default.navbar.menu,
                        params: '\'list\',' + JSON.stringify(vm.data.interaction.request)
                    }
                }]
            }, {
                type: 'tabs',
                class: 'menu-li pull-left first-menu-li',
                tabList: [{
                    name: $filter('translate')('421'),
                    fun: {
                        default: vm.service.default.navbar.menu,
                        params: '\'detail\',' + JSON.stringify(vm.data.interaction.request)
                    }

                }, {
                    name: $filter('translate')('374'),
                    authority: 'test',
                    fun: {
                        default: vm.service.default.navbar.menu,
                        params: '\'test\',' + JSON.stringify(vm.data.interaction.request)
                    }
                },  {
                    name: $filter('translate')('453'),
                    class: 'elem-active'
                }]
            }, {
                type: 'divide',
                class: 'divide-li pull-left',
                authority: 'edit'
            }].concat(template.array);
        }
    }
})();