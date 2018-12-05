(function () {
    /**
     * @name API详情
     * @author 广州银云信息科技有限公司 
     */
    'use strict';
    angular.module('eolinker')
        .component('homeProjectInsideApiDetail', {
            templateUrl: 'app/ui/content/home/project/inside/content/api/detail/index.html',
            controller: indexController
        })
        .run(['$anchorScroll', function ($anchorScroll) {
            $anchorScroll.yOffset = 110;
            // 在此处配置偏移量
        }])

    indexController.$inject = ['RESPONSE_TEXT', '$scope', '$location', '$anchorScroll', 'Authority_CommonService', 'ApiManagementResource', '$state', 'CODE', '$rootScope', 'Cache_CommonService', 'Operate_CommonService', 'HomeProjectApi_Service', 'GroupService','$filter'];

    function indexController(RESPONSE_TEXT, $scope, $location, $anchorScroll, Authority_CommonService, ApiManagementResource, $state, CODE, $rootScope,  Cache_CommonService, Operate_CommonService, HomeProjectApi_Service, GroupService,$filter) {
        var vm = this;
        vm.data = {
            text1:'<p>{{\'228\'|translate}}</p>',
            text:'<p>{{\'229\'|translate}}</p>',
            info: {
                statusList: [{
                        name: $filter('translate')('58'),
                        value: 0,
                        class: 'eo-status-success'
                    },
                    {
                        name: $filter('translate')('60'),
                        value: 1,
                        class: 'eo-status-warning'
                    },
                    {
                        name: $filter('translate')('62'),
                        value: 2,
                        class: 'eo-status-tips'
                    },
                    {
                        name: $filter('translate')('64'),
                        value: 3,
                        class: 'eo-status-yellow'
                    },
                    {
                        name: $filter('translate')('65'),
                        value: 8,
                        class: 'eo-status-purple'
                    },
                    {
                        name: $filter('translate')('59'),
                        value: 4,
                        class: 'eo-status-default'
                    },
                    {
                        name: $filter('translate')('61'),
                        value: 5,
                        class: 'eo-status-default'
                    },
                    {
                        name: $filter('translate')('63'),
                        value: 6,
                        class: 'eo-status-default'
                    },
                    {
                        name: 'BUG',
                        value: 7,
                        class: 'eo-status-danger'
                    }
                ],
                mock: {
                    isFailure: false
                }
            },
            interaction: {
                request: {
                    spaceKey: $state.params.spaceKey,
                    apiID: $state.params.apiID,
                    projectID: $state.params.projectID,
                    groupID: $state.params.groupID,
                    childGroupID: $state.params.childGroupID,
                    grandSonGroupID: $state.params.grandSonGroupID
                },
                response: {
                    apiInfo: null
                }
            },
            fun: {
                init: null, //初始化功能函数
                showRequestValue: null, //显示请求参数示例
                storage: null, //星标功能函数
                set: null //跳转设置函数
            }
        }
        vm.service = {
            home: Operate_CommonService,
            authority: Authority_CommonService,
            default: HomeProjectApi_Service,
        };
        vm.component = {
            menuObject: {
                list: null,
                otherObject: null
            }
        }
        var fun = {};
        fun.initGroupInfo = function (arg) {
            var template = {
                groupInfo: '',
                groupObject: {},
                request: GroupService.get(),
            }
            angular.forEach(template.request, function (val, key) {
                template.groupObject[val.groupID] = val.groupName;
                angular.forEach(val.childGroupList, function (childVal, childKey) {
                    template.groupObject[childVal.groupID] = childVal.groupName;
                    angular.forEach(childVal.childGroupList, function (grandSonVal, grandSonKey) {
                        template.groupObject[grandSonVal.groupID] = grandSonVal.groupName;
                    })
                })
            })
            if (template.request) {
                template.groupInfo = template.groupObject[arg.groupID];
                if (arg.parentGroupID) {
                    template.groupInfo = template.groupObject[arg.parentGroupID] + ' > ' + template.groupInfo;
                    if (arg.topParentGroupID) {
                        template.groupInfo = template.groupObject[arg.topParentGroupID] + ' > ' + template.groupInfo;
                    }
                }
                vm.data.interaction.response.apiInfo.baseInfo.sgroupInfo = template.groupInfo;
            }
        }
        fun.initRecentViewApi = function (arg) {
            var template = {
                storage: null,
            }
            try {
                template.storage = JSON.parse(window.localStorage['API_RECENT_VIEW']) || {
                    apiList: []
                };
            } catch (e) {
                template.storage = {
                    apiList: []
                };
            }
            if (template.storage.projectID != vm.data.interaction.request.projectID) {
                template.storage = {
                    apiList: []
                };
            } else {
                angular.forEach(template.storage.apiList, function (val, key) {
                    if (vm.data.interaction.request.apiID == val.apiID) {
                        template.storage.apiList.splice(key, 1);
                    }
                });
                if (template.storage.apiList.length == 6) {
                    template.storage.apiList.splice(-1, 1);
                };
            }
            template.storage.projectID = vm.data.interaction.request.projectID;
            template.storage.apiList.unshift({
                apiID: vm.data.interaction.request.apiID,
                apiRequestType: arg.apiRequestType,
                groupID: vm.data.interaction.response.apiInfo.baseInfo.removed == 1 ? -2 : null,
                apiName: arg.apiName
            })
            window.localStorage.setItem('API_RECENT_VIEW', JSON.stringify(template.storage));
            return template.storage.apiList;
        }
        vm.data.fun.set = function (info) {
            console.log(vm.data.interaction.request, info)
            var template = {
                uri: {
                    groupID: vm.data.interaction.request.groupID,
                    childGroupID: vm.data.interaction.request.childGroupID,
                    grandSonGroupID: vm.data.interaction.request.grandSonGroupID,
                    apiID: vm.data.interaction.request.apiID,
                    status: 'edit'
                }
            }
            window.open($state.href('home.project.inside.api.edit', template.uri) + '#' + info, '_blank');
        }
        vm.data.fun.changeApiStatus = function (arg) {
            var template = {
                request: {
                    spaceKey: vm.data.interaction.request.spaceKey,
                    projectID: vm.data.interaction.request.projectID,
                    apiID: '[' + vm.data.interaction.request.apiID + ']',
                    apiStatus: arg.item.value
                }
            }
            ApiManagementResource.Api.ChangeStatus(template.request).$promise
                .then(function (response) {
                    switch (response.statusCode) {
                        case CODE.COMMON.SUCCESS:
                            {
                                vm.data.interaction.response.apiInfo.baseInfo.apiStatus = arg.item.value;
                                vm.data.interaction.response.apiInfo.baseInfo.status = arg.item.name;
                                $rootScope.InfoModal($filter('translate')('445'), 'success');
                                break;
                            }
                        default:
                            {
                                $rootScope.InfoModal($filter('translate')('446') + RESPONSE_TEXT.FAILURE, 'error');
                                break;
                            }
                    }
                })
        }
        // fun.releaseStructure=function(arg){
        //     var template = {
        //         key: null,
        //         request: [],
        //     }
        //     angular.copy(arg, template.request);
        //     template.key = 0;
        //     angular.forEach(arg, function (val, key) {
        //         template.key++;
        //         if (!val.structureID) return;
        //         template.request.splice(--template.key, 1);
        //         angular.forEach(val.structureData, function (val1, key1) {
        //             val1.structureID = val.structureID;
        //             template.request.splice(template.key++, 0, val1);
        //         })
        //     })
        //     return template.request;
        // }
        vm.data.fun.init = function () {
            var template = {
                request: {
                    spaceKey: vm.data.interaction.request.spaceKey,
                    projectID: vm.data.interaction.request.projectID,
                    apiID: vm.data.interaction.request.apiID
                }
            }
            $rootScope.global.ajax.Detail_Api = ApiManagementResource.Api.Detail(template.request);
            $rootScope.global.ajax.Detail_Api.$promise.then(function (response) {
                switch (response.statusCode) {
                    case CODE.COMMON.SUCCESS:
                        {
                            vm.data.interaction.response.apiInfo = response.apiInfo;
                            fun.initGroupInfo(vm.data.interaction.response.apiInfo.baseInfo);
                            vm.data.info.recentApiList = fun.initRecentViewApi({
                                apiRequestType: vm.data.interaction.response.apiInfo.baseInfo.apiRequestType,
                                apiName: vm.data.interaction.response.apiInfo.baseInfo.apiName
                            });
                            $scope.$emit('$WindowTitleSet', {
                                list: [$filter('translate')('447') + response.apiInfo.baseInfo.apiName, $filter('translate')('448'), $state.params.projectName, $filter('translate')('405')]
                            });
                            vm.data.info.menuType = (response.apiInfo.requestInfo.length > 0 && response.apiInfo.baseInfo.apiRequestParamType != 1) || (response.apiInfo.baseInfo.apiRequestParamType == 1 && response.apiInfo.baseInfo.apiRequestRaw) ? 'body' : response.apiInfo.restfulParam.length > 0 ? 'restful' : response.apiInfo.urlParam.length > 0 ? 'urlParam' : 'body';
                            switch (response.apiInfo.baseInfo.apiProtocol) {
                                case 0:
                                    vm.data.interaction.response.apiInfo.baseInfo.protocol = 'HTTP';
                                    break;
                                case 1:
                                    vm.data.interaction.response.apiInfo.baseInfo.protocol = 'HTTPS';
                                    break;
                            }
                            switch (response.apiInfo.baseInfo.apiStatus) {
                                case 0:
                                    vm.data.interaction.response.apiInfo.baseInfo.status = $filter('translate')('58');
                                    break;
                                case 1:
                                    vm.data.interaction.response.apiInfo.baseInfo.status = $filter('translate')('60');
                                    break;
                                case 2:
                                    vm.data.interaction.response.apiInfo.baseInfo.status = $filter('translate')('62');
                                    break;
                                case 3:
                                    vm.data.interaction.response.apiInfo.baseInfo.status = $filter('translate')('64');
                                    break;
                                case 4:
                                    vm.data.interaction.response.apiInfo.baseInfo.status = $filter('translate')('59');
                                    break;
                                case 5:
                                    vm.data.interaction.response.apiInfo.baseInfo.status = $filter('translate')('61');
                                    break;
                                case 6:
                                    vm.data.interaction.response.apiInfo.baseInfo.status = $filter('translate')('63');
                                    break;
                                case 7:
                                    vm.data.interaction.response.apiInfo.baseInfo.status = 'BUG';
                                    break;
                                case 8:
                                    vm.data.interaction.response.apiInfo.baseInfo.status = $filter('translate')('65');
                                    break;
                            }
                            vm.data.interaction.response.apiInfo.resultInfo = $filter('paramLevelFilter')(vm.data.interaction.response.apiInfo.resultInfo);
                            vm.service.home.envObject.object.model = {
                                baseInfo: {
                                    apiURI: response.apiInfo.baseInfo.apiURI,
                                    apiRequestRaw: response.apiInfo.baseInfo.apiRequestRaw,
                                    apiRequestParamType: response.apiInfo.baseInfo.apiRequestParamType
                                },
                                headerInfo: response.apiInfo.headerInfo,
                                urlParam: response.apiInfo.urlParam
                            };
                            // response.apiInfo.requestInfo=fun.releaseStructure(response.apiInfo.requestInfo);
                            vm.service.home.envObject.object.model.requestInfo = $filter('paramLevelFilter')(response.apiInfo.requestInfo);
                            vm.data.interaction.response.apiInfo.restfulParam = $filter('paramLevelFilter')(response.apiInfo.restfulParam);
                            vm.data.interaction.response.apiInfo.baseInfo.apiNoteHtml = $filter('XssFilter')(vm.data.interaction.response.apiInfo.baseInfo.apiNote, {
                                onIgnoreTagAttr: function (tag, name, value, isWhiteAttr) {
                                    if (/(style)|(class)|(id)|(name)/.test(name)) {
                                        return name + '="' + value + '"';
                                    }
                                }
                            });
                            vm.component.menuObject.otherObject = angular.copy(vm.data.interaction.response.apiInfo);
                            $scope.$emit('$TransferStation', {
                                state: '$EnvInitReady',
                                data: {
                                    status: 1,
                                    param: angular.toJson(vm.service.home.envObject.object.model)
                                }
                            });
                            break;
                        }
                }
            })
            return $rootScope.global.ajax.Detail_Api.$promise;
        }
        vm.data.fun.storage = function () {
            var template = {
                request: {
                    spaceKey: vm.data.interaction.request.spaceKey,
                    projectID: vm.data.interaction.request.projectID,
                    apiID: vm.data.interaction.request.apiID
                }
            }
            if ($rootScope.global.ajax.Star_Api) $rootScope.global.ajax.Star_Api.$cancelRequest();
            switch (vm.data.interaction.response.apiInfo.baseInfo.starred) {
                case 0:
                    {
                        $rootScope.global.ajax.Star_Api = ApiManagementResource.Star.Add(template.request);
                        $rootScope.global.ajax.Star_Api.$promise.then(function (response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        vm.data.interaction.response.apiInfo.baseInfo.starred = 1;
                                        break;
                                    }
                            }
                        });
                        break;
                    }
                case 1:
                    {
                        $rootScope.global.ajax.Star_Api = ApiManagementResource.Star.Delete(template.request);
                        $rootScope.global.ajax.Star_Api.$promise.then(function (response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        vm.data.interaction.response.apiInfo.baseInfo.starred = 0;
                                        break;
                                    }
                            }
                        });
                        break;
                    }
            }
        }
        vm.data.fun.anchor = function (info) {
            $location.hash(info);
            $anchorScroll();
        };
        vm.$onInit = function () {
            var template = {
                array: [],
                menu: []
            }
            switch (vm.data.interaction.request.groupID) {
                case '-2':
                    {
                        template.array = [{
                            type: 'fun-list',
                            class: 'btn-li sort-btn-li pull-left',
                            authority: 'edit',
                            name: $filter('translate')('449'),
                            icon: 'caidan',
                            click: true,
                            funList: [{
                                name: $filter('translate')('450'),
                                icon: 'shuaxin',
                                fun: {
                                    default: vm.service.default.navbar.recover,
                                    params: JSON.stringify(vm.data.interaction.request)
                                }
                            }, {
                                name: $filter('translate')('451'),
                                icon: 'shanchu',
                                fun: {
                                    default: vm.service.default.navbar.deleteCompletely,
                                    params: JSON.stringify(vm.data.interaction.request)
                                }
                            }]
                        }]
                        break;
                    }
                default:
                    {
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
                        }];
                        template.menu = [{
                            name: $filter('translate')('374'),
                            fun: {
                                default: vm.service.default.navbar.menu,
                                params: '\'test\',' + JSON.stringify(vm.data.interaction.request) + ',vm.otherObject'
                            }
                        },  {
                            name: $filter('translate')('453'),
                            fun: {
                                default: vm.service.default.navbar.menu,
                                params: '\'history\',' + JSON.stringify(vm.data.interaction.request)
                            }
                        }]
                        break;
                    }
            }
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
                    class: 'elem-active'
                }].concat(template.menu)
            }, {
                type: 'divide',
                class: 'divide-li pull-left',
                authority: 'edit'
            }].concat(template.array);
        }
    }
})();