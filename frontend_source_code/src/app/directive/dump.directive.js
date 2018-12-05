(function () {
    'use strict';
    /*
     * author：广州银云信息科技有限公司
     * 导出文件指令js
     */
    angular.module('eolinker.directive')

        .directive('dumpDirective', [function () {
            return {
                restrict: 'AE',
                transclude: true,
                template: '<a class="eo-export {{interaction.request.class}}" ng-click="fun.dump()"><p>{{interaction.request.text}}</p></a><loading-common-component fun="dumpDirective(arg)" interaction="{request:{delay:true}}"></loading-common-component>',
                scope: {
                    interaction: '<',
                    dumpDirective: '&'
                },
                link: function ($scope, elem, attrs, ctrl) {
                    $scope.data = {
                        elem: document.getElementById('dump-directive_js')
                    };
                    $scope.fun={};
                    var data = {
                        broadcast: null
                    },fun={};
                    $scope.fun.dump = function () {
                        $scope.$broadcast('$Init_LoadingCommonComponent', {
                            arg: {
                                switch: $scope.interaction.request.switch
                            }
                        });
                    }
                    fun.$DumpDirective_Click = function (_default, arg) {
                        $scope.data.elem.href = './server/dump/' + arg.response.fileName;
                        $scope.data.elem.download = arg.fileName || arg.response.fileName;
                        $scope.data.elem.click();
                    }
                    fun.$Destory = function () {
                        data.broadcast();
                    }
                    fun.init = (function () {
                        $scope.interaction = $scope.interaction || {
                            request: {}
                        };
                        data.broadcast = $scope.$on('$DumpDirective_Click_' + ($scope.interaction.request.broadcast || $scope.interaction.request.switch || ''), fun.$DumpDirective_Click);
                        $scope.$on('$destroy', fun.$Destory);
                    })()
                }
            };
        }]);
})();