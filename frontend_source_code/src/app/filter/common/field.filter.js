(function() {
    'use strict';
    /**
     * @author 广州银云信息科技有限公司
     * @description 过滤字段
     * @return function 主函数
     */
    angular.module('eolinker.filter')
        .filter('Field_CommonFilter', [function() {
            var fun={};

            /**
             * 数组处理函数
             * @param {array} input 传入数组
             */
            fun.array = function(input) {
                // JSON.stringify(input,function(val,key){
                //     if()
                // })
            }

            /**
             * 对象处理函数
             * @param {object} input 传入对象
             * @param {array} fieldArray 需过滤字段数组
             */
            fun.object = function(input, fieldArray) {
                for (var key in input) {
                    if (fieldArray.indexOf(key) > -1) {
                        input[key]=null;
                    }
                }
                return input;
            }

            /**
             * 主函数
             * @param {string} type 类型 
             * @param {object} input 源数据
             * @param {array} fieldArray 过滤字段数组
             */
            fun.main = function(type, input, fieldArray) {
                switch (type) {
                    case 'array':
                        {
                            return fun.array(input);
                        }
                    case 'object':
                        {
                            return fun.object(input, fieldArray);
                        }
                }
            }
            return fun.main;
        }])

})();
