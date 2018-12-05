(function () {
    'use strict';

    /**
     * author：广州银云信息科技有限公司
     * ace 有右侧菜单的编辑器指令js
     * @param {string} setVariable 设置绑定setModel的对象键，(optional)，需搭配setModel使用
     * @param {object} setModel 存储值位置，双绑
     * @param {string} type 语言类型{json,javascript}，默认json
     * @param {any} watchModel 监听控件变化切换值[optional]，用于多ace编辑器
     * @param {any} readOnly 监听读写权限[optional]
     * @param {string} mark 目标位置{project,automatic,share}
     */

    angular.module('eolinker')
        .component('aceMenuEditorAmsComponent', {
            controller: indexController,
            templateUrl: 'app/component/ams/editor/aceMenu/index.html',
            bindings: {
                setVariable: '<',
                setModel: '=',
                watchModel: '<',
                readOnly: '<',
                mark: '@',
                inputObject: '<'
            }
        })

    indexController.$inject = ['$scope', '$rootScope', '$state', 'Cache_CommonService', 'CODE','$filter'];

    function indexController($scope, $rootScope, $state, Cache_CommonService, CODE,$filter) {
        var vm = this;
        vm.data = {
                funMenu: [{
                        name: $filter('translate')('358'),
                        spreedKey: 'request',
                        funList: [{
                                name: $filter('translate')('359'),
                                value: 'url',
                            }, {
                                name: $filter('translate')('360'),
                                value: 'headers[""]',
                                offset: 2
                            }, {
                                name: $filter('translate')('361'),
                                value: 'params[""]',
                                offset: 2
                            },
                            {
                                name: $filter('translate')('362'),
                                value: 'raw',
                            }, {
                                name: $filter('translate')('363'),
                                value: 'query[""]',
                                offset: 2
                            },
                        ]
                    },
                    {
                        name: $filter('translate')('364'),
                        spreedKey: 'env',
                        funList: [{
                                name: $filter('translate')('365'),
                                value: 'env.url',
                            }, {
                                name: $filter('translate')('366'),
                                value: 'env.headers[""]',
                                offset: 2
                            }, {
                                name: $filter('translate')('367'),
                                value: 'env.extraParams[""]',
                                offset: 2
                            },
                            {
                                name: $filter('translate')('368'),
                                value: 'env.globalParams[""]',
                                offset: 2
                            },
                        ]
                    },
                    {
                        name: $filter('translate')('369'),
                        spreedKey: 'lock',
                        funList: [{
                                name: 'MD5()',
                                value: 'eo.md5()',
                                offset: 1
                            },
                            {
                                name: 'SHA1()',
                                value: 'eo.sha1()',
                                offset: 1
                            },
                            {
                                name: 'SHA256()',
                                divide: 1,
                                value: 'eo.sha256()',
                                offset: 1
                            }
                        ]
                    }
                ],
                current: {}
            },
            vm.fun = {};

        var data = {
                resource: {}
            },
            fun = {},
            service = {
                cache: Cache_CommonService
            },
            interaction = {
                request: {
                    spaceKey: $state.params.spaceKey,
                    projectID: $state.params.projectID,
                    shareID: $state.params.shareID,
                    shareCode: $state.params.shareCode
                },
                response: {
                    funList: []
                }
            };
        fun.changeCodeType = function (status) {
            switch (status) {
                case 'before':
                case 'beforeInject':
                    {
                        vm.data.funMenu = [{
                                name: $filter('translate')('358'),
                                spreedKey: 'request',
                                funList: [{
                                        name: $filter('translate')('359'),
                                        value: 'url',
                                    }, {
                                        name: $filter('translate')('360'),
                                        value: 'headers[""]',
                                        offset: 2
                                    }, {
                                        name: $filter('translate')('361'),
                                        value: 'params[""]',
                                        offset: 2
                                    },
                                    {
                                        name: $filter('translate')('362'),
                                        value: 'raw',
                                    }, {
                                        name: $filter('translate')('363'),
                                        value: 'query[""]',
                                        offset: 2
                                    },
                                ]
                            },
                            {
                                name: $filter('translate')('364'),
                                spreedKey: 'env',
                                funList: [{
                                        name: $filter('translate')('365'),
                                        value: 'env.url',
                                    }, {
                                        name: $filter('translate')('366'),
                                        value: 'env.headers[""]',
                                        offset: 2
                                    }, {
                                        name: $filter('translate')('367'),
                                        value: 'env.extraParams[""]',
                                        offset: 2
                                    },
                                    {
                                        name: $filter('translate')('368'),
                                        value: 'env.globalParams[""]',
                                        offset: 2
                                    },
                                ]
                            },
                            {
                                name: $filter('translate')('369'),
                                spreedKey: 'lock',
                                funList: [{
                                        name: 'MD5()',
                                        value: 'eo.md5()',
                                        offset: 1
                                    },
                                    {
                                        name: 'SHA1()',
                                        value: 'eo.sha1()',
                                        offset: 1
                                    },
                                    {
                                        name: 'SHA256()',
                                        divide: 1,
                                        value: 'eo.sha256()',
                                        offset: 1
                                    }
                                ]
                            },
                        ];
                        break;
                    }
                default:
                    {
                        vm.data.funMenu = [{
                            name: $filter('translate')('358'),
                            spreedKey: 'request',
                            funList: [{
                                name: $filter('translate')('370'),
                                value: 'response',
                            }]
                        }];

                    }
            }
        }
        vm.fun.clickMenu = function (arg) {
            if (vm.data.current.spreed == arg.item.spreedKey) {
                vm.data.current.spreed = null;
            } else {
                vm.data.current.spreed = arg.item.spreedKey;
            }
        }
        vm.fun.quickSetExpression = function (arg) {
            var template = {
                javascript: '',
                callback: null,
                cache: service.cache.get('Common_Function_List')
            }
            template.javascript = arg.value;
            $scope.$broadcast('$InsertText_AceEditorAms_Code_Ace_Editor_Js', template.javascript, arg.offset);
        }
        vm.$onInit = function () {
        }
        $rootScope.global.$watch.push($scope.$watch('$ctrl.setVariable', fun.changeCodeType));
    }
})();