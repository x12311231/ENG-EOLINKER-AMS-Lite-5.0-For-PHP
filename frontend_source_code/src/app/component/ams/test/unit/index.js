(function () {
    'use strict';
    /**
     * @name 单元测试组件
     * @author 广州银云信息科技有限公司
     * @param {object} input 传输数据（formToJson&injectScript）
     * @param {object} message 传递给插件相应内容容器
     * @param {object} result 测试后返回结果
     * @param {object} format 测试初始化getApi内容
     * @param {form} testForm 基本表单信息是否填写完整
     * @param {obejct} env 环境变量数组
     * @param {obejct} interaction 组件与页面交互(num:测试秒数，useStatus:插件状态)
     * @param {function} addHistory 新建测试历史记录绑定函数
     */

    angular.module('eolinker')
        .component('unitTestAmsComponent', {
            template: '<div ng-class={\'send-btn-plug\':$ctrl.interaction.useStatus}>' +
                '<button type="button" class="iconfont preview-btn" ng-class="{\'icon-attentionfill\':$ctrl.output.isPreview,\'icon-attention\':!$ctrl.output.isPreview}"  ng-click="$ctrl.data.preview()"><span class="triangle-bottom"></span><span class="preview-tips-span">{{\'371\'|translate}}</span></button><button class="send-btn" ng-click="$ctrl.fun.test()">{{$ctrl.data.timer.disable?(\'280\'|translate)+"&nbsp;"+($ctrl.data.timer.num>0?$ctrl.data.timer.num:""):(\'372\'|translate)}}</button>' +
                '<div class="hidden" id="plug-in-result-js" watch-dom-common-directive="$ctrl.fun.watch(input)" bind-id="plug-in-result-js"></div>' +
                '</div>',
            bindings: {
                input: '<',
                message: '=',
                result: '=',
                format: '=',
                testForm: '<',
                env: '<',
                addHistory: '&',
                output: '=',
                urlParam: '=',
                restfulParam: '=',
                interaction: '='
            },
            controller: indexController
        })

    indexController.$inject = ['$scope', 'Authority_CommonService', 'CODE', '$window', 'ApiManagementResource', '$rootScope', '$state', '$filter', 'Cache_CommonService', 'DOMAIN_CONSTANT', '$timeout'];

    function indexController($scope, Authority_CommonService, CODE, $window, ApiManagementResource, $rootScope, $state, $filter, Cache_CommonService, DOMAIN_CONSTANT, $timeout) {
        var vm = this;
        vm.data = {
            timer: {
                disable: null,
                num: ''
            }
        }
        vm.fun = {};
        vm.service = {
            authority: Authority_CommonService
        }
        var data = {
                domainRegex: '^(((http|ftp|https):\/\/)|)(([\\\w\\\-_]+([\\\w\\\-\\\.]*)?(\\\.(' + DOMAIN_CONSTANT.join('|') + ')))|((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))|(localhost))((\\\/)|(\\\?)|(:)|($))',
                historyItem: null,
                timer: {
                    default: null
                },
                status: $state.current.name.indexOf('quickTest') > -1 ? 'quick' : 'default',
                decorateEnv: false,
                timeout: null
            },
            service = {
                cache: Cache_CommonService
            },
            cache = {
                requestInfo: null,
                mutualInfo: null,
                restfulParam: null
            },
            fun = {};
        /**
         * @function [服务器测试调用功能函数] [Server test call]
         */
        fun.addHistory = function (history) {
            var request={
                testTime:history.history,
                apiID:$state.params.apiID,
                httpCodeType:history.httpCode,
                resultInfo:JSON.stringify(history.resultInfo),
                requestInfo:JSON.stringify(history.requestInfo)
            }
            ApiManagementResource.Test.AddHistory(request).$promise.then(function (response) {
                switch (response) {
                    case '000000':
                        {
                            vm.addHistory({
                                arg: {
                                    status: 'plug-test',
                                    history: history
                                }
                            });
                        }
                }
            })
        }
        fun.showTestResult = function (request, response, options) {
            var template = {
                history: {
                    testTime: $filter('currentTimeFilter')(),
                    beforeInject: vm.input.injectScript.before,
                    afterInject: vm.input.injectScript.after,
                    requestInfo: {
                        requestType: request.requestType,
                        headers: [],
                        params: [],
                        URL: '',
                        methodType: options.apiRequestType,
                        method: options.apiRequestType == '0' ? 'POST' : (options.apiRequestType == '1' ? 'GET' : (options.apiRequestType == '2' ? 'PUT' : (options.apiRequestType == '3' ? 'DELETE' : (options.apiRequestType == '4' ? 'HEAD' : (options.apiRequestType == "5" ? 'OPTIONS' : 'PATCH')))))
                    }
                },
                img: {
                    html: ''
                },
                reportHeader: [],
                request: request,
                response: response,
            }
            if (template.response.statusCode == CODE.COMMON.SUCCESS) {
                try {
                    template.request.headers = JSON.parse(template.request.headers);
                    template.request.params = JSON.parse(template.request.params);
                } catch (e) {

                }
                for (var key in template.request.headers) {
                    var val = template.request.headers[key];
                    template.history.requestInfo.headers.push({
                        name: key,
                        value: val
                    })
                    template.reportHeader.push({
                        key: key,
                        value: val
                    })
                }
                vm.result = {
                    status: '0',
                    headers: template.request.headers,
                    testHttpCode: template.response.testHttpCode,
                    testDeny: template.response.testDeny,
                    testResult: {
                        headers: template.response.testResult.headers
                    },
                    requestBody: {
                        headers: template.reportHeader,
                        params: {
                            body: template.request.params,
                            requestType: template.request.requestType
                        }
                    },
                    httpCodeType: template.response.testHttpCode >= 100 && template.response.testHttpCode < 200 ? 1 : template.response.testHttpCode >= 200 && template.response.testHttpCode < 300 ? 2 : template.response.testHttpCode >= 300 && template.response.testHttpCode < 400 ? 3 : 4
                };
                if (/image\/(jpg|jpeg|png|gif)/ig.test(JSON.stringify(template.response.testResult.headers))) {
                    template.img.html = '<img style="max-width:100%;" author="eolinker-frontend" src="' + template.response.testResult.body + '"/>';
                }
                template.history.requestInfo.URL = template.request.URL;
                switch (template.request.requestType.toString()) {
                    case '0':
                    case '2':
                        {
                            for (var key in template.request.params) {
                                var val = template.request.params[key];
                                template.history.requestInfo.params.push({
                                    key: val.paramKey,
                                    value: val.paramInfo
                                })
                            }
                            break;
                        }
                    default:
                        {
                            template.history.requestInfo.params = template.request.raw;
                            break;
                        }
                }
                template.history.resultInfo = {
                    headers: template.response.testResult.headers,
                    body: (template.img.html || ((typeof template.response.testResult.body == 'object') ? JSON.stringify(template.response.testResult.body) : template.response.testResult.body)),
                    httpCode: template.response.testHttpCode,
                    testDeny: template.response.testDeny
                };
                template.history.testID = template.response.testID;
                template.history.httpCodeType = vm.result.httpCodeType;
                service.cache.set(template.history.resultInfo.body, 'UNIT_TEST_RESULT');
            } else {
                vm.result = {
                    status: '0',
                    httpCodeType: 5
                };
            }
            vm.format.message = !vm.format.message;
            vm.result.hadTest = true;
            clearInterval(data.timer.default);
            vm.data.timer.num = null;
            vm.data.timer.disable = false;
        };
        fun.serverTest = function () {
            if (vm.data.timer.disable) {
                clearInterval(data.timer.default);
                vm.data.timer.num = null;
                vm.data.timer.disable = false;
            } else {
                var template = {
                    env: vm.env,
                    decorate: fun.decorate('server' + (vm.output.isPreview ? '-preview' : ''), angular.copy(vm.message)),
                    request: {},
                    cacheFileList: null
                }
                if (vm.testForm.$valid) {
                    vm.data.timer.num = 0;
                    vm.data.timer.disable = true;
                    template.request = {
                        apiProtocol: 'http://',
                        URL: template.decorate.URL,
                        headers: {},
                        params: {},
                        apiID: $state.params.apiID,
                        projectID: $state.params.projectID,
                        requestType: template.decorate.toJson ? '0' : template.decorate.requestType
                    }
                    angular.forEach(template.decorate.headers, function (val, key) {
                        if (val.checkbox) {
                            if (!!val.headerName) {
                                template.request.headers[val.headerName] = val.headerValue;
                            }
                        }
                    });
                    switch (template.decorate.auth.status) {
                        case '1':
                            {
                                template.request.headers['Authorization'] = $filter('base64Filter')(template.decorate.auth.basicAuth.username + ':' + template.decorate.auth.basicAuth.password);
                                break;
                            }
                    }
                    template.request.headers = angular.toJson(template.request.headers);
                    switch (template.decorate.requestType) {
                        case '0':
                            {
                                if (vm.input.formToJson.checkbox) {
                                    template.request.params = $filter('paramLevelToJsonFilter')(template.decorate.params);
                                } else {
                                    angular.forEach(template.decorate.params, function (val, key) {
                                        if (val.checkbox) {
                                            if (!!val.paramKey) {
                                                template.request.params[val.paramKey] = val.paramInfo;
                                            }
                                        }
                                    });
                                    template.request.params = angular.toJson(template.request.params);
                                }
                                break;
                            }
                        case '1':
                            {
                                template.request.params = template.decorate.raw;
                                break;
                            }
                        case '2':
                            {
                                angular.forEach(template.decorate.params, function (val, key) {
                                    if (val.checkbox) {
                                        if (val.paramKey) {
                                            if (info.URL.trim().indexOf('{' + val.paramKey + '}') > -1) {
                                                info.URL = info.URL.replace(eval('/(\\\{' + val.paramKey + '\\\})/g'), val.paramInfo);
                                            } else {
                                                template.restfulObject.hadFilterParams.push(val);
                                                template.request.params[val.paramKey] = val.paramInfo;
                                                var history = {
                                                    key: val.paramKey,
                                                    value: val.paramInfo
                                                }
                                                testHistory.requestInfo.params.push(history);
                                            }
                                        }
                                    }
                                });
                                if (vm.input.formToJson.checkbox) {
                                    template.request.params = $filter('paramLevelToJsonFilter')(template.decorate.params);
                                } else {
                                    template.request.params = angular.toJson(template.request.params);
                                }
                                testHistory.requestInfo.URL = info.URL;
                                break;
                            }
                    }
                    if (typeof template.request.params != 'string') {
                        template.request.params = JSON.stringify(template.request.params || {});
                    }
                    data.timer.default = setInterval(function () {
                        vm.data.timer.num++;
                        $scope.$root && $scope.$root.$$phase || $scope.$apply();
                    }, 1000);
                    var options = {
                        apiRequestType: template.decorate.apiRequestType
                    }
                    switch (template.decorate.apiRequestType) {
                        case '0':
                            ApiManagementResource.Test.Post(template.request).$promise.then(function (data) {
                                fun.showTestResult(template.request, data, options);
                            })
                            break;
                        case '1':
                            ApiManagementResource.Test.Get(template.request).$promise.then(function (data) {
                                fun.showTestResult(template.request, data, options);

                            })
                            break;
                        case '2':
                            ApiManagementResource.Test.Put(template.request).$promise.then(function (data) {
                                fun.showTestResult(template.request, data, options);

                            })
                            break;
                        case '3':
                            ApiManagementResource.Test.Delete(template.request).$promise.then(function (data) {
                                fun.showTestResult(template.request, data, options);

                            })
                            break;
                        case '4':
                            ApiManagementResource.Test.Head(template.request).$promise.then(function (data) {
                                fun.showTestResult(template.request, data, options);

                            })
                            break;
                        case '5':
                            ApiManagementResource.Test.Options(template.request).$promise.then(function (data) {
                                fun.showTestResult(template.request, data, options);

                            })
                            break;
                        case '6':
                            ApiManagementResource.Test.Patch(template.request).$promise.then(function (data) {
                                fun.showTestResult(template.request, data, options);

                            })
                            break;
                    }
                }
            }
        }
        vm.data.preview = function () {
            vm.output.isPreview = !vm.output.isPreview;
            if (!cache.requestInfo) {
                cache.requestInfo = angular.copy(vm.message);
            } else {
                vm.message = cache.requestInfo;
                cache.requestInfo = null;
                vm.urlParam.push({
                    paramKey: '',
                    paramInfo: '',
                    checkbox: true
                });
                vm.restfulParam = angular.copy(cache.restfulParam);
                $scope.$emit('$TransferStation', {
                    state: '$Maunal_AceEditorAms',
                    data: vm.message.raw
                });
                return;
            }
            cache.restfulParam = angular.copy(vm.restfulParam);
            vm.message = fun.decorate('preview', vm.message);
            vm.urlParam.splice(vm.urlParam.length - 1, 1);

        }
        /**
         * 预览请求数据
         */
        fun.decorate = function (status, input) {
            var template = {
                output: angular.copy(input),
                statusObject: {
                    alreadyHadContentType: false
                },
                headers: [],
                URL: input.URL,
                fileList: service.cache.get('fileList') || [],
                restfulParam: []
            }
            template.output.headers = [];
            try {
                input.headers.map(function (val, key) {
                    if ((val.checkbox) && val.headerName) {
                        template.output.headers.push(val);
                        if (/content-type/i.test(val.headerName)) {
                            template.statusObject.alreadyHadContentType = true;
                        }
                    }
                })
            } catch (e) {
                console.error('component ams test unit index.js', e);
            }
            if (vm.message.auth) {
                switch (vm.message.auth.status) {
                    case '0':
                        {
                            template.output.auth = {
                                status: '0'
                            }
                            break;
                        }
                    case '1':
                        {
                            template.output.auth = {
                                status: '1',
                                basicAuth: template.output.auth.basicAuth
                            }
                            break;
                        }
                    case '2':
                        {
                            template.output.auth = {
                                status: '2',
                                jwtAuth: template.output.auth.jwtAuth
                            }
                            break;
                        }
                }
            }
            for (var key in vm.restfulParam) {
                var val = vm.restfulParam[key];
                if (val.checkbox && val.paramKey) {
                    if (eval('/:' + val.paramKey + '/').test(template.output.URL.trim())) {
                        template.output.URL = $filter('RegexFilter')(':' + val.paramKey, val.paramInfo, template.output.URL);
                    } else if (template.output.URL.trim().indexOf('{{' + val.paramKey + '}}') == -1 && template.output.URL.trim().indexOf('{' + val.paramKey + '}') > -1) {
                        template.output.URL = $filter('RegexFilter')('{' + val.paramKey + '}', val.paramInfo, template.output.URL);
                    } else if (template.output.requestType.toString() == '0') {
                        input.params.push(val);
                        // template.restfulParam.push(val);
                    }
                }
            }
            if (status == 'preview') vm.restfulParam = [];
            switch (template.output.requestType.toString()) {
                case '0':
                    {
                        template.output.params = [];
                        angular.forEach(input.params, function (val, key) {
                            if (val.checkbox && val.paramKey) {
                                if ((val.paramType || 0).toString() == '1' && val.paramInfo) {
                                    switch (status) {
                                        case 'plug':
                                        case 'server':
                                        case 'plug-preview':
                                        case 'server-preview':
                                            {
                                                val.files = template.fileList[key] || [];
                                                break;
                                            }
                                    }
                                }
                                template.output.params.push(val);
                            }
                        });
                        if (vm.input.formToJson.checkbox && status.indexOf('plug') == -1) {
                            template.output.raw = $filter('paramLevelToJsonFilter')(input.params);
                            template.output.requestType = '1';
                            template.output.toJson = true;
                            if (!template.statusObject.alreadyHadContentType) {
                                template.output.headers.push({
                                    headerName: 'Content-Type',
                                    headerValue: 'application/json',
                                    checkbox: true
                                });
                            }
                        }
                        break;
                    }
                case '1':
                    {
                        break;
                    }
            }
            if (vm.env) {
                if (vm.env.paramList && vm.env.paramList.length > 0) {
                    angular.forEach(vm.env.paramList, function (val, key) {
                        switch (status) {
                            case 'plug':
                            case 'server':
                            case 'plug-preview':
                            case 'server-preview':
                                {
                                    template.URL = $filter('RegexFilter')('{{' + val.paramKey + '}}', val.paramValue, template.output.URL);
                                    break;
                                }
                            default:
                                {
                                    template.output.URL = $filter('RegexFilter')('{{' + val.paramKey + '}}', val.paramValue, template.output.URL);
                                    angular.forEach(template.output.headers, function (childVal, childKey) {
                                        childVal.headerValue = $filter('RegexFilter')('{{' + val.paramKey + '}}', val.paramValue, childVal.headerValue);
                                        childVal.headerName = $filter('RegexFilter')('{{' + val.paramKey + '}}', val.paramValue, childVal.headerName);
                                    })
                                    switch (template.output.requestType.toString()) {
                                        case '1':
                                            {
                                                template.output.raw = $filter('RegexFilter')('{{' + val.paramKey + '}}', val.paramValue, template.output.raw);
                                                break;
                                            }
                                        default:
                                            {
                                                angular.forEach(template.output.params, function (childVal, childKey) {
                                                    childVal.paramKey = $filter('RegexFilter')('{{' + val.paramKey + '}}', val.paramValue, childVal.paramKey);
                                                    childVal.paramInfo = $filter('RegexFilter')('{{' + val.paramKey + '}}', val.paramValue, childVal.paramInfo);
                                                })
                                                break;
                                            }
                                    }
                                    break;
                                }
                        }


                    })
                }
                switch (status) {
                    case 'plug':
                    case 'server':
                    case 'plug-preview':
                    case 'server-preview':
                        {
                            if (!new RegExp(data.domainRegex).test(template.URL)) {
                                template.output.URL = (vm.env.frontURI || '') + template.output.URL;
                            }
                            break;
                        }
                    default:
                        {
                            if (!new RegExp(data.domainRegex).test(template.output.URL)) {
                                template.output.URL = (vm.env.frontURI || '') + template.output.URL;
                            }
                            break;
                        }
                }
            }
            if (status == 'preview') {
                switch (template.output.requestType.toString()) {
                    case '1':
                        {
                            $scope.$emit('$TransferStation', {
                                state: '$Maunal_AceEditorAms',
                                data: template.output.raw
                            });
                            break;
                        }
                }
            }
            return template.output;
        }
        /**
         * 记载等待页面监听指令绑定函数
         */
        vm.fun.watch = function (input) {
            if (!vm.data.timer.disable || !($window.plug && $window.plug.type == "application/eolinker" && !($window.plug.version < 450))) return;
            var template = {
                data: {},
                img: {
                    html: ''
                },
                body: null,
                history: angular.copy(data.historyItem),
                session: window.sessionStorage.getItem('plug-background-result')
            }
            try {
                template.data = JSON.parse(template.session || input);
            } catch (e) {
                template.data = {
                    statusCode: '2xxxxx'
                }
            }
            if (template.data.statusCode == CODE.COMMON.SUCCESS) {
                vm.result = {
                    status: '0',
                    headers: template.data.headers,
                    testHttpCode: template.data.testHttpCode,
                    testDeny: template.data.testDeny,
                    testResult: {
                        headers: template.data.testResult.headers
                    },
                    requestBody: template.data.requestBody,
                    httpCodeType: template.data.testHttpCode >= 100 && template.data.testHttpCode < 200 ? 1 : template.data.testHttpCode >= 200 && template.data.testHttpCode < 300 ? 2 : template.data.testHttpCode >= 300 && template.data.testHttpCode < 400 ? 3 : 4
                };
                if (/image\/(jpg|jpeg|png|gif)/ig.test(JSON.stringify(template.data.testResult.headers))) {
                    template.img.html = '<img style="max-width:100%;" author="eolinker-frontend" src="' + template.data.testResult.body + '"/>';
                }
                template.body = template.data.testResult.body;
                template.history.requestInfo.URL = template.data.requestBody.url;
                switch (cache.mutualInfo.requestType.toString()) {
                    case '0':
                    case '2':
                        {
                            for (var key in cache.mutualInfo.params) {
                                var val = cache.mutualInfo.params[key];
                                template.history.requestInfo.params.push({
                                    key: val.paramKey,
                                    value: val.paramInfo
                                })
                            }
                            break;
                        }
                    default:
                        {
                            template.history.requestInfo.params = cache.mutualInfo.raw;
                            break;
                        }
                }
                for (var key in cache.mutualInfo.headers) {
                    var val = cache.mutualInfo.headers[key];
                    template.history.requestInfo.headers.push({
                        name: val.headerName,
                        value: val.headerValue
                    })
                }
                template.history.resultInfo = {
                    headers: template.data.testResult.headers,
                    body: (template.img.html || ((typeof template.data.testResult.body == 'object') ? JSON.stringify(template.data.testResult.body) : template.data.testResult.body)),
                    httpCode: template.data.testHttpCode,
                    testDeny: template.data.testDeny
                };
                template.history.testID = template.data.testID;
                template.history.httpCodeType = vm.result.httpCodeType;
                service.cache.set(template.history.resultInfo.body, 'UNIT_TEST_RESULT');
                fun.addHistory(template.history);
            } else {
                vm.result = {
                    status: '0',
                    httpCodeType: 5
                };
                service.cache.set(template.data.errorText || '', 'UNIT_TEST_RESULT');
            }
            vm.format.message = !vm.format.message;
            vm.result.hadTest = true;
            clearInterval(data.timer.default);
            vm.data.timer.num = null;
            vm.data.timer.disable = false;

            $scope.$root && $scope.$root.$$phase || $scope.$apply();
        }

        /**
         * 测试发送
         */
        vm.fun.test = function () {
            if (!vm.message.URL) return;
            var template = {
                decorate: null,
                modal: {
                    html: ''
                }
            }

            if (!vm.data.timer.disable) {
                if ($window.plug && $window.plug.type == "application/eolinker" && !($window.plug.version < 450)) {
                    if (data.ws) {
                        data.ws.close();
                        data.ws = null;
                    }
                    if (vm.testForm.$valid) {
                        fun.parsePlugRequestMessage();
                        vm.data.timer.num = 0;
                        vm.data.timer.disable = true;
                        data.historyItem = {
                            testTime: $filter('currentTimeFilter')(),
                            beforeInject: vm.input.injectScript.before,
                            afterInject: vm.input.injectScript.after,
                            requestInfo: {
                                apiRequestParamJsonType: cache.mutualInfo.apiRequestParamJsonType,
                                requestType: cache.mutualInfo.requestType,
                                headers: [],
                                params: [],
                                URL: '',
                                methodType: cache.mutualInfo.apiRequestType,
                                method: cache.mutualInfo.apiRequestType == '0' ? 'POST' : (cache.mutualInfo.apiRequestType == '1' ? 'GET' : (cache.mutualInfo.apiRequestType == '2' ? 'PUT' : (cache.mutualInfo.apiRequestType == '3' ? 'DELETE' : (cache.mutualInfo.apiRequestType == '4' ? 'HEAD' : (cache.mutualInfo.apiRequestType == "5" ? 'OPTIONS' : 'PATCH')))))
                            }
                        }
                        data.timer.default = setInterval(function () {
                            vm.data.timer.num++;
                            if (vm.data.timer.num == 60) {
                                vm.result = {
                                    httpCodeType: 5
                                };
                                service.cache.set('', 'UNIT_TEST_RESULT');
                                vm.format.message = !vm.format.message;
                                vm.result.hadTest = true;
                                clearInterval(data.timer.default);
                                vm.data.timer.num = null;
                                vm.data.timer.disable = false;
                            }
                            $scope.$root && $scope.$root.$$phase || $scope.$apply();
                        }, 1000);
                    }
                } else {
                    fun.serverTest();
                }
            } else {
                clearInterval(data.timer.default);
                vm.data.timer.num = null;
                vm.data.timer.disable = false;
            }
        }

        /**
         * 渲染插件请求信息
         */
        fun.parsePlugRequestMessage = function (input) {
            if (!vm.message || !vm.message.URL || !($window.plug && $window.plug.type == "application/eolinker" && $window.plug.version > 300)) return;
            var template = {
                input: {
                    requestInfo: fun.decorate('plug' + (vm.output.isPreview ? '-preview' : ''), angular.copy(vm.message)),
                    script: vm.input.injectScript,
                    env: vm.env.paramList || []
                }
            }
            template.input.formDataToJson = vm.input.formToJson || {};
            cache.mutualInfo = template.input.requestInfo;
            window.sessionStorage.setItem('plug-normalTest-info', JSON.stringify(template.input));
        }
        vm.$onInit = function () {
            $rootScope.global.$watch.push($scope.$watch('$ctrl.env', function () {
                if (vm.output.isPreview) {
                    cache.requestInfo = angular.copy(vm.message);
                    vm.message = fun.decorate('env', vm.message);
                    vm.urlParam.splice(vm.urlParam.length - 1, 1);
                }
                $scope.$emit('$TransferStation', {
                    state: '$Maunal_AceEditorAms',
                    data: vm.message.raw
                });
            }, true));
            vm.interaction.timer = vm.data.timer;
        }
        $scope.$on('$UnitTestClick', function () {
            vm.fun.test();
        })
        $scope.$on('$stateChangeStart', function () { //路由开始转换时清除计时器
            if (data.timer.default) {
                clearInterval(data.timer.default);
            }
            if (data.timeout) {
                $timeout.cancel(data.timeout);
            }
        })
    }
})();