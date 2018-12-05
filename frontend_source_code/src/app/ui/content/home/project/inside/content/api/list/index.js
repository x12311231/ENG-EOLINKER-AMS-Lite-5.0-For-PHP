(function() {
    /**
     * @name API列表
     * @author 广州银云信息科技有限公司 
     */
    'use strict';
    angular.module('eolinker')
        .component('homeProjectInsideApiList', {
            template: '<div on-resize-directive  change-fun="$ctrl.fun.onResize()" class="apimanagement-scss-api-list home-project-inside-div">' +
                '<menu-common-component authority-object="{\'edit\':$ctrl.service.authority.permission.project.apiManagement.edit,\'export\':$ctrl.service.authority.permission.project.exportAndShare.export}" other-object="{query:$ctrl.data.batch.address}" active-object="$ctrl.component.menuObject.active" show-object="$ctrl.component.menuObject.show" list="$ctrl.component.menuObject.list"></menu-common-component>' +
                '<list-require-common-component authority-object="{edit:$ctrl.service.authority.permission.project.apiManagement.edit}" main-object="$ctrl.component.listRequireObject.mainObject" list="$ctrl.service.home.envObject.object.model" active-object="$ctrl.component.menuObject.show.batch" show-object="{more:$ctrl.component.menuObject.active.more,batch:$ctrl.component.menuObject.show.batch}" other-object="{apiNum:$ctrl.data.apiNum,selectAll:$ctrl.component.menuObject.show.batch.selectAll}"></list-require-common-component>' +
                '<loading-common-component fun="$ctrl.fun.init(arg)"></loading-common-component>' +
                '</div>',
            controller: indexController,
            bindings: {
                'envStatus': '='
            }
        })

    indexController.$inject = ['RESPONSE_TEXT', 'Operate_CommonService', 'ENSURE_WARNIMG', '$scope', 'ApiManagementResource', '$state', 'CODE', '$rootScope', 'GroupService', 'Authority_CommonService', 'Cache_CommonService','$filter'];

    function indexController(RESPONSE_TEXT, Operate_CommonService, ENSURE_WARNIMG, $scope, ApiManagementResource, $state, CODE, $rootScope, GroupService, Authority_CommonService, Cache_CommonService,$filter) {
        var vm = this;
        vm.data = {
            text:$filter('translate')('206'),
            apiNum: 0,
            batch: {
                address: []
            }
        }
        vm.service = {
            home: Operate_CommonService,
            authority: Authority_CommonService,
        };
        vm.fun = {};
        var service = {
                cache: Cache_CommonService
            },
            fun = {},
            interaction = {
                request: {
                    spaceKey: $state.params.spaceKey,
                    projectID: $state.params.projectID,
                    groupID: $state.params.groupID || -1,
                    childGroupID: $state.params.childGroupID,
                    grandSonGroupID: $state.params.grandSonGroupID,
                    tips: $state.params.groupID ? '' : window.sessionStorage.getItem('COMMON_SEARCH_TIP'),
                    orderBy: 1,
                    asc: 1,
                    apiID: [],
                    connID: null,
                    apiStatus: '0'
                },
                response: {}
            },
            data = {
                apiList: [],
                currentApiListLength: 0
            };
        vm.component = {
            menuObject: {
                show: {
                    batch: {
                        disable: false
                    }
                },
                active: {
                    sort: JSON.parse(window.localStorage['PROJECT_SORTTYPE'] || '{"orderBy":3,"asc":0}'),
                    condition: 0,
                    more: parseInt(window.localStorage['PROJECT_MORETYPE']) || 1
                }
            },
            listRequireObject: {
                mainObject: {
                    baseInfo: {
                        ajaxTime: 0,
                        active: 'disable',
                        class: 'hover-tr'
                    },
                    tdList: [],
                    fun: {}
                }
            }
        };
        fun.search = function() {
            var template = {
                searchObject: JSON.parse(interaction.request.tips || '{}')
            }
            $rootScope.AMS_ApiSearchModal({
                request: {
                    keyword: template.searchObject.tips,
                    apiStatus: Number.isInteger(template.searchObject.apiStatus) ? template.searchObject.apiStatus : -1,
                    requestMethod: Number.isInteger(template.searchObject.apiRequestType) ? template.searchObject.apiRequestType : -1,
                    apiStarStatus: Number.isInteger(template.searchObject.starred) ? template.searchObject.starred : -1,
                    creator: JSON.parse(template.searchObject.creatorID || '[]').join(','),
                    updater: JSON.parse(template.searchObject.updaterID || '[]').join(',')
                },
                resource: {
                    getMemberList: ApiManagementResource.Partner.QueryAll
                },
                resourceParams: {
                    spaceKey: interaction.request.spaceKey,
                    projectID: interaction.request.projectID
                }
            }, function(callback) {
                if (callback) {
                    window.sessionStorage.setItem('COMMON_SEARCH_TIP', JSON.stringify(callback));
                    if ($state.params.groupID) {
                        $state.go('home.project.inside.api.list', {
                            groupID: null
                        });
                    } else {
                        $state.reload('home.project.inside.api.list');
                    }
                }
            })
        }
        fun.translateApiStatus = function(apiStatus) {
            var output = {}
            switch (apiStatus) {
                case 0:
                    {
                        output.apiStatusString = $filter('translate')('58');
                        output.apiStatusClass = 'eo-label-success';
                        break;
                    }
                case 1:
                    {
                        output.apiStatusString = $filter('translate')('60');
                        output.apiStatusClass = 'eo-label-warning';
                        break;
                    }
                case 2:
                    {
                        output.apiStatusString = $filter('translate')('62');
                        output.apiStatusClass = 'eo-label-tips';
                        break;
                    }
                case 3:
                    {
                        output.apiStatusString = $filter('translate')('64');
                        output.apiStatusClass = 'eo-label-yellow';
                        break;
                    }
                case 4:
                    {
                        output.apiStatusString = $filter('translate')('59');
                        output.apiStatusClass = 'eo-label-default';
                        break;
                    }
                case 5:
                    {
                        output.apiStatusString = $filter('translate')('61');
                        output.apiStatusClass = 'eo-label-default';
                        break;
                    }
                case 6:
                    {
                        output.apiStatusString = $filter('translate')('63');
                        output.apiStatusClass = 'eo-label-default';
                        break;
                    }
                case 7:
                    {
                        output.apiStatusString = 'BUG';
                        output.apiStatusClass = 'eo-label-danger';
                        break;
                    }
                case 8:
                    {
                        output.apiStatusString = $filter('translate')('65');
                        output.apiStatusClass = 'eo-label-purple';
                        break;
                    }
            }
            return output;
        }
        fun.filter = function(inputArray) {
            var template = {
                output: [],
                apiStatusObject: {}
            }
            for (var key in inputArray) {
                var val = inputArray[key];
                template.apiStatusObject = fun.translateApiStatus(val.apiStatus);
                val.apiStatusClass = template.apiStatusObject.apiStatusClass;
                val.apiStatusString = template.apiStatusObject.apiStatusString;
                switch (val.apiRequestType) {
                    case 0:
                        {
                            val.apiRequestMethod = 'POST';
                            val.apiRequestMethodClass = 'eo-label-success';
                            break;
                        }
                    case 1:
                        {
                            val.apiRequestMethod = 'GET';
                            val.apiRequestMethodClass = 'eo-label-default';
                            break;
                        }
                    case 2:
                        {
                            val.apiRequestMethod = 'PUT';
                            val.apiRequestMethodClass = 'eo-label-others';
                            break;
                        }
                    case 3:
                        {
                            val.apiRequestMethod = 'DEL';
                            val.apiRequestMethodClass = 'eo-label-danger';
                            break;
                        }
                    case 4:
                        {
                            val.apiRequestMethod = 'HEAD';
                            val.apiRequestMethodClass = 'eo-label-yellow';
                            break;
                        }
                    case 5:
                        {
                            val.apiRequestMethod = 'OPTS';
                            val.apiRequestMethodClass = 'eo-label-options';
                            break;
                        }
                    case 6:
                        {
                            val.apiRequestMethod = 'PATCH';
                            val.apiRequestMethodClass = 'eo-label-warning';
                            break;
                        }
                }
                template.output.push(val);
            }
            return template.output;
        }
        fun.setMore = function(arg) {
            vm.component.menuObject.active.more = arg.switch;
            window.localStorage.setItem('PROJECT_MORETYPE', arg.switch);
        }
        vm.fun.onResize = function() {
            if (window.innerWidth <= 1300) {
                fun.setMore({
                    switch: "2"
                })
            } else if (window.innerWidth > 1700) {
                fun.setMore({
                    switch: "1"
                })
            }
        }
        vm.fun.onResize();
        /**
         * {{\'475\'|translate}}
         */
        fun.export = function() {
            var template = {
                cache: service.cache.get('ENV_QUERY_AMS_COMPONENT'),
                modal: {
                    mark: 'exceptHtml',
                    title: $filter('translate')('475'),
                    spaceKey: interaction.request.spaceKey,
                    request: {
                        projectID: interaction.request.projectID,
                        apiID: JSON.stringify(interaction.request.apiID),
                    },
                    resource: ApiManagementResource.Api
                },
                fun: null
            }
            template.fun = function() {
                $rootScope.AMS_ExportModal(template.modal, function(callback) {
                    if (callback) {
                        vm.component.menuObject.show.batch.disable = false;
                        interaction.request.apiID = [];
                    }
                });
            }
            template.fun();
        }

        /**
         * {{\'509\'|translate}}
         */
        fun.import = function() {
            var template = {
                request: {
                    spaceKey: interaction.request.spaceKey,
                    projectID: interaction.request.projectID
                },
                reader: null,
                modal: {
                    title: $filter('translate')('476'),
                    group: {
                        parent: GroupService.get(),
                        groupID: parseInt(interaction.request.groupID),
                        childGroupID: parseInt(interaction.request.childGroupID),
                        grandSonGroupID: parseInt(interaction.request.grandSonGroupID)
                    },
                    inputObject: {
                        type: 'file'
                    },
                    secondTitle: $filter('translate')('477')
                }
            }
            if ((!template.modal.group.parent) || (template.modal.group.parent == 0)) {
                $rootScope.InfoModal($filter('translate')('478'), 'error');
                return;
            }
            $rootScope.Common_UploadFile(template.modal, function(callback) {
                if (callback) {
                    template.request.groupID = callback.groupID;
                    template.reader = new FileReader();
                    template.reader.readAsText(callback.file);
                    template.reader.onloadend = function(evt) {
                        template.request.data = this.result;
                        $scope.$broadcast('$Init_LoadingCommonComponent', {
                            status: 'import',
                            request: template.request
                        });
                    }

                }
            });
        }

        /**
         * 加载状态，发送请求
         * @param  {object} arg 请求
         * @return {promise}     请求promise
         */
        fun.load = function(arg) {
            var template = {
                promise: null,
                request: arg.request
            }
            template.promise = ApiManagementResource.Api.Import(template.request).$promise.then(function(response) {
                switch (response.statusCode) {
                    case CODE.COMMON.SUCCESS:
                        {
                            fun.init();
                        }
                    case '510000':
                        {
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
        fun.edit = function(arg) {
            arg = arg || {};
            var template = {
                cache: GroupService.get(),
                uri: {
                    groupID: $state.params.groupID || (window.sessionStorage.getItem('COMMON_SEARCH_TIP') ? null : interaction.request.groupID),
                    childGroupID: interaction.request.childGroupID,
                    grandSonGroupID: interaction.request.grandSonGroupID
                }
            }
            if ((!template.cache) || (template.cache.length == 0)) {
                $rootScope.InfoModal($filter('translate')('478'), 'error');
            } else {
                if (arg.status == 'add') {
                    template.uri.status = 'add';
                } else {
                    template.uri.status = 'edit';
                    template.uri.apiID = arg.item.apiID;
                }
                $state.go('home.project.inside.api.edit', template.uri)
            }
        }
        fun.sort = function(arg) {
            arg.item.asc = arg.item.asc == 0 ? 1 : 0;
            vm.component.menuObject.active.sort = arg.item;
            window.localStorage.setItem('PROJECT_SORTTYPE', angular.toJson(arg.item));
            $scope.$broadcast('$Init_LoadingCommonComponent', {
                boolean: true
            });
        }
        fun.storage = function(arg) {
            if (vm.component.menuObject.show.batch.disable || interaction.request.groupID == '-2') {
                fun.click(arg);
                return;
            }
            arg = arg || {};
            var template = {
                request: {
                    spaceKey: interaction.request.spaceKey,
                    projectID: interaction.request.projectID,
                    apiID: arg.item.apiID
                }
            }
            switch (arg.item.starred) {
                case 0:
                    {
                        ApiManagementResource.Star.Add(template.request).$promise
                        .then(function(response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        arg.item.starred = 1;
                                        break;
                                    }
                            }
                        });
                        break;
                    }
                case 1:
                    {
                        ApiManagementResource.Star.Delete(template.request).$promise
                        .then(function(response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        arg.item.starred = 0;
                                        break;
                                    }
                            }
                        });
                        break;
                    }
            }
        }

        /**
         * {{\'451\'|translate}}/{{\'481\'|translate}}操作
         * @param {object} arg 
         * @param {object} options 操作对象{mark:目标,status:操作对象}
         */
        fun.deleteOrRemoveApi = function(arg, options) {
            var template = {
                request: {
                    spaceKey: interaction.request.spaceKey,
                    projectID: interaction.request.projectID
                },
                ensureModal: null,
                infoModal: null,
                resource: null
            }
            switch (options.status) {
                case 'remove':
                    {
                        if (options.mark == 'single') {
                            template.ensureModal = {
                                title: $filter('translate')('481'),
                                secondTitle: $filter('translate')('482')
                            }
                        } else {
                            template.ensureModal = {
                                title: $filter('translate')('407'),
                                secondTitle: $filter('translate')('408')
                            }
                        }
                        template.infoModal = {
                            tip: $filter('translate')('409')
                        }
                        template.resource = ApiManagementResource.Api.Delete;
                        break;
                    }
                case 'delete':
                    {
                        template.ensureModal = {
                            title: $filter('translate')('413'),
                            secondTitle: ENSURE_WARNIMG.DELETE
                        }
                        template.infoModal = {
                            tip: $filter('translate')('414')
                        }
                        if (options.mark == 'batch') template.ensureModal.title = $filter('translate')('483') + template.ensureModal.title;
                        template.resource = ApiManagementResource.Trash.Delete;
                        break;
                    }

            }
            switch (options.mark) {
                case 'single':
                    {
                        template.request.apiID = '[' + arg.item.apiID + ']';
                        template.fun = function(index) {
                            vm.service.home.envObject.object.model.splice(index, 1);
                        }
                        break;
                    }
                case 'batch':
                    {
                        template.request.apiID = JSON.stringify(interaction.request.apiID);
                        template.fun = function() {
                            var loopNum = 0;
                            angular.forEach(vm.data.batch.address.sort(fun.batchSort), function(val, key) {
                                val = val - loopNum++;
                                vm.service.home.envObject.object.model.splice(val, 1);
                            })
                            vm.component.menuObject.show.batch.disable = false;
                        }
                        break;
                    }
            }
            $rootScope.EnsureModal(template.ensureModal.title, false, template.ensureModal.secondTitle, {}, function(callback) {
                if (callback) {
                    template.resource(template.request).$promise
                        .then(function(response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        template.fun(arg.$index);
                                        $rootScope.InfoModal(template.infoModal.tip, 'success');
                                        break;
                                    }
                                default:
                                    {
                                        $rootScope.InfoModal($filter('translate')('484') + RESPONSE_TEXT.FAILURE, 'error');
                                        break;
                                    }
                            }
                        })
                }
            });
        }
        fun.recover = function(arg) {
            arg = arg || {};
            var template = {
                modal: {
                    list: angular.copy(GroupService.get()),
                    title: $filter('translate')('410')
                },
                request: {
                    spaceKey: interaction.request.spaceKey,
                    projectID: interaction.request.projectID,
                    apiID: '[' + arg.item.apiID + ']',
                    groupID: ''
                }
            }
            if ((!template.modal.list) || (template.modal.list.length == 0)) {
                $rootScope.InfoModal($filter('translate')('485'), 'error');
                return;
            }
            $rootScope.SelectVisualGroupModal(template.modal, function(callback) {
                if (callback) {
                    template.request.groupID = callback.groupID;
                    ApiManagementResource.Trash.Recover(template.request).$promise
                        .then(function(response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        $rootScope.InfoModal($filter('translate')('412'), 'success');
                                        vm.service.home.envObject.object.model.splice(arg.$index, 1);
                                        break;
                                    }
                            }
                        })
                }
            });
        }
        fun.clean = function() {
            var template = {
                request: {
                    spaceKey: interaction.request.spaceKey,
                    projectID: interaction.request.projectID
                }
            }
            $rootScope.EnsureModal($filter('translate')('486'), false, $filter('translate')('487'), {}, function(callback) {
                if (callback) {
                    ApiManagementResource.Trash.Clean(template.request).$promise
                        .then(function(response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        $rootScope.InfoModal($filter('translate')('488'), 'success');
                                        vm.service.home.envObject.object.model = [];
                                        break;
                                    }
                            }
                        })
                }
            });
        }
        fun.click = function(arg, $event) {
            var template = {
                $index: interaction.request.apiID.indexOf(arg.item.apiID)
            };
            if (vm.component.menuObject.show.batch.disable) {
                arg.item.isClick = !arg.item.isClick;
                if (arg.item.isClick) {
                    interaction.request.apiID.push(arg.item.apiID);
                    vm.data.batch.address.push(arg.$index);
                } else {
                    interaction.request.apiID.splice(template.$index, 1);
                    vm.data.batch.address.splice(template.$index, 1);
                }
                return;
            }
            try {
                //get button mark
                template.point = $event.target.classList[0];
            } catch (e) {
                // default enter the api detail
                template.point = 'default';
            }
            switch (template.point) {
                case 'btn-star':
                    {
                        fun.storage(arg)
                        break;
                    }
                case 'btn-newtag':
                    {
                        fun.newTarget(arg)
                        break;
                    }
                case 'btn-edit':
                    {
                        arg.status = 'edit';
                        fun.edit(arg);
                        break;
                    }
                case 'btn-recover':
                    {
                        fun.recover(arg);
                        break;
                    }
                case 'btn-delete':
                    {
                        fun.deleteOrRemoveApi(arg, {
                            mark: 'single',
                            status: 'delete'
                        });
                        break;
                    }
                case 'btn-remove':
                    {
                        fun.deleteOrRemoveApi(arg, {
                            mark: 'single',
                            status: 'remove'
                        });
                        break;
                    }
                case 'btn-change-status':
                    {
                        fun.changeApiStatus('single', {
                            item: {
                                apiID: arg.item.apiID
                            },
                            $index: arg.$index
                        });
                        break;
                    }
                default:
                    {
                        $state.go('home.project.inside.api.detail', {
                            groupID: $state.params.groupID || (window.sessionStorage.getItem('COMMON_SEARCH_TIP') ? null : interaction.request.groupID),
                            childGroupID: interaction.request.childGroupID,
                            grandSonGroupID: interaction.request.grandSonGroupID,
                            apiID: arg.item.apiID
                        });
                        break;
                    }
            }

        }
        fun.newTarget = function(arg) {
            var template = {
                uri: {
                    groupID: $state.params.groupID || (window.sessionStorage.getItem('COMMON_SEARCH_TIP') ? null : interaction.request.groupID),
                    childGroupID: interaction.request.childGroupID,
                    grandSonGroupID: interaction.request.grandSonGroupID,
                    apiID: arg.item.apiID
                }
            }
            window.open($state.href('home.project.inside.api.detail', template.uri), '_blank');
        }
        fun.batchSort = function(pre, next) {
            return pre - next;
        }
        fun.batchDefault = function() {
            if (vm.service.home.envObject.object.model && vm.service.home.envObject.object.model.length > 0) {
                vm.component.menuObject.show.batch.disable = true;
                vm.component.menuObject.show.batch.selectAll = false;
                try {
                    angular.forEach(vm.data.batch.address, function(val, key) {
                        vm.service.home.envObject.object.model[val].isClick = false;
                    })
                } catch (e) {}
                vm.data.batch.address = [];
                interaction.request.apiID = [];
                $rootScope.InfoModal($filter('translate')('489'), 'success');
            } else {
                $rootScope.InfoModal($filter('translate')('490'), 'error');
            }
        }
        fun.batchMoveGroup = function() {
            var template = {
                modal: {
                    list: angular.copy(GroupService.get()),
                    title: $filter('translate')('491'),
                },
                request: {
                    spaceKey: interaction.request.spaceKey,
                    projectID: interaction.request.projectID,
                    apiID: JSON.stringify(interaction.request.apiID),
                    groupID: ''
                },
                loop: {
                    num: 0
                }
            }
            if ((!template.modal.list) || (template.modal.list.length == 0)) {
                $rootScope.InfoModal($filter('translate')('485'), 'error');
                return;
            }
            $rootScope.SelectVisualGroupModal(template.modal, function(callback) {
                if (callback) {
                    template.request.groupID = callback.groupID;
                    ApiManagementResource.Api.Move(template.request).$promise
                        .then(function(response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        if (!(interaction.request.groupID == callback.grandParentGroupID || interaction.request.groupID == callback.parentGroupID || (interaction.request.groupID || -1).toString() == '-1' || interaction.request.groupID == callback.groupID)) {
                                            angular.forEach(vm.data.batch.address.sort(fun.batchSort), function(val, key) {
                                                val = val - template.loop.num++;
                                                vm.service.home.envObject.object.model.splice(val, 1);
                                            })
                                        }
                                        vm.component.menuObject.show.batch.disable = false;
                                        $rootScope.InfoModal($filter('translate')('492'), 'success');
                                        break;
                                    }
                                default:
                                    {
                                        $rootScope.InfoModal($filter('translate')('493') + RESPONSE_TEXT.FAILURE, 'error');
                                        break;
                                    }
                            }
                        })
                }
            })
        }
        fun.changeApiStar = function(arg) {
            var template = {
                request: {
                    spaceKey: interaction.request.spaceKey,
                    projectID: interaction.request.projectID,
                    apiID: JSON.stringify(interaction.request.apiID),
                    starred: arg.item.value
                }
            }
            ApiManagementResource.Api.ChangeStar(template.request).$promise
                .then(function(response) {
                    switch (response.statusCode) {
                        case CODE.COMMON.SUCCESS:
                            {
                                angular.forEach(vm.data.batch.address.sort(fun.batchSort), function(val, key) {
                                    vm.service.home.envObject.object.model[val].starred = arg.item.value;
                                })
                                vm.component.menuObject.show.batch.disable = false;
                                $rootScope.InfoModal($filter('translate')('494'), 'success');
                                break;
                            }
                        default:
                            {
                                $rootScope.InfoModal($filter('translate')('495') + RESPONSE_TEXT.FAILURE, 'error');
                                break;
                            }
                    }
                })
        }
        fun.changeApiStatus = function(status, arg) {
            arg = arg || {};
            var template = {
                request: {
                    spaceKey: interaction.request.spaceKey,
                    projectID: interaction.request.projectID,
                    apiID: status == 'single' ? '[' + arg.item.apiID + ']' : JSON.stringify(interaction.request.apiID)
                },
                apiStatusObject: {}
            }
            template.fun = function($index, value) {
                template.request.apiStatus = value;
                ApiManagementResource.Api.ChangeStatus(template.request).$promise
                    .then(function(response) {
                        switch (response.statusCode) {
                            case CODE.COMMON.SUCCESS:
                                {
                                    template.apiStatusObject = fun.translateApiStatus(value);
                                    switch (status) {
                                        case 'single':
                                            {
                                                vm.service.home.envObject.object.model[$index].apiStatusClass = template.apiStatusObject.apiStatusClass;
                                                vm.service.home.envObject.object.model[$index].apiStatusString = template.apiStatusObject.apiStatusString;
                                                $rootScope.InfoModal($filter('translate')('445'), 'success');
                                                break;
                                            }
                                        case 'batch':
                                            {
                                                angular.forEach(vm.data.batch.address.sort(fun.batchSort), function(val, key) {
                                                    vm.service.home.envObject.object.model[val].apiStatusClass = template.apiStatusObject.apiStatusClass;
                                                    vm.service.home.envObject.object.model[val].apiStatusString = template.apiStatusObject.apiStatusString;
                                                })
                                                vm.component.menuObject.show.batch.disable = false;
                                                $rootScope.InfoModal($filter('translate')('496'), 'success');
                                                break;
                                            }
                                    }
                                    break;
                                }
                            default:
                                {
                                    $rootScope.InfoModal($filter('translate')('446') + RESPONSE_TEXT.FAILURE, 'error');
                                    break;
                                }
                        }
                    })
            }
            switch (status) {
                case 'single':
                    {
                        $rootScope.AMS_ChangeStatusModal(function(callback) {
                            if (callback) {
                                template.fun(arg.$index, callback.status);
                            }
                        })
                        break;
                    }
                case 'batch':
                    {
                        template.fun(arg.$index, arg.item.value);
                        break;
                    }
            }

        }
        fun.batchRecover = function() {
            var template = {
                modal: {
                    list: angular.copy(GroupService.get()),
                    title: $filter('translate')('410')
                },
                request: {
                    spaceKey: interaction.request.spaceKey,
                    projectID: interaction.request.projectID,
                    apiID: JSON.stringify(interaction.request.apiID),
                    groupID: ''
                },
                loop: {
                    num: 0
                }
            }
            if ((!template.modal.list) || (template.modal.list.length == 0)) {
                $rootScope.InfoModal($filter('translate')('485'), 'error');
                return;
            }
            $rootScope.SelectVisualGroupModal(template.modal, function(callback) {
                if (callback) {
                    template.request.groupID = callback.groupID;
                    ApiManagementResource.Trash.Recover(template.request).$promise
                        .then(function(response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        angular.forEach(vm.data.batch.address.sort(fun.batchSort), function(val, key) {
                                            val = val - template.loop.num++;
                                            vm.service.home.envObject.object.model.splice(val, 1);
                                        })
                                        vm.component.menuObject.show.batch.disable = false;
                                        $rootScope.InfoModal($filter('translate')('497'), 'success');
                                        break;
                                    }
                            }
                        })
                }
            });
        }
        fun.screen = function(arg) {
            if (vm.component.menuObject.active.condition == arg.item.value) return;
            vm.component.menuObject.active.condition = arg.item.value;
            interaction.request.connID = null;
            $scope.$broadcast('$Init_LoadingCommonComponent', {
                boolean: true
            });
        }
        fun.init = function() {
            var template = {
                request: {
                    spaceKey: interaction.request.spaceKey,
                    projectID: interaction.request.projectID,
                    groupID: interaction.request.grandSonGroupID || interaction.request.childGroupID || interaction.request.groupID,
                    orderBy: vm.component.menuObject.active.sort.orderBy,
                    asc: vm.component.menuObject.active.sort.asc
                },
                fun: function(response) {
                    data.apiList = fun.filter(response.apiList || []);
                    vm.service.home.envObject.object.model = angular.copy(data.apiList.slice(0, 100));
                    vm.data.apiNum = data.apiList.length;
                    $scope.$emit('$TransferStation', {
                        state: '$EnvInitReady',
                        data: {
                            status: 0
                        }
                    });
                }
            }
            if (interaction.request.tips) {
                try {
                    angular.merge(template.request, JSON.parse(interaction.request.tips));
                } catch (e) {
                    console.log(e);
                }
                template.resource = ApiManagementResource.Api.Search;
            } else if (interaction.request.groupID == -2) {
                template.resource = ApiManagementResource.Trash.Query;
            } else {
                template.request.condition = vm.component.menuObject.active.condition;
                template.request.connID = interaction.request.connID;
                template.request.apiStatus = interaction.request.apiStatus;
                template.resource = ApiManagementResource.Api.Query;
            }

            $rootScope.global.ajax.Query_Api = template.resource(template.request)
            $rootScope.global.ajax.Query_Api.$promise.then(template.fun);
            return $rootScope.global.ajax.Query_Api.$promise;
        }
        fun.apiStatusFilter = function(status, arg) {
            $rootScope.AMS_ChangeStatusModal(function(callback) {
                if (callback) {
                    vm.component.menuObject.active.condition = 4;
                    interaction.request.apiStatus = callback.status;
                    $scope.$broadcast('$Init_LoadingCommonComponent', {
                        boolean: true
                    });
                }
            })
        }
        fun.selectPerson = function(status, arg) {
            var template = {
                modal: {
                    title: status == 'create' ? $filter('translate')('498') : $filter('translate')('499'),
                    request: {
                        params: {
                            spaceKey: interaction.request.spaceKey,
                            projectID: interaction.request.projectID,
                        },
                        resource: ApiManagementResource.Partner.QueryAll,
                        responseKey: 'memberList',
                    }
                },
                fun: null
            }
            $rootScope.Common_SelectPersonModal(template.modal, function(callback) {
                if (callback) {
                    vm.component.menuObject.active.condition = arg.item.value;
                    interaction.request.connID = JSON.stringify(callback);
                    $scope.$broadcast('$Init_LoadingCommonComponent', {
                        boolean: true
                    });
                }
            });
        }
        fun.scrollLoading = function() {
                var template = {
                    apiList: []
                }
                if (data.currentApiListLength != vm.service.home.envObject.object.model.length) {
                    data.currentApiListLength = vm.service.home.envObject.object.model.length;
                    return;
                }
                if (data.apiList.length > vm.service.home.envObject.object.model.length) {
                    template.apiList = angular.copy(data.apiList.slice(vm.service.home.envObject.object.model.length, vm.service.home.envObject.object.model.length + 100));
                    data.currentApiListLength = template.apiList.length;
                    $scope.$emit('$TransferStation', {
                        state: '$PARSE_QUERY_ENV_AMS_COMPONENT',
                        data: {
                            apiList: template.apiList
                        }
                    });
                }
            }
            /**
             * 初始化功能函数
             * @param  {object} arg 传参状态{status:请求加载状态}
             */
        vm.fun.init = function(arg) {
            arg = arg || {};
            switch (arg.status) {
                case 'import':
                    {
                        return fun.load(arg)
                    }
                default:
                    {
                        return fun.init();
                    }
            }
        }
        vm.$onInit = function() {
            service.cache.clear('ENV_QUERY_AMS_COMPONENT')
            var template = {
                array: [],
                conditionArray: [],
                funAllSelect: function(arg) {
                    vm.component.menuObject.show.batch.selectAll = !vm.component.menuObject.show.batch.selectAll;
                    if (vm.component.menuObject.show.batch.selectAll) {
                        vm.service.home.envObject.object.model.map(function(val, key) {
                            if (!val.isClick) {
                                interaction.request.apiID.push(val.apiID);
                                vm.data.batch.address.push(key);
                                val.isClick = true;
                            }
                        })
                    } else {
                        angular.forEach(vm.data.batch.address, function(val, key) {
                            vm.service.home.envObject.object.model[val].isClick = false;
                        })
                        interaction.request.apiID = [];
                        vm.data.batch.address = [];
                    }
                }
            }
            $scope.$emit('$WindowTitleSet', {
                list: [$filter('translate')('500'), $state.params.projectName, $filter('translate')('405')]
            });
            vm.component.listRequireObject.mainObject.fun = {
                click: fun.click,
                scrollLoading: fun.scrollLoading
            }
            vm.component.listRequireObject.mainObject.tdList = [{
                html: '<input autocomplete="off" class="hidden" type="checkbox" id="api_checkbox_all"  ng-model="$ctrl.otherObject.selectAll" ng-click="$ctrl.mainObject.tdList[0].fun()"><label for="api_checkbox_all" class="eo-checkbox iconfont" ng-class="{\'icon-check\':$ctrl.otherObject.selectAll==true}">{{$ctrl.otherObject.selectAll?\'\':\'&nbsp;\'}}</label></span>',
                type: 'customized-html',
                showPoint: 'batch',
                showVariable: 'disable',
                show: true,
                keyType: 'customized-html',
                keyHtml: '<label class="eo-checkbox iconfont" ng-class="{\'icon-check\':item.isClick==true}">{{item.isClick?\'\':\'&nbsp;\'}}</label>',
                style: {
                    'width': '50px'
                },
                fun: template.funAllSelect
            }, {
                html: '<label class="iconfont icon-favorfill"></label>',
                type: 'customized-html',
                keyType: 'customized-html',
                keyHtml: interaction.request.groupID == '-2' ? '<span class="iconfont" ng-show="!($ctrl.showObject.batch.disable&&item.starred==0)" ng-class="{\'icon-favorfill\':item.starred==1}"><span>' : '<a class="btn-star iconfont" ng-if="$ctrl.authorityObject.edit" ng-show="!($ctrl.showObject.batch.disable&&item.starred==0)" ng-class="{\'icon-favor\':item.starred==0,\'icon-favorfill\':item.starred==1}"></a><span class="iconfont" ng-if="!$ctrl.authorityObject.edit" ng-class="{\'icon-favorfill\':item.starred==1}"></span>',
                style: {
                    'width': '36px'
                }
            }, {
                html: '<span>APIs&nbsp;</span><span class="count-span">{{\'[\'+($ctrl.otherObject.apiNum||0)+\']\'}}</span>',
                type: 'customized-html',
                keyType: 'customized-html',
                keyHtml: interaction.request.groupID == '-2' ? '<span class="api-status-label {{item.apiStatusClass}}"  title="'+vm.data.text+'">{{item.apiStatusString}}</span><div class="name-box"><span class="api-name">{{item.apiName}}</span><span class="btn-hover" copy-common-directive copy-model="item.apiName">{{\'215\'|translate}}</span></div>' : ('<span class="btn-change-status api-status-label {{item.apiStatusClass}}" title="'+vm.data.text+'" ng-if="$ctrl.authorityObject.edit">{{item.apiStatusString}}</span><span class="api-status-label {{item.apiStatusClass}}" title="'+vm.data.text+'" ng-if="!$ctrl.authorityObject.edit">{{item.apiStatusString}}</span>' +
                    '<div class="name-box"><span class="api-name">{{item.apiName}}</span><span class="btn-hover" copy-common-directive copy-model="item.apiName" >{{\'215\'|translate}}</span></div>'),
                style: {
                    'width': '25%'
                }
            }, {
                name: 'URL',
                keyType: 'customized-html',
                title: 'apiURI',
                keyHtml: '<span class="eo-method-label {{item.apiRequestMethodClass}}" >{{item.apiRequestMethod}}</span>' +
                    '<div class="url-box" ><span class="api-url">{{item.apiURI}}</span><span class="btn-hover"  copy-common-directive copy-model="item.apiURI">{{\'215\'|translate}}</span></div>',
                style: {
                    'width': '40%'
                }
            }];
            
            switch (interaction.request.groupID) {
                case '-2':
                    {
                        template.array = [{
                            type: 'btn',
                            showVariable: 'disable',
                            showPoint: 'batch',
                            class: 'btn-group-li pull-left',
                            authority: 'edit',
                            disabledPoint: 'query',
                            disabledVariable: 'length',
                            btnList: [{
                                name: $filter('translate')('501'),
                                icon: 'shanchu',
                                class: 'eo-button-danger',
                                show: false,
                                fun: {
                                    default: fun.clean
                                }
                            }, {
                                name: $filter('translate')('502'),
                                show: false,
                                fun: {
                                    default: fun.batchDefault
                                }
                            }, {
                                name: $filter('translate')('13'),
                                icon: 'close',
                                show: true,
                                class: 'default-btn first-btn',
                                fun: {
                                    default: function() {
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
                                name: $filter('translate')('503'),
                                icon: 'shuaxin',
                                show: true,
                                disabled: 0,
                                fun: {
                                    default: fun.batchRecover
                                }
                            }, {
                                name: $filter('translate')('504'),
                                icon: 'shanchu',
                                show: true,
                                disabled: 0,
                                fun: {
                                    default: fun.deleteOrRemoveApi,
                                    params: 'arg,{"mark":"batch","status":"delete"}'
                                }
                            }]
                        }];
                        vm.component.listRequireObject.mainObject.tdList = vm.component.listRequireObject.mainObject.tdList.concat([{
                            name: $filter('translate')('505'),
                            key: 'groupName',
                            style: {
                                'width': '100px'
                            },
                            showVariable: 'more',
                            show: 1
                        }, {
                            name: $filter('translate')('506'),
                            style: {
                                'width': '180px'
                            },
                            key: 'removeTime',
                            showVariable: 'more',
                            show: 1
                        }, {
                            name: $filter('translate')('507'),
                            keyType: 'btn',
                            style: {
                                'width': '130px'
                            },
                            authority: 'edit',
                            showPoint: 'batch',
                            showVariable: 'disable',
                            show: false,
                            btnList: [{
                                name: $filter('translate')('450'),
                                class: 'btn-recover'
                            }, {
                                name: $filter('translate')('451'),
                                class: 'btn-delete'
                            }]
                        }]);
                        break;
                    }
                case '-3':
                    {
                        break;
                    }
                default:
                    {
                        template.array = [{
                            type: 'btn',
                            showVariable: 'disable',
                            showPoint: 'batch',
                            class: 'btn-group-li pull-left',
                            authority: 'edit',
                            disabledPoint: 'query',
                            disabledVariable: 'length',
                            btnList: [{
                                name: $filter('translate')('508'),
                                icon: 'tianjia',
                                class: 'eo-button-success',
                                show: false,
                                fun: {
                                    default: fun.edit,
                                    params: {
                                        status: 'add'
                                    }
                                }
                            }, {
                                name: $filter('translate')('509'),
                                show: false,
                                fun: {
                                    default: fun.import
                                }
                            }, {
                                name: $filter('translate')('502'),
                                show: false,
                                fun: {
                                    default: fun.batchDefault
                                }
                            }, {
                                name: $filter('translate')('13'),
                                icon: 'close',
                                show: true,
                                class: 'default-btn first-btn',
                                fun: {
                                    default: function() {
                                        vm.component.menuObject.show.batch.disable = false;
                                    }
                                }
                            }]
                        }, {
                            type: 'fun-list',
                            class: 'first-btn btn-li sort-btn-li pull-left',
                            name: $filter('translate')('510'),
                            showVariable: 'disable',
                            showPoint: 'batch',
                            show: false,
                            disabledPoint: 'query',
                            disabledVariable: 'length',
                            disabled: 0,
                            rightIcon: 'xiangxia',
                            funList: [{
                                name: $filter('translate')('20'),
                                value: 0,
                                fun: {
                                    default: fun.changeApiStar
                                }
                            }, {
                                name: $filter('translate')('76'),
                                value: 1,
                                fun: {
                                    default: fun.changeApiStar
                                }
                            }]

                        }, {
                            type: 'fun-list',
                            class: 'margin-right-li-5px btn-li sort-btn-li pull-left',
                            name: $filter('translate')('511'),
                            showVariable: 'disable',
                            showPoint: 'batch',
                            show: false,
                            disabledPoint: 'query',
                            disabledVariable: 'length',
                            disabled: 0,
                            rightIcon: 'xiangxia',
                            funHtml: '<span class="iconfont icon-circle {{funItem.class}}" ></span><span>{{funItem.name}}</span>',
                            funList: [{
                                name: $filter('translate')('58'),
                                value: 0,
                                class: 'eo-status-success',
                                fun: {
                                    default: fun.changeApiStatus,
                                    params: '"batch",arg'
                                }
                            }, {
                                name: $filter('translate')('60'),
                                value: 1,
                                class: 'eo-status-warning',
                                fun: {
                                    default: fun.changeApiStatus,
                                    params: '"batch",arg'
                                }
                            }, {
                                name: $filter('translate')('62'),
                                value: 2,
                                class: 'eo-status-tips', // eo-status-tips eo-status-danger eo-status-yellow eo-status-default,
                                fun: {
                                    default: fun.changeApiStatus,
                                    params: '"batch",arg'
                                }
                            }, {
                                name: $filter('translate')('64'),
                                value: 3,
                                class: 'eo-status-yellow',
                                fun: {
                                    default: fun.changeApiStatus,
                                    params: '"batch",arg'
                                }
                            }, {
                                name: $filter('translate')('65'),
                                value: 8,
                                class: 'eo-status-purple',
                                fun: {
                                    default: fun.changeApiStatus,
                                    params: '"batch",arg'
                                }
                            }, {
                                name: $filter('translate')('59'),
                                value: 4,
                                class: 'eo-status-default',
                                fun: {
                                    default: fun.changeApiStatus,
                                    params: '"batch",arg'
                                }
                            }, {
                                name: $filter('translate')('61'),
                                value: 5,
                                class: 'eo-status-default',
                                fun: {
                                    default: fun.changeApiStatus,
                                    params: '"batch",arg'
                                }
                            }, {
                                name: $filter('translate')('63'),
                                value: 6,
                                class: 'eo-status-default',
                                fun: {
                                    default: fun.changeApiStatus,
                                    params: '"batch",arg'
                                }
                            }, {
                                name: 'BUG',
                                value: 7,
                                class: 'eo-status-danger',
                                fun: {
                                    default: fun.changeApiStatus,
                                    params: '"batch",arg'
                                }
                            }]

                        }, {
                            type: 'btn',
                            showVariable: 'disable',
                            showPoint: 'batch',
                            class: 'btn-group-li pull-left',
                            authority: 'export',
                            disabledPoint: 'query',
                            disabledVariable: 'length',
                            btnList: [{
                                name: $filter('translate')('475'),
                                show: true,
                                disabled: 0,
                                fun: {
                                    default: fun.export
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
                                name: $filter('translate')('512'),
                                show: true,
                                disabled: 0,
                                fun: {
                                    default: fun.batchMoveGroup
                                }
                            }, {
                                name: $filter('translate')('407'),
                                show: true,
                                disabled: 0,
                                fun: {
                                    default: fun.deleteOrRemoveApi,
                                    params: 'arg,{"mark":"batch","status":"remove"}'
                                }
                            }]
                        }];
                        vm.component.listRequireObject.mainObject.tdList = vm.component.listRequireObject.mainObject.tdList.concat([{
                            name: $filter('translate')('513'),
                            keyType: 'customized-html',
                            keyHtml: '<span>{{item.creator}}</span>',
                            style: {
                                'width': '11%'
                            },
                            showVariable: 'more',
                            show: 1
                        }, {
                            name: $filter('translate')('514'),
                            keyType: 'customized-html',
                            keyHtml: '<span>{{item.updater}}</span>',
                            style: {
                                'width': '11%'
                            },
                            showVariable: 'more',
                            show: 1
                        }, {
                            name: $filter('translate')('515'),
                            key: 'apiUpdateTime',
                            style: {
                                'width': '180px'
                            },
                            showVariable: 'more',
                            show: 1
                        }, {
                            name: $filter('translate')('507'),
                            keyType: 'btn',
                            style: {
                                'width': '200px'
                            },
                            authority: 'edit',
                            showPoint: 'batch',
                            showVariable: 'disable',
                            unNeedToBindClick: true,
                            show: false,
                            btnList: [{
                                name: $filter('translate')('516'),
                                class: 'btn-newtag'
                            }, {
                                name: $filter('translate')('324'),
                                class: 'btn-edit'
                            }, {
                                name: $filter('translate')('259'),
                                class: 'btn-remove'
                            }]
                        }])
                        if (!interaction.request.tips) {
                            template.conditionArray = [{
                                type: 'fun-list',
                                class: 'btn-li first-tab-li sort-btn-li pull-right',
                                name: $filter('translate')('517'),
                                icon: 'chouyang',
                                activePoint: 'condition',
                                showVariable: 'disable',
                                showPoint: 'batch',
                                show: true,
                                funList: [{
                                    name: $filter('translate')('20'),
                                    value: 0,
                                    active: 0,
                                    fun: {
                                        default: fun.screen
                                    }
                                }, {
                                    name: $filter('translate')('76'),
                                    value: 1,
                                    active: 1,
                                    fun: {
                                        default: fun.screen
                                    }
                                }, {
                                    name: $filter('translate')('518'),
                                    value: 4,
                                    active: 4,
                                    fun: {
                                        default: fun.apiStatusFilter
                                    }
                                }, {
                                    name: $filter('translate')('519'),
                                    value: 2,
                                    active: 2,
                                    fun: {
                                        default: fun.selectPerson,
                                        params: '\'update\',arg'
                                    }
                                }, {
                                    name: $filter('translate')('520'),
                                    value: 3,
                                    active: 3,
                                    fun: {
                                        default: fun.selectPerson,
                                        params: '\'create\',arg'
                                    }
                                }]

                            }];

                        }
                    }
            }
            vm.component.menuObject.list = [{
                type: 'divide',
                class: 'divide-li pull-right',
                showVariable: 'disable',
                showPoint: 'batch',
                show: true
            }, {
                type: 'tips-tab',
                class: 'view-btn-li pull-right mr5',
                activePoint: 'more',
                showVariable: 'disable',
                showPoint: 'batch',
                show: true,
                tabList: [{
                    name: $filter('translate')('521'),
                    icon: 'sort',
                    active: 1,
                    fun: {
                        default: fun.setMore,
                        params: {
                            switch: 1
                        }
                    }
                }, {
                    name: $filter('translate')('522'),
                    icon: 'more',
                    active: 2,
                    fun: {
                        default: fun.setMore,
                        params: {
                            switch: 2
                        }
                    }
                }]
            }, {
                type: 'fun-list',
                class: (interaction.request.groupID > -2 && !interaction.request.tips ? 'last-tab-li ' : '') + 'btn-li sort-btn-li pull-right',
                name: $filter('translate')('441'),
                icon: 'sort',
                activePoint: 'sort',
                activeVariable: 'orderBy',
                showVariable: 'disable',
                showPoint: 'batch',
                show: true,
                init: function(arg) {
                    if (arg.item.orderBy != vm.component.menuObject.active.sort.orderBy) return;
                    arg.item.asc = vm.component.menuObject.active.sort.asc;
                },
                funHtml: '<span>{{funItem.name}}[{{funItem.asc==0?(\'523\'|translate):(\'524\'|translate)}}]</span>',
                funList: [{
                    name: $filter('translate')('525'),
                    asc: 0,
                    orderBy: 3,
                    active: 3,
                    fun: {
                        default: fun.sort
                    }
                }, {
                    name: $filter('translate')('526'),
                    asc: 0,
                    orderBy: 1,
                    active: 1,
                    fun: {
                        default: fun.sort
                    }
                }, {
                    name: $filter('translate')('527'),
                    asc: 0,
                    orderBy: 0,
                    active: 0,
                    fun: {
                        default: fun.sort
                    }
                }, {
                    name: $filter('translate')('76'),
                    asc: 0,
                    orderBy: 2,
                    active: 2,
                    fun: {
                        default: fun.sort
                    }
                }]

            }];

            vm.component.menuObject.list = template.array.concat(vm.component.menuObject.list).concat(template.conditionArray).concat([{
                type: 'divide',
                class: 'divide-li pull-right margin-right-li-5px',
                showVariable: 'disable',
                showPoint: 'batch',
                show: true
            }, {
                type: 'btn',
                showVariable: 'disable',
                showPoint: 'batch',
                class: 'btn-group-li pull-right mr5',
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
            }]);
        }
        $rootScope.global.$watch.push($scope.$watch('$ctrl.component.menuObject.show.batch.disable', function() {
            vm.envStatus = vm.component.menuObject.show.batch.disable ? 'hide' : 'show';
        }))
    }
})();
