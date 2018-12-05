(function () {
    /**
     * @name 项目环境编辑
     * @author：广州银云信息科技有限公司
     */
    'use strict';
    angular.module('eolinker')
        .component('homeProjectInsideEnvOperate', {
            templateUrl: 'app/ui/content/home/project/inside/content/env/operate/index.html',
            controller: homeProjectInsideEnv
        })

    homeProjectInsideEnv.$inject = ['RESPONSE_TEXT', '$scope', 'ApiManagementResource', '$state', 'CODE', '$rootScope', 'HTTP_CONSTANT', 'Authority_CommonService', 'Operate_CommonService','$filter'];

    function homeProjectInsideEnv(RESPONSE_TEXT, $scope, ApiManagementResource, $state, CODE, $rootScope, HTTP_CONSTANT, Authority_CommonService, Operate_CommonService,$filter) {

        var vm = this;
        vm.data = {
            constant: {
                headerArray: HTTP_CONSTANT.REQUEST_HEADER
            },
            info: {
                pre: null,
                current: {
                    envName: '',
                    envDesc: '',
                    frontURI: '',
                    headerList: [{
                        headerName: '',
                        headerValue: ''
                    }],
                    paramList: [{
                        paramKey: '',
                        paramValue: ''
                    }],
                    additionalParamList: [{
                        paramKey: '',
                        paramValue: ''
                    }],
                    envAuth: {
                        status: '0'
                    }
                },
                reset: {
                    envName: '',
                    envDesc: '',
                    envID: -1,
                    frontURI: '',
                    headerList: [{
                        headerName: '',
                        headerValue: ''
                    }],
                    paramList: [{
                        paramKey: '',
                        paramValue: '',
                        paramName: ''
                    }],
                    additionalParamList: [{
                        paramKey: '',
                        paramValue: '',
                        paramName: ''
                    }],
                    envAuth: {
                        status: '0'
                    }
                }
            },
            interaction: {
                request: {
                    spaceKey: $state.params.spaceKey,
                    projectID: $state.params.projectID,
                    envID: $state.params.envID,
                    uriID: -1,
                    frontURI: '',
                    headerName: '',
                    headerValue: '',
                    paramKey: '',
                    paramValue: ''
                },
                response: {
                    headerQuery: [],
                    paramQuery: [],
                    itemNum: parseInt($state.params.itemNum || '0'),
                }
            },
            fun: {
                cancle: null, //取消功能函数
                init: null, //初始化功能函数
                click: null, //菜单单击功能函数
                add: null, //新建菜单里面功能函数
                edit: null, //编辑功能函数
                delete: {
                    sidebar: null,
                    headerList: null,
                    paramList: null
                }, //删除功能函数
            }
        }
        vm.component = {
            menuObject: {
                list: []
            }
        };
        vm.service = {
            authority: Authority_CommonService,
            root: Operate_CommonService
        }
        var assistantFun = {};
        vm.data.fun.delete.headerList = function (arg) {
            vm.data.info.current.headerList.splice(arg.$index, 1);
        }
        vm.data.fun.delete.paramList = function (arg) {
            vm.data.info.current.paramList.splice(arg.$index, 1);
        }
        vm.data.fun.delete.additionalParamList = function (arg) {
            vm.data.info.current.additionalParamList.splice(arg.$index, 1);
        }
        vm.data.fun.change = function (arg) {
            arg.item = arg.item || vm.data.info.current;
            var template = {
                reset: {},
                length: {
                    header: arg.item.headerList.length ? (arg.item.headerList.length - 1) : 0
                }
            }
            angular.copy(vm.data.info.reset, template.reset);
            if (arg.$last) {
                switch (arg.switch) {
                    case 0:
                        {
                            arg.item.headerList.push(template.reset.headerList[0]);
                            break;
                        }
                    case 1:
                        {
                            arg.item.paramList.push(template.reset.paramList[0]);
                            break;
                        }
                    case 2:
                        {
                            arg.item.additionalParamList.push(template.reset.additionalParamList[0]);
                            break;
                        }
                    default:
                        {
                            if ((!arg.item.headerList[template.length.header]) || arg.item.headerList[template.length.header].headerName || arg.item.headerList[template.length.header].headerValue) {
                                arg.item.headerList.push(template.reset.headerList[0]);
                                arg.item.paramList.push(template.reset.paramList[0]);
                                arg.item.additionalParamList.push(template.reset.additionalParamList[0]);
                            }
                            break;
                        }
                }
            }
        }
        vm.data.fun.confirm = function (arg) {
            if ($scope.ConfirmForm.$invalid) {
                $scope.ConfirmForm.envName.$dirty = true;
                return;
            }
            $scope.ConfirmForm.envName.$dirty = false;
            arg = arg || {};
            var template = {
                request: {
                    spaceKey: vm.data.interaction.request.spaceKey,
                    projectID: vm.data.interaction.request.projectID,
                    envName: vm.data.info.current.envName,
                    envDesc: vm.data.info.current.envDesc,
                    frontURI: vm.data.info.current.frontURI,
                    headers: [],
                    params: [],
                    additionalParams: [],
                    envID: vm.data.info.current.envID,
                    envAuth: '{"status":"0"}'
                },
                object: {},
                promise: null
            }
            switch (vm.data.info.current.envAuth.status) {
                case '1':
                    {
                        template.request.envAuth = JSON.stringify({
                            status: '1',
                            basicAuth: vm.data.info.current.envAuth.basicAuth
                        })
                        break;
                    }
                case '2':
                    {
                        template.request.envAuth = JSON.stringify({
                            status: '2',
                            jwtAuth: vm.data.info.current.envAuth.jwtAuth
                        })
                        break;
                    }
            }
            for (var key = 0; key < vm.data.info.current.headerList.length; key++) {
                var val = vm.data.info.current.headerList[key];
                if (val.headerName) {
                    template.request.headers.push(val);
                } else if (!val.headerName && val.headerValue) return;
            }
            for (var key = 0; key < vm.data.info.current.paramList.length; key++) {
                var val = vm.data.info.current.paramList[key];
                if (val.paramKey) {
                    template.request.params.push(val);
                } else if (!val.paramKey && (val.paramValue || val.paramName)) return;
            }
            for (var key = 0; key < vm.data.info.current.additionalParamList.length; key++) {
                var val = vm.data.info.current.additionalParamList[key];
                if (val.paramKey) {
                    template.request.additionalParams.push(val);
                } else if (!val.paramKey && (val.paramValue || val.paramName)) return;
            }
            template.request.headers = JSON.stringify(template.request.headers, function (key, val) {
                if (key == 'mouseLeave') return undefined;
                return val;
            });
            template.request.params = JSON.stringify(template.request.params, function (key, val) {
                if (key == '$$hashKey') return undefined;
                return val;
            });
            template.request.additionalParams = JSON.stringify(template.request.additionalParams, function (key, val) {
                if (key == '$$hashKey') return undefined;
                return val;
            });
            switch ($state.params.status) {
                case 'edit':
                    {
                        template.promise = ApiManagementResource.Env.Edit(template.request).$promise;
                        template.promise.then(function (response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        $rootScope.InfoModal($filter('translate')('558'), 'success');
                                        break;
                                    }
                                default:
                                    {
                                        $rootScope.InfoModal($filter('translate')('559') + RESPONSE_TEXT.FAILURE, 'error');
                                        break;
                                    }
                            }
                        })
                        break;
                    }
                default:
                    {
                        template.promise = ApiManagementResource.Env.Add(template.request).$promise;
                        template.promise.then(function (response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        vm.data.interaction.response.itemNum++;
                                        $rootScope.InfoModal( $filter('translate')('560'), 'success');
                                        vm.data.info.current.envID = response.envID;
                                        switch (arg.switch) {
                                            case 1:
                                                {
                                                    vm.data.info.current = angular.copy(vm.data.info.reset);
                                                    angular.copy(vm.data.info.reset, template.object);
                                                    break;
                                                }
                                            default:
                                                {
                                                    $state.go('home.project.inside.env.default');
                                                    break;
                                                }
                                        }
                                        break;
                                    }
                                default:
                                    {
                                        $rootScope.InfoModal($filter('translate')('561') + RESPONSE_TEXT.FAILURE, 'error');
                                        break;
                                    }
                            }
                        })
                        break;
                    }
            }
            return template.promise;
        }
        vm.data.fun.init = (function () {
            if (!vm.data.interaction.request.envID) return;
            var template = {
                request: {
                    spaceKey: vm.data.interaction.request.spaceKey,
                    projectID: vm.data.interaction.request.projectID,
                    envID: vm.data.interaction.request.envID
                }
            }
            $rootScope.global.ajax.Info_Env = ApiManagementResource.Env.Info(template.request);
            $rootScope.global.ajax.Info_Env.$promise.then(function (response) {
                vm.data.info.current = response.envInfo
                vm.data.fun.change({
                    item: vm.data.info.current,
                    switch: -1,
                    $last: 1
                });
                vm.data.info.current.envAuth = vm.data.info.current.envAuth || {
                    status: '0'
                };
                vm.data.info.current.envAuth.status = (vm.data.info.current.envAuth.status || 0).toString();
            })
        })()
        vm.$onInit = function () {
            $scope.$emit('$WindowTitleSet', {
                list: [$filter('translate')('562'), $state.params.projectName, $filter('translate')('405')]
            });
            vm.component.menuObject.list = [{
                type: 'btn',
                class: 'btn-group-li margin-left-li-20 pull-left',
                btnList: [{
                    name: $filter('translate')('465'),
                    icon: 'xiangzuo',
                    fun: {
                        default: function () {
                            $state.go('home.project.inside.env.default');
                        },
                        params: {}
                    }
                }]
            }, {
                type: 'divide',
                authority: 'edit',
                class: 'divide-li pull-left'
            }, {
                type: 'btn',
                class: 'btn-group-li pull-left',
                authority: 'edit',
                btnList: (vm.data.interaction.request.envID ? [] : [{
                    name: $filter('translate')('70'),
                    class: 'eo-button-info',
                    fun: {
                        disabled: 1,
                        default: vm.data.fun.confirm,
                        params: {
                            switch: 1
                        }
                    }
                }]).concat([{
                    name: $filter('translate')('467'),
                    class: 'eo-button-info',
                    fun: {
                        disabled: 1,
                        default: vm.data.fun.confirm
                    }
                }])
            }]

        }
    }
})();