(function () {
    'use strict';
    /**
     * @name 侧边栏服务
     * @author 广州银云信息科技有限公司
     */
    angular.module('eolinker')
        .factory('Sidebar_CommonService', index);

    index.$inject = []

    function index() {
        var data={
            isShrink:true
        }
        return data;
    }
})();