(function () {
    /**
     * @name API接口容器
     * @author 广州银云信息科技有限公司 
     */
    'use strict';
    angular.module('eolinker')
        .component('homeProjectInsideApi', {
            template: '<home-project-inside-api-sidebar></home-project-inside-api-sidebar>' +
                '<div>' +
                '    <header ng-show="$ctrl.data.status!=-1&&$ctrl.data.envStatus==\'show\'">' +
                '        <ul>' +
                '            <li class="env-li">' +
                '                <env-ams-component mark="projectPro" env-model="$ctrl.service.home.envObject.object.model" env-param="$ctrl.service.home.envObject.object.param" total-env="$ctrl.service.home.envObject.object.total"  input-object="$ctrl.component.envAms" ></env-ams-component>' +
                '            </li>' +
                '        </ul>' +
                '    </header>' +
                '    <div ui-view></div>' +
                '</div>',
            controller: indexController
        })

    indexController.$inject = ['$scope', '$state', 'Operate_CommonService', 'Group_AmsCommonService', 'Authority_CommonService', 'Cache_CommonService','ApiManagementResource'];

    function indexController($scope, $state, Operate_CommonService, Group_AmsCommonService, Authority_CommonService, Cache_CommonService,ApiManagementResource) {
        var vm = this;
        vm.data = {
            sidebarShow: false,
            status: 0,
            envStatus: 'show'
        }
        vm.service = {
            home: Operate_CommonService,
            authority: Authority_CommonService
        }
        vm.component={
            envAms:{
                resource:ApiManagementResource
            }
        }
        var fun = {},
            service = {
                group: Group_AmsCommonService,
                cache: Cache_CommonService,
            };
        fun.initEnv = function () {
            var template = {
                modelType: $state.current.name == 'home.project.inside.api.list' ? [] : {}
            }
            vm.service.home.envObject.fun.resetObject(template.modelType);
            vm.data.envStatus = 'show';
            switch ($state.current.name) {
                case 'home.project.inside.api.list':
                case 'home.project.inside.api.detail':
                case 'home.project.inside.api.test':
                case 'home.project.inside.api.case':
                    {
                        vm.data.status = 0;
                        break;
                    }
                default:
                    {
                        vm.data.status = -1;
                        break;
                    }
            }
        }
        vm.$onInit = function () {
            service.cache.clear('Common_Function_List');
            service.group.fun.clear();
            fun.initEnv();
            $scope.$on('$stateChangeSuccess', fun.initEnv);
        }
    }
})();