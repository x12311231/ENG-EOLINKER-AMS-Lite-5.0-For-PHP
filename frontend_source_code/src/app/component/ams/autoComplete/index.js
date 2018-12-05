(function () {
    'use strict';
    /**
     * @author 广州银云信息科技有限公司
     * @description 自动匹配组件
     * @extends {string} placeholder 内置输入框placeholder内容[optional]
     * @extends {string} expressionBuilder 是否有构造器功能[optional](默认无)
     * @extends {string} addClass 输入框外置样式[optional]
     * @extends {array} array 预设列表
     * @extends {string} model 输入框绑定对象
     * @extends {string} type 输入对象类型
     * @extends {function} inputChangeFun 输入框预设函数[optional]
     */
    angular.module('eolinker')
        .component('autoCompleteAmsComponent', {
            template: '<div ng-mouseover="$ctrl.mouseLeave=false" ng-mouseleave="$ctrl.mouseLeave=true">' +
                '<input autocomplete="off" placeholder="{{$ctrl.placeholder || \'\'}}" ng-class="{\'eo-input-error\':$ctrl.required&&!$ctrl.model[$ctrl.keyName]}" class="eo-input {{$ctrl.addClass || \'\'}}" ng-model="$ctrl.model[$ctrl.keyName]" ng-change="$ctrl.fun.modelChange()" ng-blur="$ctrl.fun.modelBlur({focus:$ctrl.data})" ng-focus="$ctrl.fun.focus($event)" ng-keydown="$ctrl.fun.keydown($event)" ng-readonly="$ctrl.readOnly"><span ng-show="$ctrl.data.isFocus&&$ctrl.expressionBuilder" class="cp iconfont icon-index-magicwand" ng-click="$ctrl.fun.expressionBuilder()"></span><label class="cp iconfont icon-xiangxia" ng-click="$ctrl.fun.changeSwitch($event)"></label>' +
                '<div class="auto-complete-message" ng-show="$ctrl.data.view.isShow" style=" width:{{$ctrl.data.elem.clientWidth}}px">' +
                '    <ul>' +
                '        <li class="auto-complete-li" ng-repeat="item in $ctrl.data.array.filter track by $index" ng-click="$ctrl.fun.changeText(item)">{{item}}</li>' +
                '    </ul>' +
                '</div>' +
                '</div>',
            controller: indexController,
            bindings: {
                readOnly: '<',
                placeholder: '@',
                expressionBuilder: '@',
                addClass: '@',
                keyName: '@',
                required: "<",
                array: '<', //自定义数组填充数组
                model: '=', //输入框绑定
                inputChangeFun: '&', //输入框值改变绑定功能函数
            }
        })

    indexController.$inject = ['$scope', '$rootScope'];

    function indexController($scope, $rootScope) {
        var vm = this;
        vm.data = {
            array: {
                filter: []
            },
            input: {
                isFocus: false,
            },
            view: {
                isShow: false
            },
            isFocus: false,
            expressionBuilderObject: {
                request: {},
                response: {}
            },
            elem: null
        };
        vm.fun = {};
        var data = {
                html: '',
                timer: null,
                keydown: {
                    preCount: -1,
                    count: -1,
                    elem: null,
                    originParent: null,
                    originElem: null,
                }
            },
            fun = {};
        vm.fun.expressionBuilder = function (arg) {
            vm.data.expressionBuilderObject.request.constant = vm.model[vm.keyName];
            $rootScope.ExpressionBuilderModal(vm.data.expressionBuilderObject, function (callback) {
                vm.model[vm.keyName] = callback.response.result || vm.model[vm.keyName];
                vm.data.expressionBuilderObject = callback;
            });
        }
        vm.fun.modelChange = function () {
            vm.data.view.isShow = true;
            vm.inputChangeFun();
            if (vm.model[vm.keyName]) {
                vm.data.array.filter = [];
                var template = {
                    count: 0
                }
                angular.forEach(vm.array, function (val, key) {
                    var pattern = '/^' + vm.model[vm.keyName].toLowerCase() + '/';
                    try {
                        if (eval(pattern).test(val.toLowerCase())) {
                            vm.data.array.filter.splice(template.count, 0, val);
                            template.count++;
                        } else if (val.toLowerCase().indexOf(vm.model[vm.keyName].toLowerCase()) > -1) {
                            vm.data.array.filter.push(val);
                        }
                    } catch (e) {
                        console.log(e)
                    }
                })
                if (vm.data.array.filter.length <= 0) {
                    vm.data.view.isShow = false;
                }
            } else {
                vm.data.array.filter = vm.array;
            }
        }
        vm.fun.changeSwitch = function ($event) {
            var template={
                node:null
            }
            if (vm.readOnly) return;
            if (!data.keydown.originParent) {
                template.node=$event.target.parentNode.children[0];
                vm.data.elem = template.node;
                data.keydown.originParent = template.node.nextElementSibling.nextElementSibling.nextElementSibling;
                data.keydown.originElem = template.node.nextElementSibling.nextElementSibling.nextElementSibling.children[0];
            }
            vm.data.elem.focus();
            vm.data.view.isShow = !vm.data.view.isShow;
            if (vm.data.view.isShow) {
                vm.data.array.filter = vm.array;
            }
        }
        vm.fun.changeText = function (info) {
            vm.model[vm.keyName] = info;
            vm.data.view.isShow = false;
            vm.inputChangeFun();
            fun.reset();
        }
        vm.fun.modelBlur = function (arg) {
            setTimeout(function () { //进行延时处理，时间单位为千分之一秒
                arg.focus.isFocus = false;
                $scope.$root && $scope.$root.$$phase || $scope.$apply();
            }, 500)
            if (vm.mouseLeave) {
                vm.data.view.isShow = false;
                fun.reset();
            }
        }
        fun.reset = function () {
            data.keydown.originParent.scrollTop = 0;
            data.keydown.count = -1;
            if (data.keydown.elem) {
                data.keydown.elem.style.backgroundColor = null;
            }
            $scope.$root && $scope.$root.$$phase || $scope.$apply();

        }
        vm.fun.focus = function ($event) {
            vm.data.isFocus = true;
            if (!data.keydown.originParent) {
                vm.data.elem = $event.target;
                data.keydown.originParent = $event.target.nextElementSibling.nextElementSibling.nextElementSibling;
                data.keydown.originElem = $event.target.nextElementSibling.nextElementSibling.nextElementSibling.children[0];
            }
        }
        vm.fun.keydown = function (_default) {
            switch (_default.keyCode) {
                case 38: // up
                case 40: // down
                    {
                        _default.preventDefault();
                        if (!vm.data.view.isShow) return;
                        var template = {
                            parent: data.keydown.originParent,
                            origin: data.keydown.originElem
                        };
                        data.keydown.preCount = data.keydown.count;
                        if (data.keydown.elem) {
                            data.keydown.elem.style.backgroundColor = null;
                        }
                        switch (_default.keyCode) {
                            case 38:
                                {
                                    if (data.keydown.count == -1 || data.keydown.count == 0) {
                                        data.keydown.count = template.origin.childElementCount - 1;
                                    } else {
                                        data.keydown.count--;
                                    }
                                    data.keydown.elem = angular.element(template.origin.children[data.keydown.count])[0];
                                    data.keydown.elem.style.backgroundColor = '#f5f5f5';
                                    if (data.keydown.count < data.keydown.preCount) {
                                        template.parent.scrollTop = (data.keydown.count - 4) * data.keydown.elem.offsetHeight;
                                    } else {
                                        template.parent.scrollTop = data.keydown.count * data.keydown.elem.offsetHeight;
                                    }
                                    return false;
                                }
                            case 40:
                                {
                                    if (data.keydown.count == (template.origin.childElementCount - 1)) {
                                        data.keydown.count = 0;
                                    } else {
                                        data.keydown.count++;
                                    }
                                    data.keydown.elem = angular.element(template.origin.children[data.keydown.count])[0];
                                    data.keydown.elem.style.backgroundColor = '#f5f5f5';
                                    if (data.keydown.count > 4) {
                                        template.parent.scrollTop = (data.keydown.count - 4) * data.keydown.elem.offsetHeight;
                                    } else if (data.keydown.count < data.keydown.preCount) {
                                        template.parent.scrollTop = 0;
                                    }
                                    return false;
                                }
                        }
                        break;
                    }
                case 13:
                    { //enter
                        _default.preventDefault();
                        if (data.keydown.elem) {
                            vm.fun.changeText(data.keydown.elem.innerText);
                        }
                        return false;
                    }
            }
        }
    }
})();