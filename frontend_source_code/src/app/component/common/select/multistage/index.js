(function () {
    'use strict';
    /**
     * @author 广州银云信息科技有限公司
     * @description 多级下拉菜单
     */

    angular.module('eolinker')
        .component('selectMultistageCommonComponent', {
            templateUrl: 'app/component/common/select/multistage/index.html',
            bindings: {
                input: '<',
                output: '='
            },
            controller: indexController
        });

    indexController.$inject = ['$rootScope', '$scope', '$document'];

    function indexController($rootScope, $scope, $document) {
        var vm = this;
        vm.data = {
            wantToSelect: false,
            textList: [],
            parentNodeList: [],
            query: null
        }
        vm.fun = {};


        vm.fun.filter = function (arg) {
            if(!vm.data.queryHaveChild&&arg[vm.input.child]&&arg[vm.input.child].length>0){
                vm.data.queryHaveChild=true;
            }
            if (vm.data.q && arg[vm.input.key].indexOf(vm.data.q) == -1) {
                return false;
            }
            return arg;
        }
        var fun = {},
            data = {
                initialObject: {
                    textList: [],
                    parentNodeList: [],
                    query: []
                }
            }
        vm.fun.wantToSelect = function ($event) {
            $event.stopPropagation();
            vm.data.wantToSelect = !vm.data.wantToSelect;
            fun.clearText();
        }
        $document.on("click", function (_default) {
            vm.data.wantToSelect = false;
            $scope.$root && $scope.$root.$$phase || $scope.$apply();
        });
        fun.setText=function(newValue){
            var text = '';
            for (var key in vm.data.textList) {
                text = text + (text ? '>' : '') + vm.data.textList[key].key;
            }
            vm.output.new = {
                text: text,
                value: newValue
            };
        }
        fun.goToParent = function () {
            var template = {
                length: vm.data.textList.length - 1,
                nodeLength: vm.data.parentNodeList.length - 1
            }
            if(vm.data.textList.length>vm.data.parentNodeList.length){
                vm.data.textList.splice(template.length, 1);
            }
            vm.data.query = vm.data.parentNodeList.splice(template.nodeLength, 1)[0];
            fun.setText(vm.data.textList[(template.length||1)-1].value);
        }
        fun.goToChild = function (arg) {
            if (vm.data.parentNodeList.length == vm.data.textList.length) {
                vm.data.textList.push({
                    key: arg[vm.input.key],
                    value: arg[vm.input.value]
                })

            } else {
                vm.data.textList.splice(vm.data.textList.length - 1, 1, {
                    key: arg[vm.input.key],
                    value: arg[vm.input.value]
                });
            }
            if (arg[vm.input.child] && arg[vm.input.child].length > 0) {
                vm.data.parentNodeList.push(vm.data.query);
                vm.data.query = arg[vm.input.child];
            } else {
                vm.data.wantToSelect = false;
            }
            fun.setText(arg[vm.input.value]);
        }
        fun.clearText = function () {
            vm.data.q = '';
        }

        vm.fun.click = function ($event) {
            $event.stopPropagation();
            var template = {};
            try {
                template.point = $event.target.classList[0];
            } catch (e) {
                template.point = 'default';
            }
            switch (template.point) {
                case 'select-multistage-btn-clear-text':
                    {
                        fun.clearText();
                        break;
                    }
                case 'select-multistage-btn-close':
                    {
                        vm.data.wantToSelect = false;;
                        break;
                    }
                case 'select-multistage-btn-back':
                    {
                        fun.goToParent();
                        break;
                    }
                case 'select-multistage-btn-item':
                    {
                        template.index = $event.target.getAttribute('eo-attr-index');
                        template.query=[];
                        vm.data.query.map(function(val,key){
                            if(vm.fun.filter(val)){
                                template.query.push(val);
                            }
                        })
                        fun.goToChild(template.query[template.index]);
                        break;
                    }
                case 'select-multistage-btn-item-span':
                    {
                        template.index = $event.target.parentNode.getAttribute('eo-attr-index');
                        template.query=[];
                        vm.data.query.map(function(val,key){
                            if(vm.fun.filter(val)){
                                template.query.push(val);
                            }
                        })
                        fun.goToChild(template.query[template.index]);
                        break;
                    }
            }


        }
        fun.initial = function () {
            data.initialObject.query = vm.input.query;
            for (var key in vm.input.initialData) {
                var val = vm.input.initialData[key];
                key=parseInt(key);
                for (var childKey in data.initialObject.query) {
                    var childVal = data.initialObject.query[childKey];
                    if (childVal[vm.input.value] == val || (val == -1 && key == 0)) {
                        data.initialObject.textList.push({
                            key: childVal[vm.input.key],
                            value: childVal[vm.input.value]
                        })
                        if(key<=(vm.input.initialData.length-1)&&(vm.input.initialData[key+1]==-1||!vm.input.initialData[key+1]))break;
                        if (childVal[vm.input.child] && childVal[vm.input.child].length > 0) {
                            data.initialObject.parentNodeList.push(data.initialObject.query);
                            data.initialObject.query = childVal[vm.input.child] || [];
                        }
                        break;
                    }
                }
                if (val == -1) {
                    break;
                }
            }
            fun.resetInitial();
        }
        fun.resetInitial = function () {
            vm.output = {};
            vm.data.query = angular.copy(data.initialObject.query);
            vm.data.parentNodeList = angular.copy(data.initialObject.parentNodeList);
            vm.data.textList = angular.copy(data.initialObject.textList);
            var text = '';
            for (var key in vm.data.textList) {
                text = text + (text ? '>' : '') + vm.data.textList[key].key;
            }
            vm.output.new = vm.output.original = {
                text: text,
                value: vm.data.textList[vm.data.textList.length - 1].value
            }
        }
        data.broadcast = $scope.$on('$ResetInitial_SelectMultistageCommonComponent', fun.resetInitial);
        $rootScope.global.$watch.push($scope.$watch('$ctrl.input.query', function () {
            if (!vm.input.query) return;
            vm.data.query = vm.input.query;
            fun.initial();
        }));
        $scope.$on('$destroy', function () {
            data.broadcast();
        });
    }
})();