(function () {
    'use strict';
    /*
     * author：广州银云信息科技有限公司
     * api接口相关公用服务js
     */
    angular.module('eolinker')
        .service('HomeProjectApi_Service', index);

    index.$inject = ['$state','RESPONSE_TEXT', 'Cache_CommonService', '$rootScope', 'ApiManagementResource', 'CODE', 'GroupService','ENSURE_WARNIMG','$filter']

    function index($state,RESPONSE_TEXT, Cache_CommonService, $rootScope, ApiManagementResource, CODE, GroupService,ENSURE_WARNIMG,$filter) {
        var data = {
            service: {
                cache: Cache_CommonService
            },
            navbar: {
                menu: null, //菜单功能
                delete: null, //{{\'407\'|translate}}
                recover: null, //恢复接口
                deleteCompletely: null, //彻底删除接口
            }
        }
        data.navbar.menu = function (status, uri, cache) {
            var template = {
                uri: {
                    groupID: uri.groupID,
                    childGroupID: uri.childGroupID,
                    grandSonGroupID: uri.grandSonGroupID,
                    apiID: uri.apiID,
                    status: status
                },
                cache: {}
            }
            switch (status) {
                case 'list':
                    {
                        $state.go('home.project.inside.api.list', template.uri);
                        break;
                    }
                case 'detail':
                    {
                        data.service.cache.set(null);
                        $state.go('home.project.inside.api.detail', template.uri);
                        break;
                    }
                case 'test':
                    {
                        data.service.cache.set(cache);
                        $state.go('home.project.inside.api.test', template.uri);
                        break;
                    }
                case 'history':
                    {
                        $state.go('home.project.inside.api.history', template.uri);
                        break;
                    }
                case 'notice':
                    {
                        $state.go('home.project.inside.api.notice', template.uri);
                        break;
                    }
                case 'edit':
                    {
                        $state.go('home.project.inside.api.edit', template.uri);
                        break;
                    }
                case 'copy':
                    {
                        $state.go('home.project.inside.api.edit', template.uri);
                        break;
                    }
                case 'case':
                    {
                        $state.go('home.project.inside.api.case', template.uri);
                        break;
                    }
                case 'add':
                    {
                        template.cache = {
                            apiRequestParam: cache.request.params,
                            apiResultParam: [],
                            apiRestfulParam:[],
                            apiUrlParam:[],
                            responseHeader:[],
                            starred: 0,
                            apiStatus: '0',
                            apiProtocol: cache.request.httpHeader,
                            apiRequestType: cache.request.apiRequestType,
                            apiURI: cache.request.URL,
                            apiName: '',
                            groupID:-1,
                            // apiFailureStatusCode:'200',
                            // apiSuccessStatusCode:'200',
                            apiSuccessMock: data.service.cache.get(cache.testResultCache),
                            apiFailureMock: '',
                            apiHeader: cache.request.headers,
                            apiNote: '',
                            apiNoteRaw: '',
                            apiNoteType: '0',
                            apiRequestParamType: cache.request.requestType,
                            apiRequestRaw: cache.request.raw,
                            mockRule: [],
                            mockResult: '',
                            mockConfig: {
                                type: 'object'
                            },
                            apiAuth: cache.request.auth
                        };
                        template.uri.groupID = -1;
                        console.log(template.cache);
                        data.service.cache.set(template.cache, 'testInfo');
                        $state.go('home.project.inside.api.edit', template.uri);
                        break;
                    }
            }
        }
        data.navbar.delete = function (arg) {
            var template = {
                request: {
                    spaceKey: arg.spaceKey,
                    projectID: arg.projectID,
                    apiID: '[' + arg.apiID + ']'
                },
                uri: {
                    groupID: arg.groupID,
                    childGroupID: arg.childGroupID,
                    grandSonGroupID:arg.grandSonGroupID
                }
            }
            $rootScope.EnsureModal($filter('translate')('407'), false, $filter('translate')('408'), {}, function (callback) {
                if (callback) {
                    ApiManagementResource.Api.Delete(template.request).$promise
                        .then(function (response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        $state.go('home.project.inside.api.list', template.uri);
                                        $rootScope.InfoModal($filter('translate')('409'), 'success');
                                        break;
                                    }
                            }
                        })
                }
            });
        }
        data.navbar.recover = function (arg) {
            var template = {
                modal: {
                    list: angular.copy(GroupService.get()),
                    title: $filter('translate')('410')
                },
                request: {
                    spaceKey: arg.spaceKey,
                    projectID: arg.projectID,
                    apiID: '[' + arg.apiID + ']',
                    groupID: ''
                },
                uri: {
                    groupID: arg.groupID,
                    childGroupID: arg.childGroupID,
                    grandSonGroupID:arg.grandSonGroupID
                }
            }
            if (!template.modal.list) {
                $rootScope.InfoModal($filter('translate')('411'), 'error');
                return;
            }
            $rootScope.SelectVisualGroupModal(template.modal, function (callback) {
                if (callback) {
                    template.request.groupID = callback.groupID;
                    ApiManagementResource.Trash.Recover(template.request).$promise
                        .then(function (response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        $rootScope.InfoModal($filter('translate')('412'), 'success');
                                        $state.go('home.project.inside.api.list', template.uri);
                                        break;
                                    }
                            }
                        })
                }
            });
        }
        data.navbar.deleteCompletely = function (arg) {
            var template = {
                request: {
                    spaceKey: arg.spaceKey,
                    projectID: arg.projectID,
                    apiID: '[' + arg.apiID + ']'
                },
                uri: {
                    groupID: arg.groupID,
                    childGroupID: arg.childGroupID,
                    grandSonGroupID:arg.grandSonGroupID
                }
            }
            $rootScope.EnsureModal($filter('translate')('413'), false,ENSURE_WARNIMG.DELETE, {}, function (callback) {
                if (callback) {
                    ApiManagementResource.Trash.Delete(template.request).$promise
                        .then(function (response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        $state.go('home.project.inside.api.list', template.uri);
                                        $rootScope.InfoModal($filter('translate')('414'), 'success');
                                        break;
                                    }
                                default:
                                    {
                                        $rootScope.InfoModal($filter('translate')('385') + RESPONSE_TEXT.FAILURE, 'error');
                                        break;
                                    }
                            }
                        })
                }
            });
        }
        return data;
    }
})();