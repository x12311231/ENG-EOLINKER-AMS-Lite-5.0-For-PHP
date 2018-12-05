(function () {
    /**
     * @name {{\'68\'|translate}}列表
     * @author 广州银云信息科技有限公司 
     */

    'use strict';
    angular.module('eolinker')
        .component('homeProjectInsideCodeList', {
            template: '<div class="home-project-inside-div">' +
                '<menu-common-component other-object="{query:$ctrl.data.batch.address}" authority-object="{\'edit\':$ctrl.service.authority.permission.project.statusCode.edit,\'export\':$ctrl.service.authority.product.ams==\'free\'?1:$ctrl.service.authority.permission.project.exportAndShare.export}" show-object="$ctrl.component.menuObject.show" list="$ctrl.component.menuObject.list"></menu-common-component>' +
                '<list-require-common-component authority-object="$ctrl.service.authority.permission.project.statusCode" main-object="$ctrl.component.listRequireObject.mainObject"' +
                'list="$ctrl.interaction.response.query" active-object="$ctrl.component.menuObject.show.batch" show-object="$ctrl.component.menuObject.show" other-object="{selectAll:$ctrl.component.menuObject.show.batch.selectAll}"></list-require-common-component>' +
                '<loading-common-component fun="$ctrl.fun.init(arg)"></loading-common-component>' +
                '</div>',
            controller: indexController
        })

    indexController.$inject = ['RESPONSE_TEXT', 'ENSURE_WARNIMG', 'Operate_CommonService', '$scope', 'ApiManagementResource', '$state', 'CODE', '$rootScope', 'GroupService', 'Authority_CommonService','$filter'];

    function indexController(RESPONSE_TEXT, ENSURE_WARNIMG, Operate_CommonService, $scope, ApiManagementResource, $state, CODE, $rootScope, GroupService, Authority_CommonService,$filter) {
        var vm = this;
        vm.data = {
            batch: {
                address: [],
                disable: false
            }
        }
        vm.fun = {};
        vm.interaction = {
            request: {
                spaceKey: $state.params.spaceKey,
                projectID: $state.params.projectID,
                groupID: $state.params.groupID || -1,
                childGroupID: $state.params.childGroupID,
                grandSonGroupID: $state.params.grandSonGroupID,
                tips: $state.params.groupID ? '' : window.sessionStorage.getItem('COMMON_SEARCH_TIP'),
                codeID: []
            },
            response: {
                query: null
            }
        }
        vm.service = {
            home: Operate_CommonService,
            authority: Authority_CommonService
        }
        vm.component = {
            menuObject: {
                show: {
                    batch: {
                        disable: false
                    }
                }
            },
            listRequireObject: {
                mainObject: {
                    baseInfo: {
                        active: 'disable'
                    },
                    tdList: [],
                    fun: {}
                }
            }
        };
        var fun = {};
        fun.search = function () {
            var template = {
                options: {
                    callback: function (q) {
                        vm.interaction.request.tips=q;
                        window.sessionStorage.setItem('COMMON_SEARCH_TIP', q);
                        vm.fun.init();
                    }
                }
            }
            vm.service.home.searchObject.fun.search($filter('translate')('68'), template.options)
        }
        fun.getQuery = function () {
            var template = {
                request: {
                    spaceKey: vm.interaction.request.spaceKey,
                    projectID: vm.interaction.request.projectID,
                    groupID: vm.interaction.request.grandSonGroupID || vm.interaction.request.childGroupID || vm.interaction.request.groupID,
                }
            }
            $scope.$emit('$WindowTitleSet', {
                list: [$filter('translate')('543'), $state.params.projectName, $filter('translate')('405')]
            });
            if (vm.interaction.request.tips) {
                template.request.tips = vm.interaction.request.tips;
                template.promise = ApiManagementResource.Code.Search(template.request).$promise;
                template.promise.then(function (response) {
                    switch (response.statusCode) {
                        case CODE.COMMON.SUCCESS:
                            {
                                vm.data.interaction.response.query = response.codeList;
                                break;
                            }
                        default:
                            {
                                vm.data.interaction.response.query = [];
                            }
                    }
                })
            } else {
                if (template.request.groupID == -1) {
                    $rootScope.global.ajax.Query_Code = ApiManagementResource.Code.All(template.request)
                    $rootScope.global.ajax.Query_Code.$promise.then(function (response) {
                        vm.interaction.response.query = response.codeList || [];
                    })
                } else {
                    $rootScope.global.ajax.Query_Code = ApiManagementResource.Code.Query(template.request);
                    $rootScope.global.ajax.Query_Code.$promise.then(function (response) {
                        switch (response.statusCode) {
                            case CODE.COMMON.SUCCESS:
                                {
                                    vm.interaction.response.query = response.codeList;
                                    break;
                                }
                            default:
                                {
                                    vm.interaction.response.query = [];
                                }
                        }
                    })
                }
            }
            return $rootScope.global.ajax.Query_Code.$promise;
        }

        /**
         * {{\'440\'|translate}}{{\'68\'|translate}}excel
         */
        vm.fun.import = function () {
            var template = {
                request: new FormData(),
                modal: {
                    title: $filter('translate')('544'),
                    fileType: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    group: {
                        parent: GroupService.get(),
                        groupID: parseInt(vm.interaction.request.groupID),
                        childGroupID: parseInt(vm.interaction.request.childGroupID || -1),
                        grandSonGroupID: parseInt(vm.interaction.request.grandSonGroupID || -1)
                    },
                    inputObject: {
                        type: 'file'
                    },
                    secondTitle: $filter('translate')('271')
                }
            }
            if ((!template.modal.group.parent) || (template.modal.group.parent == 0)) {
                $rootScope.InfoModal($filter('translate')('478'), 'error');
                return;
            }
            template.request.append('spaceKey', vm.interaction.request.spaceKey);
            template.request.append('projectID', vm.interaction.request.projectID);
            $rootScope.Common_UploadFile(template.modal, function (callback) {
                if (callback) {
                    template.request.append('groupID', callback.groupID);
                    template.request.append('excel', callback.file);
                    $scope.$broadcast('$Init_LoadingCommonComponent', {
                        status: 'import',
                        request: template.request
                    })
                }
            });
        }
        vm.fun.load = function (arg) {
            var template = {
                promise: null,
                request: arg.request
            }
            template.promise = ApiManagementResource.Code.Import(template.request).$promise.then(function (response) {
                switch (response.statusCode) {
                    case CODE.COMMON.SUCCESS:
                    case '510000':
                        {
                            fun.getQuery();
                            $rootScope.InfoModal($filter('translate')('479'), 'success');
                            break;
                        }
                    default:
                        {
                            $rootScope.InfoModal($filter('translate')('480') + RESPONSE_TEXT.FAILURE, 'error');
                            break;
                        }
                }
            })
            return template.promise;
        }
        vm.fun.edit = function (arg) {
            arg = arg || {};
            var template = {
                cache: GroupService.get(),
                modal: {
                    title: arg.item ? $filter('translate')('545') : $filter('translate')('546')
                }
            }
            if ((!template.cache) || (template.cache.length == 0)) {
                $rootScope.InfoModal($filter('translate')('478'), 'error');
            } else {
                if (arg.item) {
                    arg.item.version = 1;
                    arg.item.spaceKey = vm.interaction.request.spaceKey;
                    arg.item.projectID = vm.interaction.request.projectID;
                    arg.item.childGroupID = vm.interaction.request.childGroupID || -1;
                    arg.item.grandSonGroupID = vm.interaction.request.grandSonGroupID || -1;
                    $rootScope.AMS_CodeModal(template.modal.title, arg.item, function (callback) {
                        if (callback) {
                            $rootScope.InfoModal(template.modal.title + $filter('translate')('329'), 'success');
                            $scope.$broadcast('$Init_LoadingCommonComponent');
                        }
                    });
                } else {
                    arg.item = {
                        version: 1,
                        spaceKey: vm.interaction.request.spaceKey,
                        projectID: vm.interaction.request.projectID,
                        groupID: vm.interaction.request.groupID,
                        childGroupID: vm.interaction.request.childGroupID || -1,
                        grandSonGroupID: vm.interaction.request.grandSonGroupID || -1
                    }
                    $rootScope.AMS_CodeModal(template.modal.title, arg.item, function (callback) {
                        if (callback) {
                            $rootScope.InfoModal(template.modal.title + $filter('translate')('329'), 'success');
                        }
                        $scope.$broadcast('$Init_LoadingCommonComponent');
                    });
                }
            }

        }
        vm.fun.delete = function (arg) {
            var template = {
                request: {
                    spaceKey: vm.interaction.request.spaceKey,
                    projectID: vm.interaction.request.projectID,
                    codeID: '[' + arg.item.codeID + ']'
                }
            }
            $rootScope.EnsureModal($filter('translate')('547'), false, ENSURE_WARNIMG.DELETE, {}, function (callback) {
                if (callback) {
                    ApiManagementResource.Code.Delete(template.request).$promise
                        .then(function (response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        vm.interaction.response.query.splice(arg.$index, 1);
                                        $rootScope.InfoModal($filter('translate')('548'), 'success');
                                        break;
                                    }
                            }
                        })
                }
            });
        }
        fun.enter = function (arg) {
            console.log(arg)
            var template = {
                $index: vm.interaction.request.codeID.indexOf(arg.item.codeID)
            }
            if (vm.component.menuObject.show.batch.disable) {
                arg.item.isClick = !arg.item.isClick;
                if (arg.item.isClick) {
                    vm.interaction.request.codeID.push(arg.item.codeID);
                    vm.data.batch.address.push(arg.$index);
                } else {
                    vm.interaction.request.codeID.splice(template.$index, 1);
                    vm.data.batch.address.splice(template.$index, 1);
                }
            }
        }
        vm.fun.batchSort = function (pre, next) {
            return pre - next;
        }
        vm.fun.batchDefault = function () {
            if (vm.interaction.response.query && vm.interaction.response.query.length > 0) {
                vm.component.menuObject.show.batch.disable = true;
                vm.component.menuObject.show.batch.selectAll = false;
                try {
                    angular.forEach(vm.data.batch.address, function (val, key) {
                        vm.interaction.response.query[val].isClick = false;
                    })
                } catch (e) {}
                vm.interaction.request.codeID = [];
                vm.data.batch.address = [];
                $rootScope.InfoModal($filter('translate')('489'), 'success');
            } else {
                $rootScope.InfoModal($filter('translate')('490'), 'error');
            }
        }
        vm.fun.batchDelete = function () {
            var template = {
                request: {
                    spaceKey: vm.interaction.request.spaceKey,
                    projectID: vm.interaction.request.projectID,
                    codeID: JSON.stringify(vm.interaction.request.codeID)
                },
                loop: {
                    num: 0
                }
            }
            $rootScope.EnsureModal($filter('translate')('547'), false, ENSURE_WARNIMG.DELETE, {}, function (callback) {
                if (callback) {
                    ApiManagementResource.Code.Delete(template.request).$promise
                        .then(function (response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        angular.forEach(vm.data.batch.address.sort(vm.fun.batchSort), function (val, key) {
                                            val = val - template.loop.num++;
                                            vm.interaction.response.query.splice(val, 1);
                                        })
                                        vm.component.menuObject.show.batch.disable = false;
                                        vm.interaction.request.codeID = [];
                                        vm.data.batch.address = [];
                                        $rootScope.InfoModal($filter('translate')('548'), 'success');
                                        break;
                                    }
                                default:
                                    {
                                        $rootScope.InfoModal($filter('translate')('385') + RESPONSE_TEXT.FAILURE, 'error');
                                        break;
                                    }
                            }
                        })
                }
            });
        }

        /**
         * 初始化功能函数
         * @param  {object} arg 传参状态{status:请求加载状态}
         * 
         */
        vm.fun.init = function (arg) {
            arg = arg || {};
            switch (arg.status) {
                case 'import':
                    {
                        return vm.fun.load(arg)
                    }
                default:
                    {
                        return fun.getQuery();
                    }
            }
        }

        vm.$onInit = function () {
            vm.component.menuObject.list = [{
                type: 'btn',
                showVariable: 'disable',
                showPoint: 'batch',
                class: 'btn-group-li pull-left',
                authority: 'edit',
                btnList: [{
                    name: $filter('translate')('546'),
                    icon: 'tianjia',
                    class: 'eo-button-success',
                    show: false,
                    fun: {
                        default: vm.fun.edit,
                        params: ''
                    }
                }]
            }, {
                type: 'btn',
                showVariable: 'disable',
                showPoint: 'batch',
                class: 'first-tab-li btn-group-li pull-left',
                authority: 'edit',
                btnList: [{
                    name: $filter('translate')('440'),
                    icon: 'shangchuan',
                    show: false,
                    fun: {
                        default: vm.fun.import
                    }
                }]
            }, {
                type: 'download',
                name: $filter('translate')('549'),
                icon: 'xiazai',
                class: 'last-tab-li btn-group-li pull-left',
                href: 'app/assets/office/statusCode_Import.xls',
                download: $filter('translate')('550'),
                showVariable: 'disable',
                showPoint: 'batch',
                show: false,
                authority: 'edit'
            }, {
                type: 'btn',
                showVariable: 'disable',
                showPoint: 'batch',
                class: 'btn-group-li pull-left',
                authority: 'edit',
                disabledPoint: 'query',
                disabledVariable: 'length',
                btnList: [{
                    name: $filter('translate')('502'),
                    show: false,
                    fun: {
                        default: vm.fun.batchDefault
                    }
                }, {
                    name: $filter('translate')('13'),
                    icon: 'close',
                    class: 'default-btn first-btn',
                    show: true,
                    fun: {
                        default: function () {
                            vm.component.menuObject.show.batch.disable = false;
                        }
                    }
                }]
            }, {
                type: 'btn',
                showVariable: 'disable',
                showPoint: 'batch',
                class: 'btn-group-li pull-left',
                authority: 'edit',
                disabledPoint: 'query',
                disabledVariable: 'length',
                btnList: [{
                    name: $filter('translate')('259'),
                    icon: 'shanchu',
                    show: true,
                    disabled: 0,
                    fun: {
                        default: vm.fun.batchDelete
                    }
                }]
            },  {
                type: 'btn',
                showVariable: 'disable',
                showPoint: 'batch',
                class: 'btn-group-li pull-right mr20',
                disabledPoint: 'query',
                disabledVariable: 'length',
                btnList: [{
                    name: $filter('translate')('80'),
                    icon: 'sousuo',
                    show: false,
                    fun: {
                        default: fun.search
                    }
                }]
            }];

            vm.component.listRequireObject.mainObject.fun = {
                click: fun.enter
            }
            vm.component.listRequireObject.mainObject.tdList = [{
                html: '<input autocomplete="off" class="hidden" type="checkbox" id="api_checkbox_all"  ng-model="$ctrl.otherObject.selectAll" ng-click="$ctrl.mainObject.tdList[0].fun()"><label for="api_checkbox_all" class="eo-checkbox iconfont" ng-class="{\'icon-check\':$ctrl.otherObject.selectAll==true}">{{$ctrl.otherObject.selectAll?\'\':\'&nbsp;\'}}</label></span>',
                type: 'customized-html',
                keyType: 'customized-html',
                keyHtml: '<label class="eo-checkbox iconfont" ng-class="{\'icon-check\':item.isClick==true}">{{item.isClick?\'\':\'&nbsp;\'}}</label>',
                style: {
                    'width': '50px'
                },
                showPoint: 'batch',
                showVariable: 'disable',
                show: true,
                fun: function (arg) {
                    vm.component.menuObject.show.batch.selectAll = !vm.component.menuObject.show.batch.selectAll;
                    if (vm.component.menuObject.show.batch.selectAll) {
                        vm.interaction.response.query.map(function (val, key) {
                            if (!val.isClick) {
                                vm.interaction.request.codeID.push(val.codeID);
                                vm.data.batch.address.push(key);
                                val.isClick = true;
                            }
                        })
                    } else {
                        angular.forEach(vm.data.batch.address, function (val, key) {
                            vm.interaction.response.query[val].isClick = false;
                        })
                        vm.interaction.request.codeID = [];
                        vm.data.batch.address = [];
                    }
                },
            }, {
                name: $filter('translate')('551'),
                key: 'code',
                style: {
                    'width': '18%'
                }
            }, {
                name: $filter('translate')('69'),
                key: 'codeDescription',
                title: 'codeDescription',
                style: {
                    'min-width': '220px'
                }
            }, {
                name: $filter('translate')('552'),
                key: 'groupName',

                style: {
                    'min-width': '200px',
                    "width": "23%"
                }
            }, {
                name: $filter('translate')('7'),
                keyType: 'btn',
                style: {
                    'width': '150px'
                },
                authority: 'edit',
                showPoint: 'batch',
                showVariable: 'disable',
                show: false,
                btnList: [{
                    name: $filter('translate')('324'),
                    fun: {
                        default: vm.fun.edit,
                        params: {
                            status: 'edit'
                        }
                    }
                }, {
                    name: $filter('translate')('259'),
                    fun: {
                        default: vm.fun.delete
                    }
                }]
            }]
        }
    }
})();