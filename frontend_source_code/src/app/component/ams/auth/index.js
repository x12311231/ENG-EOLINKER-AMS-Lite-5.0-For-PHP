(function () {
    'use strict';
    /**
     * @author 广州银云信息科技有限公司
     * @description 鉴权组件
     * @param {object} disableObject 禁用变量
     * @param {object} authObject 绑定主体
     */
    angular.module('eolinker')
        .component('authAmsComponent', {
            templateUrl: 'app/component/ams/auth/index.html',
            controller: indexController,
            bindings: {
                disableObject: '<',
                authObject: '='
            }
        })

    indexController.$inject = ['$scope', '$state'];

    function indexController($scope, $state) {
        var vm = this;
        vm.fun = {};
        var data = {
            basicAuth: {
                username: '',
                password: ''
            },
            jwtAuth: {
                typ: 'JWT',
                alg: 'HS256',
                payload: '',
                secretSalt: '',
                position: 'header',
                tokenName: ''
            }
        }
        vm.fun.changeAuthType = function () {
            switch (vm.authObject.status) {
                case '1':
                    {
                        vm.authObject.basicAuth = vm.authObject.basicAuth || data.basicAuth;
                        break;
                    }
                case '2':
                    {
                        vm.authObject.jwtAuth = vm.authObject.jwtAuth || data.jwtAuth;
                        break;
                    }
            }
        }
    }
})();