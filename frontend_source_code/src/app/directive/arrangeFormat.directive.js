(function () {
    'use strict';
    /**
     * @name 格式整理指令
     * @author 广州银云信息科技有限公司
     * @param [object] interaction （request{onlyOneTime:是否只执行一次，type：自定义格式整理类型},response）
     */
    angular.module('eolinker.directive')
        .directive('arrangeFormat', ['Cache_CommonService', '$filter', '$rootScope', function (Cache_CommonService, $filter, $rootScope) {
            return {
                restrict: 'A',
                scope: {
                    interaction: '=' ,//交互参数,
                },
                require: '?ngModel',
                link: function ($scope, elem, attrs, ngModel) {
                    var data = {
                            status: 0, //整理状态（0：字段错误，1：字段正确，整理前的字段结果,2:整理后的字段结果,3:暂无内容）
                            text: {
                                origin: null,
                                result: null,
                                assistantText: null
                            },
                            originHtml: null,
                            timer: null
                        },
                        fun = {},
                        interaction = $scope.interaction || {
                            request: {},
                            response: {}
                        },
                        service = {
                            cache: Cache_CommonService
                        }
                    fun.loop = function () {
                        switch (data.formatType) {
                            case 'json':
                                {
                                    angular.element(document.getElementById(attrs.arrangeFormat)).append(data.text.assistantText);
                                    break;
                                }
                            default:
                                {
                                    angular.element(document.getElementById(attrs.arrangeFormat)).append(data.text.assistantText.substring(0, 65535));
                                    if (data.text.assistantText.length < 65535) {
                                        return;
                                    } else {
                                        data.text.assistantText = data.text.assistantText.substring(65535, data.text.assistantText.length);
                                        data.timer = setTimeout(function () {
                                            fun.loop()
                                        }, 100);
                                    }
                                    break;
                                }
                        }
                    }
                    fun.formatJson = function (arg) {
                        data.formatType = 'json';
                        arg.text = arg.text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                        try {
                            try {
                                return data.text.result = $filter('JsonformatFilter')(arg.text, 4);
                            } catch (childE) {
                                return data.text.result = $filter('JsonformatFilter')(JSON.stringify($filter('JsonLintFilter')(arg.text)), 4);
                            }
                        } catch (e) {
                            switch (arg.status) {
                                case 0:
                                    { //一次性格式整理
                                        return (arg.text || '');
                                    }
                                default:
                                    {
                                        return data.text.result = '<span style="color: #f1592a;font-weight:bold;font-family: Menlo, Monaco, Consolas, Helvetica, Microsoft YaHei, monospace, Arial, sans-serif, SimHei;">' + e + '</span>';
                                    }
                            }

                        }
                    }
                    fun.formatHtml = function (arg) {
                        try {
                            return $filter('HtmlformatFilter')(arg.text, 5).replace(/</g, '&lt;').replace(/>/g, '&gt;');
                        } catch (e) {
                            data.status = 0;
                            return arg.text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                        }
                    }
                    fun.render = function () {
                        data.text.origin = attrs.cacheVariable ? service.cache.get(attrs.cacheVariable) : ngModel.$viewValue;
                        if (!data.text.origin) {
                            data.status = 3;
                            data.text.result = data.originHtml;
                        } else {
                            data.status = 2;
                            if (interaction.request.onlyOneTime) { //仅格式整理不相互转化
                                if (/^(<)(.*)(>)$/.test(data.text.origin.replace(/\s/g, ""))) {
                                    data.text.result = fun.formatHtml({
                                        text: data.text.origin
                                    });
                                } else {
                                    data.text.result = fun.formatJson({
                                        text: data.text.origin,
                                        status: 0
                                    });
                                }
                            } else if (interaction.request.type) { //自定义格式整理类型（0:json,1:xml,2:html）
                                switch (interaction.request.type) {
                                    case 0:
                                        {
                                            data.text.result = fun.formatJson({
                                                text: data.text.origin,
                                                status: 1
                                            });
                                            break;
                                        }
                                    case 1:
                                    case 2:
                                        {
                                            if (/^(<)(.*)(>)$/.test(data.text.origin.replace(/\s/g, ""))) {
                                                data.text.result = fun.formatHtml({
                                                    text: data.text.origin
                                                });
                                            } else {
                                                data.status = 0;
                                                data.text.result = (data.text.origin || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                                            }
                                            break;
                                        }
                                    default:
                                        {
                                            data.status = 0;
                                            data.text.result = (data.text.origin || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                                        }
                                }
                            } else { //主动判断格式是否为json或xml进行整理
                                if (/^({|\[)(.*)(}|])$/.test(data.text.origin.replace(/\s/g, ""))) {
                                    data.text.result = fun.formatJson({
                                        text: data.text.origin,
                                        status: 1
                                    });
                                } else if (/^(<img)(.*)(author="eolinker-frontend")(.*)(>)$/.test(data.text.origin.replace(/\s/g, ""))) {
                                    data.text.result = data.text.origin;
                                } else if (/^(<)(.*)(>)$/.test(data.text.origin.replace(/\s/g, ""))) {
                                    data.text.result = fun.formatHtml({
                                        text: data.text.origin
                                    });
                                } else {
                                    data.status = 0;
                                    data.text.result = (data.text.origin || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                                }
                            }
                        }
                        angular.element(document.getElementById(attrs.arrangeFormat)).empty();
                        data.text.assistantText = data.text.result;
                        fun.loop();
                    };
                    fun.click = function () {
                        switch (data.status) {
                            case 0:
                                {
                                    $rootScope.InfoModal($filter('translate')('309'), 'error');
                                    break;
                                }
                            case 2:
                                {
                                    data.status = 1;
                                    angular.element(document.getElementById(attrs.arrangeFormat)).empty();
                                    data.text.assistantText = (data.text.origin || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                                    fun.loop()
                                    break;
                                }
                            case 3:
                                {
                                    break;
                                }
                            default:
                                {
                                    data.status = 2;
                                    angular.element(document.getElementById(attrs.arrangeFormat)).empty();
                                    data.text.assistantText = data.text.result;
                                    fun.loop()
                                    break;
                                }
                        }
                    }
                    fun.hide = function (arg) {
                        var template = {
                            parent: arg.parentNode,
                            html: null,
                            type: null,
                            size: null
                        }
                        template.type = template.parent.getAttribute('data-type');
                        template.size = template.parent.getAttribute('data-size');
                        template.parent.setAttribute('data-inner', template.parent.innerHTML);
                        if (template.type === 'array') {
                            template.html = '<i  style="cursor:pointer;color: #3ab54a;font-size: 13px;padding-right:5px;" class="iconfont icon-youjiantou-copy" onclick="$eo.directive.arrangeFormat.show(this)" ></i>Array[<span class="json_number">' + template.size + '</span>]';
                        } else {
                            template.html = '<i style="cursor:pointer;color: #3ab54a;font-size: 13px;padding-right:5px;" class="iconfont icon-youjiantou-copy" onclick="$eo.directive.arrangeFormat.show(this)"></i>Object{...}';
                        }
                        angular.element(template.parent).empty();
                        angular.element(template.parent).append(template.html);
                    }
                    fun.show = function (arg) {
                        var template = {
                            parent: arg.parentNode,
                            html: null
                        }
                        template.html = template.parent.getAttribute('data-inner');
                        angular.element(template.parent).empty();
                        angular.element(template.parent).append(template.html);
                    }
                    fun.init = function () {
                        service.cache.clear(attrs.cacheVariable);
                        if (ngModel) {
                            ngModel.$render = fun.render;
                        }
                        if (!interaction.request.onlyOneTime) {
                            elem.bind('click', fun.click);
                        }
                        data.originHtml = document.getElementById(attrs.arrangeFormat).innerHTML;
                        window.$eo.directive.arrangeFormat = window.$eo.directive.arrangeFormat || {};
                        if (!window.$eo.directive.arrangeFormat.hide) {
                            window.$eo.directive.arrangeFormat.hide = fun.hide;
                        }
                        if (!window.$eo.directive.arrangeFormat.show) {
                            window.$eo.directive.arrangeFormat.show = fun.show;
                        }

                    }
                    fun.init();
                    $scope.$on('$stateChangeStart', function () {
                        if (data.timer) clearTimeout(data.timer)
                    })
                }
            };
        }]);
})();