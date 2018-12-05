(function () {
    /**
     * @name 项目容器
     * @author 广州银云信息科技有限公司 
     */

    'use strict';
    angular.module('eolinker')
        .component('homeProjectInside', {
            templateUrl: 'app/ui/content/home/project/inside/index.html',
            controller: indexController
        })

    indexController.$inject = ['$scope', 'ApiManagementResource', '$state', 'Authority_CommonService'];

    function indexController($scope, ApiManagementResource, $state, Authority_CommonService) {

        var vm = this;
        vm.data = {
            info: {
            },
            interaction: {
                request: {
                    projectID: $state.params.projectID,
                    projectName: $state.params.projectName,
                }
            },
            fun: {
                init: null,
                assistant: {},
            }
        }
        vm.service = {
            authority: Authority_CommonService
        };
        vm.data.fun.init = (function () {
            var template = {
                request: {
                    projectID: vm.data.interaction.request.projectID,
                },
                power: false,
                uri: ''
            }
            $scope.$emit('$Home_ShrinkSidebar', {
                shrink: false
            });
            if (vm.service.authority.permission.project) return;
            ApiManagementResource.Project.GetProjectPermission(template.request).$promise.then(function (response) {
                vm.service.authority.fun.setPermission('project', {
                    permission: response.permission || {}
                });
            })
        })();
    }
})();