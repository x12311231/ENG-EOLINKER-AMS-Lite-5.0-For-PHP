(function () {
    'use strict';
    /**
     * @author 广州银云信息科技有限公司
     * @description 默认列表组件
     * @extend {object} authorityObject 权限类{operate}
     * @extend {object} funObject 第一部分功能集类{showVar,btnGroupList{edit:{fun,key,class,showable,icon,tips},sort:{default,cancel,confirm:{fun,key,showable,class,icon,tips}}}}
     * @extend {object} mainObject 主类{baseInfo:{colspan,warning},item:{default,fun}}
     * @extend {object} activeObject 活动/聚焦标志
     * @extend {object} showObject 显示标志
     */
    angular.module('eolinker')
        .component('listDefaultCommonComponent', {
            template: '<div class="common-scss-list" ng-class="{\'grey-black-list\':$ctrl.mainObject.baseInfo.greyShading}"><article class="first-level-article " ng-class="{\'tab-container\':$ctrl.mainObject.baseInfo.canChangeView&&$ctrl.showObject.view==2,\'disabled-tab-container\':$ctrl.mainObject.baseInfo.canChangeView&&$ctrl.showObject.view==2&&$ctrl.mainObject.item.fun.disabled,\'list-container\':$ctrl.mainObject.baseInfo.canChangeView&&$ctrl.showObject.view==1}">' +
                '<table ng-hide="$ctrl.mainObject.baseInfo.canChangeView&&$ctrl.showObject.view==2">' +
                '    <thead>' +
                '        <tr>' +
                '            <th class="{{item.keyClass}}" ng-switch="item.thType" ng-style="item.keyStyle" ng-show="(item.showPoint&&$ctrl.showObject[item.showPoint][item.showVariable]==item.show)||(item.showVariable&&$ctrl.showObject[item.showVariable]==item.show)||!item.showVariable" ng-if="!item.hideKey" ng-repeat="item in $ctrl.mainObject.item.default">' +
                '               <span ng-switch-default>{{item.key}}</span>' +
                '               <span ng-switch-when="select"><label for="api_checkbox_all" ng-click="item.fun({item:item})" class="eo-checkbox iconfont" ng-class="{\'icon-check\':$ctrl.activeObject.selectAll==true}">{{$ctrl.activeObject.selectAll?\'\':\'&nbsp;\'}}</label></span></th>' +
                '            <th class="{{$ctrl.mainObject.item.fun.keyClass}}" ng-style="$ctrl.mainObject.item.fun.keyStyle" ng-if="$ctrl.mainObject.item.fun&&(!$ctrl.mainObject.baseInfo.operate||($ctrl.mainObject.baseInfo.operate&&$ctrl.authorityObject.operate))">{{\'7\'|translate}}</th>' +
                '        </tr>' +
                '    </thead>' +
                '    <tbody inner-html-common-directive html="$ctrl.data.html"></tbody>' +
                '</table>' +
                '<inner-html-common-directive html="$ctrl.data.canChangeViewHtml"></inner-html-common-directive>' +
                '</article></div>',
            controller: indexController,
            bindings: {
                authorityObject: '<',
                funObject: '<',
                mainObject: '<',
                showObject: '<',
                activeObject: '<',
                list: '<'
            }
        })

    indexController.$inject = ['$filter'];

    function indexController($filter) {
        var vm = this;
        vm.data = {
            html: ''
        }
        vm.fun = {};

        /**
         * 初始化单项表格
         */
        vm.$onInit = function () {
            var template = {
                loopHtml: ''
            }
            if (vm.mainObject.baseInfo.canChangeView) {
                template.html = '<li ' + (vm.mainObject.item.fun.contentClass ? ('class="item-btn-group-li ' + vm.mainObject.item.fun.contentClass + '" ') : '') + ' ng-if="!$ctrl.mainObject.baseInfo.operate||($ctrl.mainObject.baseInfo.operate&&$ctrl.authorityObject.operate)"><div  ng-if="!(' + vm.mainObject.item.fun.hideKey + ')">' +
                    '<button class="eo-operate-btn"  ng-show="!$ctrl.activeObject[$ctrl.mainObject.baseInfo.active]" ng-repeat="funItem in $ctrl.mainObject.item.fun.array" ng-hide="!(funItem.show==-1||item[funItem.showType]==funItem.show)"  ng-if="(!funItem.powerName)||funItem.powerName&&$ctrl.authorityObject[funItem.powerName]==funItem.power" ng-click="$ctrl.fun.common(funItem,{item:item,$index:$outerIndex,$event:$event})" ng-disabled="$ctrl.mainObject.item.fun.disabled||(funItem.disabled&&item[funItem.disabledVar]==funItem.disabled)||(' + vm.mainObject.baseInfo.disabled + '&&funItem.status!==\'allowed\')"><div class="eo-tip-container" ng-if="$ctrl.mainObject.item.fun.disabled||(funItem.disabled&&item[funItem.disabledVar]==funItem.disabled)||(' + vm.mainObject.baseInfo.disabled + '&&funItem.status!==\'allowed\')"><div class="arrow-li"></div></div>{{funItem.key}}</button>' +
                    '</div></li>';
                angular.forEach(vm.mainObject.item.default, function (val, key) {
                    template.loopHtml = template.loopHtml + '<li ' + (val.contentClass ? ('class="' + val.contentClass + '" ') : '') + ' ng-if="' + !val.hideKey + '" ' + (val.switch ? ('ng-switch = "item.' + val.switch+'"') : '') + ' > ' + val.html + ' </li>';
                })
                vm.data.canChangeViewHtml = '<ul  class="hover-tr" ng-class="{\"disabled-tr\":' + (vm.mainObject.baseInfo.disabled || false) + ',\"elem-active\":item.isClick&&$ctrl.activeObject[$ctrl.mainObject.baseInfo.active]}" ng-repeat="($outerIndex,item) in $ctrl.list" ng-click="$ctrl.mainObject.baseFun.click({item:item,$index:$index})">' + template.loopHtml + template.html + '</ul>' + '<div class="eo-none-p" ng-if="$ctrl.list.length==0" ng-show="$ctrl.showObject.view==1">' + (vm.mainObject.baseInfo.warningType == 'customized-html' ? vm.mainObject.baseInfo.warning : '<span >{{$ctrl.mainObject.baseInfo.warning||\'373\'|translate}}</span>') + '</div>';
            } else {
                template.html = '<td  ng-if="$ctrl.mainObject.item.fun&&(!$ctrl.mainObject.baseInfo.operate||($ctrl.mainObject.baseInfo.operate&&$ctrl.authorityObject.operate))">' +
                    '<div ' + (vm.mainObject.item.fun ? ('ng-if="' + '!(' + vm.mainObject.item.fun.hideKey + ')&&' + vm.mainObject.item.fun.power + '"') : '') + '>' +
                    '<button class="eo-operate-btn" ng-show="!$ctrl.activeObject[$ctrl.mainObject.baseInfo.active]" ng-repeat="funItem in $ctrl.mainObject.item.fun.array" ng-if="funItem.show==-1||item[funItem.showType]==funItem.show" ng-click="$ctrl.fun.common(funItem,{item:item,$index:$outerIndex,$event:$event})" ng-disabled="$ctrl.mainObject.item.fun.disabled||(funItem.disabled&&item[funItem.disabledVar]==funItem.disabled)||(' + vm.mainObject.baseInfo.disabled + '&&funItem.status!==\'allowed\')"><div class="eo-tip-container" ng-if="$ctrl.mainObject.item.fun.disabled||(funItem.disabled&&item[funItem.disabledVar]==funItem.disabled)||(' + vm.mainObject.baseInfo.disabled + '&&funItem.status!==\'allowed\')"><div class="arrow-li"></div></div><span class="iconfont icon-{{funItem.icon}}" ng-if="funItem.icon"></span>{{funItem.key}}</button>' +
                    '</div>' +
                    '</td>';
                angular.forEach(vm.mainObject.item.default, function (val, key) {
                    template.loopHtml = template.loopHtml + '<td class="' + (val.contentClass || '') + '"' + (val.showPoint ? (' ng-show="$ctrl.showObject[\'' + val.showPoint + '\'][\'' + val.showVariable + '\']==' + val.show + '"') : val.showVariable ? (' ng-show="$ctrl.showObject[\'' + val.showVariable + '\']==' + val.show + '"') : '') + (val.hideKey ? (' ng-if="' + !val.hideKey + '"') : '') + (val.switch ? ' ng-switch="item.' + val.switch+'" ' : '') + (val.title ? ('title="' + val.title + '"') : '') + '>' + val.html + '</td>';
                })
                vm.data.html = '<tr  class="' + (vm.mainObject.baseInfo.unhover ? 'unhover-tr' : 'hover-tr') + '" ng-style="$ctrl.mainObject.baseInfo.style" ng-class="{\'disabled-tr\':' + (vm.mainObject.baseInfo.disabled || false) + ',\'elem-active\':item.isClick&&$ctrl.activeObject[$ctrl.mainObject.baseInfo.active]}" ng-repeat=\'($outerIndex,item) in $ctrl.list\' ng-click="$ctrl.mainObject.baseFun.click({item:item,$index:$index})" ng-init="item.$index=$index">' + template.loopHtml + template.html + '</tr>' +
                    '        <tr class="eo-none-tr" ng-if="$ctrl.list.length==0">' +
                    '            <td colspan="{{$ctrl.mainObject.baseInfo.colspan}}">' + (vm.mainObject.baseInfo.warningType == 'customized-html' ? vm.mainObject.baseInfo.warning : '<span >{{$ctrl.mainObject.baseInfo.warning||\'' + $filter('translate')('373') + '\'}}</span>') +
                    '            </td>' +
                    '        </tr>';
            }
        }

        /**
         * @description 统筹绑定调用页面列表功能单击函数
         * @param {extend} obejct 方式值
         * @param {object} arg 共用体变量，后根据传值函数回调方法
         */
        vm.fun.common = function (extend, arg) {
            arg.$event.stopPropagation();
            var template = {
                params: angular.copy(arg)
            }

            for (var key in extend.params) {
                if (extend.params[key] == null) {
                    template.params[key] = arg[key];
                } else {
                    template.params[key] = extend.params[key];
                }
            }
            extend.fun(template.params);
        }
    }
})();