(function () {
    'use strict';
    /*
     * author：广州银云信息科技有限公司
     * 上传文件重置指令js
     */
    angular.module('eolinker.directive')

        .directive('checkPlugDirective', ['$timeout', function ($timeout) {
            return {
                restrict: 'AE',
                scope: {
                    input: '='
                },
                link: function ($scope, elem, attrs, ctrl) {
                    var data = {
                        timer:null
                    }
                    var fun={};
                    fun.init = (function () {
                        try{
                            $scope.input.version=0;
                        }catch(e){}
                        if (navigator.mimeTypes['application/eolinker'] || (window.plug && window.plug.type == "application/eolinker")) {
                            if ($scope.input.needVersion) {
                                try {
                                    $scope.input.version = window.plug.version;
                                    $scope.input.matchVersion=$scope.input.matchVersion||451;
                                    $scope.input.useStatus = $scope.input.version >= ($scope.input.matchVersion||451);
                                    $scope.input.versionString = JSON.stringify(window.plug.version).split('').join('.');
                                    return;
                                } catch (e) {}
                            } else {
                                if($scope.input.number){
                                    $scope.input.useStatus =1;
                                }else{
                                    $scope.input.useStatus =true;
                                }
                                return;
                            }
                        }
                        angular.element(document.getElementById('plug-inner-script')).bind('DOMNodeInserted', function (e) {
                            $scope.input.version = window.plug.version;
                            $scope.input.matchVersion=$scope.input.matchVersion||451;
                            if ($scope.input.needVersion) {
                                $scope.input.useStatus = $scope.input.version >= $scope.input.matchVersion;
                            }else{
                                if($scope.input.number){
                                    $scope.input.useStatus =1;
                                }else{
                                    $scope.input.useStatus =true;
                                }
                            }
                            $scope.input.versionString = JSON.stringify(window.plug.version).split('').join('.');
                            $scope.$root && $scope.$root.$$phase || $scope.$apply();
                        });
                        if(!$scope.input.number){
                            data.timer=$timeout(function () {
                                $scope.input.useStatus=$scope.input.useStatus||false;
                            },1000);
                        }
                        
                    })()
                    $scope.$on('$destroy', function () { //页面销毁功能函数
                        if (data.timer) {
                            $timeout.cancel(data.timer);
                        }
                    });
                }
            };
        }]);
})();