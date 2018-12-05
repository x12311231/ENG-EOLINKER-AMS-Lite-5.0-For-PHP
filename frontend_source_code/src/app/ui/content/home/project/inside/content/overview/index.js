(function () {
    /**
     * @name {{\'399\'|translate}}
     * @author 广州银云信息科技有限公司 
     */
    'use strict';
    angular.module('eolinker')
        .component('homeProjectInsideOverview', {
            templateUrl: 'app/ui/content/home/project/inside/content/overview/index.html',
            controller: indexController
        })

    indexController.$inject = ['$scope', 'ApiManagementResource', '$state', '$rootScope', 'Cache_CommonService', 'Authority_CommonService', 'Operate_CommonService','$filter'];

    function indexController($scope, ApiManagementResource, $state, $rootScope, Cache_CommonService, Authority_CommonService, Operate_CommonService,$filter) {

        var vm = this;
        vm.interaction = {
            request: {
                spaceKey: $state.params.spaceKey,
                projectID: $state.params.projectID
            },
            response: {
                projectInfo: null
            }
        };
        vm.component = {
            plugApiStatusStatisticsObject: {
                array: [{
                        name: $filter('translate')('58'),
                        value: 0,
                        class: 'success',
                        count: 0
                    },
                    {
                        name: $filter('translate')('60'),
                        value: 1,
                        class: 'warning',
                        count: 0
                    },
                    {
                        name: $filter('translate')('62'),
                        value: 2,
                        class: 'tips',
                        count: 0
                    },
                    {
                        name: $filter('translate')('64'),
                        value: 3,
                        class: 'yellow',
                        count: 0
                    },
                    {
                        name: $filter('translate')('59'),
                        value: 4,
                        class: 'default',
                        count: 0
                    },
                    {
                        name: $filter('translate')('61'),
                        value: 5,
                        class: 'default',
                        count: 0
                    },
                    {
                        name: $filter('translate')('63'),
                        value: 6,
                        class: 'default',
                        count: 0
                    },
                    {
                        name: 'BUG',
                        value: 7,
                        class: 'danger',
                        count: 0
                    },
                    {
                        name: $filter('translate')('65'),
                        value: 8,
                        class: 'purple',
                        count: 0
                    }
                ],
                totalCount: 0

            }
        }
        vm.fun = {};
        vm.service = {
            authority: Authority_CommonService,
            common: Operate_CommonService,
            cache: Cache_CommonService,
        }
        vm.fun.init = function () {
            var template = {
                promise: null,
                request: {
                    spaceKey: vm.interaction.request.spaceKey,
                    projectID: vm.interaction.request.projectID
                }
            }
            $scope.$emit('$WindowTitleSet', {
                list: [$filter('translate')('399'), $state.params.projectName, $filter('translate')('405')]
            });
            template.promise = ApiManagementResource.Project.Detail(template.request).$promise
                .then(function (response) {
                    vm.interaction.response.projectInfo = response || {};
                    try {
                        vm.component.plugApiStatusStatisticsObject.totalCount=vm.interaction.response.projectInfo.apiCount;
                        for (var key in vm.interaction.response.projectInfo.apiStatusList) {
                            vm.component.plugApiStatusStatisticsObject.array[key].count = vm.interaction.response.projectInfo.apiStatusList[key];
                        }
                    } catch (e) {}
                    vm.service.cache.set(response, 'projectInfo');
                })
            return template.promise;
        }
        vm.fun.menu = function (arg) {
            switch (arg.switch) {
                case 0:
                    {
                            $state.go('home.project.inside.api.list', {
                                groupID: -1
                            });
                        break;
                    }
                case 1:
                    {
                            $state.go('home.project.inside.code.list', {
                                groupID: -1
                            });
                        break;
                    }
                case 2:
                    {
                        $state.go('home.project.inside.log');
                        break;
                    }
                case 3:
                    {
                        $state.go('home.project.inside.team');
                        break;
                    }
            }
        }
        vm.fun.dump = function () {
            var template = {
                modal: {
                    title: $filter('translate')('189'),
                    spaceKey: vm.interaction.request.spaceKey,
                    resource: ApiManagementResource.Project,
                    envList: vm.interaction.response.projectInfo.envList,
                    mark: 'full'
                }
            }
            $rootScope.AMS_ExportModal(template.modal, function (callback) {});
        }

    }
})();