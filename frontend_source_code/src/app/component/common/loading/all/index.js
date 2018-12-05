(function() {
    'use strict';

    /**
     * loading加载组件
     * @param {function} fun 绑定方法
     * @param {object} interaction 交互参数
     */
    angular.module('eolinker')
        .component('loadingCommonComponent', {
            template: '<div class="loading-content" ng-hide="$ctrl.data.isEnd"><div class="loading"><ul><li><div><span class="iconfont  icon-loading"></span></div>{{\'374\'|translate}}</li></ul></div></div>',
            controller: indexController,
            bindings: {
                fun: '&',
                interaction: '<'
            }
        })

    indexController.$inject = ['$scope', '$state'];

    function indexController($scope, $state) {
        var vm = this;
        var data = {
            broadcast: null
        },fun={};
        vm.data = {
            isEnd: true
        }
        fun.dataProcessing = function(arg) {
            vm.data.isEnd = false;
            var template = {
                promise: vm.fun({ arg: arg })
            }
            if (template.promise) {
                template.promise.finally(function() {
                    vm.data.isEnd = true;
                })
            } else {
                vm.data.isEnd = true;
            }
        }
        fun.$LoadingInit = function(_default, arg) {
            fun.dataProcessing(arg);
        }
        fun.$Destory = function() {
            data.broadcast();
        }
        vm.$onInit = function(arg) {
            vm.interaction=vm.interaction||{ request: {}, response: {} };
            if (!vm.interaction.request.delay) {
                fun.dataProcessing(arg);
            }
            data.broadcast = $scope.$on('$Init_LoadingCommonComponent', fun.$LoadingInit);
            $scope.$on('$destroy', fun.$Destory);
        }

    }
})();
