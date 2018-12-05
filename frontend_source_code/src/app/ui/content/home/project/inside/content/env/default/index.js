(function () {
    'use strict';
    /**
     * @name 环境列表
     * @author 广州银云信息科技有限公司
     */

    angular.module('eolinker')
        .component('homeProjectInsideEnv', {
            template: '<div ng-class="{\'unauthority-div\':!$ctrl.service.authority.permission.project.environment.edit}">' +
                '<menu-common-component ng-if="$ctrl.service.authority.permission.project.environment.edit"  other-object="{query:$ctrl.data.batch.address}" show-object="$ctrl.component.menuObject.show" list="$ctrl.component.menuObject.list"></menu-common-component>' +
                '<list-default-common-component show-object="{batch:$ctrl.component.menuObject.show.batch}" authority-object="{operate:!$ctrl.component.menuObject.show.batch.disable&&$ctrl.service.authority.permission.project.environment.edit}" main-object="$ctrl.component.listDefaultCommonObject.mainObject" list="$ctrl.interaction.response.query" active-object="$ctrl.component.menuObject.show.batch" ></list-default-common-component>' +
                '<loading-common-component fun="$ctrl.fun.init(arg)"></loading-common-component>' +
                '</div>',
            controller: indexController
        })

    indexController.$inject = ['Authority_CommonService', 'ApiManagementResource', '$scope', '$state', 'CODE', '$rootScope', 'ENSURE_WARNIMG', 'RESPONSE_TEXT','$filter'];

    function indexController(Authority_CommonService, ApiManagementResource, $scope, $state, CODE, $rootScope, ENSURE_WARNIMG, RESPONSE_TEXT,$filter) {
        var vm = this;
        vm.data = {
            batch: {
                address: []
            }
        }
        vm.interaction = {
            request: {
                spaceKey: $state.params.spaceKey,
                projectID: $state.params.projectID,
                envID: []
            },
            response: {
                query: []
            }
        }
        vm.fun = {}
        var fun = {};
        vm.service = {
            authority: Authority_CommonService
        }
        vm.component = {
            menuObject: {
                show: {
                    batch: {
                        disable: false
                    }
                },
                list: []
            },
            listDefaultCommonObject: {
                mainObject: {}
            }
        }
        fun.batchSort = function (pre, next) {
            return pre - next;
        }
        fun.batchDefault = function () {
            if (vm.interaction.response.query && vm.interaction.response.query.length > 0) {
                vm.component.menuObject.show.batch.disable = true;
                vm.component.menuObject.show.batch.selectAll = false;
                try {
                    angular.forEach(vm.data.batch.address, function (val, key) {
                        vm.interaction.response.query[val].isClick = false;
                    })
                } catch (e) {}
                vm.interaction.request.envID = [];
                vm.data.batch.address = [];
                $rootScope.InfoModal($filter('translate')('489'), 'success');
            } else {
                $rootScope.InfoModal($filter('translate')('490'), 'error');
            }
        }
        vm.fun.init = function (arg) {
            var template = {
                promise: null,
                request: {
                    spaceKey: vm.interaction.request.spaceKey,
                    projectID: vm.interaction.request.projectID
                }
            }
            template.promise = ApiManagementResource.Env.Query(template.request).$promise;
            template.promise.then(function (response) {
                vm.interaction.response.query = response.envList || [];
                vm.interaction.response.itemNum = response.itemNum || 0;
            })
            return template.promise;
        }
        fun.click = function (arg) {
            var template = {
                $index: vm.interaction.request.envID.indexOf(arg.item.envID)
            }
            if (vm.component.menuObject.show.batch.disable) {
                arg.item.isClick = !arg.item.isClick;
                if (arg.item.isClick) {
                    vm.interaction.request.envID.push(arg.item.envID);
                    vm.data.batch.address.push(arg.$index);
                } else {
                    vm.interaction.request.envID.splice(template.$index, 1);
                    vm.data.batch.address.splice(template.$index, 1);
                }
            } else {
                vm.interaction.request.envID = arg.item.envID;
                $state.go('home.project.inside.env.operate', {
                    envID: arg.item.envID,
                    status: 'edit'
                });
            }

        }
        fun.edit = function (arg) {
            arg = arg || {};
            $state.go('home.project.inside.env.operate', {
                status: arg.item ? 'edit' : 'add',
                envID: arg.item ? arg.item.envID : null,
                itemNum: vm.interaction.response.itemNum
            })
        }
        fun.delete = function (arg) {
            var template = {
                request: {
                    spaceKey: vm.interaction.request.spaceKey,
                    projectID: vm.interaction.request.projectID,
                    envID: (arg.status == 'batch') ? JSON.stringify(vm.interaction.request.envID) : '[' + arg.item.envID + ']'
                },
                loop: {
                    num: 0
                }
            }
            $rootScope.EnsureModal($filter('translate')('553'), false, ENSURE_WARNIMG.DELETE, {}, function (callback) {
                if (callback) {
                    ApiManagementResource.Env.BatchDelete(template.request).$promise
                        .then(function (response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        switch (arg.status) {
                                            case 'batch':
                                                {
                                                    vm.interaction.response.itemNum = vm.interaction.response.itemNum - template.request.envID.length;
                                                    angular.forEach(vm.data.batch.address.sort(fun.batchSort), function (val, key) {
                                                        val = val - template.loop.num++;
                                                        vm.interaction.response.query.splice(val, 1);
                                                    })
                                                    vm.component.menuObject.show.batch.disable = false;
                                                    vm.interaction.request.envID = [];
                                                    vm.data.batch.address = [];
                                                    break;
                                                }
                                            case 'single':
                                                {
                                                    vm.interaction.response.query.splice(arg.$index, 1);
                                                    break;
                                                }
                                        }
                                        $rootScope.InfoModal($filter('translate')('384'), 'success');
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
        vm.$onInit = function () {
            $scope.$emit('$WindowTitleSet', {
                list: [$filter('translate')('554'), $state.params.projectName, $filter('translate')('405')]
            });
            vm.component.menuObject.list = [{
                type: 'btn',
                class: 'btn-group-li pull-left',
                showVariable: 'disable',
                showPoint: 'batch',
                btnList: [{
                    name: $filter('translate')('555'),
                    icon: 'tianjia',
                    class: 'eo-button-success',
                    show: false,
                    fun: {
                        default: fun.edit,
                        params: ''
                    }
                }]
            }, {
                type: 'btn',
                showVariable: 'disable',
                showPoint: 'batch',
                class: 'btn-group-li pull-left',
                disabledPoint: 'query',
                disabledVariable: 'length',
                btnList: [{
                    name: $filter('translate')('502'),
                    show: false,
                    fun: {
                        default: fun.batchDefault
                    }
                }, {
                    name: $filter('translate')('13'),
                    icon: 'close',
                    class: 'default-btn first-btn',
                    show: true,
                    fun: {
                        default: function () {
                            vm.component.menuObject.show.batch.disable = false;
                        }
                    }
                }]
            }, {
                type: 'btn',
                showVariable: 'disable',
                showPoint: 'batch',
                class: 'btn-group-li pull-left',
                disabledPoint: 'query',
                disabledVariable: 'length',
                btnList: [{
                    name: $filter('translate')('259'),
                    icon: 'shanchu',
                    show: true,
                    disabled: 0,
                    fun: {
                        default: fun.delete,
                        params: {
                            status: 'batch'
                        }
                    }
                }]
            }];
            vm.component.listDefaultCommonObject = {
                mainObject: {
                    item: {
                        default: [{
                                thType: 'select',
                                keyClass: "eo-width-50",
                                showPoint:"batch",
                                showVariable:"disable",
                                show:true,
                                html: '<label  class="eo-checkbox iconfont" ng-class="{\'icon-check\':item.isClick==true}">{{item.isClick?\'\':\'&nbsp;\'}}</label>',
                                fun: function (arg) {
                                    vm.component.menuObject.show.batch.selectAll = !vm.component.menuObject.show.batch.selectAll;
                                    if (vm.component.menuObject.show.batch.selectAll) {
                                        vm.interaction.response.query.map(function (val, key) {
                                            if (!val.isClick) {
                                                vm.interaction.request.envID.push(val.envID);
                                                vm.data.batch.address.push(key);
                                                val.isClick = true;
                                            }
                                        })
                                    } else {
                                        angular.forEach(vm.data.batch.address, function (val, key) {
                                            vm.interaction.response.query[val].isClick = false;
                                        })
                                        vm.interaction.request.envID = [];
                                        vm.data.batch.address = [];
                                    }
                                },
                            }, {
                                key: $filter('translate')('239'),
                                html: '{{item.envName}}'
                            },
                            {
                                key: $filter('translate')('83'),
                                html: '{{item.envDesc}}'
                            },
                            {
                                key: $filter('translate')('556'),
                                html: '{{item.frontURI}}'
                            }
                        ],
                        fun: {
                            array: [ {
                                key: $filter('translate')('324'),
                                show: -1,
                                fun: fun.edit
                            }, {
                                key: $filter('translate')('259'),
                                show: -1,
                                fun: fun.delete,
                                params: {
                                    status: 'single'
                                }
                            }],
                            keyStyle: {
                                'width': '220px'
                            },
                            power: 'true'
                        }
                    },
                    baseInfo: {
                        colspan: 4,
                        active: 'disable',
                        class: 'hover-tr',
                        warningStyle: {
                            'height': '40px',
                            'line-height': '40px'
                        },
                        warningType: 'customized-html',
                        warning: '<span ng-init="$ctrl.authorityObject.operate?$ctrl.mainObject.baseInfo.colspan=4:$ctrl.mainObject.baseInfo.colspan=3">{{\'557\'|translate}}</span>',
                        operate: 1
                    },
                    baseFun: {
                        click: fun.click
                    }
                },
            }
        }
    }
})();