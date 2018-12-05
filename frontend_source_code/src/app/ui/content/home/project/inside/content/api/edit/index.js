(function () {
    /**
     * @name API编辑
     * @author 广州银云信息科技有限公司 
     */
    'use strict';
    angular.module('eolinker')
        .component('homeProjectInsideApiEdit', {
            templateUrl: 'app/ui/content/home/project/inside/content/api/edit/index.html',
            controller: indexController
        })

    indexController.$inject = ['Cache_CommonService', 'Group_AmsCommonService', '$scope', '$location', '$anchorScroll', 'ApiManagementResource', '$state', 'CODE', '$rootScope', 'HTTP_CONSTANT', 'GroupService', 'HTML_LAZYLOAD', '$document', 'Authority_CommonService','$filter'];

    function indexController(Cache_CommonService, Group_AmsCommonService, $scope, $location, $anchorScroll, ApiManagementResource, $state, CODE, $rootScope, HTTP_CONSTANT, GroupService,  HTML_LAZYLOAD, $document, Authority_CommonService,$filter) {
        var vm = this;
        vm.data = {
            typeSelect: [{
                    value: "0",
                    name: "[string]"
                },
                {
                    value: "1",
                    name: "[file]"
                },
                {
                    value: "2",
                    name: "[json]"
                },
                {
                    value: "3",
                    name: "[int]"
                },
                {
                    value: "4",
                    name: "[float]"
                },
                {
                    value: "5",
                    name: "[double]"
                },
                {
                    value: "6",
                    name: "[date]"
                },
                {
                    value: "7",
                    name: "[datetime]"
                },
                {
                    value: "8",
                    name: "[boolean]"
                },
                {
                    value: "9",
                    name: "[byte]"
                },
                {
                    value: "10",
                    name: "[short]"
                },
                {
                    value: "11",
                    name: "[long]"
                },
                {
                    value: "12",
                    name: "[array]"
                },
                {
                    value: "13",
                    name: "[object]"
                },
                {
                    value: "14",
                    name: "[number]"
                },
            ],
            index: {
                header: 0,
                url: 0,
                body: 0,
                restful: 0,
                response: 0,
                param: 0,
            },
            apiGroup: null,
            menuType: 'body',
            mockType: 'set',
            isIgnoreNotice: false,
            contentType: {
                array: [{
                    key: 'Auto',
                    value: ''
                }, {
                    key: 'Text(text/plain)',
                    value: 'text/plain'
                }, {
                    key: 'JSON(application/json)',
                    value: 'application/json'
                }, {
                    key: 'Javascript(application/javascript)',
                    value: 'application/javascript'
                }, {
                    key: 'XML(application/xml)',
                    value: 'application/xml'
                }, {
                    key: 'XML(text/xml)',
                    value: 'text/xml'
                }, {
                    key: 'HTML(text/html)',
                    value: 'text/html'
                }],
                current: {
                    key: 'Auto',
                    value: ''
                }
            },
            allObject: {
                body: false,
                url: false,
                response: false,
                restful: false
            },
            input: {
                submited: false
            },
            menu: 0, //0：API文档、1：详细说明、2：高级mock
            mock: {},
            timer: {
                fun: null
            },
            sort: {
                urlParamForm: {
                    containment: '.url-form-ul',
                    child: {
                        containment: '.request-param-form-ul'
                    }
                },
                requestParamForm: {
                    containment: '.request-form-ul',
                    child: {
                        containment: '.request-param-form-ul'
                    }
                },
                restfulParamForm: {
                    containment: '.restful-form-ul',
                    child: {
                        containment: '.request-param-form-ul'
                    }
                },
                headerForm: {
                    containment: '.header-form-ul'
                },
                responseParamForm: {
                    containment: '.response-form-ul',
                    child: {
                        containment: '.response-param-form-ul'
                    }
                }
            },
            jsonToParamObject: { //自动匹配json获取response params
                headerItem: {
                    "headerName": '',
                    "headerValue": ''
                },
                resultItem: {
                    "paramNotNull": true,
                    "paramName": "",
                    "paramKey": "",
                    "type": "0",
                    "paramType": "0",
                    "paramValueList": []
                },
                resultValueItem: {
                    "value": "",
                    "paramType": "0",
                    "valueDescription": ""
                },
                requestItem: {
                    "paramNotNull": true,
                    "paramType": "0",
                    "paramName": "",
                    "paramKey": "",
                    "paramValue": "",
                    "paramLimit": "",
                    "paramNote": "",
                    "paramValueList": [],
                    "default": 0
                },
                requestValueItem: {
                    "value": "",
                    "paramType": "0",
                    "valueDescription": ""
                },
                urlValueItem: {
                    "value": "",
                    "valueDescription": ""
                },
            },
            group: {
                parent: [],
                child: [],
                grandson: []
            },
            script: {},
            reset: {
                spaceKey: $state.params.spaceKey,
                projectID: $state.params.projectID,
                groupID: $state.params.groupID || -1,
                childGroupID: $state.params.childGroupID,
                grandSonGroupID: $state.params.grandSonGroupID,
                apiID: $state.params.apiID,
                status: $state.params.status
            },
            isOrigin: true,
            responseMenuType: 'response'
        }
        vm.interaction = {
            response: {
                apiInfo: {
                    spaceKey: $state.params.spaceKey,
                    projectID: $state.params.projectID,
                    groupID: $state.params.groupID || -1,
                    childGroupID: $state.params.childGroupID,
                    grandSonGroupID: $state.params.grandSonGroupID,
                    apiID: $state.params.apiID,
                    apiRichNote: '',
                    apiMarkdownNote: '',
                    apiNoteRaw: '',
                    apiNoteType: '1',
                    apiRequestParamType: '0',
                    apiRequestRaw: '',
                    apiHeader: [],
                    apiRequestParam: [],
                    apiResultParam: [],
                    apiRestfulParam: [],
                    apiUrlParam: [],
                    responseHeader: [],
                    starred: 0,
                    mockConfig: {
                        rule: '',
                        type: 'object'
                    },
                    apiAuth: {
                        status: '0'
                    }
                }
            }
        }
        vm.constant = {
            requestHeader: HTTP_CONSTANT.REQUEST_HEADER,
            requestParamLimit: HTTP_CONSTANT.REQUEST_PARAM,
            lazyload: HTML_LAZYLOAD.LAZY_EDITOR
        };
        vm.fun = {};
        vm.service = {
            authority: Authority_CommonService
        }
        vm.component = {
            menuObject: {
                list: []
            },
            selectMultistageCommonComponentObject: {
                new: {},
                original: {}
            },
            aceEditorMenu: {
                resource: ApiManagementResource
            }
        };
        var service = {
                cache: Cache_CommonService,
                defaultCommon: Group_AmsCommonService
            },
            data = {
                objCompatable: {
                    header: {
                        select: 'apiHeader',
                        name: '{{\'27\'|translate}} ',
                        key: 'headerName',
                    },
                    body: {
                        select: 'apiRequestParam',
                        name: $filter('translate')('455'),
                        key: 'paramKey',
                    },
                    restful: {
                        select: 'apiRestfulParam',
                        name: '{{\'38\'|translate}} ',
                        key: 'paramKey',

                    },
                    url: {
                        select: 'apiUrlParam',
                        name: '{{\'39\'|translate}} ',
                        key: 'paramKey',

                    },
                    response: {
                        select: 'apiResultParam',
                        name: '{{\'223\'|translate}} ',
                        key: 'paramKey',
                    },
                    responseHeader: {
                        select: 'responseHeader',
                        name: '{{\'222\'|translate}} ',
                        key: 'headerName',
                    }
                },
                modalType: '',
                detailBefore: {},
                timer: null,
                updateDesc: ''
            },
            fun = {}

        vm.fun.quickSelectContentType = function (status, arg) {
            arg.$event.stopPropagation();
            switch (status) {
                case 'select':
                    {
                        var index = vm.interaction.response.apiInfo.apiHeader[0].$index;
                        if (arg.item.value) {
                            if (/content-type/i.test(vm.interaction.response.apiInfo.apiHeader[0]['headerName'])) {
                                vm.interaction.response.apiInfo.apiHeader.splice(0, 1, {
                                    "headerName": 'Content-Type',
                                    "headerValue": arg.item.value,
                                    "$index": index,
                                })
                            } else {
                                vm.interaction.response.apiInfo.apiHeader.splice(0, 0, {
                                    "headerName": 'Content-Type',
                                    "headerValue": arg.item.value,
                                    "$index": ++vm.data.index.header,
                                })
                            }
                        } else {
                            if (/content-type/i.test(vm.interaction.response.apiInfo.apiHeader[0]['headerName'])) {
                                vm.interaction.response.apiInfo.apiHeader.splice(0, 1);
                            }
                        }
                        vm.data.contentType.current = arg.item;
                        break;
                    }
            }
            vm.data.contentType.isClick = !vm.data.contentType.isClick;
        }
        vm.fun.quickSetExpression = function (arg) {
            var template = {
                javascript: '',
                callback: null,
            }
            template.javascript = arg.value;
            $scope.$broadcast('$InsertText_AceEditorAms_Code_Ace_Editor_Js', template.javascript, arg.offset);
        }
        $rootScope.global.$watch.push($scope.$watch('$ctrl.interaction.response.apiInfo.apiHeader[0]["headerValue"]', function () {
            try {
                if (/content-type/i.test(vm.interaction.response.apiInfo.apiHeader[0]['headerName'])) {
                    switch (vm.interaction.response.apiInfo.apiHeader[0]['headerValue'].toLowerCase()) {
                        case 'text/plain':
                            {
                                vm.data.contentType.current = vm.data.contentType.array[1];
                                break;
                            }
                        case 'application/json':
                            {
                                vm.data.contentType.current = vm.data.contentType.array[2];
                                break;
                            }
                        case 'application/javascript':
                            {
                                vm.data.contentType.current = vm.data.contentType.array[3];
                                break;
                            }
                        case 'application/xml':
                            {
                                vm.data.contentType.current = vm.data.contentType.array[4];
                                break;
                            }
                        case 'text/xml':
                            {
                                vm.data.contentType.current = vm.data.contentType.array[5];
                                break;
                            }
                        case 'text/html':
                            {
                                vm.data.contentType.current = vm.data.contentType.array[6];
                                break;
                            }
                        default:
                            {
                                vm.data.contentType.current = {
                                    key: 'Auto',
                                    value: ''
                                }
                                break;
                            }
                    }
                } else {
                    vm.data.contentType.current = {
                        key: 'Auto',
                        value: ''
                    }
                }
            } catch (e) {}
        }))
        $document.on("click", function (_default) {
            vm.data.contentType.isClick = false;
            $scope.$root && $scope.$root.$$phase || $scope.$apply();
        });
        vm.fun.all = function (status) {
            switch (status) {
                case 'body':
                    {
                        for (var key in vm.interaction.response.apiInfo.apiRequestParam) {
                            vm.interaction.response.apiInfo.apiRequestParam[key]['paramNotNull'] = vm.data.allObject.body;
                        }
                        break;
                    }
                case 'restful':
                    {
                        for (var key in vm.interaction.response.apiInfo.apiRestfulParam) {
                            vm.interaction.response.apiInfo.apiRestfulParam[key]['paramNotNull'] = vm.data.allObject.restful;
                        }
                        break;
                    }
                case 'url':
                    {
                        for (var key in vm.interaction.response.apiInfo.apiUrlParam) {
                            vm.interaction.response.apiInfo.apiUrlParam[key]['paramNotNull'] = vm.data.allObject.url;
                        }
                        break;
                    }
                case 'response':
                    {
                        for (var key in vm.interaction.response.apiInfo.apiResultParam) {
                            vm.interaction.response.apiInfo.apiResultParam[key]['paramNotNull'] = vm.data.allObject.response;
                        }
                        break;
                    }
                case 'responseHeader':
                    {
                        for (var key in vm.interaction.response.apiInfo.responseHeader) {
                            vm.interaction.response.apiInfo.responseHeader[key]['paramNotNull'] = vm.data.allObject.response;
                        }
                        break;
                    }
            }
        }
        vm.fun.menu = function (arg) {
            vm.data.menu = arg.switch;
        }
        vm.fun.filterMock = function (arg) {
            if (arg.paramKey == '') {
                return false;
            } else {
                return true;
            }
        }
        vm.fun.storage = function () {
            switch (vm.interaction.response.apiInfo.starred) {
                case 0:
                    {
                        vm.interaction.response.apiInfo.starred = 1;
                        break;
                    }
                case 1:
                    {
                        vm.interaction.response.apiInfo.starred = 0;
                        break;
                    }
            }
        }
        vm.fun.last = function (status, arg) {
            if (arg.$last) {
                switch (status) {
                    case 'header':
                        {
                            vm.fun.add('header');
                            break;
                        }
                    case 'body':
                        {
                            vm.fun.add('body', arg);
                            break;
                        }
                    case 'response':
                        {
                            vm.fun.add('response');
                            break;
                        }
                    case 'restful':
                        {
                            vm.fun.add('restful');
                            break;
                        }
                    case 'url':
                        {
                            vm.fun.add('url');
                            break;
                        }
                    case 'param':
                        {
                            vm.fun.add('param', {
                                item: arg.item
                            });
                            break;
                        }
                    case 'responseHeader':
                        {
                            vm.fun.add('responseHeader');
                            break;
                        }
                }
            }
            if (vm.data.reset.status != 'add') {
                fun.monitorEditParam(status, arg.item);
            }
        }
        vm.fun.add = function (status, arg) {
            var template = {
                responseHeader: {
                    "headerName": '',
                    "headerValue": ''
                },
                header: {
                    "headerName": '',
                    "headerValue": ''
                },
                url: {
                    "paramNotNull": true,
                    "paramName": "",
                    "paramKey": "",
                    "paramValue": "",
                    "paramLimit": "",
                    "paramNote": "",
                    "paramValueList": [],
                    "default": 0
                },
                body: {
                    "paramNotNull": true,
                    "paramType": "0",
                    "paramName": "",
                    "paramKey": "",
                    "paramValue": "",
                    "paramLimit": "",
                    "paramNote": "",
                    "paramValueList": [],
                    "default": 0
                },
                restful: {
                    "paramNotNull": true,
                    "paramType": "0",
                    "paramName": "",
                    "paramKey": "",
                    "paramValue": "",
                    "paramLimit": "",
                    "paramNote": "",
                    "paramValueList": [],
                    "default": 0
                },
                response: {
                    "paramNotNull": true,
                    "paramName": "",
                    "paramKey": "",
                    "paramType": '0',
                    "paramValueList": []
                }
            }
            switch (status) {
                case 'header':
                    {
                        template.header.$index = ++vm.data.index.header;
                        vm.interaction.response.apiInfo.apiHeader.push(template.header);
                        break;
                    }
                case 'url':
                    {
                        template.url.$index = ++vm.data.index.url;
                        vm.interaction.response.apiInfo.apiUrlParam.push(template.url);
                        break;
                    }
                case 'insertUrl':
                    {
                        template.url.$index = ++vm.data.index.url;
                        vm.interaction.response.apiInfo.apiUrlParam.splice(arg.$index, 0, template.url);
                        break;
                    }
                case 'body':
                    {
                        template.body.$index = ++vm.data.index.body;
                        vm.interaction.response.apiInfo.apiRequestParam.push(template.body);
                        break;
                    }
                case 'insertBody':
                    {
                        template.body.$index = ++vm.data.index.body;
                        vm.interaction.response.apiInfo.apiRequestParam.splice(arg.$index, 0, template.body);
                        break;
                    }
                case 'restful':
                    {
                        template.restful.$index = ++vm.data.index.restful;

                        vm.interaction.response.apiInfo.apiRestfulParam.push(template.restful);
                        break;
                    }
                case 'insertRestful':
                    {
                        template.restful.$index = ++vm.data.index.restful;
                        vm.interaction.response.apiInfo.apiRestfulParam.splice(arg.$index, 0, template.restful);
                        break;
                    }
                case 'responseHeader':
                    {
                        template.responseHeader.$index = ++vm.data.index.restful;
                        vm.interaction.response.apiInfo.responseHeader.push(template.responseHeader);
                        break;
                    }
                case 'response':
                    {
                        template.response.$index = ++vm.data.index.response;
                        vm.interaction.response.apiInfo.apiResultParam.push(template.response);
                        break;
                    }
                case 'insertResponse':
                    {
                        template.response.$index = ++vm.data.index.response;
                        vm.interaction.response.apiInfo.apiResultParam.splice(arg.$index, 0, template.response);
                        break;
                    }
                case 'all':
                    {
                        vm.interaction.response.apiInfo.apiHeader.push(template.header);
                        vm.interaction.response.apiInfo.apiUrlParam.push(template.url);
                        vm.interaction.response.apiInfo.apiRequestParam.push(template.body);
                        vm.interaction.response.apiInfo.apiResultParam.push(template.response);
                        vm.interaction.response.apiInfo.apiRestfulParam.push(template.restful);
                        vm.interaction.response.apiInfo.responseHeader.push(template.responseHeader);
                        break;
                    }
                case 'param':
                    {
                        arg.item.paramValueList.push({
                            "value": "",
                            "valueDescription": "",
                            "$index": ++vm.data.index.param
                        });
                        break;
                    }
            }
        }
        vm.fun.delete = function (status, arg) {
            if (vm.data.reset.status != 'add') {
                fun.monitorDeleteParam(status, arg.item, arg.$index);
            }
            switch (status) {
                case 'header':
                    {
                        vm.interaction.response.apiInfo.apiHeader.splice(arg.$index, 1);
                        break;
                    }
                case 'url':
                    {
                        vm.interaction.response.apiInfo.apiUrlParam.splice(arg.$index, 1);
                        break;
                    }
                case 'body':
                    {
                        vm.interaction.response.apiInfo.apiRequestParam.splice(arg.$index, 1);
                        break;
                    }
                case 'restful':
                    {
                        vm.interaction.response.apiInfo.apiRestfulParam.splice(arg.$index, 1);
                        break;
                    }
                case 'response':
                    {
                        vm.interaction.response.apiInfo.apiResultParam.splice(arg.$index, 1);
                        break;
                    }
                case 'responseHeader':
                    {
                        vm.interaction.response.apiInfo.responseHeader.splice(arg.$index, 1);
                        break;
                    }
                case 'param':
                    {
                        arg.item.paramValueList.splice(arg.$index, 1);
                        if (arg.$index < arg.item.default) {
                            arg.item.default--;
                        } else if (arg.$index == arg.item.default) {
                            arg.item.default = -1;
                        }
                        break;
                    }
            }
        }
        vm.fun.moreRequest = function (status, arg) {
            data.modalType = 'request';
            var template = {
                modal: {
                    status: status,
                    item: {},
                    sort: {
                        requestParamForm: status == 'restful' ? vm.data.sort.restfulParamForm.child : status == 'body' ? vm.data.sort.requestParamForm.child : vm.data.sort.urlParamForm.child
                    },
                    constant: vm.constant.requestParamLimit,
                    typeSelect: vm.data.typeSelect,
                    fun: {
                        paramAdd: vm.fun.last,
                        delete: vm.fun.delete
                    }
                }
            }
            angular.copy(arg.item, template.modal.item);
            template.modal.item.paramValueList = template.modal.item.paramValueList || [];
            vm.data.index.param = arg.item.paramValueList.length - 1;
            if (template.modal.item.paramValueList.length == 0 || template.modal.item.paramValueList[template.modal.item.paramValueList.length - 1].value) {
                vm.fun.add('param', {
                    item: template.modal.item
                });
            }
            $rootScope.AMS_RequestParamEditModal(template.modal, function (callback) {
                if (callback) {
                    switch (status) {
                        case 'body':
                            {
                                if (arg.type != 'structure') {
                                    vm.interaction.response.apiInfo.apiRequestParam.splice(arg.$index, 1, callback.item);
                                } else {
                                    vm.interaction.response.apiInfo.apiRequestParam[arg.$parentIndex].structureData.splice(arg.$index, 1, callback.item);
                                }
                                break;
                            }
                        case 'restful':
                            {
                                vm.interaction.response.apiInfo.apiRestfulParam.splice(arg.$index, 1, callback.item);
                                break;
                            }
                        case 'url':
                            {
                                vm.interaction.response.apiInfo.apiUrlParam.splice(arg.$index, 1, callback.item);
                                break;
                            }

                    }
                }
            })
        }
        vm.fun.moreResponse = function (arg) {
            data.modalType = 'response';
            var template = {
                modal: {
                    item: {},
                    typeSelect: vm.data.typeSelect,
                    sort: {
                        responseParamForm: vm.data.sort.responseParamForm.child
                    },
                    fun: {
                        paramAdd: vm.fun.last,
                        delete: vm.fun.delete
                    }
                }
            }
            angular.copy(arg.item, template.modal.item);
            template.modal.item.paramValueList = template.modal.item.paramValueList || [];
            vm.data.index.param = arg.item.paramValueList.length - 1;
            if (template.modal.item.paramValueList.length == 0 || template.modal.item.paramValueList[template.modal.item.paramValueList.length - 1].value) {
                vm.fun.add('param', {
                    item: template.modal.item
                });
            }
            $rootScope.AMS_ResponseParamEditModal(template.modal, function (callback) {
                if (callback) {
                    vm.interaction.response.apiInfo.apiResultParam.splice(arg.$index, 1, callback.item);
                } 
            })
        }
        vm.fun.back = function () {
            if (vm.data.reset.status == 'add') {
                $state.go('home.project.inside.api.list', {
                    'groupID': vm.data.reset.groupID,
                    'childGroupID': vm.data.reset.childGroupID,
                    'grandSonGroupID': vm.data.reset.grandSonGroupID
                });
            } else {
                $state.go('home.project.inside.api.detail', {
                    'groupID': vm.data.reset.groupID,
                    'childGroupID': vm.data.reset.childGroupID,
                    'grandSonGroupID': vm.data.reset.grandSonGroupID,
                    'apiID': vm.data.reset.apiID
                });
            }
        }

        fun.checkForm = function (mark) {
            var info = {
                spaceKey: vm.data.reset.spaceKey,
                projectID: vm.data.reset.projectID,
                groupID: vm.component.selectMultistageCommonComponentObject.new.value,
                apiID: vm.data.reset.apiID,
                apiRestfulParam: '',
                apiResultParam: '',
                apiUrlParam: '',
                responseHeader: '',
                starred: vm.interaction.response.apiInfo.starred,
                apiStatus: vm.interaction.response.apiInfo.apiStatus,
                apiProtocol: vm.interaction.response.apiInfo.apiProtocol,
                apiRequestType: vm.interaction.response.apiInfo.apiRequestType,
                apiURI: vm.interaction.response.apiInfo.apiURI,
                apiName: vm.interaction.response.apiInfo.apiName,
                apiSuccessMock: vm.interaction.response.apiInfo.apiSuccessMock,
                apiFailureMock: vm.interaction.response.apiInfo.apiFailureMock,
                apiHeader: vm.interaction.response.apiInfo.apiHeader,
                apiNote: vm.interaction.response.apiInfo.apiNoteType == '1' ? vm.interaction.response.apiInfo.apiMarkdownNote : vm.interaction.response.apiInfo.apiRichNote,
                apiNoteRaw: vm.interaction.response.apiInfo.apiNoteRaw,
                apiNoteType: vm.interaction.response.apiInfo.apiNoteType,
                apiRequestParamType: vm.interaction.response.apiInfo.apiRequestParamType,
                apiFailureStatusCode: '',
                apiSuccessStatusCode: '',
                apiFailureContentType: vm.interaction.response.apiInfo.apiFailureContentType,
                apiSuccessContentType: vm.interaction.response.apiInfo.apiSuccessContentType,
                beforeInject: vm.interaction.response.apiInfo.beforeInject,
                afterInject: vm.interaction.response.apiInfo.afterInject,
                apiAuth: '{"status":"0"}',
            }
            switch (vm.interaction.response.apiInfo.apiAuth.status) {
                case '1':
                    {
                        info.apiAuth = JSON.stringify({
                            status: '1',
                            basicAuth: vm.interaction.response.apiInfo.apiAuth.basicAuth
                        })
                        break;
                    }
                case '2':
                    {
                        info.apiAuth = JSON.stringify({
                            status: '2',
                            jwtAuth: vm.interaction.response.apiInfo.apiAuth.jwtAuth
                        })
                        break;
                    }
            }
            switch (vm.data.reset.status) {
                case 'edit':
                    {
                        info.apiSuccessStatusCode = vm.interaction.response.apiInfo.apiSuccessStatusCode || '200';
                        info.apiFailureStatusCode = vm.interaction.response.apiInfo.apiFailureStatusCode || '200';
                        break;
                    }
                default:
                    {
                        info.apiSuccessStatusCode = vm.interaction.response.apiInfo.successCode || vm.interaction.response.apiInfo.apiSuccessStatusCode || '200';
                        info.apiFailureStatusCode = vm.interaction.response.apiInfo.failureCode || vm.interaction.response.apiInfo.apiFailureStatusCode || '200';
                        break;
                    }
            }
            var template = {
                apiRequestParam: [],
                apiResultParam: [],
                apiHeader: [],
                apiUrlParam: [],
                apiRestfulParam: [],
                responseHeader: [],
                fun: null
            };
            angular.copy(vm.interaction.response.apiInfo.apiRestfulParam, template.apiRestfulParam);
            angular.copy(vm.interaction.response.apiInfo.apiUrlParam, template.apiUrlParam);
            angular.copy(vm.interaction.response.apiInfo.apiHeader, template.apiHeader);
            angular.copy(vm.interaction.response.apiInfo.responseHeader, template.responseHeader);
            var i = 0,
                j = 0;
            vm.check = false;

            template.parseHeaderFun = function (array) {
                for (i = array.length - 1; i >= 0; i--) { //{{\'27\'|translate}}
                    if (!array[i].headerName) {
                        if (!array[i].headerValue) {
                            array.splice(i, 1);
                        } else {
                            vm.check = true;
                        }
                    }
                }
            }
            template.fun = function (array) {
                for (i = 0; i < array.length; i++) {
                    if (array[i].paramType == '1') {
                        array[i].paramValueList = [];
                    }
                    array[i].paramNotNull = array[i].paramNotNull ? '0' : '1';
                        if (!array[i].paramKey) {
                            if (array[i].paramName) {
                                vm.check = true;
                                break;
                            } else {
                                array.splice(i, 1);
                                vm.check = false;
                                i--;
                                continue;
                            }
                        }
                }
            }
            if (vm.interaction.response.apiInfo.apiRequestParamType == '0' && !vm.check) {
                angular.copy(vm.interaction.response.apiInfo.apiRequestParam, template.apiRequestParam);
                template.fun(template.apiRequestParam);
            } else if (vm.interaction.response.apiInfo.apiRequestParamType == '1') {
                info.apiRequestRaw = vm.interaction.response.apiInfo.apiRequestRaw;
            }
            if (!vm.check) {
                template.parseHeaderFun(template.apiHeader);
            }
            if (!vm.check) {
                template.parseHeaderFun(template.responseHeader);
            }
            if (!vm.check) {
                template.fun(template.apiRestfulParam);
            }
            if (!vm.check) {
                for (i = 0; i < template.apiUrlParam.length; i++) { //{{\'39\'|translate}}
                    template.apiUrlParam[i].paramNotNull = template.apiUrlParam[i].paramNotNull ? '0' : '1';
                    if (!template.apiUrlParam[i].paramKey) {
                        if (template.apiUrlParam[i].paramName) {
                            vm.check = true;
                            break;
                        } else {
                            template.apiUrlParam.splice(i, 1);
                            vm.check = false;
                            i--;
                        }
                    }
                }
            }
            if (!vm.check) {
                    template.apiResultParam = angular.copy(vm.interaction.response.apiInfo.apiResultParam);
                template.fun(template.apiResultParam);
            }
            if (!vm.check) {
                info.responseHeader = JSON.stringify(template.responseHeader, function (key, value) {
                    if (/(\$\$hashKey)|(\$index)|(mouseLeave)|(labelIsClick)|(headerID)/.test(key)) {
                        return undefined;
                    }
                    return value;
                });
                info.apiHeader = JSON.stringify(template.apiHeader, function (key, value) {
                    if (/(\$\$hashKey)|(\$index)|(mouseLeave)|(labelIsClick)|(headerID)/.test(key)) {
                        return undefined;
                    }
                    return value;
                });
                info.apiUrlParam = JSON.stringify(template.apiUrlParam, function (key, value) {
                    if (/(\$\$hashKey)|(\$index)|(paramID)|(mouseLeave)|(moreParam)|(valueID)/.test(key)) {
                        return undefined;
                    }
                    return value;
                });
                info.apiRequestParam = JSON.stringify(template.apiRequestParam, function (key, value) {
                    if (/(\$\$hashKey)|(\$index)|(paramID)|(mouseLeave)|(moreParam)|(valueID)/.test(key)) {
                        return undefined;
                    }
                    return value;
                });
                info.apiRestfulParam = JSON.stringify(template.apiRestfulParam, function (key, value) {
                    if (/(\$\$hashKey)|(\$index)|(paramID)|(mouseLeave)|(moreParam)|(valueID)/.test(key)) {
                        return undefined;
                    }
                    return value;
                });
                info.apiResultParam = JSON.stringify(template.apiResultParam, function (key, value) {
                    if (/(\$\$hashKey)|(\$index)|(paramID)|(valueID)/.test(key)) {
                        return undefined;
                    }
                    return value;
                });
            }
            return info;
        }
        vm.fun.load = function (arg) {
            return arg.promise;
        }
        vm.fun.requestProcessing = function (arg) { //arg status:（0：{{\'70\'|translate}} 1：{{\'463\'|translate}}，2：编辑（编辑/新建））
            var template = {
                request: fun.checkForm(),
                promise: null
            }
            if ($scope.editForm.$valid && !vm.check) {
                switch (arg.status) {
                    case 0:
                        {
                            template.promise = fun.keep({
                                request: template.request
                            });
                            break;
                        }
                    case 1:
                        {
                            template.promise = fun.quickEdit({
                                request: template.request
                            });
                            break;
                        }
                    case 2:
                        {
                            template.promise = fun.modify({
                                request: template.request
                            });
                            break;
                        }
                }
            } else {
                $rootScope.InfoModal($filter('translate')('456'), 'error');
                vm.data.input.submited = true;
            }
            $scope.$emit('$TransferStation', {
                state: '$Init_LoadingCommonComponent',
                data: {
                    promise: template.promise
                }
            });
            return template.promise;
        }
        fun.keep = function (arg) {
            var template = {
                promise: null
            }
            template.promise = ApiManagementResource.Api.Add(arg.request).$promise;
            template.promise.then(function (response) {
                switch (response.statusCode) {
                    case CODE.COMMON.SUCCESS:
                        {

                            $rootScope.InfoModal($filter('translate')('457'), 'success');
                            vm.interaction.response.apiInfo = {
                                projectID: vm.data.reset.projectID,
                                groupID: vm.interaction.response.apiInfo.groupID,
                                childGroupID: vm.interaction.response.apiInfo.childGroupID,
                                grandSonGroupID: vm.interaction.response.apiInfo.grandSonGroupID,
                                apiHeader: [],
                                responseHeader: [],
                                apiRequestParam: [],
                                apiRestfulParam: [],
                                apiResultParam: [],
                                apiUrlParam: [],
                                starred: 0
                            };
                            if (vm.interaction.response.apiInfo.apiRequestRaw) $scope.$broadcast('$ResetAceEditor_AmsEditor_Raw_Ace_Editor_Js');
                            if (vm.data.mock.isFailure === false) {
                                $scope.$broadcast('$ResetAceEditor_AmsEditor_Mock_Ace_Editor_Js');
                            } else {
                                vm.data.mock.isFailure = false;
                            }
                            vm.data.script.type = '0';
                            $scope.$broadcast('$ResetAceEditor_AmsEditor_Code_Ace_Editor_Js');
                            $scope.$broadcast('$ResetInitial_SelectMultistageCommonComponent');
                            vm.interaction.response.apiInfo.apiStatus = '0';
                            vm.interaction.response.apiInfo.apiProtocol = '0';
                            vm.interaction.response.apiInfo.apiRequestType = '0';
                            vm.interaction.response.apiInfo.apiRequestParamType = "0";
                            vm.interaction.response.apiInfo.apiNoteType = "1";
                            vm.interaction.response.apiInfo.apiRichNote = '';
                            vm.interaction.response.apiInfo.apiMarkdownNote = '';
                            vm.data.input.submited = false;
                            vm.interaction.response.apiInfo.successCode = '200';
                            vm.interaction.response.apiInfo.failureCode = '200';
                            vm.interaction.response.apiInfo.apiSuccessStatusCode = '';
                            vm.interaction.response.apiInfo.apiFailureStatusCode = '';
                            vm.interaction.response.apiInfo.apiSuccessContentType = 'text/html; charset=UTF-8';
                            vm.interaction.response.apiInfo.apiFailureContentType = 'text/html; charset=UTF-8';
                            vm.interaction.response.apiInfo.beforeInject = '';
                            vm.interaction.response.apiInfo.afterInject = '';
                            vm.interaction.response.apiInfo.apiAuth = {
                                status: '0'
                            }
                            window.scrollTo(0, 0);
                            vm.data.menu = 0;
                            vm.fun.add('all');
                            break;
                        }
                    case CODE.PROJECT_API.EXIST:
                        {
                            vm.data.input.submited = true;
                            $rootScope.InfoModal($filter('translate')('458'), 'error');
                            break;
                        }
                }
            })
            return template.promise;
        }
        fun.quickEdit = function (arg) {
            var template = {
                promise: null
            }
            template.promise = ApiManagementResource.Api.Edit(arg.request).$promise;
            template.promise.then(function (response) {
                switch (response.statusCode) {
                    case CODE.COMMON.SUCCESS:
                        {
                            data.munalSave = true;
                            $state.go('home.project.inside.api.detail', {
                                'groupID': vm.data.reset.groupID,
                                'childGroupID': vm.data.reset.childGroupID,
                                'grandSonGroupID': vm.data.reset.grandSonGroupID,
                                'apiID': vm.data.reset.apiID
                            });
                            $rootScope.InfoModal($filter('translate')('459'), 'success');
                            break;
                        }
                    case CODE.PROJECT_API.EXIST:
                        {
                            vm.data.input.submited = true;
                            $rootScope.InfoModal($filter('translate')('458'), 'error');
                        }
                }
            })
            return template.promise;
        }
        fun.modify = function (arg) {
            var template = {
                promise: null
            }
            if (vm.data.reset.status == 'edit') {
                $rootScope.CommonSingleInputModal($filter('translate')('256'), arg.request.updateDesc, '', {}, function (callback) {
                    if (callback.check) {
                        data.updateDesc = arg.request.updateDesc = callback.desc;
                        ApiManagementResource.Api.Edit(arg.request).$promise.then(function (response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        data.munalSave = true;
                                        $state.go('home.project.inside.api.detail', {
                                            'groupID': vm.data.reset.groupID,
                                            'childGroupID': vm.data.reset.childGroupID,
                                            'grandSonGroupID': vm.data.reset.grandSonGroupID,
                                            'apiID': vm.data.reset.apiID
                                        });
                                        $rootScope.InfoModal($filter('translate')('459'), 'success');
                                        break;
                                    }
                                case CODE.PROJECT_API.EXIST:
                                    {
                                        vm.data.input.submited = true;
                                        $rootScope.InfoModal($filter('translate')('458'), 'error');
                                    }
                            }
                        })
                    }
                });
            } else {
                template.promise = ApiManagementResource.Api.Add(arg.request).$promise;
                template.promise.then(function (response) {
                    switch (response.statusCode) {
                        case CODE.COMMON.SUCCESS:
                            {
                                data.munalSave = true;
                                $state.go('home.project.inside.api.detail', {
                                    'groupID': vm.data.reset.groupID,
                                    'childGroupID': vm.data.reset.childGroupID,
                                    'grandSonGroupID': vm.data.reset.grandSonGroupID,
                                    'apiID': response.apiID
                                });
                                $rootScope.InfoModal($filter('translate')('457'), 'success');
                                break;
                            }
                        case CODE.PROJECT_API.EXIST:
                            {
                                vm.data.input.submited = true;
                                $rootScope.InfoModal($filter('translate')('458'), 'error');
                            }
                    }
                })
            }
            return template.promise;
        }
        $scope.$on('$SidebarFinish', function () {
            vm.fun.init();
        })

        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
            var template = {
                hash: $location.$$hash
            }
            if (template.hash) {
                switch (template.hash) {
                    case 'Failure_Example':
                        {
                            vm.data.mock.isFailure = true;
                            $location.hash(template.hash);
                            $anchorScroll();
                            break;
                        }
                    default:
                        {
                            $location.hash(template.hash);
                            $anchorScroll();
                        }
                }
            }
        });
        fun.initCommonExpression = function () {
            vm.data.apiGroup = GroupService.get();
            vm.data.script.type = '0';
            vm.data.mock.isFailure = false;
            var hash = $location.$$hash;
            if (hash) {
                switch (hash) {
                    case 'Failure_Example':
                        {
                            vm.data.mock.isFailure = true;
                            break;
                        }
                    default:
                        {}
                }
            }
        }
        fun.initDataStatus = function () {
            vm.interaction.response.apiInfo.apiSuccessContentType = vm.interaction.response.apiInfo.apiSuccessContentType || 'text/html; charset=UTF-8';
            vm.interaction.response.apiInfo.apiFailureContentType = vm.interaction.response.apiInfo.apiFailureContentType || 'text/html; charset=UTF-8';
            vm.interaction.response.apiInfo.successCode = vm.interaction.response.apiInfo.apiSuccessStatusCode || '200';
            vm.interaction.response.apiInfo.failureCode = vm.interaction.response.apiInfo.apiFailureStatusCode || '200'
            angular.copy(vm.interaction.response.apiInfo, data.detailBefore);
            data.detailBefore.apiSuccessStatusCode = vm.interaction.response.apiInfo.successCode;
            data.detailBefore.apiFailureStatusCode = vm.interaction.response.apiInfo.failureCode;
            try {
                vm.data.index = {
                    header: data.detailBefore.apiHeader.length,
                    body: data.detailBefore.apiRequestParam.length,
                    restful: data.detailBefore.apiRestfulParam.length,
                    url: data.detailBefore.apiUrlParam.length,
                    response: data.detailBefore.apiResultParam.length,
                    responseHeader: data.detailBefore.responseHeader.length
                }
            } catch (e) {}
        }
        fun.initDetail = function () {
            var template = {
                cache: {
                    detail: service.cache.get('testInfo')
                },
                fun: null,
                promise: null
            }
            if (vm.data.reset.status != 'add') {
                template.promise = ApiManagementResource.Api.Detail({
                    spaceKey: vm.data.reset.spaceKey,
                    apiID: vm.data.reset.apiID,
                    groupID: vm.data.reset.grandSonGroupID || vm.data.reset.childGroupID || vm.data.reset.groupID,
                    projectID: vm.data.reset.projectID
                }).$promise.then(function (response) {
                    switch (response.statusCode) {
                        case CODE.COMMON.SUCCESS:
                            {
                                vm.interaction.response.apiInfo = response.apiInfo.baseInfo;
                                vm.interaction.response.apiInfo.mockConfig = response.apiInfo.mockInfo ? (response.apiInfo.mockInfo.mockConfig || {
                                    type: 'object',
                                    rule: ''
                                }) : {
                                    type: 'object',
                                    rule: ''
                                };
                                vm.interaction.response.apiInfo.responseHeader = response.apiInfo.responseHeader;
                                vm.interaction.response.apiInfo.apiHeader = response.apiInfo.headerInfo;
                                vm.interaction.response.apiInfo.apiRequestParam = response.apiInfo.requestInfo;
                                vm.interaction.response.apiInfo.apiRestfulParam = response.apiInfo.restfulParam;
                                vm.interaction.response.apiInfo.apiUrlParam = response.apiInfo.urlParam;
                                vm.interaction.response.apiInfo.apiResultParam = response.apiInfo.resultInfo;
                                vm.interaction.response.apiInfo.apiStatus = "" + vm.interaction.response.apiInfo.apiStatus;
                                vm.interaction.response.apiInfo.apiProtocol = "" + vm.interaction.response.apiInfo.apiProtocol;
                                vm.interaction.response.apiInfo.apiRequestType = "" + vm.interaction.response.apiInfo.apiRequestType;
                                vm.interaction.response.apiInfo.apiRequestParamType = "" + vm.interaction.response.apiInfo.apiRequestParamType;
                                vm.interaction.response.apiInfo.apiNoteType = "" + vm.interaction.response.apiInfo.apiNoteType;
                                vm.interaction.response.apiInfo.apiRichNote = vm.interaction.response.apiInfo.apiNoteType == '0' ? vm.interaction.response.apiInfo.apiNote : '';
                                vm.interaction.response.apiInfo.apiMarkdownNote = vm.interaction.response.apiInfo.apiNoteType == '1' ? vm.interaction.response.apiInfo.apiNote : '';
                                try {
                                    response.apiInfo.authInfo.status = response.apiInfo.authInfo.status || "0";
                                } catch (e) {}
                                vm.interaction.response.apiInfo.apiAuth = response.apiInfo.authInfo;
                                $scope.$emit('$WindowTitleSet', {
                                    list: [((vm.data.reset.status == 'copy' ? $filter('translate')('460') : $filter('translate')('461')) + vm.interaction.response.apiInfo.apiName), $filter('translate')('448'), $state.params.projectName, $filter('translate')('405')]
                                });
                                if (!vm.interaction.response.apiInfo.topParentGroupID) {
                                    if (vm.interaction.response.apiInfo.parentGroupID) {
                                        vm.interaction.response.apiInfo.childGroupID = response.apiInfo.baseInfo.groupID;
                                        vm.interaction.response.apiInfo.groupID = vm.interaction.response.apiInfo.parentGroupID;
                                        vm.interaction.response.apiInfo.grandSonGroupID = -1;
                                    } else {
                                        vm.interaction.response.apiInfo.childGroupID = -1;
                                        vm.interaction.response.apiInfo.grandSonGroupID = -1;
                                    }
                                } else {
                                    vm.interaction.response.apiInfo.grandSonGroupID = response.apiInfo.baseInfo.groupID;
                                    vm.interaction.response.apiInfo.childGroupID = response.apiInfo.baseInfo.parentGroupID;
                                    vm.interaction.response.apiInfo.groupID = response.apiInfo.baseInfo.topParentGroupID;
                                }
                                $scope.$broadcast('$Maunal_AceEditorAms_Raw_Ace_Editor_Js', response.apiInfo.baseInfo.apiRequestRaw);
                                template.fun = function (val, key) {
                                    val.paramNotNull = !parseInt(val.paramNotNull || '0');
                                    val.paramType = val.paramType || 0;
                                    val.paramValueList = val.paramValueList || [];
                                    if (val.paramType < 1000) {
                                        val.paramType = val.paramType.toString();
                                    }
                                }
                                angular.forEach(vm.interaction.response.apiInfo.apiRequestParam, template.fun);
                                angular.forEach(vm.interaction.response.apiInfo.apiRestfulParam, template.fun);
                                angular.forEach(vm.interaction.response.apiInfo.apiResultParam, template.fun)
                                angular.forEach(vm.interaction.response.apiInfo.apiUrlParam, function (val, key) {
                                    val.paramNotNull = !parseInt(val.paramNotNull || '0');
                                    val.paramValueList = val.paramValueList || [];
                                })
                                fun.initDataStatus();
                                vm.fun.add('all');
                                vm.interaction.response.dataStructureList = response.apiInfo.dataStructureList;
                                break;
                            }
                    }
                });
            } else if (template.cache.detail) {
                $scope.$emit('$windowTitle', {
                    apiName: $filter('translate')('462')
                });
                vm.interaction.response.apiInfo = template.cache.detail;
                $scope.$broadcast('$Maunal_AceEditorAms_Raw_Ace_Editor_Js', vm.interaction.response.apiInfo.apiRequestRaw);
                vm.interaction.response.apiInfo.apiUrlParam = [];
                fun.initDataStatus();
                vm.fun.add('url');
                vm.fun.add('response');
                angular.forEach(vm.interaction.response.apiInfo.apiRequestParam, function (val, key) {
                    val.paramNotNull = val.checkbox;
                    val.paramType = val.paramType;
                    val.paramName = '';
                    val.paramValue = "";
                    val.paramLimit = "";
                    val.paramNote = "";
                    val.paramValueList = val.paramInfo ? [{
                        value: val.paramInfo,
                        valueDescription: ''
                    }] : [];
                    val.default = 0;

                })
                angular.forEach(vm.interaction.response.apiInfo.apiRestfulParam, function (val, key) {
                    val.paramNotNull = val.checkbox;
                    val.paramType = val.paramType;
                    val.paramName = '';
                    val.paramValue = "";
                    val.paramLimit = "";
                    val.paramNote = "";
                    val.paramValueList = val.paramInfo ? [{
                        value: val.paramInfo,
                        valueDescription: ''
                    }] : [];
                    val.default = 0;

                })
            } else {
                $scope.$emit('$windowTitle', {
                    apiName: $filter('translate')('462')
                });
                vm.interaction.response.apiInfo.apiStatus = '0';
                vm.interaction.response.apiInfo.apiProtocol = '0';
                vm.interaction.response.apiInfo.apiRequestType = '0';
                vm.interaction.response.apiInfo.apiRequestParamType = "0";
                vm.interaction.response.apiInfo.apiNoteType = '1';
                fun.initDataStatus();
                vm.fun.add('all');
            }
            if (template.promise) {
                template.promise.finally(fun.initCommonExpression)
            } else {
                fun.initCommonExpression();
            }
        }
        vm.fun.init = function () {
            if (GroupService.get()) {
                fun.initDetail();
            }
        }
        vm.fun.init();
        vm.$onInit = function () {
            var template = {
                array: [],
                funArray: []
            }
            switch (vm.data.reset.status) {
                case 'edit':
                    {
                        template.array = [{
                            name: $filter('translate')('463'),
                            class: 'eo-button-info',
                            fun: {
                                disabled: 1,
                                default: vm.fun.requestProcessing,
                                params: {
                                    status: 1
                                }
                            }
                        }];
                        template.funArray = [{
                            type: 'customized-html',
                            class: 'btn-group-li pull-left',
                            authority: 'api',
                            fun: function () {
                                vm.data.isIgnoreNotice = !vm.data.isIgnoreNotice;
                            },
                            html: '<button class="ignore-notice-checkbox-btn common-btn" ng-click="item.fun({item:item})" ><span class="eo-checkbox pull-left iconfont" ng-class="{\'icon-check\':$ctrl.activeObject.isIgnoreNotice}"></span>{{\'464\'|translate}}</button>'
                        }];
                        break;
                    }
                case 'add':
                    {
                        template.array = [{
                            name: $filter('translate')('70'),
                            class: 'eo-button-info',
                            fun: {
                                disabled: 1,
                                default: vm.fun.requestProcessing,
                                params: {
                                    status: 0
                                }
                            }
                        }]
                        break;
                    }
            }
            vm.component.menuObject.list = [{
                type: 'btn',
                class: 'btn-group-li margin-left-li-20 pull-left',
                btnList: [{
                    name: vm.data.reset.status == 'add' ? $filter('translate')('465') : $filter('translate')('466'),
                    icon: 'xiangzuo',
                    fun: {
                        default: vm.fun.back
                    }
                }]
            }, {
                type: 'divide',
                class: 'divide-li pull-left'
            },  {
                type: 'btn',
                class: 'btn-group-li pull-left',
                btnList: template.array.concat([{
                    name: $filter('translate')('467'),
                    class: 'eo-button-info',
                    fun: {
                        disabled: 1,
                        default: vm.fun.requestProcessing,
                        params: {
                            status: 2
                        }
                    }
                }])
            }].concat(template.funArray);
            window.onbeforeunload = function (event) {
                return $filter('translate')('468')
            };
        }
        $scope.$on('$stateChangeStart', function ($event, targetUrl, targetParam) {
            window.onbeforeunload=null;
            if (!data.munalSave && fun.checkForm('checkIsUpdate').updateDesc) {
                $event.preventDefault();
                var windowConfirm=window.confirm($filter('translate')('469'));
                if(windowConfirm){
                    data.munalSave = true;
                    $state.go(targetUrl, targetParam);
                }
            }
            service.cache.clear('testInfo');
            if (vm.data.timer.fun) {
                clearInterval(vm.data.timer.fun);
            }
            if (data.timer) {
                clearInterval(data.timer);
            }
        });
    }
})();