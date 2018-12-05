(function () {
    'use strict';
    /**
     * @author：广州银云信息科技有限公司
     * @name ams弹窗controller js
     */
    angular.module('eolinker.modal')

        .directive('eoAmsModal', ['$rootScope', '$uibModal', function ($rootScope, $uibModal) {
            return {
                restrict: 'AE',
                templateUrl: 'app/modal/branch/ams/index.html',
                link: function (scope, iElement, iAttrs) {
                    $rootScope.ExpressionBuilderModal = function openModel(data, callback) {
                        var modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: 'ExpressionBuilderModal',
                            controller: 'ExpressionBuilderModalCtrl',
                            resolve: {
                                data: function () {
                                    return data;
                                }
                            }
                        });
                        modalInstance.result.then(callback);
                    }
                    $rootScope.AMS_JsonToParamInputModal = function openModel(input, callback) {
                        var modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: 'AMS_JsonToParamInputModal',
                            controller: 'AMS_JsonToParamInputModalCtrl',
                            resolve: {
                                input: function () {
                                    return input;
                                }
                            }
                        });
                        modalInstance.result.then(callback);
                    }

                    $rootScope.AMS_RequestParamEditModal = function openModal(input, callback) {
                        var modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: 'AMS_RequestParamEditModal',
                            controller: 'AMS_RequestParamEditModalCtrl',
                            resolve: {
                                input: function () {
                                    return input;
                                }
                            }
                        });
                        modalInstance.result.then(callback);
                    }
                    $rootScope.AMS_ResponseParamEditModal = function openModal(input, callback) {
                        var modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: 'AMS_ResponseParamEditModal',
                            controller: 'AMS_ResponseParamEditModalCtrl',
                            resolve: {
                                input: function () {
                                    return input;
                                }
                            }
                        });
                        modalInstance.result.then(callback);
                    }
                    $rootScope.AMS_ExportModal = function openModel(input, callback) {
                        var modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: 'AMS_ExportModal',
                            controller: 'AMS_ExportModalCtrl',
                            resolve: {
                                input: function () {
                                    return input;
                                }
                            }
                        });
                        modalInstance.result.then(callback);
                    }
                    $rootScope.AMS_ChangeStatusModal = function openModel(callback) {
                        var modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: 'AMS_ChangeStatusModal',
                            controller: 'AMS_ChangeStatusModalCtrl'
                        });
                        modalInstance.result.then(callback);
                    }


                    $rootScope.AMS_ApiSearchModal = function openModel(input, callback) {
                        var modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: 'AMS_ApiSearchModal',
                            controller: 'AMS_ApiSearchModalCtrl',
                            resolve: {
                                input: function () {
                                    return input;
                                }
                            }
                        });
                        modalInstance.result.then(callback);
                    }
                    $rootScope.AMS_CodeModal = function openModel(title, info, callback) {
                        var modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: 'AMS_CodeModal',
                            controller: 'AMS_CodeModalCtrl',
                            resolve: {
                                title: function () {
                                    return title;
                                },
                                info: function () {
                                    return info;
                                }
                            }
                        });
                        modalInstance.result.then(callback);
                    }

                    $rootScope.AMS_ImportModal = function openModel(input, callback) {
                        var modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: 'AMS_ImportModal',
                            controller: 'AMS_ImportModalCtrl',
                            resolve: {
                                input: function () {
                                    return input;
                                }
                            }
                        });
                        modalInstance.result.then(callback);
                    }
                }
            }
        }])
        .controller('AMS_JsonToParamInputModalCtrl', AMS_JsonToParamInputModalCtrl)

        .controller('AMS_ImportModalCtrl', AMS_ImportModalCtrl)
        .controller('AMS_CodeModalCtrl', AMS_CodeModalCtrl)

        .controller('AMS_ApiSearchModalCtrl', AMS_ApiSearchModalCtrl)

        .controller('AMS_ChangeStatusModalCtrl', AMS_ChangeStatusModalCtrl)

        .controller('AMS_ExportModalCtrl', AMS_ExportModalCtrl)

        .controller('AMS_RequestParamEditModalCtrl', AMS_RequestParamEditModalCtrl)

        .controller('AMS_ResponseParamEditModalCtrl', AMS_ResponseParamEditModalCtrl)
        .controller('ExpressionBuilderModalCtrl', ExpressionBuilderModalCtrl)
    ExpressionBuilderModalCtrl.$inject = ['$scope', '$uibModalInstance', 'data'];

    function ExpressionBuilderModalCtrl($scope, $uibModalInstance, data) {
        $scope.fun = {};
        $scope.directive = {
            expressionBuilderObject: null
        }
        var fun = {};
        fun.init = (function () {
            var template = {
                input: angular.copy(data)
            }
            $scope.directive.expressionBuilderObject = {
                request: template.input.request,
                response: template.input.response,
                mark: template.input.mark
            };
            $scope.fun.bindFun = data.bindFun;
        })();
        $scope.fun.callback = function (callback) {
            if (callback.mark == 'cancel') {
                $uibModalInstance.close(false);
            } else {
                $uibModalInstance.close(callback);
            }
        };
    }

    AMS_JsonToParamInputModalCtrl.$inject = ['$scope', '$uibModalInstance', 'input'];
    /**
     * @function [导入JSON弹窗] [Import JSON]
     * @service  $scope [注入作用域服务] [Injection scope service]
     * @service  $uibModalInstance [注入$uibModalInstance服务] [Injection $uibModalInstance service]
     * @param    {[obj]}   input [参数详情 Parameter details]
     */
    function AMS_JsonToParamInputModalCtrl($scope, $uibModalInstance, input) {
        $scope.data = {
            input: input
        }
        $scope.ok = function (which) {
            if ($scope.sureForm.$valid) {
                $uibModalInstance.close({
                    which: which,
                    desc: $scope.info.desc
                });
            } else {
                $scope.submited = true;
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.close(false);
        };
    }
    AMS_RequestParamEditModalCtrl.$inject = ['$scope', '$uibModalInstance', 'input'];

    function AMS_RequestParamEditModalCtrl($scope, $uibModalInstance, input) {
        $scope.data = {
            input: input,
            fun: {
                close: null, //关闭功能函数
                ok: null, //确认功能函数
            }
        }
        $scope.data.fun.initParam = function (arg) {
            arg.item.$index = arg.item.$index ? arg.item.$index : arg.$index;
            arg.item.paramType = arg.item.paramType ? arg.item.paramType : input.item.paramType;
        }
        $scope.data.fun.close = function () {
            $uibModalInstance.close(false);
        }

        /**
         * 拖动排序绑定函数，重置默认位置
         */
        $scope.data.fun.resetDefaultValue = function (arg) {
            if ($scope.data.input.item.default == arg.$index) {
                $scope.data.input.item.default = arg.$targetIndex;
            } else if (arg.$index > $scope.data.input.item.default && arg.$targetIndex <= $scope.data.input.item.default) {
                $scope.data.input.item.default = ($scope.data.input.item.default+1);
            } else if (arg.$index < $scope.data.input.item.default && arg.$targetIndex >= $scope.data.input.item.default) {
                $scope.data.input.item.default = ($scope.data.input.item.default-1);
            }
        }
        $scope.data.fun.ok = function () {
            var template = {
                output: {}
            }
            angular.copy($scope.data.input.item, template.output);
            for (var key = 0; key < template.output.paramValueList.length; key++) {
                var val = template.output.paramValueList[key];
                if (val.valueDescription && !val.value) {
                    break;
                } else if (!val.valueDescription && !val.value) {
                    template.output.paramValueList.splice(key, 1);
                    key--;
                }
            }
            if (key == template.output.paramValueList.length) {
                $uibModalInstance.close({
                    item: template.output
                });
            }
        }
    }

    AMS_ResponseParamEditModalCtrl.$inject = ['$scope', '$uibModalInstance', 'input'];

    function AMS_ResponseParamEditModalCtrl($scope, $uibModalInstance, input) {
        $scope.data = {
            input: input,
            fun: {
                close: null, //关闭功能函数
                ok: null, //确认功能函数
            }
        }
        $scope.data.fun.initParam = function (arg) {
            arg.item.$index = arg.item.$index ? arg.item.$index : arg.$index;
            arg.item.paramType = arg.item.paramType ? arg.item.paramType : input.item.paramType;
        }
        $scope.data.fun.close = function () {
            $uibModalInstance.close(false);
        }
        $scope.data.fun.ok = function () {
            var template = {
                output: {}
            }
            angular.copy($scope.data.input.item, template.output);
            for (var key = 0; key < template.output.paramValueList.length; key++) {
                var val = template.output.paramValueList[key];
                if (val.valueDescription && !val.value) {
                    break;
                } else if (!val.valueDescription && !val.value) {
                    template.output.paramValueList.splice(key, 1);
                    key--;
                }
            }
            if (key == template.output.paramValueList.length) {
                $uibModalInstance.close({
                    item: template.output
                });
            }
        }
    }

    AMS_ExportModalCtrl.$inject = ['$scope', '$uibModalInstance', 'CODE', '$rootScope', 'input', '$state','$filter'];

    function AMS_ExportModalCtrl($scope, $uibModalInstance, CODE, $rootScope, input, $state,$filter) {
        $scope.info = {
            projectID: $state.params.projectID
        }
        $scope.data = {
           text:$filter('translate')('188'),
            input: input,
            info: {
                exportType: 0,
            },
            fun: {
                dumpDirective: null //dumpDirective绑定指令
            }
        }
        var data = {
            assistantFun: {
                response: null
            }
        }
        data.assistantFun.response = function (arg) {
            switch (arg.response.statusCode) {
                case CODE.COMMON.SUCCESS:
                    {
                        $scope.$broadcast('$DumpDirective_Click_' + arg.switch.toString(), {
                            response: arg.response,
                            fileName: $scope.data.input.fileName
                        });
                        $uibModalInstance.close(true);
                        break;
                    }
                default:
                    {
                        $rootScope.InfoModal($filter('translate')('340'), 'error');
                        break;
                    }
            }
        }
        $scope.data.fun.dumpDirective = function (arg) {
            var template = {
                promise: null,
                request: {
                    spaceKey: $scope.data.input.spaceKey,
                    projectID: $scope.info.projectID,
                    envID: $scope.data.info.envID
                }
            }
            if ($scope.data.input.request) {
                for (var key in $scope.data.input.request) {
                    template.request[key] = $scope.data.input.request[key];
                }
            }
            switch (arg.switch.toString()) {
                case '0':
                case '5':
                    {
                        template.promise = input.resource.Export(template.request).$promise;
                        break;
                    }
            }
            template.promise.then(function (response) {
                data.assistantFun.response({
                    response: response,
                    switch: 'export-by-one-key'
                });
            })
            return template.promise;
        }
        $scope.data.fun.cancel = function () {
            //$uibModalInstance.dismiss(false);
            $uibModalInstance.close(false);
        };
    }

    AMS_ChangeStatusModalCtrl.$inject = ['$scope', '$uibModalInstance'];

    function AMS_ChangeStatusModalCtrl($scope, $uibModalInstance) {
        $scope.fun = {};
        $scope.fun.selectStatus = function (value) {
            $uibModalInstance.close({
                status: value
            });
        }
        $scope.fun.cancel = function (value) {
            $uibModalInstance.close(false);
        }
    }



    AMS_ApiSearchModalCtrl.$inject = ['$scope', '$uibModalInstance', 'API_AMS_CONSTANT', 'input','$filter'];

    function AMS_ApiSearchModalCtrl($scope, $uibModalInstance, API_AMS_CONSTANT, input,$filter) {
        $scope.fun = {};
        $scope.data = {
            submitted: false
        }
        $scope.output = angular.copy(input.request);
        $scope.const = {
            apiStatusQuery: [{
                key: $filter('translate')('341'),
                value: -1
            }].concat(API_AMS_CONSTANT.STATUS_QUERY),
            requestMethodQuery: [{
                key: $filter('translate')('341'),
                value: -1
            }].concat(API_AMS_CONSTANT.REQUEST_METHOD_QUERY),
            apiStarStatusQuery: [{
                key: $filter('translate')('20'),
                value: 0
            }, {
                key: $filter('translate')('76'),
                value: 1
            }, {
                key: $filter('translate')('341'),
                value: -1
            }]
        }
        $scope.component = {
            selectPersonCommonComponentObject: {
                updater: {},
                creator: {}
            }
        }
        var fun = {};

        $scope.fun.confirm = function () {
            var template = {
                output: {
                    tips: $scope.output.keyword,
                    apiRequestType: $scope.output.requestMethod,
                    apiStatus: $scope.output.apiStatus,
                    updaterID: '[' + ($scope.component.selectPersonCommonComponentObject.updater.value || '') + ']',
                    creatorID: '[' + ($scope.component.selectPersonCommonComponentObject.creator.value || '') + ']',
                    starred: $scope.output.apiStarStatus
                }
            }
            if ($scope.ConfirmForm.$valid) {
                $uibModalInstance.close(template.output);
            } else {
                $scope.data.submitted = true;
            }
        };

        $scope.fun.cancel = function () {
            $uibModalInstance.close(false);
        };
        fun.init = (function () {
            input.resource.getMemberList(input.resourceParams).$promise.then(function (response) {
                $scope.data.memberQuery = response.memberList || [];
            })
        })();
    }
    AMS_CodeModalCtrl.$inject = ['$scope', '$uibModalInstance', 'ApiManagementResource', '$rootScope', 'CODE', 'title', 'info', 'GroupService','$filter'];

    function AMS_CodeModalCtrl($scope, $uibModalInstance, ApiManagementResource, $rootScope, CODE, title, info, GroupService,$filter) {
        $scope.title = title;
        $scope.info = {
            spaceKey: info.spaceKey,
            projectID: info.projectID,
            groupID: parseInt(info.groupID),
            childGroupID: parseInt(info.childGroupID) || -1,
            grandSonGroupID: parseInt(info.grandSonGroupID) || -1,
            code: '',
            codeDesc: '',
            isAdd: true
        }
        $scope.data = {
            interaction: {
                request: {
                    statusCode: [{
                        code: '',
                        codeDesc: ''
                    }]
                }
            },
            fun: {
                operate: null
            }
        }
        $scope.query = [];
        $scope.component = {
            selectMultistageCommonComponentObject: {
                new: {},
                original: {}
            }
        };

        $scope.keep = function () {
            var template = {
                request: {
                    spaceKey: $scope.info.spaceKey,
                    projectID: $scope.info.projectID,
                    groupID: $scope.component.selectMultistageCommonComponentObject.new.value,
                    statusCode: '[]'
                },
                isCheck: false,
                promise: null
            }
            template.request.statusCode = JSON.stringify($scope.data.interaction.request.statusCode.slice(0, $scope.data.interaction.request.statusCode.length - 1), function (key, val) {
                if (Object.prototype.toString.call(val) == '[object Object]' && (!val.code || !val.codeDesc)) {
                    template.isCheck = true;
                }
                if (typeof (val) == 'object' || /(code)|(codeDesc)/.test(key)) return val;
            })
            if (template.isCheck || template.request.statusCode == '[]') {
                $scope.submited = true;
                return;
            }
            if ($scope.ConfirmForm.$valid) {
                template.promise = ApiManagementResource.Code.Add(template.request).$promise;
                template.promise.then(function (response) {
                    switch (response.statusCode) {
                        case CODE.COMMON.SUCCESS:
                            {
                                $rootScope.InfoModal($filter('translate')('342'), 'success');
                                $scope.submited = false;
                                $scope.data.interaction.request.statusCode = [{
                                    codeDesc: '',
                                    code: ''
                                }];
                                $scope.$broadcast('$ResetInitial_SelectMultistageCommonComponent');
                                break;
                            }
                        case '190000':
                            {
                                $rootScope.InfoModal($filter('translate')('343'), 'error');
                                break;
                            }
                        default:
                            {
                                $scope.submited = true;
                                break;
                            }
                    }
                });
            } else {
                $scope.submited = true;
            }
            return template.promise;
        }
        $scope.data.fun.operate = function (status, arg) {
            switch (status) {
                case 'last':
                    {
                        if (!arg.$last) return;
                        $scope.data.interaction.request.statusCode.push({
                            code: '',
                            codeDesc: ''
                        });
                        break;
                    }
                case 'delete':
                    {
                        $scope.data.interaction.request.statusCode.splice(arg.$index, 1);
                        break;
                    }
            }
        }
        $scope.ok = function () {
            var template = {
                request: {
                    spaceKey: $scope.info.spaceKey,
                    projectID: $scope.info.projectID,
                    groupID: $scope.component.selectMultistageCommonComponentObject.new.value,
                    codeID: $scope.info.codeID,
                    codeDesc: $scope.info.codeDesc,
                    code: $scope.info.code,
                    statusCode: ''
                },
                promise: null,
                isCheck: false
            }
            if ($scope.ConfirmForm.$valid) {
                if ($scope.info.isAdd) {
                    template.request.statusCode = JSON.stringify($scope.data.interaction.request.statusCode.slice(0, $scope.data.interaction.request.statusCode.length - 1), function (key, val) {
                        if (Object.prototype.toString.call(val) == '[object Object]' && (!val.code || !val.codeDesc)) {
                            template.isCheck = true;
                        }
                        if (typeof (val) == 'object' || /(code)|(codeDesc)/.test(key)) return val;
                    })
                    if (template.isCheck || template.request.statusCode == '[]') {
                        $scope.submited = true;
                        return;
                    }
                    template.promise = ApiManagementResource.Code.Add(template.request).$promise;
                    template.promise.then(function (response) {
                        switch (response.statusCode) {
                            case CODE.COMMON.SUCCESS:
                                {
                                    $uibModalInstance.close(true);
                                    break;
                                }
                            case '190000':
                                {
                                    $rootScope.InfoModal($filter('translate')('343'), 'error');
                                    break;
                                }
                            default:
                                {
                                    $scope.submited = true;
                                    break;
                                }
                        }
                    });
                } else {
                    template.promise = ApiManagementResource.Code.Edit(template.request).$promise;
                    template.promise.then(function (response) {
                        switch (response.statusCode) {
                            case CODE.COMMON.SUCCESS:
                            case CODE.STATUS_CODE.ERROR:
                                {
                                    $uibModalInstance.close(true);
                                    break;
                                }
                            case '190007':
                                {
                                    $rootScope.InfoModal($filter('translate')('344'), 'error');
                                    break;
                                }
                            default:
                                {
                                    $scope.submited = true;
                                    break;
                                }
                        }
                    });
                }
            } else {
                $scope.submited = true;
            }
            return template.promise;
        };

        $scope.cancel = function () {
            //$uibModalInstance.dismiss(false);
            $uibModalInstance.close(false);
        };
        (function () {

            if (info.codeID) {
                $scope.info = {
                    spaceKey: info.spaceKey,
                    projectID: info.projectID,
                    codeID: info.codeID,
                    code: info.code,
                    codeDesc: info.codeDescription,
                    isAdd: false
                }
                if (info.topParentGroupID) {
                    $scope.info.groupID = info.topParentGroupID;
                    $scope.info.childGroupID = info.parentGroupID;
                    $scope.info.grandSonGroupID = info.groupID;
                } else if (info.parentGroupID) {
                    $scope.info.groupID = parseInt(info.parentGroupID);
                    $scope.info.childGroupID = info.groupID;
                    $scope.info.grandSonGroupID = -1;
                } else {
                    $scope.info.groupID = parseInt(info.groupID);
                    $scope.info.childGroupID = -1;
                    $scope.info.grandSonGroupID = -1;
                }
            }
            $scope.query = GroupService.get();

        })()
    }
    AMS_ImportModalCtrl.$inject = ['$scope', '$uibModalInstance', 'ApiManagementResource', 'CODE', '$rootScope', 'input','$filter'];

    function AMS_ImportModalCtrl($scope, $uibModalInstance, ApiManagementResource, CODE, $rootScope, input,$filter) {
        $scope.data = {
            input: input,
            fun: {
                import: null //导入按钮功能函数
            }
        }
        $scope.importFile = function (arg) {
            var file = arg.$file[0];
            var reader = new FileReader();
            reader.readAsText(file);
            reader.onloadend = function (evt) {
                $scope.$broadcast('$Init_LoadingCommonComponent', {
                    spaceKey: input.spaceKey,
                    status: arg.status,
                    result: this.result,
                    groupID: input.groupID,
                });
            }
        }
        $scope.data.fun.import = function (arg) {
            var template = {
                promise: null,
                request: {}
            }
            switch (arg.status) {
                case 0:
                    {
                        template.promise = ApiManagementResource.Import.Eoapi({
                            spaceKey: arg.spaceKey,
                            groupID: arg.groupID,
                            data: arg.result
                        }).$promise;
                        template.promise.then(function (response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        $uibModalInstance.close(true);
                                        break;
                                    }
                                case CODE.IMPORT_EXPORT.ILLEGAL_IMPORT:
                                    {
                                        $rootScope.InfoModal($filter('translate')('345'), 'error');
                                        break;
                                    }
                                default:
                                    {
                                        $rootScope.InfoModal($filter('translate')('346'), 'error');
                                        break;
                                    }
                            }
                        });
                        break;
                    }
                case 1:
                case 2:
                    {
                        template.promise = ApiManagementResource.Import.Postman({
                            spaceKey: arg.spaceKey,
                            groupID: arg.groupID,
                            data: arg.result,
                            version: arg.status
                        }).$promise;
                        template.promise.then(function (response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {

                                        $uibModalInstance.close(true);
                                        break;
                                    }
                                case CODE.IMPORT_EXPORT.ILLEGAL_VERSION:
                                    {
                                        $rootScope.InfoModal($filter('translate')('347'), 'error');
                                        break;
                                    }
                                case CODE.IMPORT_EXPORT.ILLEGAL_IMPORT:
                                    {
                                        $rootScope.InfoModal($filter('translate')('345'), 'error');
                                        break;
                                    }
                                default:
                                    {
                                        $rootScope.InfoModal($filter('translate')('346'), 'error');
                                        break;
                                    }
                            }
                        });
                        break;
                    }
                case 5:
                    {
                        template.promise = ApiManagementResource.Import.Swagger({
                            spaceKey: arg.spaceKey,
                            groupID: arg.groupID,
                            data: arg.result
                        }).$promise;
                        template.promise.then(function (response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        $uibModalInstance.close(true);
                                        break;
                                    }
                                case CODE.IMPORT_EXPORT.ILLEGAL_IMPORT:
                                    {
                                        $rootScope.InfoModal($filter('translate')('348'), 'error');
                                        break;
                                    }
                                default:
                                    {
                                        $rootScope.InfoModal($filter('translate')('346'), 'error');
                                        break;
                                    }
                            }
                        });
                        break;
                    }
                case 6:
                    {
                        template.request = Object.assign({}, input.request || {});
                        template.request.data = arg.result;
                        template.promise = input.resource.Import(template.request).$promise;
                        template.promise.then(function (response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        $uibModalInstance.close(true);
                                        break;
                                    }
                                case CODE.IMPORT_EXPORT.ILLEGAL_IMPORT:
                                    {
                                        $rootScope.InfoModal($filter('translate')('345'), 'error');
                                        break;
                                    }
                                default:
                                    {
                                        $rootScope.InfoModal($filter('translate')('346'), 'error');
                                        break;
                                    }
                            }
                        });
                        break;
                    }
            }
            return template.promise;
        }
        $scope.cancel = function () {
            //$uibModalInstance.dismiss(false);
            $uibModalInstance.close(false);
        };

    }


})();