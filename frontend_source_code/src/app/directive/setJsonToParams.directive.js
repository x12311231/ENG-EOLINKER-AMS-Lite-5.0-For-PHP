(function () {
    'use strict';
    /*
     * author：广州银云信息科技有限公司
     * 匹配Json转换为Param指令js
     */
    angular.module('eolinker.directive')
        .directive('setToParams', ['$rootScope', '$filter', function ($rootScope, $filter) {
            return {
                restrict: 'A',
                scope: {
                    importMethod: '@', //导入文本方式，默认json，1：get请求参数形式,2:请求头部形式,3:xml形式
                    item: '@', //设置初始object类集,(可选)
                    resetResult: '=', //插入结果位置集（必选）
                    valueItem: '@', //值可能性object类集（可选）
                    updateDesc: '<', //设置开始index（更新日志所用）
                },
                replace: true,
                template: '<button class="eo-button-info add-param-btn import-btn" data-ng-click="fun.confirm()" ng-switch="importMethod"><span ng-switch-when="1">{{\'30\'|translate}}</span><span ng-switch-when="2">{{\'31\'|translate}}</span><span ng-switch-when="3">{{\'32\'|translate}}</span><span ng-switch-default>{{\'33\'|translate}}</span></button>',
                link: function ($scope, elem, attrs, ngModel) {
                    var data = {
                            input: {
                                key: attrs.setToParams || 'key', //数组参数个例变量名
                                valueExample: attrs.valueExample || 'paramValue', //数组参数个例示例
                                valueKey: attrs.setValueKey || 'key', //数组参数个例值变量结果（如果value存储为array及object时存在）
                                value: attrs.setValue || 'value', //数组参数个例值变量名
                            },
                            output: []
                        },
                        fun = {};
                    $scope.fun = {};
                    fun.formatValue = function (object) {
                        if (!object) return;
                        switch ($scope.importMethod) {
                            case '2':
                                {
                                    break;
                                }
                            default:
                                {
                                    data.output[data.output.length - 1][data.input.valueExample] = object;
                                }
                        }
                        switch (fun.formatTypeof(data.output[data.output.length - 1][data.input.value])) {
                            case 'Array':
                                try {
                                    var newItem = JSON.parse($scope.valueItem);
                                    // newItem[data.input.valueKey] = object;
                                    data.output[data.output.length - 1][data.input.value].push(newItem);
                                } catch (e) {
                                    data.output[data.output.length - 1][data.input.value][0] = object;
                                }
                                break;
                            default:
                                try {
                                    var newItem = JSON.parse($scope.valueItem);
                                    // newItem[data.input.valueKey] = object;
                                    data.output[data.output.length - 1][data.input.value].push(newItem);
                                } catch (e) {
                                    data.output[data.output.length - 1][data.input.value] = object;
                                }
                                break;
                        }
                    }
                    fun.formatArray = function (object, indent_count, parent) {
                        if (object.length > 0) {
                            fun.formatDefault(object[0], indent_count + 1, parent)
                        }
                    }
                    fun.formatObject = function (object, indent_count, parent) {
                        var template = {
                            preItem: {}
                        }
                        var newItem = {};
                        for (var key in object) {
                            if (object[key] !== 'author-riverLethe-double-slash-note') {
                                try {
                                    newItem = JSON.parse($scope.item);
                                } catch (e) {
                                    newItem = {};
                                }
                                switch (fun.formatTypeof(object[key])) {
                                    case 'Object':
                                        {
                                            newItem.paramType = '13';
                                            for (var childKey in object[key]) {
                                                if (object[key][childKey] == 'author-riverLethe-double-slash-note') {
                                                    newItem.paramName = childKey;
                                                }
                                                break;
                                            }
                                            break;
                                        }
                                    case 'Array':
                                        {
                                            newItem.paramType = '12';
                                            if (object[key].length > 0) {
                                                for (var childKey in object[key][0]) {
                                                    if (object[key][0][childKey] == 'author-riverLethe-double-slash-note') {
                                                        newItem.paramName = childKey;
                                                        object[key].splice(0, 1);
                                                    }
                                                    break;
                                                }
                                            }
                                            break;
                                        }
                                    case 'Number':
                                        {
                                            newItem.paramType = '14';
                                            break;
                                        }
                                    case 'Boolean':
                                        {
                                            newItem.paramType = '8';
                                            break;
                                        }
                                }
                                template.preItem = newItem;
                                newItem[data.input.key] = parent ? (parent + '>>' + key) : key;
                                if ($scope.updateDesc) {
                                    newItem.$index = $scope.updateDesc.index++;
                                }
                                data.output.push(newItem);
                                fun.formatDefault(object[key], indent_count + 1, parent ? (parent + '>>' + key) : key)
                            } else {
                                template.preItem.paramName = (key || '').replace('author-riverLethe-double-slash-note', '');
                            }
                        }
                    }
                    fun.formatTypeof = function (object) {
                        var tf = typeof object,
                            ts = Object.prototype.toString.call(object);
                        return null === object ? 'Null' :
                            'undefined' == tf ? 'Undefined' :
                            'boolean' == tf ? 'Boolean' :
                            'number' == tf ? 'Number' :
                            'string' == tf ? 'String' :
                            '[object Function]' == ts ? 'Function' :
                            '[object Array]' == ts ? 'Array' :
                            '[object Date]' == ts ? 'Date' : 'Object';
                    }
                    fun.formatDefault = function (object, indent_count, parent) {
                        switch (fun.formatTypeof(object)) {
                            case 'Boolean':
                            case 'Number':
                            case 'String':
                                object = '' + object;
                                fun.formatValue(object);
                                break;
                            case 'Array':
                                fun.formatArray(object, indent_count, parent);
                                break;
                            case 'Object':
                                fun.formatObject(object, indent_count, parent);
                                break;
                        }
                    }
                    fun.formatGetHeaderDefault = function (string) {
                        var template = {
                            query: string.replace(/\"/g, '\\\"').split('\n'),
                            output: '{"'
                        }
                        angular.forEach(template.query, function (val, key) {
                            if (template.query.length - 1 != key) {
                                template.output = template.output + val.replace(/:/, '":"') + '","';
                            } else {
                                template.output = template.output + val.replace(/:/, '":"') + '"}';
                            }
                        })
                        return template.output;
                    }
                    fun.formatGetParamDefault = function (string) {
                        var template = {
                            $index: string.indexOf('?'),
                            output: ''
                        }
                        switch (template.$index) {
                            case -1:
                                {
                                    template.output = '{"' + string.replace(/&/g, '","').replace(/=/g, '":"') + '"}';
                                    break;
                                }
                            default:
                                {
                                    template.output = '{"' + string.substring(template.$index + 1).replace(/&/g, '","').replace(/=/g, '":"') + '"}';
                                    break;
                                }
                        }
                        return template.output;
                    }
                    $scope.fun.confirm = function () { //插入返回参数集
                        var template = {
                            input: '',
                            modal: {
                                method: $scope.importMethod
                            },
                            jsonToParamObject: {},
                            parseStatus: 'success'
                        }
                        $rootScope.AMS_JsonToParamInputModal(template.modal, function (callback) {
                            if (callback) {
                                switch ($scope.importMethod) {
                                    case '1':
                                        {
                                            try {
                                                template.input = JSON.parse(fun.formatGetParamDefault(callback.desc));
                                            } catch (e) {
                                                template.parseStatus = 'error';
                                                $rootScope.InfoModal($filter('translate')('303'), 'error');
                                            }

                                            break;
                                        }
                                    case '2':
                                        {
                                            try {
                                                template.input = JSON.parse(fun.formatGetHeaderDefault(callback.desc));
                                            } catch (e) {
                                                template.parseStatus = 'error';
                                                $rootScope.InfoModal($filter('translate')('313'), 'error');
                                            }
                                            break;
                                        }
                                    case '3':
                                        {
                                            try {
                                                template.input = JSON.parse($filter('XmlToJsonFilter')(callback.desc));
                                            } catch (e) {
                                                template.parseStatus = 'error';
                                                $rootScope.InfoModal($filter('translate')('314'), 'error');
                                            }
                                            break;
                                        }
                                    default:
                                        {
                                            try {

                                                template.jsonToParamObject = {
                                                    origin: callback.desc.replace(/\/\/((?!").)*(\r|)\n/g, ',"author-lethe":"author-riverLethe-double-slash-note",').replace(/(\s)*,(\s)*,/g, ',').replace(/(\s)*,(\s)*}/g, '}').replace(/(\s)*,(\s)*\]/g, ']').replace(/(\s)*\[(\s)*,"author-lethe":"author-riverLethe-double-slash-note"/g, '[{"author-lethe":"author-riverLethe-double-slash-note"}').replace(/(\s)*{(\s)*,/g, '{'),
                                                    matchList: [],
                                                    splitList: [],
                                                    result: ''
                                                }
                                                template.jsonToParamObject.matchList = callback.desc.match(/\/\/((?!").)*(\r|)\n/g);
                                                template.jsonToParamObject.splitList = template.jsonToParamObject.origin.split('author-lethe');
                                                angular.forEach(template.jsonToParamObject.splitList, function (val, key) {
                                                    if (key == 0) {
                                                        template.jsonToParamObject.result = val;
                                                    } else {
                                                        template.jsonToParamObject.result = template.jsonToParamObject.result + 'author-riverLethe-double-slash-note' + template.jsonToParamObject.matchList[key - 1].replace(/(\r|)\n/g, '').replace(/\/\//g, '') + val;
                                                    }
                                                })
                                                template.input = eval('(' + template.jsonToParamObject.result + ')');
                                            } catch (e) {
                                                template.parseStatus = 'error';
                                                $rootScope.InfoModal($filter('translate')('315'), 'error');
                                            }
                                            break;
                                        }
                                }
                                switch (template.parseStatus) {
                                    case 'success':
                                        {
                                            fun.formatDefault(template.input, 1);
                                            var item = JSON.parse($scope.item);
                                            if ($scope.updateDesc) {
                                                item.$index = $scope.updateDesc.index++;
                                            }
                                            data.output.push(item);
                                            switch (callback.which) {
                                                case 0:
                                                    { //插入
                                                        $scope.resetResult.splice($scope.resetResult.length - 1, 1);
                                                        $scope.resetResult = $scope.resetResult.concat(data.output);
                                                        break;
                                                    }
                                                case 1:
                                                    { //替换

                                                        $scope.resetResult = data.output;
                                                        break;
                                                    }
                                            }
                                            break;
                                        }
                                }

                                data.output = [];
                            }
                        });
                    }
                }
            };
        }]);
})();