(function () {
  /**
   * @name 权限设置
   * @author 广州银云信息科技有限公司
   */

  "use strict";
  angular
    .module("eolinker")
    .factory("Authority_CommonService", Authority_CommonService);

  Authority_CommonService.$inject = [];

  function Authority_CommonService() {
    var data = {
        permissionConstant: {
          project: {
            projectSetting: {
              edit: 1,
              delete: 1
            },
            authorityManagement: {
              edit: 1,
              editManager: 1
            },
            exportAndShare: {
              export: 1,
              share: 1
            },
            apiManagement: {
              look: 1,
              edit: 1,
              test: 1,
              versionManagement: 1,
              editApiCase: 1
            },
            statusCode: {
              look: 1,
              edit: 1
            },
            environment: {
              look: 1,
              edit: 1
            },
          },
        },
        permission: {
          project: null,
        }
      },
      fun = {},
      packageFun = {};
    fun.clear = function (mark) {
      data.permission[mark] = null;
      window.sessionStorage.removeItem('COMMON_SEARCH_TIP');
    };
    // 人员权限 
    //0:超级管理员 1：协作管理员 2：读写权限 3：只读权限
    fun.setPermission = function (mark, arg) {
      switch (arg.permission.userType.toString()) {
        case "0":
          {
            data.permission[mark] = packageFun.setPermission({
              mark: mark,
              memberType: 'SpaceAdmin',
              permission: data.permissionConstant[mark]
            });
            break;
          }
        case "1":
        case "2":
        case "3":
          {
            data.permission[mark] = packageFun.setPermission({
              mark: mark,
              memberType: arg.permission.userType,
              permission: data.permissionConstant[mark]
            });
            break;
          }
        default:
          {
            data.permission[mark] = packageFun.setPermission({
              mark: mark,
              memberType: "-1",
              permission: JSON.parse(arg.permission.userType)
            });
            break;
          }
      }
      data.permission.project.apiTest = {
        look: data.permission.project.apiManagement.test
      }
    };
    //0：协作管理员 1：读写权限 2：只读权限
    packageFun.setPermission = function (arg) {
      var permission = angular.copy(arg.permission);
      switch (arg.memberType.toString()) {
        case '1':
          {
            permission.authorityManagement = {
              edit: 1,
              editManager: 0,
            }
            break;
          }
        case '2':
          {
            for (var permissionModule in permission) {
              for (var permissionName in permission[permissionModule]) {
                if (/export/.test(permissionName)) {
                  permission[permissionModule][permissionName] = 0;
                }
              }
            }
            permission.authorityManagement = {
              edit: 0,
              editManager: 0,
            }
            break;
          }
        case '3':
          {
            for (var permissionModule in permission) {
              for (var permissionName in permission[permissionModule]) {
                if (/export|edit|versionManagement/.test(permissionName)) {
                  permission[permissionModule][permissionName] = 0;
                }
              }
            }
            permission.authorityManagement = {
              edit: 0,
              editManager: 0,
            }
            break;
          }
        default:
          {
            return permission;
          }
      }
      permission.projectSetting = {
        edit: 0,
        delete: 0
      }
      return permission;
    }
    return {
      product: data.product,
      permission: data.permission,
      fun: fun,
      info: data.info,
    };
  }
})();