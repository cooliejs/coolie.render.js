/**
 * mocha 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var expect = require('chai-jasmine').expect;
var render = require('../src/index.js');
var fs = require('fs');
var path = require('path');
var uglify = require('uglify-js');

describe('coolie.render.js', function () {
    it('globalDefs', function () {
        var ast = uglify.parse([
            'if(A) {',
            '    alert(1);',
            '} else {',
            '    alert(2)',
            '}'
        ].join('\n'));
        var ret = render(ast, {
            globalDefs: {
                A: false,
                '@alert': 'console.log'
            }
        });
        expect(ret.code).toEqual('console.log(2);');
    });

    it('beautify', function () {
        var ast = uglify.parse([
            'alert(a + "b");'
        ].join('\n'));
        var ret = render(ast, {
            beautify: false
        });
        expect(ret.code).toEqual('alert(a+"b");');

        ret = render(ast, {
            beautify: true
        });
        expect(ret.code).toEqual('alert(a + "b");');
    });

    it('keepComments', function () {
        var ast = uglify.parse([
            '/**',
            ' * a',
            ' */',
            '',
            '/* b */',
            '',
            '// c',
            ''
        ].join('\n'));
        var ret = render(ast, {
            keepComments: false
        });
        expect(ret.code).toEqual('');

        ret = render(ast, {
            keepComments: true
        });
        expect(ret.code).toMatch(/^\s\*\sa$/m);
        expect(ret.code).toMatch(/^\/\* b \*\/$/m);
        expect(ret.code).toMatch(/^\/\/ c$/m);

        ret = render(ast, {
            keepComments: /^\sb\s$/
        });
        expect(ret.code).toEqual('/* b */\n');

        ret = render(ast, {
            keepComments: function (node, token) {
                if (token.value === ' b ') {
                    return true;
                }

                return false;
            }
        });
        expect(ret.code).toEqual('/* b */\n');
    });

    it('ie8', function () {
        var ast = uglify.parse([
            'var o = {',
            'for: "bar",',
            '};',
            ''
        ].join('\n'));
        var ret = render(ast, {
            ie8: false
        });
        expect(ret.code).toEqual('var o={for:"bar"};');

        ret = render(ast, {
            ie8: true
        });
        expect(ret.code).toEqual('var o={"for":"bar"};');
    });

    it('sourceMap', function () {
        var ast = uglify.parse([
            'var o = {',
            'for: "bar",',
            '};',
            ''
        ].join('\n'));
        var ret = render(ast, {
            sourceMap: false
        });
        expect(ret.map).toEqual(undefined);

        ret = render(ast, {
            sourceMap: true
        });
        expect(ret.map).toEqual('{"version":3,"sources":[],"names":[],"mappings":""}');
    });

    it('uglifyOptions', function () {
        var ast = uglify.parse([
            'function abc(def, ghi) {',
            '   console.log(def + ghi);',
            '}',
            ''
        ].join('\n'));
        var ret = render(ast, {
            uglifyOptions: {
                mangle: {
                    reserved: ['def']
                }
            }
        });
        expect(ret.code).toEqual('function abc(def,o){console.log(def+o)}');
    });
});


