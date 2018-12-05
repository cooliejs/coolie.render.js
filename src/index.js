/**
 * coolie.render.js
 * @author ydr.me
 * @create 2018-12-04 19:41:41
 * @update 2018年12月05日11:47:30
 */


'use strict';


var object = require('blear.utils.object');
var uglify = require('uglify-js');

var defaults = {
    /**
     * Compress options
     * global_defs
     * @type Object
     */
    globalDefs: {},

    /**
     * Output options
     * 是否美化
     * @type Boolean
     */
    beautify: false,

    /**
     * Output options
     * 保留注释风格
     * - true: 同 all
     * - false: 不保留注释
     * - regexp: 匹配保留规则
     * - function: 规则函数，返回 true 保留
     * @type Boolean | RegExp | Function
     */
    keepComments: false,

    /**
     * 是否支持 IE8
     * @type Boolean
     */
    ie8: false,

    /**
     * 是否支持资源地图
     * @type Boolean
     */
    sourceMap: false,

    /**
     * 自定义配置，高于上述配置
     * @type Null | Object
     */
    uglifyOptions: null
};


/**
 * coolie.render.js
 * @param ast
 * @param options
 * @returns {{code: String, map: Object}}
 */
module.exports = function (ast, options) {
    options = object.assign({}, defaults, options);
    var uglifyOptions = {
        compress: {
            global_defs: options.globalDefs
        },
        output: {
            beautify: options.beautify,
            comments: options.keepComments
        },
        ie8: options.ie8,
        sourceMap: options.sourceMap
    };
    object.assign(true, uglifyOptions, options.uglifyOptions);
    return uglify.minify(ast, uglifyOptions);
};
