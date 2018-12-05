(function () {
    'use strict';
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
     * @function [api外页相关服务js] [api outside page related services js]
     * @version  3.0.2
     */
    angular.module('eolinker')
        .config(['$stateProvider', 'RouteHelpersProvider', function ($stateProvider, helper) {
            $stateProvider
                .state('home.project', {
                    url: '/project',
                    template: '<div class="home-content">' +
                        '    <div class="home-div">' +
                        '        <div ui-view></div>' +
                        '    </div>' +
                        '</div>'
                })
                /**
                 * @description 项目列表
                 */
                .state('home.project.default', {
                    url: '/',
                    template: '<home-project-default class="home-common-container-div"></home-project-default>',
                })
                .state('home.project.inside', {
                    url: '/inside?projectName?projectID',
                    template: '<home-project-inside></home-project-inside>',
                    resolve: helper.resolveFor('CLIPBOARD')
                })
                /**
                 * @description 概况页面
                 */
                .state('home.project.inside.overview', {
                    url: '/overview',
                    template: '<home-project-inside-overview></home-project-inside-overview>'
                })
                /**
                 * @description API接口
                 */
                .state('home.project.inside.api', {
                    url: '/api',
                    template: '<home-project-inside-api ></home-project-inside-api>',
                    resolve: helper.resolveFor('ACE_EDITOR', 'ACE_EDITOR_AUTOCOMPLETE')
                })
                .state('home.project.inside.api.detail', {
                    url: '/detail?apiID?groupID?childGroupID?grandSonGroupID',
                    template: '<home-project-inside-api-detail ></home-project-inside-api-detail>'
                })
                .state('home.project.inside.api.edit', {
                    url: '/operate/:status?apiID?groupID?childGroupID?grandSonGroupID',
                    template: '<home-project-inside-api-edit></home-project-inside-api-edit>',
                    resolve: helper.resolveFor('ZEPTO', 'WANG_EDITOR', 'MARKDOWN')
                })
                .state('home.project.inside.api.history', {
                    url: '/history?apiID?groupID?childGroupID?grandSonGroupID',
                    template: '<home-project-inside-api-history ></home-project-inside-api-history>'
                })
                .state('home.project.inside.api.list', {
                    url: '/list?groupID?childGroupID?grandSonGroupID',
                    template: '<home-project-inside-api-list env-status="$ctrl.data.envStatus"></home-project-inside-api-list>'
                })
                .state("home.project.inside.api.test", {
                    url: "/test?apiID?groupID?childGroupID?grandSonGroupID",
                    template: "<home-project-inside-api-test></home-project-inside-api-test>"
                })
                /**
                 * @description 状态码
                 */
                .state('home.project.inside.code', {
                    url: '/code',
                    template: '<div>' +
                        '    <home-project-inside-code-sidebar></home-project-inside-code-sidebar>' +
                        '    <div ui-view>' +
                        '    </div>' +
                        '</div>'
                })
                .state('home.project.inside.code.list', {
                    url: '/list?groupID?childGroupID?grandSonGroupID?q',
                    template: '<home-project-inside-code-list></home-project-inside-code-list>'
                })
                /**
                 * @description 公共资源管理
                 */
                .state('home.project.inside.env', {
                    url: '/env',
                    template: '<div ui-view></div>'
                })
                .state('home.project.inside.env.default', {
                    url: '/',
                    template: '<home-project-inside-env></home-project-inside-env>'
                })
                .state('home.project.inside.env.operate', {
                    url: '/operate/:status?envID?itemNum',
                    template: '<home-project-inside-env-operate></home-project-inside-env-operate>'
                })
                /**
                 * @description 协作管理
                 */
                .state('home.project.inside.team', {
                    url: '/team',
                    template: '<home-project-inside-team></home-project-inside-team>'
                })
                /**
                 * @description 日志管理
                 */
                .state('home.project.inside.log', {
                    url: '/log?page',
                    template: '<home-project-inside-log></home-project-inside-log>',
                    sidebarIndex: "7|8"
                })
        }])
})();