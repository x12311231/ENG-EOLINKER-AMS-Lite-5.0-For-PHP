(function () {
    /**
     * @name 环境组件
     * @author 广州银云信息科技有限公司
     * @param [object] authorityObject 操作权限
     * @param [string] mark 定位模块资源
     * @param [object] envModel 模型
     * @param [object] totalEnv 完整环境变量数据
     */
    'use strict';
    angular.module('eolinker')
        .component('envAmsComponent', {
            templateUrl: 'app/component/ams/env/index.html',
            controller: indexController,
            bindings: {
                authorityObject: '<',
                mark: '@',
                envModel: '=',
                totalEnv: '=',
                inputObject:'<'
            }
        })

    indexController.$inject = ['$scope', 'Cache_CommonService','$state', '$filter', '$timeout', 'Operate_CommonService', '$document', 'DOMAIN_CONSTANT'];

    function indexController($scope, Cache_CommonService, $state, $filter, $timeout, Operate_CommonService, $document, DOMAIN_CONSTANT) {
        var vm = this;
        vm.data = {
            model: {},
            itemStatus: 'hidden'
        }
        vm.interaction = {
            response: {
                query: null
            }
        };
        vm.fun = {};
        var data = {
                timer: null,
                reset: false,
                domainRegex: '^(((http|ftp|https):\/\/)|)(([\\\w\\\-_]+([\\\w\\\-\\\.]*)?(\\\.(' + DOMAIN_CONSTANT.join('|') + ')))|((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))|(localhost))((\\\/)|(\\\?)|(:)|($))'
            },
            service = {
                ams: Operate_CommonService,
                cache: Cache_CommonService
            },
            resource = {
                GET_ENV_QUERY: null
            },
            fun = {},
            interaction = {
                request: {
                    shareID: $state.params.shareID,
                    projectID: $state.params.projectID,
                    spaceKey: $state.params.spaceKey
                },
                response: {
                    apiList: []
                }
            },
            storage = {},
            broadcast = {
                $EnvInitReady: {
                    status: 0,
                    param: '',
                    result: '',
                    header: '',
                    additionalParams: '',
                    uri: ''
                }
            };

        /**
         * @description 修饰环境队列
         */
        fun.parseEnvQuery = function () {
            var envItem = null;
            var template = {
                cache: null
            }
            switch (vm.mark) {
                case 'share':
                    {

                        template.cache = service.cache.get('envID_envDirective');
                        break;
                    }
                default:
                    {
                        template.cache = storage[interaction.request.projectID];
                        break;
                    }
            }
            if (template.cache) {
                for (var key = 0; key < vm.interaction.response.query.length; key++) {
                    var val = vm.interaction.response.query[key];
                    if (val.envID == template.cache) {
                        envItem = val;
                        break;
                    }
                }
            }
            switch (broadcast.$EnvInitReady.status) {
                case 0:
                    {
                        service.cache.set(vm.interaction.response.query, 'ENV_QUERY_AMS_COMPONENT');
                        break;
                    }
            }
            try {
                vm.totalEnv = angular.copy(envItem || {});
            } catch (e) {}
            if (envItem) {
                fun.bindEnv(angular.copy(envItem));
            } else {
                vm.data.model = {
                    envName: '',
                    frontURI: '',
                    headerList: [],
                    paramList: [],
                    additionalParamList: [],
                    envAuth: {
                        status: 0
                    }
                }
                switch (broadcast.$EnvInitReady.status) {
                    case 1:
                    case 2:
                        {
                            broadcast.$EnvInitReady.result = broadcast.$EnvInitReady.param;
                            break;
                        }
                }
            }
        }
        /**
         * @description 选择环境处理模型函数
         * @param {object} envItem 
         */
        fun.bindEnv = function (envItem) {
            switch (broadcast.$EnvInitReady.status) {
                case 0:
                    {
                        service.ams.envObject.object.model.map(function (val, key) {
                            val.apiURI = interaction.response.apiList[key].apiURI;
                            angular.forEach(envItem.paramList, function (childVal, childKey) {
                                val.apiURI = $filter('RegexFilter')('{{' + childVal.paramKey + '}}', childVal.paramValue, val.apiURI);
                            })
                            if (!new RegExp(data.domainRegex).test(val.apiURI)) {
                                val.apiURI = (envItem.frontURI||'') + val.apiURI;
                            }
                        })
                        break;
                    }
                case 1:
                    {
                        broadcast.$EnvInitReady.result = broadcast.$EnvInitReady.param;
                        if (envItem.paramList.length > 0) {
                            var templateResult = {};
                            angular.copy(angular.fromJson(broadcast.$EnvInitReady.param), templateResult);
                            angular.forEach(envItem.paramList, function (val, key) {
                                templateResult.baseInfo.apiURI = $filter('RegexFilter')('{{' + val.paramKey + '}}', val.paramValue, templateResult.baseInfo.apiURI);
                                angular.forEach(templateResult[broadcast.$EnvInitReady.header], function (val1, key1) {
                                    val1.headerValue = $filter('RegexFilter')('{{' + val.paramKey + '}}', val.paramValue, val1.headerValue);
                                    val1.headerName = $filter('RegexFilter')('{{' + val.paramKey + '}}', val.paramValue, val1.headerName);
                                })
                                angular.forEach(templateResult.urlParam, function (val1, key1) {
                                    val1.paramKey = $filter('RegexFilter')('{{' + val.paramKey + '}}', val.paramValue, val1.paramKey);
                                })
                                switch (templateResult.baseInfo.apiRequestParamType) {
                                    case 1:
                                        {
                                            templateResult.baseInfo.apiRequestRaw = $filter('RegexFilter')('{{' + val.paramKey + '}}', val.paramValue, templateResult.baseInfo.apiRequestRaw);
                                            break;
                                        }
                                    default:
                                        {
                                            angular.forEach(templateResult.requestInfo, function (val1, key1) {
                                                val1.paramKey = $filter('RegexFilter')('{{' + val.paramKey + '}}', val.paramValue, val1.paramKey);
                                                val1.paramKeyHtml = $filter('RegexFilter')('{{' + val.paramKey + '}}', val.paramValue, val1.paramKeyHtml);
                                            })
                                            break;
                                        }
                                }
                            })
                            broadcast.$EnvInitReady.result = angular.toJson(templateResult);
                        }
                        if (envItem.headerList.length > 0) {
                            var headerString = angular.toJson(envItem.headerList);
                            if (broadcast.$EnvInitReady.result.indexOf('\"' + broadcast.$EnvInitReady.header + '\":[]') > -1) {
                                broadcast.$EnvInitReady.result = broadcast.$EnvInitReady.result.replace('"' + broadcast.$EnvInitReady.header + '":[', '"' + broadcast.$EnvInitReady.header + '":[' + headerString.slice(1, headerString.length - 1));
                            } else {
                                broadcast.$EnvInitReady.result = broadcast.$EnvInitReady.result.replace('"' + broadcast.$EnvInitReady.header + '":[', '"' + broadcast.$EnvInitReady.header + '":[' + headerString.slice(1, headerString.length - 1) + ',');
                            }
                        }
                        vm.envModel = angular.fromJson(broadcast.$EnvInitReady.result);
                        if (!new RegExp(data.domainRegex).test(vm.envModel.baseInfo[broadcast.$EnvInitReady.uri])) {
                            vm.envModel.baseInfo[broadcast.$EnvInitReady.uri] = (envItem.frontURI||'') + vm.envModel.baseInfo[broadcast.$EnvInitReady.uri];
                        }
                        if (envItem.additionalParamList.length > 0) {
                            for (var key in envItem.additionalParamList) {
                                var val = envItem.additionalParamList[key];
                                val.paramNotNull = '0';
                                val.paramInfo = val.paramValue;
                                val.paramType = '0';
                                val.paramKeyHtml = val.paramKey;
                            }
                            vm.envModel[broadcast.$EnvInitReady.additionalParams] = envItem.additionalParamList.concat(vm.envModel[broadcast.$EnvInitReady.additionalParams]);
                        }
                        break;
                    }
                case 2:
                    {
                        vm.envModel = JSON.parse(broadcast.$EnvInitReady.param);
                        if (envItem.headerList.length > 0) {
                            envItem.headerList.map(function (val, key) {
                                val.checkbox = true;
                            })
                            vm.envModel[broadcast.$EnvInitReady.header] = envItem.headerList.concat(vm.envModel[broadcast.$EnvInitReady.header]);
                        }
                        if (envItem.additionalParamList.length > 0) {
                            for (var key in envItem.additionalParamList) {
                                var val = envItem.additionalParamList[key];
                                val.checkbox = true;
                                val.paramInfo = val.paramValue;
                            }
                            vm.envModel[broadcast.$EnvInitReady.additionalParams] = envItem.additionalParamList.concat(vm.envModel[broadcast.$EnvInitReady.additionalParams]);
                        }
                        if (vm.envModel.auth.status == '0') {
                            envItem.envAuth.status = (envItem.envAuth.status || 0).toString();
                            vm.envModel.auth = envItem.envAuth;
                        }
                        break;
                    }
            }
            vm.data.model = envItem;
        }
        /**
         * @description 初始化队列
         */
        fun.initQuery = function () {
            var template = {
                cache: null
            }
            storage = JSON.parse(window.localStorage['ENV_DIRECTIVE_TABLE'] || '{}');
            if (vm.interaction.response.query) {
                fun.parseEnvQuery();
            } else {
                switch (vm.mark) {
                    case 'share':
                        {
                            template.cache = service.cache.get('envQuery_envDirective');
                            if (template.cache) {
                                vm.interaction.response.query = template.cache;
                                fun.parseEnvQuery();
                            } else {
                                resource.GET_ENV_QUERY({
                                    shareCode: $state.params.shareCode,
                                    shareID: interaction.request.shareID
                                }).$promise.then(function (response) {
                                    vm.interaction.response.query = response.envList || [];
                                    if (vm.interaction.response.query.length == 1) {
                                        service.cache.set(vm.interaction.response.query[0].envID, 'envID_envDirective');
                                    }
                                    service.cache.set(vm.interaction.response.query, 'envQuery_envDirective');
                                    fun.parseEnvQuery();
                                })
                            }
                            break;
                        }
                    default:
                        {
                            resource.GET_ENV_QUERY({
                                projectID: interaction.request.projectID,
                                spaceKey: interaction.request.spaceKey
                            }).$promise.then(function (response) {
                                vm.interaction.response.query = response.envList || [];
                                fun.parseEnvQuery();
                            })
                            break;
                        }
                }
            }
        }
        /**
         * @description 管理环境跳转路由
         */
        vm.fun.href=function(){
            switch (vm.mark) {
                case 'projectPro':
                    {
                        $state.go('home.project.inside.env.default')
                        break;
                    }
            }
        }
        /**
         * @description 查看详情
         * @param {object}  $event dom对象
         */
        vm.fun.showDetail = function ($event) {
            $event.stopPropagation();
            vm.data.showDetail = !vm.data.showDetail;
        }
        /**
         * @description dom绑定click函数
         */
        $document.on("click", function (_default) {
            vm.data.showDetail = false;
            $scope.$root && $scope.$root.$$phase || $scope.$apply();
        });
        /**
         * @description 列表选中
         * @param {object} envItem 
         */
        vm.fun.click = function (envItem) {
            if (envItem == null) {
                envItem = {
                    envName: '',
                    frontURI:'',
                    headerList: [],
                    paramList: [],
                    additionalParamList: [],
                    envAuth: {
                        status: 0
                    }
                }
            } else {
                envItem.changed = true;
            }
            broadcast.$EnvInitReady.status ? data.reset = 1 : '';
            vm.data.itemStatus = 'hidden';
            switch (vm.mark) {
                case 'share':
                    {

                        service.cache.set(envItem.envID, 'envID_envDirective');
                        break;
                    }
                default:
                    {
                        storage[interaction.request.projectID] = envItem.envID;
                        window.localStorage.setItem('ENV_DIRECTIVE_TABLE', angular.toJson(storage));
                        break;
                    }
            }
            try {
                vm.totalEnv = angular.copy(envItem || {});
            } catch (e) {}
            fun.bindEnv(angular.copy(envItem));
        }

        /**
         * @description 广播渲染数组
         */
        $scope.$on('$PARSE_QUERY_ENV_AMS_COMPONENT', function (_default, attr) {
            interaction.response.apiList=interaction.response.apiList.concat(attr.apiList);
            var template={
                apiList:angular.copy(attr.apiList),
                fun:function(envItem){
                    template.apiList.map(function (val, key) {
                        angular.forEach(envItem.paramList, function (childVal, childKey) {
                            val.apiURI = $filter('RegexFilter')('{{' + childVal.paramKey + '}}', childVal.paramValue, val.apiURI);
                        })
                        if (!new RegExp(data.domainRegex).test(val.apiURI)) {
                            val.apiURI = (envItem.frontURI||'') + val.apiURI;
                        }
                    })
                    service.ams.envObject.object.model=service.ams.envObject.object.model.concat(template.apiList);
                }
            }
            template.fun(vm.totalEnv);
        });
        /**
         * @description 广播初始
         */
        $scope.$on('$EnvInitReady', function (_default, attr) {
            attr = attr || {};
            broadcast.$EnvInitReady.param = attr.param;
            broadcast.$EnvInitReady.status = attr.status;
            broadcast.$EnvInitReady.header = attr.header || 'headerInfo';
            broadcast.$EnvInitReady.additionalParams = attr.additionalParams || 'requestInfo';
            broadcast.$EnvInitReady.uri = attr.uri || 'apiURI';
            data.timer = $timeout(function () {
                switch (broadcast.$EnvInitReady.status) {
                    case 0:
                        {
                            interaction.response.apiList = angular.copy(service.ams.envObject.object.model);
                            break;
                        }
                }
                fun.initQuery();
            });
        });
        /**
         * @description 页面销毁
         */
        $scope.$on('$destroy', function () {
            if (data.timer) {
                $timeout.cancel(data.timer);
            }
        });

        /**
         * @description 初始化
         */
        vm.$onInit = function () {
            resource.GET_ENV_QUERY = vm.inputObject.resource.Env.Query;
        }
    }
})();