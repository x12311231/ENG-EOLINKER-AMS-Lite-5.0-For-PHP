(function () {
    'use strict';
    /**
     * @name {{\'416\'|translate}}日志
     * @author 广州银云信息科技有限公司
     */
    angular.module('eolinker')
        .component('homeProjectInsideLog', {
            template: '<div class="apimanagement-scss-account-log">' +
                '<list-default-common-component main-object="$ctrl.component.listDefaultCommonObject.mainObject" list="$ctrl.data.interaction.response.query"></list-default-common-component>' +
                '<footer class="pageFooter" ng-if="$ctrl.data.interaction.response.query.length>0">' +
                '    <uib-pagination total-items="$ctrl.data.info.pagination.msgCount" items-per-page="$ctrl.data.info.pagination.pageSize" ng-model="$ctrl.data.info.pagination.page" max-size="$ctrl.data.info.pagination.maxSize" class="pagination-sm " boundary-link-Number="true" rotate="false" next-text="&#xe684;" previous-text="&#xe685;" ng-change="$ctrl.data.fun.pageChanged()"></uib-pagination>' +
                '</footer>' +
                '<loading-common-component fun="$ctrl.data.fun.init(arg)"></loading-common-component>' +
                '</div>',
            controller: indexController
        })

    indexController.$inject = ['$rootScope', '$scope', 'ApiManagementResource', 'Authority_CommonService', '$state', 'CODE','$filter'];

    function indexController($rootScope, $scope, ApiManagementResource, Authority_CommonService, $state, CODE,$filter) {
        var vm = this;
        vm.service = {
            authority: Authority_CommonService
        }
        vm.data = {
            info: {
                pagination: {
                    pages: '',
                    maxSize: 5,
                    pageSize: 15,
                    page: 1,
                    msgCount: 0,
                    jumpPage: ""
                }
            },
            interaction: {
                request: {
                    spaceKey: $state.params.spaceKey,
                    projectID: $state.params.projectID,
                    page: $state.params.page || 1,
                },
                response: {
                    query: null
                },
            },
            fun: {
                init: null, //初始化功能函数
                pageChange: null //页面更改功能函数
            }
        }
        var assistantFun = {};
        vm.component = {
            listDefaultCommonObject: null,
            menuObject: {
                list: null,
                otherObject: null
            }
        }
        vm.data.fun.init = function () {
            var template = {
                request: {
                    spaceKey: vm.data.interaction.request.spaceKey,
                    projectID: vm.data.interaction.request.projectID,
                    page: vm.data.interaction.request.page,
                    pageSize: vm.data.info.pagination.pageSize,
                }
            }
            $scope.$emit('$WindowTitleSet', {
                list: [$filter('translate')('404'), $state.params.projectName, $filter('translate')('405')]
            });
            $rootScope.global.ajax.GetProjectLogList_Project = ApiManagementResource.Project.GetProjectLogList(template.request);
            $rootScope.global.ajax.GetProjectLogList_Project.$promise.then(function (response) {
                vm.data.info.pagination.page = template.request.page;
                vm.data.interaction.response.query = response.logList || [];
                vm.data.info.pagination.msgCount = response.logCount || 1;
            })
            return $rootScope.global.ajax.GetProjectLogList_Project.$promise;
        }
        vm.data.fun.pageChanged = function () {
            $state.go('home.project.inside.log', {
                page: vm.data.info.pagination.page
            });
        }
        vm.$onInit = function () {
            vm.component.listDefaultCommonObject = {
                mainObject: {
                    item: {
                        default: [{
                                key: $filter('translate')('254'),
                                html: '{{item.opTime}}',
                                keyStyle: {
                                    'width': '200px'
                                }
                            },
                            {
                                key: $filter('translate')('44'),
                                html: '<span ng-switch-when=0>{{\'325\'|translate}}</span><span ng-switch-when=1>{{\'324\'|translate}}</span><span ng-switch-when=2>{{\'259\'|translate}}</span><span ng-switch-when=3>{{\'176\'|translate}}</span>',
                                keyStyle: {
                                    'width': '60px'
                                },
                                switch: 'opType'
                            },
                            {
                                key: $filter('translate')('415'),
                                keyStyle: {
                                    'width': '150px'
                                },
                                html: '<span ng-switch-when=0>{{\'416\'|translate}}</span><span ng-switch-when=1>{{\'417\'|translate}}</span><span ng-switch-when=2>{{\'418\'|translate}}</span><span ng-switch-when=3>{{\'68\'|translate}}</span><span ng-switch-when=4>{{\'66\'|translate}}</span><span ng-switch-when=5>{{\'402\'|translate}}</span><span ng-switch-when=6>{{\'419\'|translate}}</span><span ng-switch-when=7>{{\'420\'|translate}}</span><span ng-switch-when=8>{{\'421\'|translate}}</span>',
                                switch: 'opTarget'
                            },
                            {
                                key: $filter('translate')('255'),
                                keyStyle: {
                                    'width': '150px'
                                },
                                html: '{{item.operator}}',
                                contentClass: 'unnecessary-td'
                            },
                            {
                                key: $filter('translate')('69'),
                                html: '{{item.opDesc}}',
                                title: '{{item.opDesc}}',
                                contentClass: 'unnecessary-td'
                            }
                        ]
                    },
                    baseInfo: {
                        colspan: 5,
                        warning: $filter('translate')('422'),
                        style: {
                            cursor: 'default'
                        }
                    }
                }
            }
        }
    }
})();