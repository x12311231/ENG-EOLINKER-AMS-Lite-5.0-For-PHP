(function () {
    /**
     * @name 进行中{{\'386\'|translate}}
     * @author 广州银云信息科技有限公司 
     */
    'use strict';
    angular.module('eolinker')
        .component('homeProjectDefault', {
            templateUrl: 'app/ui/content/home/project/default/index.html',
            controller: indexController
        })

    indexController.$inject = ['RESPONSE_TEXT', '$scope', 'ApiManagementResource', '$state', '$rootScope', 'NavbarService', 'Operate_CommonService', 'Authority_CommonService', 'CODE','$filter'];

    function indexController(RESPONSE_TEXT, $scope, ApiManagementResource, $state, $rootScope, NavbarService, Operate_CommonService, Authority_CommonService, CODE,$filter) {
        var vm = this;
        vm.data = {
            storage: JSON.parse(window.localStorage['ENV_DIRECTIVE_TABLE'] || '{}'),
            status: $state.params.status,
            batch: {
                address: []
            },
            json: $state.params.json || "[]"
        }
        vm.interaction = {
            request: {
                groupID: $state.params.parentGroupID || 0,
                projectType: -1,
                projectID: []
            },
            response: {
                itemNum: null,
                query: null,
                groupQuery: null,
            }
        }
        vm.fun = {};
        vm.service = {
            navbar: NavbarService,
            amsCommon: Operate_CommonService,
            authority: Authority_CommonService
        }
        vm.component = {
            listGroupCommonObject: null,
            menuObject: {
                show: {
                    batch: {
                        disable: false
                    }
                },
                list: null,
            }
        }
        var fun = {};
        vm.fun.init = function () {
            var template = {
                resource: ApiManagementResource.Project.Query,
                request: {
                    projectType: -1
                }
            }
            $rootScope.global.ajax.Query_Project = template.resource(template.request);
            $rootScope.global.ajax.Query_Project.$promise.then(function (response) {
                vm.interaction.response.query = response.projectList || [];
            })
            return $rootScope.global.ajax.Query_Project.$promise;
        }
        fun.import = function () {
            var template = {
                modal: {
                    groupID: vm.interaction.request.groupID,
                    title: $filter('translate')('381'),
                    version: 1
                }
            }
            $rootScope.AMS_ImportModal(template.modal, function (callback) {
                if (callback) {
                    $scope.$broadcast('$Init_LoadingCommonComponent');
                }
            });
        }
        fun.edit = function (arg) {
            var template = {
                queryName: arg.queryName || "query",
                arg: arg || {},
                option: {
                    groupID: vm.interaction.request.groupID,
                    callback: null,
                    mark: 'project'
                }
            }
            template.option.callback = function (input) {
                if (arg.status == 'edit') {
                    vm.interaction.response[template.queryName].splice(template.arg.$index, 1);
                }
                vm.interaction.response[template.queryName].splice(0, 0, input);
            }
            switch (arg.status) {
                case 'add':
                    {
                        template.option.resource = ApiManagementResource.Project.Add;
                        vm.service.amsCommon.outsideObject.fun.operate(arg.status, template.arg, template.option);
                        break;
                    }
                case 'edit':
                    {
                        template.option.resource = ApiManagementResource.Project.Edit;
                        vm.service.amsCommon.outsideObject.fun.operate(arg.status, template.arg, template.option);
                        break;
                    }
            }

        }
        fun.enter = function (arg) {
            var template = {
                param: {
                    projectName: arg.item.projectName,
                    projectID: arg.item.projectID,
                },
                $index: vm.interaction.request.projectID.indexOf(arg.item.projectID)
            }
            vm.service.authority.fun.clear('project');
            vm.service.authority.fun.setPermission('project', {
                permission: {
                    userType: arg.item.userType || 0
                }
            });
            $state.go('home.project.inside.overview', template.param);
        }
        fun.delete = function (arg) {
            var template = {
                queryName: arg.queryName || "query",
                request: {
                    projectID: arg.item.projectID
                },
                loop: {
                    num: 0
                }
            }
            $rootScope.EnsureModal($filter('translate')('382'), true, $filter('translate')('383'), {}, function (callback) {
                if (callback) {
                    ApiManagementResource.Project.Delete(template.request).$promise
                        .then(function (response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {

                                        vm.interaction.response[template.queryName].splice(arg.$index, 1);
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
        /**
         * 项目存档操作函数
         * @param {object} arg {isArchive,item:{projectID},$index}
         */
        vm.$onInit = function () {
            $scope.$emit('$WindowTitleSet', {
                list: [$filter('translate')('386')]
            });
            vm.component.listGroupCommonObject = {
                mainObject: {
                    item: {
                        default: [{
                                key: $filter('translate')('239'),
                                html: '{{item.projectName}}',
                                contentClass: 'item-title-li'
                            },
                            {
                                key: $filter('translate')('335'),
                                html: 'V&nbsp;{{item.projectVersion}}',
                                contentClass: 'eo-width-120',
                                keyClass: 'eo-width-120'
                            },
                            {
                                key: $filter('translate')('44'),
                                contentClass: 'eo-width-120',
                                html: '<span ng-switch-when=0>Web</span><span ng-switch-when=1>App</span><span ng-switch-when=2>PC</span><span ng-switch-when=3>{{\'175\'|translate}}</span><span ng-switch-when=4>{{\'176\'|translate}}</span>',
                                switch: 'projectType',
                                keyClass: 'eo-width-120'
                            },
                            {
                                key: $filter('translate')('387'),
                                html: '{{item.projectUpdateTime}}',
                                contentClass: 'unnecessary-td eo-width-170',
                                keyClass: 'eo-width-170'
                            }
                        ],
                        fun: {
                            array: [{
                                    key: $filter('translate')('324'),
                                    show: -1,
                                    fun: fun.edit,
                                    params: {
                                        status: 'edit',
                                    }
                                },
                                {
                                    key: $filter('translate')('259'),
                                    show: -1,
                                    fun: fun.delete,
                                }
                            ],
                            contentClass: 'eo-width-250',
                            keyClass: 'eo-width-250',
                            power: 'true',
                            hideKey: "item.userType>1",
                        }
                    },
                    baseInfo: {
                        active: 'disable',
                        class: 'hover-tr',
                        colspan: 4,
                        operate: 1,
                        warningType: 'customized-html',
                        warning: '<span >{{\'388\'|translate}}</span>'
                    },
                    baseFun: {
                        click: fun.enter
                    }
                },
            }
            vm.component.menuObject.list = [{
                type: 'btn',
                class: 'btn-group-li pull-left',
                btnList: [{
                    name: $filter('translate')('333'),
                    icon: 'tianjia',
                    class: 'eo-button-success',
                    fun: {
                        default: fun.edit,
                        params: {
                            status: 'add'
                        }
                    }
                }, {
                    name: $filter('translate')('381'),
                    icon: 'shangchuan',
                    fun: {
                        default: fun.import
                    }
                }]
            }]
        }
    }
})();