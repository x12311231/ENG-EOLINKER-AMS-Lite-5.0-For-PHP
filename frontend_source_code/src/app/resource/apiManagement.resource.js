(function () {
    'use strict';

    angular.module('eolinker.resource')
        /**
         * @name EOLINKER AMS OPEN SOURCE，EOLINKER AMS开源版本
         * @link https://www.eolinker.com
         * @package EOLINKER AMS
         * @author www.eolinker.com 广州银云信息科技有限公司 2015-2018

         * EOLINKER，业内领先的Api接口管理及测试平台，为您提供最专业便捷的在线接口管理、测试、维护以及各类性能测试方案，帮助您高效开发、安全协作。
         * 如在使用的过程中有任何问题，可通过[图片]http://help.eolinker.com寻求帮助
         *
         *注意！EOLINKER AMS 开源版本遵循 GPL V3开源协议，仅供用户下载试用，禁止“一切公开使用于商业用途”或者“以 EOLINKER AMS开源版本为基础而开发的二次版本”在互联网上流通。。
         * 注意！一经发现，我们将立刻启用法律程序进行维权。
         * 再次感谢您的使用，希望我们能够共同维护国内的互联网开源文明和正常商业秩序。
         *
         * @function [接口管理接口服务定义js] [API management interface service definition js]
         * @version  3.1.5
         * @service  $resource [注入$resource服务] [Inject the $resource service]
         * @constant serverUrl [注入前缀URL] [Inject the prefix URL]
         */
        .factory('ApiManagementResource', ApiManagementResource)

    ApiManagementResource.$inject = ['$resource', 'serverUrl'];

    function ApiManagementResource($resource, serverUrl) {
        var data = {
            method: 'POST',
            api: [],
        }
        data.api['Import'] = $resource(serverUrl + '?g=Web&c=Import&o=:operate', {

            }, {
                Eoapi: {
                    params: {
                        operate: 'importEoapi'
                    },
                    method: data.method
                },
                Postman: {
                    params: {
                        operate: 'importPostMan'
                    },
                    method: data.method
                },
                Swagger: {
                    params: {
                        operate: 'importSwagger'
                    },
                    method: data.method
                }
            }

        );

        data.api['Project'] = $resource(serverUrl + '?g=Web&c=Project&o=:operate', {

            }, {
                Query: {
                    params: {
                        operate: 'getProjectList'
                    },
                    method: data.method
                },
                Edit: {
                    params: {
                        operate: 'editProject'
                    },
                    method: data.method
                },
                Add: {
                    params: {
                        operate: 'addProject'
                    },
                    method: data.method
                },
                Delete: {
                    params: {
                        operate: 'deleteProject'
                    },
                    method: data.method
                },
                Detail: {
                    params: {
                        operate: 'getProject'
                    },
                    method: data.method
                },
                Export: {
                    params: {
                        operate: 'dumpProject'
                    },
                    method: data.method
                },
                GetProjectPermission:{
                    params: {
                        operate: 'getUserProjectPermission'
                    },
                    method: data.method
                },
                GetProjectLogList: {
                    params: {
                        operate: 'getProjectLogList'
                    },
                    method: data.method,
                }
            }

        );

        data.api['Api'] = $resource(serverUrl + '?g=Web&c=Api&o=:operate', {

            }, {
                Query: {
                    params: {
                        operate: 'getApiListByCondition'
                    },
                    method: data.method
                },
                All: {
                    params: {
                        operate: 'getAllApiList'
                    },
                    method: data.method
                },
                Add: {
                    params: {
                        operate: 'addApi'
                    },
                    method: data.method
                },
                Delete: {
                    params: {
                        operate: 'removeApi'
                    },
                    method: data.method
                },
                Edit: {
                    params: {
                        operate: 'editApi'
                    },
                    method: data.method
                },
                Move: {
                    params: {
                        operate: 'changeApiGroup'
                    },
                    method: data.method,
                    cancellable: true
                },
                Search: {
                    params: {
                        operate: 'searchApi'
                    },
                    method: data.method
                },
                Detail: {
                    params: {
                        operate: 'getApi'
                    },
                    method: data.method
                },
                HistoryList: {
                    params: {
                        operate: 'getApiHistoryList'
                    },
                    method: data.method,
                    cancellable: true
                },
                DeleteHistory: {
                    params: {
                        operate: 'deleteApiHistory'
                    },
                    method: data.method,
                    cancellable: true
                },
                toggleHistory: {
                    params: {
                        operate: 'toggleApiHistory'
                    },
                    method: data.method,
                    cancellable: true
                },
                AddMock :{
                    params: {
                        operate: 'saveSimpleMock'
                    },
                    method: data.method,
                    cancellable: true
                },
                Check: {
                    params: {
                        operate: 'checkApiExist'
                    },
                    method: data.method,
                    cancellable: true
                },
                Import: {
                    params: {
                        operate: 'importApi'
                    },
                    method: data.method,
                    cancellable: true
                },
                Export: {
                    params: {
                        operate: 'exportApi'
                    },
                    method: data.method,
                    cancellable: true
                },
                ChangeStar: {
                    params: {
                        operate: 'updateApiStar'
                    },
                    method: data.method,
                    cancellable: true
                },
                ChangeStatus: {
                    params: {
                        operate: 'updateApiStatus'
                    },
                    method: data.method,
                    cancellable: true
                },
                Move: {
                    params: {
                        operate: 'changeApiGroup'
                    },
                    method: data.method,
                    cancellable: true
                }
            }

        );

        data.api['Doc'] = $resource(serverUrl + '?g=Web&c=Document&o=:operate', {

            }, {
                Query: {
                    params: {
                        operate: 'getDocumentList'
                    },
                    method: data.method,
                    cancellable: true
                },
                All: {
                    params: {
                        operate: 'getAllDocumentList'
                    },
                    method: data.method,
                    cancellable: true
                },
                Add: {
                    params: {
                        operate: 'addDocument'
                    },
                    method: data.method,
                    cancellable: true
                },
                Delete: {
                    params: {
                        operate: 'deleteDocuments'
                    },
                    method: data.method,
                    cancellable: true
                },
                Edit: {
                    params: {
                        operate: 'editDocument'
                    },
                    method: data.method,
                    cancellable: true
                },
                Detail: {
                    params: {
                        operate: 'getDocument'
                    },
                    method: data.method,
                    cancellable: true
                },
                Search: {
                    params: {
                        operate: 'searchDocument'
                    },
                    method: data.method,
                    cancellable: true
                }
            }

        );


        data.api['Trash'] = $resource(serverUrl + '?g=Web&c=Api&o=:operate', {

            }, {
                Query: {
                    params: {
                        operate: 'getRecyclingStationApiList'
                    },
                    method: data.method
                },
                Clean: {
                    params: {
                        operate: 'cleanRecyclingStation'
                    },
                    method: data.method
                },
                Delete: {
                    params: {
                        operate: 'deleteApi'
                    },
                    method: data.method
                },
                Recover: {
                    params: {
                        operate: 'recoverApi'
                    },
                    method: data.method
                }
            }

        );

        data.api['Test'] = $resource(serverUrl + '?g=Web&c=Test&o=:operate', {

            }, {
                Get: {
                    params: {
                        operate: 'get'
                    },
                    method: data.method
                },
                Post: {
                    params: {
                        operate: 'post'
                    },
                    method: data.method
                },
                Delete: {
                    params: {
                        operate: 'delete'
                    },
                    method: data.method
                },
                Patch: {
                    params: {
                        operate: 'patch'
                    },
                    method: data.method
                },
                Head: {
                    params: {
                        operate: 'head'
                    },
                    method: data.method
                },
                Options: {
                    params: {
                        operate: 'options'
                    },
                    method: data.method
                },
                Put: {
                    params: {
                        operate: 'put'
                    },
                    method: data.method
                },
                DeleteHistory: {
                    params: {
                        operate: 'deleteTestHistory'
                    },
                    method: data.method
                },
                DeleteAllHistory: {
                    params: {
                        operate: 'deleteAllTestHistory'
                    },
                    method: data.method
                },
                TestHistoryList: {
                    params: {
                        operate: 'getTestHistoryList'
                    },
                    method: data.method,
                    cancellable: true
                },
                AddHistory: {
                    params: {
                        operate: 'addTestHistory'
                    },
                    method: data.method,
                    cancellable: true
                }
            }

        );

        data.api['Star'] = $resource(serverUrl + '?g=Web&c=Api&o=:operate', {

            }, {
                Add: {
                    params: {
                        operate: 'addStar'
                    },
                    method: data.method,
                    cancellable:true
                },
                Delete: {
                    params: {
                        operate: 'removeStar'
                    },
                    method: data.method,
                    cancellable:true
                }
            }

        );

        data.api['Code'] = $resource(serverUrl + '?g=Web&c=StatusCode&o=:operate', {

            }, {
                Query: {
                    params: {
                        operate: 'getCodeList'
                    },
                    method: data.method
                },
                All: {
                    params: {
                        operate: 'getAllCodeList'
                    },
                    method: data.method
                },
                Add: {
                    params: {
                        operate: 'addCode'
                    },
                    method: data.method
                },
                Delete: {
                    params: {
                        operate: 'deleteCode'
                    },
                    method: data.method
                },
                Edit: {
                    params: {
                        operate: 'editCode'
                    },
                    method: data.method
                },
                Search: {
                    params: {
                        operate: 'searchStatusCode'
                    },
                    method: data.method
                },
                Import: {
                    params: {
                        operate: 'addStatusCodeByExcel'
                    },
                    method: data.method,
                    cancellable: true,
                    transformRequest: angular.identity,
                    headers: {
                        "Content-Type": undefined
                    }
                }
            }

        );
        data.api['Partner'] = $resource(serverUrl + '?g=Web&c=Partner&o=:operate', {

            }, {
                Query: {
                    params: {
                        operate: 'getPartnerList'
                    },
                    method: data.method
                },
                QueryAll: {
                    params: {
                        operate: 'getMemberList'
                    },
                    method: data.method
                },
                QueryUnJoin:{
                    params: {
                        operate: 'getNotMemberList'
                    },
                    method: data.method
                },
                Add: {
                    params: {
                        operate: 'addMember'
                    },
                    method: data.method
                },
                Delete: {
                    params: {
                        operate: 'removePartner'
                    },
                    method: data.method
                },
                Quit: {
                    params: {
                        operate: 'quitPartner'
                    },
                    method: data.method
                },
                Search: {
                    params: {
                        operate: 'getPartnerInfo'
                    },
                    method: data.method
                },
                SetType: {
                    params: {
                        operate: 'editPartnerType'
                    },
                    method: data.method
                },
                SetNickName: {
                    params: {
                        operate: 'editPartnerNickName'
                    },
                    method: data.method
                }
            }

        );

        data.api['Env'] = $resource(serverUrl + '?g=Web&c=Env&o=:operate', {

            }, {
                Query: {
                    params: {
                        operate: 'getEnvList'
                    },
                    method: data.method
                },
                Info:{
                    params: {
                        operate: 'getEnvInfo'
                    },
                    method: data.method
                },
                Add: {
                    params: {
                        operate: 'addEnv'
                    },
                    method: data.method
                },
                BatchDelete: {
                    params: {
                        operate: 'batchDeleteEnv'
                    },
                    method: data.method
                },
                Delete: {
                    params: {
                        operate: 'deleteEnv'
                    },
                    method: data.method
                },
                Edit: {
                    params: {
                        operate: 'editEnv'
                    },
                    method: data.method
                },
            }

        );

        data.api['ApiGroup'] = $resource(serverUrl + '?g=Web&c=Group&o=:operate', {

            }, {
                Query: {
                    params: {
                        operate: 'getGroupList'
                    },
                    method: data.method
                },
                Add: {
                    params: {
                        operate: 'addGroup'
                    },
                    method: data.method
                },
                Delete: {
                    params: {
                        operate: 'deleteGroup'
                    },
                    method: data.method
                },
                Edit: {
                    params: {
                        operate: 'editGroup'
                    },
                    method: data.method
                },
                Sort: {
                    params: {
                        operate: 'sortGroup'
                    },
                    method: data.method
                },
                Import: {
                    params: {
                        operate: 'importGroup'
                    },
                    method: data.method,
                    cancellable: true
                },
                Export: {
                    params: {
                        operate: 'exportGroup'
                    },
                    method: data.method,
                    cancellable: true
                }
            }

        );

        data.api['CodeGroup'] = $resource(serverUrl + '?g=Web&c=StatusCodeGroup&o=:operate', {

            }, {
                Query: {
                    params: {
                        operate: 'getGroupList'
                    },
                    method: data.method
                },
                Add: {
                    params: {
                        operate: 'addGroup'
                    },
                    method: data.method
                },
                Delete: {
                    params: {
                        operate: 'deleteGroup'
                    },
                    method: data.method
                },
                Edit: {
                    params: {
                        operate: 'editGroup'
                    },
                    method: data.method
                },
                Sort: {
                    params: {
                        operate: 'sortGroup'
                    },
                    method: data.method
                },
                Import: {
                    params: {
                        operate: 'importGroup'
                    },
                    method: data.method,
                    cancellable: true
                },
                Export: {
                    params: {
                        operate: 'exportGroup'
                    },
                    method: data.method,
                    cancellable: true
                }
            }

        );


        data.api['Backup'] = $resource(serverUrl + '?g=Web&c=Backup&o=:operate', {

            }, {
                backupProject: {
                    params: {
                        operate: 'backupProject'
                    },
                    method: data.method
                }
            }

        );

        return data.api;
    }
})();