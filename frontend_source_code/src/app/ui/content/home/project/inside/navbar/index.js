(function () {
    /**
     * @name API研发管理内页侧边栏
     * @author 广州银云信息科技有限公司
     **/
    angular.module('eolinker')
        .component('homeProjectInsideNavbar', {
            template: '<sidebar-common-component power-object="$ctrl.service.authority.permission.project" main-object="$ctrl.component.sidebarCommonObject.mainObject" plugin-list="$ctrl.service.pro.info.pluginList"></sidebar-common-component>',
            controller: indexController
        })

    indexController.$inject = ['$scope', '$state', 'Authority_CommonService','$rootScope','$filter'];

    function indexController($scope, $state, Authority_CommonService,  $rootScope,$filter) {
        var vm = this;
        vm.component={
            sidebarCommonObject: {}
        }
        vm.service = {
            authority: Authority_CommonService
        }
        var data={
            menu: []
        },fun = {};
        vm.$onInit = function () {
            data.menu = [{
                    base: '/overview',
                    name: $filter('translate')('399'),
                    sref: 'home.project.inside.overview',
                    icon: 'icon-tongjibaobiao',
                    power: -1
                },
                {
                    base: '/api/',
                    name: $filter('translate')('400'),
                    sref: 'home.project.inside.api',
                    icon: 'icon-api',
                    childSref: 'home.project.inside.api.list',
                    power: 'apiManagement',
                    params: {
                        groupID: -1,
                        childGroupID: null,
                        grandSonGroupID: null
                    }
                },
                {
                    base: '/code',
                    name: $filter('translate')('401'),
                    sref: 'home.project.inside.code',
                    childSref: 'home.project.inside.code.list',
                    icon: 'icon-icocode',
                    power: 'statusCode',
                    params: {
                        groupID: -1,
                        childGroupID: null,
                        grandSonGroupID: null
                    }
                },
                {
                    base: '/env',
                    name: $filter('translate')('402'),
                    sref: 'home.project.inside.env',
                    childSref: 'home.project.inside.env.default',
                    icon: 'icon-waibuhuanjing',
                    power: -1,
                    status: 'un-spreed',
                    divide: 3
                }, {
                    base: '/team',
                    name: $filter('translate')('403'),
                    sref: 'home.project.inside.team',
                    icon: 'icon-zuzhijigou',
                    childSref: 'home.project.inside.team',
                    power: -1
                },
                {
                    base: '/log',
                    name: $filter('translate')('404'),
                    sref: 'home.project.inside.log',
                    icon: 'icon-gongzuojihua',
                    power: -1,
                    status: 'un-spreed',
                }
            ];
            vm.component.sidebarCommonObject = {
                mainObject: {
                    baseInfo: {
                        menu: data.menu,
                        class: 'inside-sidebar',
                        navigation: [{
                            name: $filter('translate')('405'),
                            sref: 'home.project.default'
                        }, {
                            name: $state.params.projectName
                        }],
                        staticQuery: [{
                            name: $filter('translate')('406'),
                            sref: 'home.project.default',
                            icon: 'icon-huidaodingbu-copy',
                        }]
                    }
                }
            }
        }
    }

})();