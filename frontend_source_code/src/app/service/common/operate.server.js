(function () {
    'use strict';
    /**
     * @name API研发管理公用服务
     * @author 广州银云信息科技有限公司
     * @required $rootScope 
     * @required $filter
     * @constant CODE
     */
    angular.module('eolinker.service')
        .factory('Operate_CommonService', index);

    index.$inject = ['$rootScope','$filter']

    function index($rootScope,$filter) {
        var outsideObject = {
                fun: {
                    operate: null,
                    init: null
                }
            },
            urlParamObject = {
                fun: {
                    $watch: null,
                    reset: null
                }
            },
            envObject = {
                object: {
                    model: null,
                    param: [],
                    fun: null,
                    urlParam: []
                },
                query: null,
                fun: {
                    resetObject: null, //重置变量双向绑定数据
                    clear: null, //清缓存功能函数
                }
            },
            searchObject = {
                fun: {}
            }
        searchObject.fun.search = function (status, option) {
            var template = {
                modal: {
                    title: $filter('translate')('331') + status,
                    textArray: [{
                        type: 'input',
                        title: $filter('translate')('73'),
                        key: 'q',
                        value: '',
                        required: true
                    }],
                    btnObject: {
                        class: 'eo-button-info',
                        text: $filter('translate')('80')
                    }
                }
            }
            $rootScope.MixInputModal(template.modal, function (callback) {
                if (callback) {
                    option.callback(callback.q);
                }
            })
        }
        envObject.fun.resetObject = function (modelType) {
            envObject.object = {
                model: modelType || {},
                param: [],
                fun: null,
                urlParam: []
            };
        }
        envObject.fun.reset = function () {

        }
        envObject.fun.clear = function () {
            envObject.query = null;
        }

        urlParamObject.fun.reset = function (url) {
            url = url || '';
            var template = {
                paramArray: url.split('?').slice(1).join('?').split('&'),
                urlParam: []
            }
            for (var key in template.paramArray) {
                var val = template.paramArray[key].split('=');
                if (!val[0]) break;
                template.urlParam.push({
                    paramKey: val[0],
                    paramInfo: val.slice(1, val.length).join('=') || '',
                    checkbox: true
                })
            }
            return template.urlParam;
        }
        urlParamObject.fun.$watch = function (parseData) {
            var template = {
                url: (parseData.url || '').split('?')[0],
                count: 0
            }
            try {
                for (var key in parseData.params) {
                    var val = parseData.params[key];
                    if (val.paramKey && val.checkbox) {
                        if (template.count == 0) {
                            template.url += '?' + val.paramKey + '=' + (val.paramInfo || '');
                        } else {
                            template.url += '&' + val.paramKey + '=' + (val.paramInfo || '');
                        }
                        template.count++;
                    }
                }
            } catch (e) {
                console.error(e)
            }
            return template.url || parseData.url;
        }

        /**
         * 外页操作相关功能
         * @param {string} status 操作类型(edit,delete,move...)
         * @param {object} arg 请求相关object
         * @param {object} option {status:版本类型,spaceKey,callback:回馈函数,resource:资源,storage:存储}
         */
        outsideObject.fun.operate = function (status, arg, option) {
            var template = {
                modal: null,
                request: {},
                output: {}
            }
            switch (status) {
                case 'edit':
                case 'add':
                    {
                        template.item = arg.item || {};
                        switch(option.mark){
                            case 'project':{
                                template.modal = {
                                    title: status == 'edit' ? $filter('translate')('332') :  $filter('translate')('333'),
                                    resource: option.resource,
                                    textArray: [{
                                        type: 'input',
                                        title: $filter('translate')('334'),
                                        key: 'projectName',
                                        value: template.item['projectName'],
                                        maxlength: '32',
                                        pattern: '^.{1,32}$',
                                        required: true
                                    }, {
                                        type: 'input',
                                        title: $filter('translate')('335'),
                                        key: 'projectVersion',
                                        value: template.item['projectVersion'] || '1.0',
                                        maxlength: '20',
                                        pattern: '^[0-9.]{1,6}$',
                                        required: true
                                    }, {
                                        type: 'select',
                                        title: $filter('translate')('177'),
                                        key: 'projectType',
                                        value: (template.item['projectType'] || 0).toString(),
                                        selectOptions: [{
                                            key: 'Web',
                                            value: '0'
                                        }, {
                                            key: 'App',
                                            value: '1'
                                        }, {
                                            key: 'PC',
                                            value: '2'
                                        }, {
                                            key: $filter('translate')('175'),
                                            value: '3'
                                        }, {
                                            key: $filter('translate')('176'),
                                            value: '4'
                                        }]
                                    }],
                                    request: {
                                        projectID: template.item.projectID,
                                    }
                                }
                                break;
                            }
                        }
                        
                        template.modal.request.spaceKey = option.spaceKey;
                        $rootScope.MixInputModal(template.modal, function (callback) {
                            if (callback) {
                                switch(option.mark){
                                    case 'project':{
                                        template.output = {
                                            projectID: callback.projectID||callback.projectInfo.projectID,
                                            projectName: callback.projectName,
                                            projectType: callback.projectType,
                                            userType:0,
                                            projectUpdateTime: $filter('currentTimeFilter')(),
                                            projectVersion: callback.projectVersion
                                        }
                                        break;
                                    }
                                }
                                $rootScope.InfoModal(template.modal.title + $filter('translate')('329'), 'success');
                                option.callback(template.output);
                            }
                        });
                        break;
                    }
            }
        }


        return {
            outsideObject: outsideObject,
            urlParamObject: urlParamObject,
            envObject: envObject,
            searchObject: searchObject
        };
    }
})();