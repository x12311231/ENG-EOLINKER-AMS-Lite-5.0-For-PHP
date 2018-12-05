(function () {
    /**
     * @name API测试
     * @author 广州银云信息科技有限公司 
     */
    "use strict";
    angular.module("eolinker")
        .component("homeProjectInsideApiTest", {
            templateUrl: "app/ui/content/home/project/inside/content/api/test/index.html",
            controller: indexController,
        });

    indexController.$inject = ["$scope", 'ENSURE_WARNIMG', "$document", "ApiManagementResource", "$state", "CODE", "$rootScope", "HTTP_CONSTANT", "Cache_CommonService", "HomeProjectApi_Service", "Authority_CommonService", "Operate_CommonService",'$filter'];

    function indexController($scope, ENSURE_WARNIMG, $document, ApiManagementResource, $state, CODE, $rootScope, HTTP_CONSTANT, Cache_CommonService, HomeProjectApi_Service, Authority_CommonService, Operate_CommonService,$filter) {
        var vm = this;
        vm.data = {
            queryHistory: false,
            menuType: "body",
            format: {
                isJson: true,
                message: ""
            },
            contentType: {
                array: [{
                        key: "Auto",
                        value: ""
                    },
                    {
                        key: "Text(text/plain)",
                        value: "text/plain"
                    },
                    {
                        key: "JSON(application/json)",
                        value: "application/json"
                    },
                    {
                        key: "Javascript(application/javascript)",
                        value: "application/javascript"
                    },
                    {
                        key: "XML(application/xml)",
                        value: "application/xml"
                    },
                    {
                        key: "XML(text/xml)",
                        value: "text/xml"
                    },
                    {
                        key: "HTML(text/html)",
                        value: "text/html"
                    }
                ],
                current: {
                    key: "Auto",
                    value: ""
                }
            },
            plugObject: {
                needVersion: true,
                num: 0,
                timer: {
                    disable: null,
                    num: ''
                }
            },
            response: {
                httpCodeType: 2,
                hadTest: false,
                status: "0"
            },
            jsonToParamObject: {
                headerItem: {
                    headerName: "",
                    headerValue: "",
                    checkbox: true
                },
                requestItem: {
                    paramKey: "",
                    paramValue: "",
                    checkbox: true
                }
            },
            allObject: {
                header: false,
                body: false,
                url: false,
                restful: false
            }
        };
        vm.interaction = {
            request: {
                spaceKey: $state.params.spaceKey,
                projectID: $state.params.projectID,
                groupID: $state.params.groupID,
                childGroupID: $state.params.childGroupID,
                grandSonGroupID: $state.params.grandSonGroupID,
                apiID: $state.params.apiID
            },
            response: {
                apiInfo: {}
            }
        }
        vm.fun = {
            blurInput: null, //构造器失焦状态检测
            expressionBuilder: null, //构造器启动功能函数
            uriBlur: null, //测试地址input失焦触发功能函数
            delete: null, //移入回收站功能函数
            recover: null, //恢复功能函数
            deleteCompletely: null, //彻底{{\'259\'|translate}}功能函数
            headerList: {
                add: null, //新建头部功能函数
                delete: null //{{\'259\'|translate}}头部功能函数
            },
            requestList: {
                add: null, //新建请求参数功能函数
                delete: null //{{\'259\'|translate}}请求参数功能函数
            },
            testList: {
                enter: null, //进入测试记录功能函数
                delete: null, //{{\'259\'|translate}}测试记录功能函数
                clear: null //清空功能函数
            },
            window: null, //新开窗口
            changeType: null, //测试请求方式更改功能函数
            import: null, //导入功能函数
            last: null,
            json: null, //请求参数切换为raw json格式功能函数
            test: null //测试组件单击函数
        }
        vm.const = {
            requestHeader: HTTP_CONSTANT.REQUEST_HEADER
        }
        vm.service = {
            home: Operate_CommonService,
            authority: Authority_CommonService,
        }
        vm.component = {
            menuObject: {
                list: null
            },
            unitTestObject: {
                formToJson: {
                    checkbox: false,
                    raw: ""
                },
                injectScript: {}
            },
            unitTestObjectOutput: {
                isPreview: false
            },
            aceEditorMenu: {
                resource: ApiManagementResource
            }
        };
        var data = {
                manualChangeUrl: false,
                fileList: {}
            },
            service = {
                default: HomeProjectApi_Service,
                cache: Cache_CommonService
            },
            fun = {},
            resource = {
                Test: $state.current.name.indexOf('quickTest') > -1 && !($state.params.apiID) ? ApiManagementResource.QuickTest : ApiManagementResource.Test
            }
        $document.on("click", function (_default) {
            vm.data.contentType.isClick = false;
            ($scope.$root && $scope.$root.$$phase) || $scope.$apply();
        });
        vm.fun.saveDemo = function () {
            var template = {
                request: {
                    spaceKey: vm.interaction.request.spaceKey,
                    projectID: vm.interaction.request.projectID,
                    apiID: vm.interaction.request.apiID,
                    mockData: service.cache.get("UNIT_TEST_RESULT"),
                    statusCode: vm.data.response.testHttpCode
                },
                fun: function () {
                    ApiManagementResource.Api.AddMock(template.request).$promise.then(function (response) {
                        switch (response.statusCode) {
                            case '000000':
                                {
                                    $rootScope.InfoModal($filter('translate')('528'), 'success');
                                    break;
                                }
                            default:
                                {
                                    $rootScope.InfoModal($filter('translate')('493'), 'error');
                                    break;
                                }
                        }
                    })
                }
            }
            $rootScope.EnsureModal($filter('translate')('529'), false, $filter('translate')('530'), {
                btnType: 1,
                btnMessage: $filter('translate')('531'),
                btnGroup: [{
                    btnType: 1,
                    btnMessage: $filter('translate')('532'),
                    confirm: function () {
                        template.request.mockType = 1;
                        template.fun();
                    }
                }]
            }, function (callback) {
                if (callback) {
                    template.request.mockType = 0;
                    template.fun();
                }
            });
        }
        vm.fun.quickSelectContentType = function (status, arg) {
            arg.$event.stopPropagation();
            switch (status) {
                case "select":
                    {
                        if (arg.item.value) {
                            if (/content-type/i.test(vm.service.home.envObject.object.model.headers[0]["headerName"])) {
                                vm.service.home.envObject.object.model.headers.splice(0, 1, {
                                    headerName: "Content-Type",
                                    headerValue: arg.item.value,
                                    checkbox: true
                                });
                            } else {
                                vm.service.home.envObject.object.model.headers.splice(0, 0, {
                                    headerName: "Content-Type",
                                    headerValue: arg.item.value,
                                    checkbox: true
                                });
                            }
                        } else {
                            if (/content-type/i.test(vm.service.home.envObject.object.model.headers[0]["headerName"])) {
                                vm.service.home.envObject.object.model.headers.splice(0, 1);
                            }
                        }
                        vm.data.contentType.current = arg.item;
                        break;
                    }
            }
            vm.data.contentType.isClick = !vm.data.contentType.isClick;
        };
        $rootScope.global.$watch.push($scope.$watch('$ctrl.service.home.envObject.object.model.headers[0]["headerValue"]', function () {
            try {
                if (
                    /content-type/i.test(vm.service.home.envObject.object.model.headers[0]["headerName"])) {
                    switch (vm.service.home.envObject.object.model.headers[0]["headerValue"].toLowerCase()) {
                        case "text/plain":
                            {
                                vm.data.contentType.current = vm.data.contentType.array[1];
                                break;
                            }
                        case "application/json":
                            {
                                vm.data.contentType.current = vm.data.contentType.array[2];
                                break;
                            }
                        case "application/javascript":
                            {
                                vm.data.contentType.current = vm.data.contentType.array[3];
                                break;
                            }
                        case "application/xml":
                            {
                                vm.data.contentType.current = vm.data.contentType.array[4];
                                break;
                            }
                        case "text/xml":
                            {
                                vm.data.contentType.current = vm.data.contentType.array[5];
                                break;
                            }
                        case "text/html":
                            {
                                vm.data.contentType.current = vm.data.contentType.array[6];
                                break;
                            }
                        default:
                            {
                                vm.data.contentType.current = {
                                    key: "Auto",
                                    value: ""
                                };
                                break;
                            }
                    }
                } else {
                    vm.data.contentType.current = {
                        key: "Auto",
                        value: ""
                    };
                }
            } catch (e) {}
        }));
        vm.fun.all = function (status) {
            switch (status) {
                case "header":
                    {
                        for (var key in vm.service.home.envObject.object.model.headers) {
                            vm.service.home.envObject.object.model.headers[key]["checkbox"] = vm.data.allObject.header;
                        }
                        break;
                    }
                case "body":
                    {
                        for (var key in vm.service.home.envObject.object.model.params) {
                            vm.service.home.envObject.object.model.params[key]["checkbox"] = vm.data.allObject.body;
                        }
                        break;
                    }
                case "restful":
                    {
                        for (var key in vm.interaction.response.apiInfo.restfulParam) {
                            vm.interaction.response.apiInfo.restfulParam[key]["checkbox"] = vm.data.allObject.restful;
                        }
                        break;
                    }
                case "url":
                    {
                        for (var key in vm.interaction.response.apiInfo.urlParam) {
                            vm.interaction.response.apiInfo.urlParam[key]["checkbox"] = vm.data.allObject.url;
                        }
                        break;
                    }
            }
        };
        vm.fun.changeRequestType = function (status) {
            if (vm.component.unitTestObjectOutput.isPreview) return;
            vm.service.home.envObject.object.model.requestType = status;
        };
        vm.fun.changeUri = function () {
            data.manualChangeUrl = true;
            vm.interaction.response.apiInfo.urlParam = vm.service.home.urlParamObject.fun
                .reset(vm.service.home.envObject.object.model.URL)
                .concat({
                    paramType: "0",
                    paramKey: "",
                    paramInfo: "",
                    checkbox: true,
                    paramValueQuery: []
                });
        };
        vm.fun.last = function (status, arg) {
            if (arg.$last) {
                switch (status) {
                    case "header":
                        {
                            vm.fun.add("header");
                            break;
                        }
                    case "url":
                        {
                            vm.fun.add("url");
                            break;
                        }
                    case "restful":
                        {
                            vm.fun.add("restful");
                            break;
                        }
                    case "body":
                        {
                            vm.fun.add("body");
                            break;
                        }
                }
            }
        };
        vm.fun.add = function (status, arg) {
            var template = {
                header: {
                    headerName: "",
                    headerValue: "",
                    checkbox: true
                },
                body: {
                    paramType: "0",
                    paramKey: "",
                    paramInfo: "",
                    checkbox: true,
                    paramValueQuery: []
                },
                restful: {
                    paramType: "0",
                    paramKey: "",
                    paramInfo: "",
                    checkbox: true,
                    paramValueQuery: []
                },
                url: {
                    paramType: "0",
                    paramKey: "",
                    paramInfo: "",
                    checkbox: true,
                    paramValueQuery: []
                }
            };
            switch (status) {
                case "header":
                    {
                        vm.service.home.envObject.object.model.headers.push(
                            template.header
                        );
                        break;
                    }
                case "body":
                    {
                        vm.service.home.envObject.object.model.params.push(
                            template.body
                        );
                        break;
                    }
                case "restful":
                    {
                        vm.interaction.response.apiInfo.restfulParam.push(
                            template.restful
                        );
                        break;
                    }
                case "url":
                    {
                        vm.interaction.response.apiInfo.urlParam.push(template.url);
                        break;
                    }
                case "all":
                    {
                        vm.service.home.envObject.object.model.headers.push(
                            template.header
                        );
                        vm.service.home.envObject.object.model.params.push(
                            template.body
                        );
                        vm.interaction.response.apiInfo.urlParam.push(template.url);
                        vm.interaction.response.apiInfo.restfulParam.push(
                            template.restful
                        );
                        break;
                    }
            }
        };
        vm.fun.delete = function (status, arg) {
            switch (status) {
                case "header":
                    {
                        vm.service.home.envObject.object.model.headers.splice(
                            arg.$index,
                            1
                        );
                        break;
                    }
                case "url":
                    {
                        vm.interaction.response.apiInfo.urlParam.splice(arg.$index, 1);
                        break;
                    }
                case "restful":
                    {
                        vm.interaction.response.apiInfo.restfulParam.splice(
                            arg.$index,
                            1
                        );
                        break;
                    }
                case "body":
                    {
                        vm.service.home.envObject.object.model.params.splice(
                            arg.$index,
                            1
                        );
                        break;
                    }
            }
        };
        vm.fun.json = function () {
            vm.component.unitTestObject.formToJson.checkbox = !vm.component
                .unitTestObject.formToJson.checkbox;
        };
        vm.fun.addHistory = function (arg) {
            if (!vm.data.queryHistory) return;
            switch (arg.status) {
                case "plug-test":
                    {
                        vm.interaction.response.apiInfo.testHistory.splice(0, 0, arg.history);
                        break;
                    }
                default:
                    {
                        vm.interaction.response.apiInfo.testHistory.splice(0, 0, arg.history);
                        break;
                    }
            }
        };
        vm.fun.window = function () {
            var template = {
                window: window.open(),
                cache: service.cache.get("UNIT_TEST_RESULT")
            };
            if (template.cache) {
                template.window.document.open();
                template.window.document.write(template.cache);
                template.window.document.close();
            }
        };
        vm.fun.test = function () {
            $scope.$broadcast('$UnitTestClick');
        }
        vm.fun.testList.clear = function (arg) {
            var template = {
                request: {
                    spaceKey: vm.interaction.request.spaceKey,
                    projectID: vm.interaction.request.projectID,
                    apiID: vm.interaction.request.apiID
                }
            };
            $rootScope.EnsureModal($filter('translate')('284'), false, $filter('translate')('533'), {}, function (
                callback
            ) {
                if (callback) {
                    resource.Test.DeleteAllHistory(
                        template.request
                    ).$promise.then(function (response) {
                        switch (response.statusCode) {
                            case CODE.COMMON.SUCCESS:
                                {
                                    $rootScope.InfoModal($filter('translate')('534'), "success");
                                    vm.interaction.response.apiInfo.testHistory = [];
                                    break;
                                }
                        }
                    });
                }
            });
        };
        vm.fun.testList.delete = function (arg) {
            arg = arg || {};
            if (arg.$event) {
                arg.$event.stopPropagation();
            }
            var template = {
                request: {
                    spaceKey: vm.interaction.request.spaceKey,
                    projectID: vm.interaction.request.projectID,
                    testID: arg.item.testID
                }
            };
            $rootScope.EnsureModal($filter('translate')('535'), false, ENSURE_WARNIMG.DELETE, {},
                function (callback) {
                    if (callback) {
                        if (arg.item.testID) {
                            resource.Test.DeleteHistory(
                                template.request
                            ).$promise.then(function (response) {
                                switch (response.statusCode) {
                                    case CODE.COMMON.SUCCESS:
                                        {
                                            $rootScope.InfoModal($filter('translate')('536'), "success");
                                            vm.interaction.response.apiInfo.testHistory.splice(arg.$index, 1);
                                            break;
                                        }
                                }
                            });
                        } else {
                            vm.interaction.response.apiInfo.testHistory.splice(
                                arg.$index,
                                1
                            );
                        }
                    }
                }
            );
        };
        vm.fun.testList.enter = function (arg) {
            if (vm.component.unitTestObjectOutput.isPreview) return;
            arg = arg || {};
            vm.service.home.envObject.object.model.URL =
                arg.item.requestInfo.URL;
            vm.service.home.envObject.object.model.headers = [];
            vm.service.home.envObject.object.model.params = [];
            vm.service.home.envObject.object.model.raw = "";
            vm.service.home.envObject.object.model.requestType =
                arg.item.requestInfo.requestType;
            vm.interaction.response.apiInfo.urlParam = vm.service.home.urlParamObject.fun.reset(
                arg.item.requestInfo.URL
            );
            vm.interaction.response.apiInfo.restfulParam = [];
            var info = {};
            vm.data.response = {
                status: "0",
                testHttpCode: arg.item.resultInfo.httpCode,
                testDeny: arg.item.resultInfo.testDeny,
                testResult: {
                    headers: arg.item.resultInfo.headers
                },
                httpCodeType: arg.item.resultInfo.httpCode >= 100 && arg.item.resultInfo.httpCode < 200 ? 1 : arg.item.resultInfo.httpCode >= 200 && arg.item.resultInfo.httpCode < 300 ? 2 : arg.item.resultInfo.httpCode >= 300 && arg.item.resultInfo.httpCode < 400 ? 3 : 4,
                hadTest: true,
            };
            vm.component.unitTestObject.injectScript = {
                type: "0",
                before: arg.item.beforeInject,
                after: arg.item.afterInject
            };
            $scope.$broadcast(
                "$Maunal_AceEditorAms_Code_Ace_Editor_Js",
                arg.item.beforeInject
            );
            angular.forEach(arg.item.requestInfo.headers, function (val, key) {
                info = {
                    headerName: val.name,
                    headerValue: val.value,
                    checkbox: true
                };
                vm.service.home.envObject.object.model.headers.push(info);
            });
            if (vm.service.home.envObject.object.model.requestType != "1") {
                for (var key = 0; key < arg.item.requestInfo.params.length; key++) {
                    var val = arg.item.requestInfo.params[key];
                    if (!val.key) break;
                    vm.service.home.envObject.object.model.params.push({
                        checkbox: true,
                        paramKey: val.key,
                        paramInfo: val.value,
                        paramValueQuery: []
                    });
                }
            } else {
                vm.service.home.envObject.object.model.params = [];
                vm.service.home.envObject.object.model.raw = arg.item.requestInfo.params;
                $scope.$broadcast("$Maunal_AceEditorAms", arg.item.requestInfo.params);
            }
            vm.service.home.envObject.object.model.apiRequestType =
                "" + arg.item.requestInfo.methodType;
            service.cache.set(arg.item.resultInfo.body, "UNIT_TEST_RESULT");
            vm.data.format.message = !vm.data.format.message;
            vm.fun.add("all");
            vm.data.header = {
                type: "0"
            };
            vm.service.home.envObject.object.model.auth = {
                status: "0",
                basicAuth: {
                    username: "",
                    password: ""
                }
            };
        };
        vm.fun.expressionBuilder = function (arg) {
            arg.item.expressionBuilderObject = arg.item.expressionBuilderObject || {
                request: {},
                response: {}
            };
            switch (arg.$index) {
                case 0:
                    {
                        arg.item.expressionBuilderObject.request.constant = arg.item.URL;
                        break;
                    }
                case 1:
                    {
                        arg.item.expressionBuilderObject.request.constant = arg.item.headerValue;
                        break;
                    }
                case 2:
                    {
                        arg.item.expressionBuilderObject.request.constant = arg.item.paramInfo;
                        break;
                    }
            }

            $rootScope.ExpressionBuilderModal(
                arg.item.expressionBuilderObject,
                function (callback) {
                    if (callback) {
                        switch (arg.$index) {
                            case 0:
                                {
                                    arg.item.URL = callback.response.result || arg.item.URL;
                                    break;
                                }
                            case 1:
                                {
                                    arg.item.headerValue =
                                    callback.response.result || arg.item.headerValue;
                                    break;
                                }
                            case 2:
                                {
                                    arg.item.paramInfo =
                                    callback.response.result || arg.item.paramInfo;
                                    break;
                                }
                        }
                        arg.item.expressionBuilderObject = callback;
                    }
                }
            );
        };
        vm.fun.import = function (arg) {
            if (arg.file.length == 0) return;
            var template = {
                $index: this.$parent.$index,
                reader: null
            };
            vm.service.home.envObject.object.model.params[template.$index].paramInfo = "";
            data.fileList[template.$index] = [];
            for (var i = 0; i < arg.file.length; i++) {
                var val = arg.file[i];
                if (val.size > 2 * 1024 * 1024) {
                    vm.service.home.envObject.object.model.params[template.$index].paramInfo = "";
                    $rootScope.InfoModal($filter('translate')('537'), "error");
                    break;
                } else {
                    vm.service.home.envObject.object.model.params[template.$index].paramInfo = val.name + "," + vm.service.home.envObject.object.model.params[template.$index].paramInfo;
                    template.reader = new FileReader();
                    template.reader.readAsDataURL(val);
                    template.reader.onload = function (_default) {
                        if (vm.data.plugObject.useStatus) {
                            data.fileList[template.$index].splice(0, 0, this.result);
                        } else {
                            data.fileList[template.$index].splice(0, 0, {
                                name: val.name,
                                dataUrl: this.result
                            });
                        }
                        service.cache.set(data.fileList, "fileList");
                    };
                }
            }
            vm.service.home.envObject.object.model.params[template.$index].paramInfo = vm.service.home.envObject.object.model.params[template.$index].paramInfo.slice(0, vm.service.home.envObject.object.model.params[template.$index].paramInfo.length - 1);
            ($scope.$root && $scope.$root.$$phase) || $scope.$apply();
        };
        fun.newApi = function (status, uri, cache) {
            var template = {
                cache: service.cache.get('API_QUICK_TEST_GROUP'),
                modal: {}
            }
            if (!template.cache || template.cache.length <= 0) {
                $rootScope.GroupModal({
                    title: $filter('translate')('538'),
                    secondTitle: $filter('translate')('328'),
                    btn: {
                        message: $filter('translate')('539'),
                        type: 'info'
                    }
                }, function (callback) {
                    if (callback) {
                        ApiManagementResource.ApiGroup.Add({
                            groupName: callback.groupName,
                            projectID: vm.interaction.request.projectID,
                            spaceKey: vm.interaction.request.spaceKey
                        }).$promise.then(function (response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        service.default.navbar.menu(status, uri, cache);
                                        break;
                                    }
                                default:
                                    {
                                        $rootScope.InfoModal($filter('translate')('493'), 'error');
                                        break;
                                    }
                            }
                        })

                    }
                })
            } else {
                service.default.navbar.menu(status, uri, cache);
            }
        }
        fun.init = function (status) {
            var template = {
                fun: {}
            };
            $scope.$emit("$WindowTitleSet", {
                list: [
                    $filter('translate')('540') + vm.interaction.response.apiInfo.baseInfo.apiName,
                    $filter('translate')('448'),
                    $state.params.projectName,
                    $filter('translate')('405')
                ]
            });
            if (status == 'reset') {
                vm.interaction.response.apiInfo = {
                    baseInfo: {
                        apiName: "",
                        apiURI: "",
                        apiRequestRaw: "",
                        apiProtocol: 0,
                        apiRequestType: 0,
                        apiRequestParamType: 0
                    },
                    headerInfo: [],
                    requestInfo: [],
                    authInfo: {
                        status: "0"
                    },
                    testHistory: vm.interaction.response.apiInfo.testHistory,
                };
                vm.data.response = {
                    httpCodeType: 2,
                    hadTest: false,
                    status: "0"
                };
                service.cache.clear("UNIT_TEST_RESULT");
                vm.data.format = {
                    isJson: true,
                    message: ""
                };
            }
            vm.service.home.envObject.object.model.params = vm.interaction.response.apiInfo.requestInfo || [];
            vm.service.home.envObject.object.model.headers = vm.interaction.response.apiInfo.headerInfo || [];
            vm.service.home.envObject.object.model.requestType = "" + vm.interaction.response.apiInfo.baseInfo.apiRequestParamType;
            vm.service.home.envObject.object.model.raw = vm.interaction.response.apiInfo.baseInfo.apiRequestRaw || "";
            vm.service.home.envObject.object.model.apiRequestType = "" + vm.interaction.response.apiInfo.baseInfo.apiRequestType;
            vm.service.home.envObject.object.model.httpHeader = "0";
            vm.service.home.envObject.object.model.auth = vm.interaction.response.apiInfo.authInfo;
            vm.component.unitTestObject.injectScript = {
                type: "0",
                before: vm.interaction.response.apiInfo.baseInfo.beforeInject,
                after: vm.interaction.response.apiInfo.baseInfo.afterInject
            };
            $scope.$broadcast('$Maunal_AceEditorAms', vm.service.home.envObject.object.model.raw);
            template.fun.handleParam = function (val, key) {
                val.paramValueQuery = [];
                val.checkbox = !parseInt(val.paramNotNull || "0");
                angular.forEach(val.paramValueList, function (value, key) {
                    val.paramValueQuery.push(value.value);
                });
                val.paramInfo = val.paramValue || val.paramValueQuery[val.default] || "";
                return val;
            };
            template.fun.releaseStructure = function (arg, status) {
                var interaction = {
                    key: null,
                    request: [],
                }
                angular.copy(arg, interaction.request);
                interaction.key = 0;
                angular.forEach(arg, function (val, key) {
                    if (status) {
                        val.type = val.paramType;
                    }
                    interaction.request[interaction.key++] = template.fun.handleParam(val, key);
                    // if (!val.structureID) return;
                    // interaction.request.splice(--interaction.key, 1);
                    // angular.forEach(val.structureData, function (val1, key1) {
                    //     val1.structureID = val.structureID;
                    //     interaction.request.splice(interaction.key++, 0, val1);
                    // })
                })
                return interaction.request;
            }
            vm.interaction.response.apiInfo.requestInfo = template.fun.releaseStructure(vm.interaction.response.apiInfo.requestInfo, true);
            vm.interaction.response.apiInfo.urlParam = template.fun.releaseStructure(vm.interaction.response.apiInfo.urlParam || []);
            vm.interaction.response.apiInfo.restfulParam = template.fun.releaseStructure(vm.interaction.response.apiInfo.restfulParam || []);
            vm.interaction.response.apiInfo.urlParam = vm.service.home.urlParamObject.fun
                .reset(vm.interaction.response.apiInfo.baseInfo.apiURI)
                .concat(vm.interaction.response.apiInfo.urlParam || []);
            vm.service.home.envObject.object.model.URL = vm.service.home.urlParamObject.fun.$watch({
                params: vm.interaction.response.apiInfo.urlParam || [],
                url: vm.interaction.response.apiInfo.baseInfo.apiURI
            });
            for (var key in vm.service.home.envObject.object.model.headers) {
                vm.service.home.envObject.object.model.headers[key]['checkbox'] = true;
            }
            data.manualChangeUrl = true;
            vm.fun.add("all");
            $scope.$emit("$TransferStation", {
                state: "$EnvInitReady",
                data: {
                    status: 2,
                    header: "headers",
                    additionalParams: "params",
                    param: JSON.stringify(vm.service.home.envObject.object.model)
                }
            });
        };
        vm.fun.initHistory = function () {
            if (vm.data.queryHistory) return;
            var template = {
                request: {
                    spaceKey: vm.interaction.request.spaceKey,
                    projectID: vm.interaction.request.projectID,
                    apiID: vm.interaction.request.apiID
                }
            }
            $rootScope.global.ajax.TestHistoryList_UnitTest = resource.Test.TestHistoryList(template.request);
            $rootScope.global.ajax.TestHistoryList_UnitTest.$promise.then(function (response) {
                vm.data.queryHistory = true;
                vm.interaction.response.apiInfo.testHistory = response.testHistoryList || [];
                angular.forEach(vm.interaction.response.apiInfo.testHistory, function (val, key) {
                    try {
                        if (val.requestInfo.constructor != Object) {
                            val.requestInfo = {
                                apiProtocol: '0',
                                method: 'error',
                                URL: $filter('translate')('541'),
                                requestType: '0'
                            };
                        }
                        if (val.resultInfo == null) {
                            val.resultInfo = {
                                'body': 'error',
                                'headers': [],
                                'httpCode': 500,
                                'testDeny': 0
                            };
                        }
                        val.requestInfo.methodType = val.requestInfo.method == 'POST' ? 0 : val.requestInfo.method == 'GET' ? 1 : val.requestInfo.method == 'PUT' ? 2 : val.requestInfo.method == 'DELETE' ? 3 : val.requestInfo.method == 'HEAD' ? 4 : val.requestInfo.method == 'OPTIONS' ? 5 : 6;
                        val.httpCodeType = val.resultInfo.httpCode >= 100 && val.resultInfo.httpCode < 200 ? 1 : val.resultInfo.httpCode >= 200 && val.resultInfo.httpCode < 300 ? 2 : val.resultInfo.httpCode >= 300 && val.resultInfo.httpCode < 400 ? 3 : 4;
                        val.requestInfo.URL = (val.requestInfo.URL || '').replace('http://', '');
                    } catch (e) {
                        console.log($filter('translate')('542'));
                    }
                })
            })
            return $rootScope.global.ajax.TestHistoryList_UnitTest.$promise;

        }
        vm.fun.selectHistoryTab = function () {
            $scope.$broadcast('$Init_LoadingPartCommonComponent');
        }
        vm.fun.init = function () {
            var template = {
                cache: {
                    apiInfo: service.cache.get()
                },
                request: {
                    spaceKey: vm.interaction.request.spaceKey,
                    projectID: vm.interaction.request.projectID,
                    groupID: vm.interaction.request.grandSonGroupID ||
                        vm.interaction.request.childGroupID ||
                        vm.interaction.request.groupID,
                    apiID: vm.interaction.request.apiID
                }
            };

            if (template.cache.apiInfo) {
                template.cache.apiInfo.authInfo.status =
                    template.cache.apiInfo.authInfo.status || "0";
                vm.interaction.response.apiInfo = template.cache.apiInfo;
                fun.init();
            } else {
                $rootScope.global.ajax.Detail_Api = ApiManagementResource.Api.Detail(
                    template.request
                );
                $rootScope.global.ajax.Detail_Api.$promise.then(function (response) {
                    switch (response.statusCode) {
                        case CODE.COMMON.SUCCESS:
                            {
                                response.apiInfo.authInfo.status = response.apiInfo.authInfo.status || "0";
                                vm.interaction.response.apiInfo = response.apiInfo;
                                $scope.$broadcast(
                                    "$Maunal_AceEditorAms",
                                    response.apiInfo.baseInfo.apiRequestRaw
                                );
                                fun.init();
                                break;
                            }
                        default:
                            {
                                vm.interaction.response.apiInfo = {};
                            }
                    }
                });
            }
        };
        vm.fun.init();
        vm.$onInit = function () {
            service.cache.clear("UNIT_TEST_RESULT");
            var template = {
                array: []
            };
            $scope.importFile = vm.fun.import;
            $rootScope.global.$watch.push($scope.$watch("$ctrl.interaction.response.apiInfo.urlParam", function () {
                    if (data.manualChangeUrl) {
                        data.manualChangeUrl = false;
                        return;
                    }
                    try {
                        vm.service.home.envObject.object.model.URL = vm.service.home.urlParamObject.fun.$watch({
                            params: vm.interaction.response.apiInfo.urlParam || [],
                            url: vm.service.home.envObject.object.model.URL
                        });
                    } catch (e) {
                        console.error("pro unit test 668：", e);
                    }
                },
                true
            ));

            template.array = [{
                    type: "btn",
                    class: "btn-group-li pull-left",
                    authority: "edit",
                    btnList: [{
                        name: $filter('translate')('324'),
                        icon: "bianji",
                        fun: {
                            default: service.default.navbar.menu,
                            params: "'edit'," + JSON.stringify(vm.interaction.request)
                        }
                    }]
                },
                {
                    type: "fun-list",
                    class: "btn-li sort-btn-li pull-left",
                    authority: "edit",
                    name: $filter('translate')('449'),
                    icon: "caidan",
                    click: true,
                    funList: [{
                            name: $filter('translate')('452'),
                            icon: "renwuguanli",
                            fun: {
                                default: service.default.navbar.menu,
                                params: "'copy'," + JSON.stringify(vm.interaction.request)
                            }
                        },
                        {
                            name: $filter('translate')('259'),
                            icon: "shanchu",
                            fun: {
                                default: service.default.navbar.delete,
                                params: JSON.stringify(vm.interaction.request)
                            }
                        }
                    ]
                }
            ];
            vm.component.menuObject.list = [{
                    type: "btn",
                    class: "margin-left-li-20 btn-group-li pull-left",
                    btnList: [{
                        name: $filter('translate')('454'),
                        icon: "xiangzuo",
                        fun: {
                            default: service.default.navbar.menu,
                            params: "'list'," + JSON.stringify(vm.interaction.request)
                        }
                    }]
                },
                {
                    type: "tabs",
                    class: "menu-li pull-left first-menu-li",
                    tabList: [{
                            name: $filter('translate')('421'),
                            fun: {
                                default: service.default.navbar.menu,
                                params: "'detail'," + JSON.stringify(vm.interaction.request)
                            }
                        },
                        {
                            name: $filter('translate')('374'),
                            class: "elem-active"
                        },
                        {
                            name: $filter('translate')('453'),
                            authority: "versionManagement",
                            fun: {
                                default: service.default.navbar.menu,
                                params: "'history'," + JSON.stringify(vm.interaction.request)
                            }
                        }
                    ]
                },
                {
                    type: "divide",
                    class: "divide-li pull-left",
                    authority: "edit"
                }
            ].concat(template.array);
        };
    }
})();