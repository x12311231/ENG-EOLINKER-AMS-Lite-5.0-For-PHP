(function () {
    'use strict';
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
     * @function [公用弹窗controller js] [Public bucket controller js]
     * @version  3.2.3
     */
    angular.module('eolinker.modal')

        .directive('eoCommonModal', ['$rootScope', '$uibModal', function ($rootScope, $uibModal) {
            return {
                restrict: 'AE',
                templateUrl: 'app/modal/branch/common/index.html',
                link: function (scope, iElement, iAttrs) {
                    /**
                     * @description 接口管理公用模块定义
                     */
                    $rootScope.ApiManagement_AutomatedTest_QiuckAddSingalModal = function openModel(input, callback) {
                        var modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: 'ApiManagement_AutomatedTest_QiuckAddSingalModal',
                            controller: 'ApiManagement_AutomatedTest_QiuckAddSingalModalCtrl',
                            resolve: {
                                input: function () {
                                    return input;
                                }
                            }
                        });
                        modalInstance.result.then(callback);
                    }

                    $rootScope.ApiManagement_AutomatedTest_EditCaseModal = function openModel(input, callback) {
                        var modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: 'ApiManagement_AutomatedTest_EditCaseModal',
                            controller: 'ApiManagement_AutomatedTest_EditCaseModalCtrl',
                            resolve: {
                                input: function () {
                                    return input;
                                }
                            }
                        });
                        modalInstance.result.then(callback);
                    }
                    $rootScope.MixInputModal = function openModel(input, callback) {
                        var modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: 'MixInputModal',
                            controller: 'MixInputModalCtrl',
                            resolve: {
                                input: function () {
                                    return input;
                                }
                            }
                        });
                        modalInstance.result.then(callback);
                    }

                    $rootScope.InfoModal = function openModel(info, type, callback) {
                        var modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: 'InfoModal',
                            controller: 'InfoModalCtrl',
                            displayClass: 'modal-info-display',
                            resolve: {
                                info: function () {
                                    return info;
                                },
                                type: function () {
                                    return type;
                                }
                            }
                        });
                        modalInstance.result.then(callback);
                    }

                    $rootScope.EnsureModal = function openModel(title, necessity, info, input, callback) {
                        var modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: 'EnsureModal',
                            controller: 'EnsureModalCtrl',
                            resolve: {
                                title: function () {
                                    return title;
                                },
                                necessity: function () {
                                    return necessity;
                                },
                                info: function () {
                                    return info;
                                },
                                input: function () {
                                    return input;
                                }
                            }
                        });
                        modalInstance.result.then(callback);
                    }

                    $rootScope.MessageModal = function openModel(title, info, callback) {
                        var modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: 'MessageModal',
                            controller: 'MessageModalCtrl',
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
                    $rootScope.SelectVisualGroupModal = function openModel(input, callback) {
                        var modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: 'SelectVisualGroupModal',
                            controller: 'SelectVisualGroupModalCtrl',
                            resolve: {
                                input: function () {
                                    return input;
                                }
                            }
                        });
                        modalInstance.result.then(callback);
                    }

                    $rootScope.GroupModal = function openModel(input, callback) {
                        var modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: 'GroupModal',
                            controller: 'GroupModalCtrl',
                            resolve: {
                                input: function () {
                                    return input;
                                }
                            }
                        });
                        modalInstance.result.then(callback);
                    }

                    $rootScope.CommonSingleInputModal = function openModel(title, desc, info, input, callback) {
                        var modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: 'CommonSingleInputModal',
                            controller: 'CommonSingleInputModalCtrl',
                            resolve: {
                                title: function () {
                                    return title;
                                },
                                desc: function () {
                                    return desc;
                                },
                                info: function () {
                                    return info;
                                },
                                input: function () {
                                    return input;
                                }
                            }
                        });
                        modalInstance.result.then(callback);
                    }

                    $rootScope.Common_UploadFile = function openModel(input, callback) {
                        var modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: 'Common_UploadFile',
                            controller: 'Common_UploadFileCtrl',
                            resolve: {
                                input: function () {
                                    return input;
                                }
                            }
                        });
                        modalInstance.result.then(callback);
                    }
                    $rootScope.Common_SelectPersonModal = function openModel(input, callback) {
                        var modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: 'Common_SelectPersonModal',
                            controller: 'Common_SelectPersonModalCtrl',
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
        .controller('MixInputModalCtrl', MixInputModalCtrl)

        .controller('InfoModalCtrl', InfoModalCtrl)

        .controller('MessageModalCtrl', MessageModalCtrl)

        .controller('EnsureModalCtrl', EnsureModalCtrl)

        .controller('SelectVisualGroupModalCtrl', SelectVisualGroupModalCtrl)

        .controller('GroupModalCtrl', GroupModalCtrl)

        .controller('CommonSingleInputModalCtrl', CommonSingleInputModalCtrl)

        .controller('Common_UploadFileCtrl', Common_UploadFileCtrl)
        .controller('Common_SelectPersonModalCtrl', Common_SelectPersonModalCtrl)

    Common_SelectPersonModalCtrl.$inject = ['$scope', '$uibModalInstance', '$rootScope', 'input','$filter'];

    function Common_SelectPersonModalCtrl($scope, $uibModalInstance, $rootScope, input,$filter) {
        $scope.data = {
            input: {
                title: input.title,
                query: input.query,
                status: input.status,
                maxNumber: input.maxNumber || 10000,
                request: input.request,
                secondTitle: input.secondTitle || $filter('translate')('349')
            },
            info: {
                checkbox: false,
                currentSelectNumber: 0
            },
            fun: {}
        }
        $scope.interaction = {
            request: {
                userCall: null
            }
        }
        var data = {
            fun: {}
        }
        $scope.data.fun.allSet = function () {
            angular.forEach($scope.data.input.query, function (val, key) {
                val.checkbox = $scope.data.info.checkbox;
            })
        }
        $scope.data.fun.change = function (arg) {
            if ((!arg.item.checkbox) && $scope.data.info.currentSelectNumber >= $scope.data.input.maxNumber) return;
            arg.item.checkbox = !arg.item.checkbox;
            arg.item.checkbox ? $scope.data.info.currentSelectNumber++ : $scope.data.info.currentSelectNumber--;
        }
        $scope.data.fun.filter = function (arg) {
            if (!$scope.interaction.request.userCall) return arg;
            if ((arg.userName || '').indexOf($scope.interaction.request.userCall) > -1 || (arg.userNickName || '').indexOf($scope.interaction.request.userCall) > -1 || (arg.inviteCall || '').indexOf($scope.interaction.request.userCall) > -1) return arg;
            return;
        }
        $scope.data.fun.confirm = function () {
            var template = {
                output: []
            }
            for (var key in $scope.data.input.query) {
                var val = $scope.data.input.query[key];
                if (val.checkbox) {
                    template.output.push(val.userID);
                }
            }
            if (template.output.length > 0) $uibModalInstance.close(template.output);
            else $rootScope.InfoModal($filter('translate')('350'), 'error');
        };

        $scope.data.fun.cancel = function () {
            $uibModalInstance.close(false);
        };
        $scope.data.fun.init = function () {
            data.promise = input.request.resource(input.request.params).$promise;
            if (!input.request) return;
            data.promise.then(function (response) {
                $scope.data.input.query = response[input.request.responseKey];
            })
            return data.promise;
        };
    }

    MixInputModalCtrl.$inject = ['$scope', '$uibModalInstance', '$rootScope', 'CODE', 'input','$filter'];

    function MixInputModalCtrl($scope, $uibModalInstance, $rootScope, CODE, input,$filter) {
        $scope.input = input;
        $scope.fun = {};
        $scope.data = {
            submitted: false,
            admin: ''
        }
        $scope.component = {
            selectPersonCommonComponentObject: {}
        }
        var data = {
                singleTextObject: angular.copy(input.singleTextObject)
            },
            fun = {};
        $scope.fun.showSearchList = function ($event) {
            $event.stopPropagation();
            $scope.data.showSearchList = !$scope.data.showSearchList;
        }
        $scope.fun.searchMemberList = function (value, $event) {
            $event.stopPropagation();
            $scope.data.showSearchList = true;
            $scope.input.singleTextObject.selectOptions = [];
            data.singleTextObject.selectOptions.map(function (val, key) {
                if (fun.filterMemberList(val, value)) {
                    $scope.input.singleTextObject.selectOptions.push(val);
                }
            })
        }

        fun.filterMemberList = function (arg, value) {
            if ((arg.inviteCall || '').indexOf(value) > -1 || (arg.userNickName || '').indexOf(value) > -1 || (arg.userName || '').indexOf(value) > -1) {
                return true;
            } else {
                return false;
            }
        }
        $scope.fun.confirm = function () {
            var template = {
                request: input.request || {},
                promise: null
            }
            if ($scope.ConfirmForm.$valid) {
                input.textArray.map(function (val, key) {
                    template.request[val.key] = val.value;
                })
                if (input.singleTextObject && $scope.component.selectPersonCommonComponentObject.value) {
                    template.request[input.singleTextObject.key] = $scope.component.selectPersonCommonComponentObject.value;
                }
                if (input.ensure) {
                    $rootScope.EnsureModal(input.ensureInfo.title, input.ensureInfo.necessity, input.ensureInfo.info, input.ensureInfo.input || {}, function (callback) {
                        if (callback) {
                            if (!input.resource) {
                                $uibModalInstance.close(Object.assign({}, template.request));
                                return;
                            }
                            template.promise = input.resource(template.request).$promise;
                            template.promise.then(function (response) {
                                switch (response.statusCode) {
                                    case CODE.COMMON.SUCCESS:
                                        {
                                            $uibModalInstance.close(Object.assign({}, template.request, response));
                                            break;
                                        }
                                    default:
                                        {
                                            $rootScope.InfoModal($filter('translate')('299'), 'error');
                                            break;
                                        }
                                }
                            });
                        }
                    })
                } else {
                    if (!input.resource) {
                        $uibModalInstance.close(Object.assign({}, template.request));
                        return;
                    }
                    template.promise = input.resource(template.request).$promise;
                    template.promise.then(function (response) {
                        switch (response.statusCode) {
                            case CODE.COMMON.SUCCESS:
                                {
                                    $uibModalInstance.close(Object.assign({}, template.request, response));
                                    break;
                                }
                            default:
                                {
                                    $rootScope.InfoModal($filter('translate')('299'), 'error');
                                    break;
                                }
                        }
                    });
                }

            } else {
                $scope.data.submitted = true;
            }
            return template.promise;
        };

        $scope.fun.cancel = function () {
            $uibModalInstance.close(false);
        };
    }


    EnsureModalCtrl.$inject = ['$scope', '$uibModalInstance', 'title', 'necessity', 'info', 'input','$filter'];
    /**
     * @function [确认弹窗] [confirm]
     * @service  $scope [注入作用域服务] [Injection scope service]
     * @service  $uibModalInstance [注入$uibModalInstance服务] [Injection $uibModalInstance service]
     * @service  $filter [注入过滤器服务] [Injection filter service]
     * @param    {[string]}   title [弹窗标题 Pop-up title]
     * @param    {[boolean]}   necessity [是否需要键入yes Do you need to type yes?]
     * @param    {[string]}   info [弹窗内容 Pop-up content]
     * @param    {[number]}   btn [按钮类型 Button type]
     */
    function EnsureModalCtrl($scope, $uibModalInstance, title, necessity, info, input,$filter) {

        $scope.title = title;
        $scope.necessity = necessity;
        $scope.info = {
            message: info || $filter('translate')('300'),
            btnType: input.btnType || 0, //0：warning 1：info,2:success,
            btnMessage: input.btnMessage || $filter('translate')('259'),
            btnGroup: input.btnGroup || [],
            timer: {
                limit: input.timeLimit,
                value: input.timeLimit / 1000,
                fun: null,
            },
            btnCancelMessage: input.btnCancelMessage || $filter('translate')('13')
        }
        $scope.fun = {};
        var data = {
            fun: {
                init: null
            }
        }
        $scope.data = {
            input: {}
        }

        /**
         * 初始化
         */
        data.fun.init = (function () {
            angular.copy(input, $scope.data.input);
            if ($scope.info.btnType == 3) {
                $scope.info.timer.fun = setInterval(function () {
                    if ($scope.info.timer == 0) clearInterval($scope.info.timer.fun);
                    $scope.info.timer.value--;
                    $scope.$root && $scope.$root.$$phase || $scope.$apply();
                }, 1000)
            }
        })()
        $scope.fun.btnClick = function (arg) {
            arg.confirm();
            $uibModalInstance.close(false);
        }
        $scope.ok = function () {
            if ($scope.sureForm.$valid || !$scope.necessity) {
                $uibModalInstance.close(true);
            } else {
                $scope.submited = true;
            }
        };

        $scope.cancel = function () {
            //$uibModalInstance.dismiss(false);
            clearInterval($scope.info.timer.fun);
            $uibModalInstance.close(false);
        };

    }



    MessageModalCtrl.$inject = ['$scope', '$sce', '$uibModalInstance', 'title', 'info'];
    /**
     * @function [消息弹窗] [Message]
     * @service  $scope [注入作用域服务] [Injection scope service]
     * @service  $uibModalInstance [注入$uibModalInstance服务] [Injection $uibModalInstance service]
     * @service  $sce [注入$sce服务] [Injection $sce service]
     * @param    {[string]}   title [弹窗标题 Pop-up title]
     * @param    {[string]}   info [弹窗内容 Pop-up content]
     */
    function MessageModalCtrl($scope, $sce, $uibModalInstance, title, info) {

        $scope.title = title;
        $scope.info = $sce.trustAsHtml(info);

        $scope.cancel = function () {
            //$uibModalInstance.dismiss(false);
            $uibModalInstance.close(false);
        };

    }




    InfoModalCtrl.$inject = ['$scope', '$uibModalInstance', '$timeout', 'info', 'type'];
    /**
     * @function [消息弹窗] [Info]
     * @service  $scope [注入作用域服务] [Injection scope service]
     * @service  $uibModalInstance [注入$uibModalInstance服务] [Injection $uibModalInstance service]
     * @param    {[string]}   input [弹窗内容 Pop-up content]
     * @param    {[string]}   type [弹窗类型 Pop-up type]
     */
    function InfoModalCtrl($scope, $uibModalInstance, $timeout, info, type) {

        $scope.type = type || 'info';
        $scope.info = typeof (info) == 'object' ? info.tip : info;
        var timer = $timeout(function () {
            $uibModalInstance.close(true);
        }, typeof (info) == 'object' ? info.timeout : 1500, true);
        $scope.$on('$destroy', function () {
            if (timer) {
                $timeout.cancel(timer);
            }
        });
    }
    SelectVisualGroupModalCtrl.$inject = ['$scope', '$uibModalInstance', '$state', 'input','$filter'];

    function SelectVisualGroupModalCtrl($scope, $uibModalInstance, $state, input,$filter) {
        $scope.title = input.title;
        $scope.secondTitle = input.secondTitle || $filter('translate')('328');
        $scope.list = input.list;
        $scope.modalType = input.modalType;
        $scope.data = {
            isEnd: false,
            initialGroupData: [],
            apiGroup: null
        };
        $scope.fun = {};
        var fun = {},
            data = {
                isBreak: false,
                groupIDArr: []
            };

        function loopGroup(groupList, fun) {
            for (var i = 0; i < groupList.length; i++) {
                var isKeep = fun(groupList[i], i);
                data.isBreak = isKeep == false ? true : data.isBreak;
                if (!isKeep) {
                    groupList.splice(i, 1);
                    return groupList;
                }
                if (groupList[i].childGroupList && !data.isBreak) {
                    groupList[i].childGroupList = loopGroup(groupList[i].childGroupList, fun);
                }
            }
            return groupList;
        }
        $scope.fun.initGroup = function () {
            var template = {
                promise: null,
                groupList: null,
            }
            template.promise = input.resource(input.request).$promise;
            template.promise.then(function (response) {
                $scope.data.isEnd = true;
                $scope.selectMultistageCommonComponentObject = {
                    new: {},
                    original: {}
                };
                template.groupList = response.groupList;
                if (input.item.groupID) {
                    template.groupList = loopGroup(template.groupList, function (val, key) {
                        if (val.groupID == input.item.groupID) {
                            return false;
                        }
                        return true;
                    })
                }
                $scope.data.apiGroup = [{
                    groupID: 0,
                    groupName: $filter('translate')('351'),
                    childGroupList: template.groupList || []
                }];
                $scope.data.initialGroupData = [0]
                try {
                    data.groupIDArr = JSON.parse($state.params.json);
                    if (input.item.groupID) data.groupIDArr = data.groupIDArr.slice(0, -1)
                    angular.forEach(data.groupIDArr, function (val, key) {
                        $scope.data.initialGroupData.push(val.groupID);
                    })
                } catch (e) {}
            })
            return template.promise;
        }
        fun.click = function (status, arg) {
            var template = {
                uri: null
            }
            switch (status) {
                case 'first-level':
                    {
                        template.uri = {
                            groupID: arg.item.groupID,
                            childGroupID: null,
                            grandSonGroupID: null,
                            groupName: arg.item.groupName,
                        }
                        break;
                    }
                case 'second-level':
                    {
                        template.uri = {
                            groupID: arg.parentItem.groupID,
                            childGroupID: arg.item.groupID,
                            grandSonGroupID: null,
                            groupName: arg.item.groupName,
                        }
                        break;
                    }
                case 'third-level':
                    {
                        template.uri = {
                            groupID: arg.grandParentItem.groupID,
                            childGroupID: arg.parentItem.groupID,
                            grandSonGroupID: arg.item.groupID,
                            groupName: arg.item.groupName,
                        }
                        break;
                    }
            }
            angular.merge($scope.interaction.request, template.uri);
            arg.item.isSpreed = true;
        }
        fun.spreed = function (arg) {
            if (arg.$event) {
                arg.$event.stopPropagation();
            }
            arg.item.isSpreed = !arg.item.isSpreed;
        }
        fun.init = (function () {
            if (input.modalType == 'no-level-limit') return;
            input.staticQuery = input.staticQuery || [];
            if (input.staticQuery.length) {
                $scope.interaction = {
                    request: {
                        groupID: input.staticQuery[0].groupID,
                        childGroupID: null,
                        grandSonGroupID: null,
                        groupName: '',
                    }
                };
            } else {
                $scope.interaction = {
                    request: {
                        groupID: input.list[0].groupID,
                        childGroupID: input.list[0].childGroupID || null,
                        grandSonGroupID: input.list[0].grandSonGroupID || null,
                        groupName: input.list[0].groupName || '',
                    }
                };
            }
            $scope.component = {
                groupCommonObject: {
                    funObject: {
                        unTop: true
                    },
                    mainObject: {
                        level: 2,
                        baseInfo: {
                            name: 'groupName',
                            id: 'groupID',
                            child: 'childGroupList',
                            secondLevelGroupID: 'childGroupID',
                            thirdLevelGroupID: 'grandSonGroupID',
                            current: $scope.interaction.request,
                            hasIcon: input.hasIcon,
                        },
                        staticQuery: input.staticQuery || [],
                        baseFun: {
                            click: fun.click,
                            spreed: fun.spreed
                        }
                    }
                }
            }
        })();
        $scope.fun.confirm = function () {
            if (input.modalType == 'no-level-limit') {
                $uibModalInstance.close($scope.selectMultistageCommonComponentObject.new);
            } else {
                $uibModalInstance.close({
                    grandParentGroupID: $scope.interaction.request.grandSonGroupID ? $scope.interaction.request.groupID : null,
                    parentGroupID: $scope.interaction.request.grandSonGroupID ? $scope.interaction.request.childGroupID : $scope.interaction.request.childGroupID ? $scope.interaction.request.groupID : null,
                    groupID: $scope.interaction.request.grandSonGroupID ? $scope.interaction.request.grandSonGroupID : $scope.interaction.request.childGroupID ? $scope.interaction.request.childGroupID : $scope.interaction.request.groupID,
                    groupName: $scope.interaction.request.groupName
                });
            };
        };
        $scope.fun.cancel = function () {
            //$uibModalInstance.dismiss(false);
            $uibModalInstance.close(false);
        };
    }
    GroupModalCtrl.$inject = ['$scope', '$uibModalInstance', 'input', '$filter'];
    /**
     * @function [编辑{{\'85\'|translate}}弹窗] [Edit grouping]
     * @service  $scope [注入作用域服务] [Injection scope service]
     * @service  $uibModalInstance [注入$uibModalInstance服务] [Injection $uibModalInstance service]
     * @service  $filter [注入过滤器服务] [inject filter service]
     * @param    {[string]}   title [弹窗标题 Pop-up title]
     * @param    {[obj]}   info [输入内容 The contents of the input]
     * @param    {[string]}   secondTitle [{{\'85\'|translate}}内容 Grouping content]
     * @param    {[string]}   query [{{\'85\'|translate}}列表 Group list]
     */

    function GroupModalCtrl($scope, $uibModalInstance, input, $filter) {
        $scope.title = input.title;
        $scope.placeholder = input.placeholder ;
        $scope.secondTitle = input.secondTitle || $filter('translate')('85');
        $scope.required = input.data ? (input.data.required ? true : false) : false;
        $scope.info = {
            groupName: '',
            groupID: '',
            $index: '0',
            isAdd: true
        }
        $scope.params = {
            query: [{
                groupName: $filter('translate')('352'),
                groupID: '0'
            }].concat(input.group),
            status: input.status || 'first-level'
        }
        $scope.data = {
            btn: input.btn || {
                type: 'success',
                message: $filter('translate')('52')
            }
        }
        $scope.fun = {};
        var init = (function () {
            if (input.data) {
                $scope.info = {
                    groupName: input.data.groupName,
                    groupID: input.data.groupID,
                    isAdd: false
                }
            }
            angular.merge($scope.info, input.parentObject);
        })();
        $scope.ok = function () {
            if ($scope.editGroupForm.$valid) {
                $uibModalInstance.close($scope.info);
            } else {
                $scope.submited = true;
            }
        };

        $scope.cancel = function () {
            //$uibModalInstance.dismiss(false);
            $uibModalInstance.close(false);
        };
    }



    CommonSingleInputModalCtrl.$inject = ['$scope', '$uibModalInstance', 'title', 'desc', 'info', 'input', '$filter'];
    /**
     * @function [单一输入框弹窗] [Single input box]
     * @service  $scope [注入作用域服务] [Injection scope service]
     * @service  $uibModalInstance [注入$uibModalInstance服务] [Injection $uibModalInstance service]
     * @service  $filter [注入过滤器服务] [inject filter service]
     * @param    {[string]}   title [弹窗标题 Pop-up title]
     * @param    {[obj]}   desc [描述信息 description information]
     * @param    {[obj]}   info [接口信息 API information]
     * @param    {[string]}   input [按钮类型 Button type]
     */
    function CommonSingleInputModalCtrl($scope, $uibModalInstance,title, desc, info, input, $filter ) {
        $scope.title = title;
        $scope.info = {
            desc: desc,
            message: info,
            btnType: input.btnType || 0, //0：warning 1：info,
            btnMessage: input.btnMessage || $filter('translate')('353'),
            placeholder: $filter('translate')('354'),
        }
        $scope.data = {
            input: input
        }
        $scope.ok = function () {
            if ($scope.sureForm.$valid) {
                $uibModalInstance.close({
                    check: true,
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

    Common_UploadFileCtrl.$inject = ['$scope', '$uibModalInstance', '$filter', 'input', '$filter'];
    /**
     * @function [上传文件弹窗] [Upload file pop-up]
     * @service  $scope [注入作用域服务] [Injection scope service]
     * @service  $uibModalInstance [注入$uibModalInstance服务] [Injection $uibModalInstance service]
     * @service  $filter [注入过滤器服务] [Injection filter service]
     * @param    {[obj]}   input [参数详情 Parameter details]
     */
    function Common_UploadFileCtrl($scope, $uibModalInstance, $timeout, input, $filter) {
        $scope.data = {
            info: {
                submitted: false
            },
            input: {},
            output: {
                file: null,
                groupID: '',
                childGroupID: ''
            },
            fun: {
                change: null, //切换父{{\'85\'|translate}}功能函数
                cancel: null,
                confirm: null
            }
        }
        var data = {
            fun: {
                init: null
            }
        }
        $scope.data.fun.import = function (arg) {
            $scope.data.output.file = arg.$files[0];
        };
        $scope.data.fun.change = function (status, ISINIT) {
            var template = {}
            switch (status) {
                case 'first-level':
                    {
                        template = {
                            input: 'parent',
                            output: 'child',
                            point: 'groupID'
                        }
                        if (!ISINIT) {
                            $scope.data.output.childGroupID = -1;
                            $scope.data.output.grandSonGroupID = -1;
                        }
                        break;
                    }
                case 'second-level':
                    {
                        template = {
                            input: 'child',
                            output: 'grandson',
                            point: 'childGroupID'
                        }
                        if (!ISINIT) {
                            $scope.data.output.grandSonGroupID = -1;
                        }
                        break;
                    }
            }
            for (var key in $scope.data.input.group[template.input]) {
                var val = $scope.data.input.group[template.input][key];
                if (val.groupID == $scope.data.output[template.point]) {
                    $scope.data.input.group[template.output] = [{
                        groupID: -1,
                        groupName: status == 'second-level' ? $filter('translate')('355') : $filter('translate')('356'),
                        childGroupList: []
                    }].concat(val.childGroupList);
                    break;
                }
            }
        }
        $scope.data.fun.confirm = function (arg) {
            var template = {
                callback: {
                    groupID: $scope.data.output.grandSonGroupID > 0 ? $scope.data.output.grandSonGroupID : $scope.data.output.childGroupID == -1 ? $scope.data.output.groupID : $scope.data.output.childGroupID,
                    file: $scope.data.output.file
                }
            }
            if ($scope.data.output.file) {
                $uibModalInstance.close(template.callback);
            } else {
                $scope.data.info.submitted = true;
            }
        };
        $scope.data.fun.cancel = function () {
            $uibModalInstance.close(false);
        };
        data.fun.init = (function () {
            angular.copy(input, $scope.data.input);
            if (!input.group.groupID || input.group.groupID == -1) {
                $scope.data.output.groupID = $scope.data.input.group.parent[0].groupID;
                $scope.data.input.group.child = [{
                    groupID: -1,
                    groupName: $filter('translate')('356'),
                    childGroupList: []
                }].concat($scope.data.input.group.parent[0].childGroupList);
                $scope.data.output.childGroupID = -1;
                $scope.data.input.group.grandson = [{
                    groupID: -1,
                    groupName: $filter('translate')('355')
                }];
                $scope.data.output.grandSonGroupID = -1;
            } else {
                $scope.data.output.groupID = input.group.groupID;
                $scope.data.output.childGroupID = input.group.childGroupID || -1;
                $scope.data.output.grandSonGroupID = input.group.grandSonGroupID || -1;
                $scope.data.fun.change('first-level', true);
                $scope.data.fun.change('second-level', true);
            }
        })()

    }


})();