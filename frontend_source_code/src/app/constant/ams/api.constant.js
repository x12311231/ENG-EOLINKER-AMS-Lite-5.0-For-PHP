(function () {
    'use strict';
    /** 
     * @aurhor 广州银云信息科技有限公司
     * @description apix相关常量集
     */
    angular
        .module('eolinker.constant')
        .factory('API_AMS_CONSTANT', constantConfig)
    constantConfig.$inject = ['$filter'];

    function constantConfig($filter) {
        return {
            STATUS_QUERY: [{
                    key: $filter('translate')('58'),
                    value: 0,
                    class: 'eo-status-success'
                },
                {
                    key: $filter('translate')('60'),
                    value: 1,
                    class: 'eo-status-warning'
                },
                {
                    key: $filter('translate')('62'),
                    value: 2,
                    class: 'eo-status-tips'
                },
                {
                    key: $filter('translate')('64'),
                    value: 3,
                    class: 'eo-status-yellow'
                },
                {
                    key: $filter('translate')('65'),
                    value: 8,
                    class: 'eo-status-purple'
                },
                {
                    key: $filter('translate')('59'),
                    value: 4,
                    class: 'eo-status-default'
                },
                {
                    key: $filter('translate')('61'),
                    value: 5,
                    class: 'eo-status-default'
                },
                {
                    key: $filter('translate')('63'),
                    value: 6,
                    class: 'eo-status-default'
                },
                {
                    key: 'bug',
                    value: 7,
                    class: 'eo-status-danger'
                }
            ],
            REQUEST_METHOD_QUERY: [{
                    key: 'POST',
                    value: 0
                },
                {
                    key: 'GET',
                    value: 1
                },
                {
                    key: 'PUT',
                    value: 2
                },
                {
                    key: 'DELETE',
                    value: 3
                },
                {
                    key: 'HEAD',
                    value: 4
                },
                {
                    key: 'OPTIONS',
                    value: 5
                },
                {
                    key: 'PATCH',
                    value: 6
                }
            ]
        };
    }

})();