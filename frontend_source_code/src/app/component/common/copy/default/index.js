(function () {
    'use strict';
    /*
     * author：广州银云信息科技有限公司
     * 复制input值到剪贴板js（欠缺及需优化地：样式需要自己个项目调控，无法做到自定义样式模板）
     */

    angular.module('eolinker')
        .component('copyDefaultCommonComponent', {
            template: '<inner-html-common-directive html="$ctrl.data.html"></inner-html-common-directive>',
            bindings: {
                copyModel: '<',
                buttonHtml: '@',
                isPopup: '@',
                switchTemplet: '@'
            },
            controller: indexController
        });

    indexController.$inject = ['$rootScope', '$scope','$filter'];

    function indexController($rootScope, $scope,$filter) {
        var vm = this;
        var data = {
                templet: {
                    button: '<button class="eo-button-default copy-default-common-component-' + $scope.$id + '" data-clipboard-text="{{$ctrl.copyModel}}"><span class=\"iconfont icon-copy\" ><\/span>{{$ctrl.data.clipboard.text}}</button>',
                    input: '<input autocomplete="off" type="text" id="copy-default-common-component-' + $scope.$id + '" name="link" value="{{$ctrl.copyModel}}" class="eo-input copy-default-common-component-' + $scope.$id + '" data-clipboard-action="copy" data-clipboard-target="#copy-default-common-component-' + $scope.$id + '" ng-class="{\'eo-copy\':($ctrl.data.clipboard.success)&&($ctrl.data.clipboard.isClick)}" data-ng-click="$ctrl.fun.click()" readonly>' + '<label for="copy-default-common-component-' + $scope.$id + '" class="pull-right copy-tips " ng-class="{\'copy-success\':($ctrl.data.clipboard.success)&&($ctrl.data.clipboard.isClick),\'copy-error\':(!$ctrl.data.clipboard.success)&&($ctrl.data.clipboard.isClick)}">' + '{{$ctrl.data.clipboard.text}}' + '</label>',
                    textarea: '<textarea id="copy-default-common-component-' + $scope.$id + '" readonly>{{$ctrl.copyModel}}</textarea><button data-clipboard-action="copy" data-clipboard-target="#copy-default-common-component-' + $scope.$id + '">{{$ctrl.data.clipboard.text}}</button>'
                },
                clipboard: null
            },
            fun = {};
        vm.data = {
            html: null,
            clipboard: {
                isClick: false,
                success: false,
                text: vm.buttonHtml || $filter('translate')('310') //显示button文本（默认文本\'310\'|translate）
            }
        }
        vm.fun = {};
        fun.reset = function (arg) {
            data.clipboard = new Clipboard(arg.class);
            data.clipboard.on('success', function (_default) {
                vm.data.clipboard.success = true;
                vm.data.clipboard.isClick = true;
                if (vm.isPopup) { //成功或者失败是否以弹窗形式提醒
                    $rootScope.InfoModal($filter('translate')('312'), 'success');
                } else {
                    vm.data.clipboard.text = $filter('translate')('312');
                }
                $scope.$root && $scope.$root.$$phase || $scope.$apply();
                _default.clearSelection();
            });

            data.clipboard.on('error', function (_default) {
                vm.data.clipboard.success = false;
                vm.data.clipboard.isClick = true;
                if (vm.isPopup) {
                    $rootScope.InfoModal($filter('translate')('302'), 'error');
                } else {
                    vm.data.clipboard.text = $filter('translate')('302');
                }
                $scope.$root && $scope.$root.$$phase || $scope.$apply();
            });
        }
        vm.fun.click = function () {
            vm.data.clipboard.isClick = false;
        }
        fun.$destroy = function () {
            data.clipboard.destroy();
        }
        vm.$onInit = function () {
            switch (vm.switchTemplet) { //选择模板（0：button模板，1：input模板，2：textarea模板，默认input模板）
                case '0':
                    {
                        vm.data.html = data.templet.button;
                        break;
                    }
                case '1':
                    {
                        vm.data.html = data.templet.input;
                        break;
                    }
                case '2':
                    {
                        vm.data.html = data.templet.textarea;
                        break;
                    }
                default:
                    {
                        vm.data.html = data.templet.input;
                        break;
                    }
            }
            $scope.$on('$destroy', fun.$destroy);
            fun.reset({
                class: ('.copy-default-common-component-' + $scope.$id)
            });
        }
    }
})();