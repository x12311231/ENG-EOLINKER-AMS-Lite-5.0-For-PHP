(function () {
    'use strict';
    /**
     * @author 广州银云信息科技有限公司
     * @description 人员下拉菜单
     */

    angular.module('eolinker')
        .component('selectPersonCommonComponent', {
            templateUrl: 'app/component/common/select/person/index.html',
            bindings: {
                input: '<',
                output: '=',
                disabled:"<",
                required:'@'
            },
            controller: indexController
        });

    indexController.$inject = ['$rootScope', '$scope','$element'];

    function indexController($rootScope, $scope,$element) {
        var vm = this;
        vm.data = {
            isFocus: false,
            textList: [],
            parentNodeList: [],
            query: null
        }
        vm.fun = {};


        vm.fun.filter = function (arg) {
            if(!vm.data.q||(arg[vm.input.nickName]||'').indexOf(vm.data.q) != -1||(arg[vm.input.loginCall]||'').indexOf(vm.data.q) != -1||(arg[vm.input.noteName]||'').indexOf(vm.data.q) != -1)return arg;
            return false;
        }
        var fun = {},data={};
        vm.fun.wantToSelect = function ($event) {
            $event.stopPropagation();
            vm.data.isFocus = !vm.data.isFocus;
            fun.clearText();
            data.elem.focus();
        }
        vm.fun.searchBlur=function($event){
            $event.stopPropagation();
            if(data.isLeave)vm.data.isFocus=false;
        }
        fun.select = function (arg) {
            vm.data.textObject=arg;
            vm.data.isFocus = false;
            vm.output = {
                value: arg[vm.input.value]
            };
        }
        vm.fun.clear=function($event){
            $event.stopPropagation();
            vm.data.textObject=null;
            vm.output={
                value:null
            }
            vm.data.isFocus = false;
        }
        fun.clearText = function () {
            vm.data.q = '';
        }

        vm.fun.click = function ($event) {
            if(vm.disabled) return;
            $event.stopPropagation();
            
            var template = {};
            try {
                template.point = $event.target.classList[0];
            } catch (e) {
                template.point = 'default';
            }
            switch (template.point) {
                case 'select-person-btn-clear-text':
                    {
                        fun.clearText();
                        break;
                    }
                case 'select-person-btn-item':
                    {
                        template.index = $event.target.getAttribute('eo-attr-index');
                        template.query=[];
                        vm.data.query.map(function(val,key){
                            if(vm.fun.filter(val)){
                                template.query.push(val);
                            }
                        })
                        fun.select(template.query[template.index]);
                        break;
                    }
                case 'select-person-btn-item-span':
                    {
                        template.index = $event.target.parentNode.getAttribute('eo-attr-index');
                        template.query=[];
                        vm.data.query.map(function(val,key){
                            if(vm.fun.filter(val)){
                                template.query.push(val);
                            }
                        })
                        fun.select(template.query[template.index]);
                        break;
                    }
            }
        }
        fun.initial = function () {
            if(!vm.input.initialData)return;
            for (var key in vm.data.query) {
                var val = vm.data.query[key];
                if (val[vm.input.value] == vm.input.initialData) {
                    vm.data.textObject=val;
                    vm.output = {
                        value: val[vm.input.value]
                    };
                    break;
                }
            }
        }
        $rootScope.global.$watch.push($scope.$watch('$ctrl.input.query+$ctrl.input.initialData', function () {
            if (!vm.input.query) return;
            vm.data.query = vm.input.query;
            fun.initial();
        }));
        vm.$onInit=function(){
            var template={
                elem:$element[0].children[1]
            }
            data.elem=$element[0].children[0];
            template.elem.onmouseleave=function(){
                data.isLeave=true;
                console.log('onmouseLeave');
            }
            template.elem.onmouseenter=function(){
                data.isLeave=false;
                console.log('onmouseenter')
            }
            data.elem.onblur=function(){
                if(data.isLeave)vm.data.isFocus=false;
                console.log('onblur')
            }
        }
    }
})();