(function () {
    'use strict';
    /**
     * @author 广州银云信息科技有限公司
     * @description 列表组件---依赖侧边（eg：分组）
     * @extend {object} authorityObject 权限类{operate}
     * @extend {object} activeObject 活动/聚焦标志
     * @extend {object} showObject 显示标志
     * @extends {array} list 列表
     * @extend {object} otherObject 不可预期辅助类
     */
    angular.module('eolinker')
        .component('listRequireCommonComponent', {
            template: '<div  ng-class="{\'un-top-list-require-common-component\':$ctrl.mainObject.baseInfo.unTop&&!$ctrl.authorityObject.edit}" ><table  infinite-scroll=\'$ctrl.mainObject.fun.scrollLoading()\' infinite-scroll-parent >' +
                '    <thead>' +
                '        <tr>' +
                '            <th ng-repeat="item in $ctrl.mainObject.tdList" ng-style="item.style" ng-switch="item.type" ng-show="(item.showPoint&&$ctrl.showObject[item.showPoint][item.showVariable]==item.show)||(item.showVariable&&$ctrl.showObject[item.showVariable]==item.show)||!item.showVariable"  ng-if="!item.authority||$ctrl.authorityObject[item.authority]">' +
                '                <inner-html-common-directive ng-switch-when=\'customized-html\'  html="item.html"></inner-html-common-directive>' +
                '                <span ng-switch-default>{{item.name}}</span>' +
                '            </th>' +
                '        </tr>' +
                '    </thead>' +
                '    <tbody inner-html-common-directive html="$ctrl.data.html">'+
                '<tr style="background-color: #fff;" class="eo-none-tr" ng-if="$ctrl.list.length==0&&$ctrl.mainObject.baseInfo.warning">' +
                '<td colspan="{{$ctrl.mainObject.baseInfo.colspan}}" ng-switch="$ctrl.mainObject.baseInfo.warningType">' +
                '    <span ng-switch-default>{{$ctrl.mainObject.baseInfo.warning||\'373\'|translate}}</span>' +
                '    <inner-html-common-directive html="$ctrl.mainObject.baseInfo.warning" ng-switch-when="customized-html"></inner-html-common-directive>' +
                '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table></div>',
            controller: indexController,
            bindings: {
                authorityObject: '<',
                otherObject: '<',
                activeObject: '<',
                showObject: '<',
                list: '<',
                mainObject: '<'
            }
        })

    indexController.$inject = ['$scope', '$rootScope'];

    function indexController($scope, $rootScope) {
        var vm = this;
        vm.data = {
            btnList: null,
            html: null
        }
        vm.fun={};
        var fun = {};
        /**
         * @description 统筹绑定调用页面列表功能单击函数
         * @param {extend} obejct 方式值
         * @param {object} arg 共用体变量，后根据传值函数回调方法
         */
        vm.fun.common = function (extend, arg) {
            if (!extend) return;
            var template = {
                params: arg
            }
            switch (typeof (extend.params)) {
                case 'string':
                    {
                        return eval('extend.default(' + extend.params + ')');
                    }
                default:
                    {
                        for (var key in extend.params) {
                            if (extend.params[key] == null) {
                                template.params[key] = arg[key];
                            } else {
                                template.params[key] = extend.params[key];
                            }
                        }
                        return extend.default(template.params);
                    }
            }
        }
        fun.initHtml = function () {
            if (!vm.mainObject.tdList) return;
            var template = {
                btnString: '',
                html: '<tr '+(vm.mainObject.baseInfo.class?'class="'+vm.mainObject.baseInfo.class+'"':'')+' ng-repeat="($outerIndex,item) in $ctrl.list" ng-click="$ctrl.mainObject.fun.click({item:item,$index:$index},$event)" ng-class="{\'elem-active\':item.isClick&&$ctrl.activeObject[$ctrl.mainObject.baseInfo.active],\'could-activer-tr\':$ctrl.activeObject[$ctrl.mainObject.baseInfo.active]}" ng-init="item.$index=$index;">'//$ctrl.fun.init($last)
            }
            vm.mainObject.tdList.map(function (val, key) {
                switch (val.keyType) {
                    case 'customized-html':
                        {
                            template.html += '<td ' + (val.showPoint?('ng-show="$ctrl.showObject.'+val.showPoint+'.'+val.showVariable+'==$ctrl.mainObject.tdList[' + key + '].show" '):(val.showVariable?('ng-show="$ctrl.showObject.' + val.showVariable + '==$ctrl.mainObject.tdList[' + key + '].show" '):' ')) + ' >' + val.keyHtml + '</td>';
                            break;
                        }
                    case 'btn':
                        {
                            vm.data.btnList = val.btnList;
                            val.btnList.map(function (childVal, childKey) {
                                switch (childVal.type) {
                                    case 'html':
                                        {
                                            template.btnString += childVal.html;
                                            break;
                                        }
                                    default:
                                        {
                                            template.btnString += '<button class="'+childVal.class+' eo-operate-btn " ' + (childVal.authority ? 'ng-if="$ctrl.authorityObject[$ctrl.data.btnList[' + childKey + '].authority]" ' : '') +(val.unNeedToBindClick?'':(' ng-click="$ctrl.fun.common($ctrl.data.btnList[' + childKey + '].fun,{item:item,$index:$outerIndex,$event:$event})"'))+(childVal.showVariable?(' ng-show="item.'+childVal.showVariable+ '==$ctrl.data.btnList[' + childKey + '].show"'):'') + (' ng-disabled="' + (childVal.disabled || false) + '"') + '>'+(childVal.icon?('<span class="iconfont icon-' + childVal.icon + '"></span>'):'') + childVal.name + '</button>';
                                            break;
                                        }
                                }
                            })
                            template.html += '<td ' + (val.showPoint?('ng-show="$ctrl.showObject.'+val.showPoint+'.'+val.showVariable+'==$ctrl.mainObject.tdList[' + key + '].show" '):(val.showVariable?('ng-show="$ctrl.showObject.' + val.showVariable + '==$ctrl.mainObject.tdList[' + key + '].show" '):' '))  + (val.authority ? 'ng-if="$ctrl.authorityObject[$ctrl.mainObject.tdList[' + key + '].authority]"' : '') + ' >' + template.btnString + '</td>';
                            break;
                        }
                    default:
                        {
                            template.html += '<td ' + (val.showPoint?('ng-show="$ctrl.showObject.'+val.showPoint+'.'+val.showVariable+'==$ctrl.mainObject.tdList[' + key + '].show" '):(val.showVariable?('ng-show="$ctrl.showObject.' + val.showVariable + '==$ctrl.mainObject.tdList[' + key + '].show" '):' '))  + (val.authority ? 'ng-if="$ctrl.authorityObject[$ctrl.mainObject.tdList[' + key + '].authority]"' : '') + '  ><span>{{item.' + val.key + '}}</span></td>';
                            break;
                        }
                }
            });
            vm.data.html = template.html + '</tr>';
        }
        $rootScope.global.$watch.push($scope.$watch('$ctrl.mainObject.tdList', fun.initHtml));
    }
})();