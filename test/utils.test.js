'use strict';

var utils = require("../src/helpers/utils.helper.js");

var assert = require('assert');

describe('regex.js', function() {
    describe('#empty()', function() {
        it('should return true when value is empty', function() {
            assert.equal(utils.empty(""), true);
        });
        it('should return true when value contains spaces', function() {
            assert.equal(utils.empty(" "), true);
        });
        it('should return true when value contains new lines', function() {
            assert.equal(utils.empty("\n"), true);
        });
        it('should return true when value contains tabs', function() {
            assert.equal(utils.empty("\t"), true);
        });
        it('should return false when value contains other chararcters', function() {
            assert.equal(utils.empty("az123"), false);
        });
        it('should return false when value is undefined', function() {
            assert.equal(utils.empty(), undefined);
        });
    });
    describe('#simpleRegex()', function() {
        it('should return true when value contains umlaute', function() {
            assert.equal(utils.simpleRegex("ÄÜÖäüö"), true);
        });
        it('should return true when value contains "ß', function() {
            assert.equal(utils.simpleRegex("ß"), true);
        });
        it('should return true when value contains simple chararcters', function() {
            assert.equal(utils.simpleRegex("abc123"), true);
        });
        it('should return true when value contains special chararcters', function() {
            assert.equal(utils.simpleRegex(".,:&'\"\-()/"), true);
        });
        it('should return false when value contains illegally chararcters', function() {
            assert.equal(utils.simpleRegex("@%"), false);
        });
        it('should return false when value is undefined', function() {
            assert.equal(utils.simpleRegex(), undefined);
        });
    });
    describe('#extendedRegex()', function() {
        it('should return true when value contains umlaute', function() {
            assert.equal(utils.extendedRegex("ÄÜÖäüö"), true);
        });
        it('should return true when value contains "ß', function() {
            assert.equal(utils.extendedRegex("ß"), true);
        });
        it('should return true when value contains simple chararcters', function() {
            assert.equal(utils.extendedRegex("abc123"), true);
        });
        it('should return true when value contains special chararcters', function() {
            assert.equal(utils.extendedRegex(".,:&'\"\-()/@%_-"), true);
        });
        it('should return false when value contains illegally chararcters', function() {
            assert.equal(utils.extendedRegex("$§"), false);
        });
        it('should return false when value is undefined', function() {
            assert.equal(utils.extendedRegex(), undefined);
        });
    });
    describe('#numRegex()', function() {
        it('should return true when value contains numbers (positive)', function() {
            assert.equal(utils.numRegex("123"), true);
        });
        it('should return false when value contains numbers (negative)', function() {
            assert.equal(utils.numRegex("-123"), false);
        });
        it('should return false when value contains illegally chararcters', function() {
            assert.equal(utils.numRegex("abc"), false);
        });
        it('should return false when value is undefined', function() {
            assert.equal(utils.numRegex(), undefined);
        });
    });
    describe('#wordRegex()', function() {
        it('should return true when value contains numbers', function() {
            assert.equal(utils.wordRegex("123"), true);
        });
        it('should return true when value contains letters', function() {
            assert.equal(utils.wordRegex("123"), true);
        });
        it('should return false when value contains special chararcters', function() {
            assert.equal(utils.wordRegex("%/-"), false);
        });
        it('should return false when value is undefined', function() {
            assert.equal(utils.wordRegex(), undefined);
        });
    });
    describe('#datetimeRegex()', function() {
        it('should return true when the value has a valid forma (dd.mm.YYY HH:MM)', function() {
            assert.equal(utils.datetimeRegex("09.05.2019 19:21"), true);
        });
        it('should return true when the value has a valid format (dd.mm.YYY HH:MM:SS)', function() {
            assert.equal(utils.datetimeRegex("09.05.2019 19:21:34"), true);
        });
        it('should return true when the value has a valid format (d.m.YYY HH:MM:SS)', function() {
            assert.equal(utils.datetimeRegex("9.5.2019 19:21:34"), true);
        });
        it('should return true when the value has a invalid format', function() {
            assert.equal(utils.datetimeRegex("9.5.19 19:21:34"), false);
        });
        it('should return false when value is undefined', function() {
            assert.equal(utils.datetimeRegex(), undefined);
        });
    });
    describe('#timestampRegex()', function() {
        it('should return true when the value has a valid forma (HH:MM)', function() {
            assert.equal(utils.timestampRegex("19:21"), true);
        });
        it('should return true when the value has a valid format (HH:MM:SS)', function() {
            assert.equal(utils.timestampRegex("19:21:34"), true);
        });
        it('should return true when the value has a valid format (H:MM:SS)', function() {
            assert.equal(utils.timestampRegex("6:21:34"), true);
        });
        it('should return true when the value has a invalid format', function() {
            assert.equal(utils.timestampRegex("19:21:"), false);
        });
        it('should return false when value is undefined', function() {
            assert.equal(utils.timestampRegex(), undefined);
        });
    });
    describe('#stripString()', function() {
        it('should return a string without leading spaces', function() {
            assert.equal(utils.stripString(" string"), "string");
        });
        it('should return a string without trailing spaces', function() {
            assert.equal(utils.stripString("string "), "string");
        });
        it('should return a string without leading and trailing spaces', function() {
            assert.equal(utils.stripString("  string  "), "string");
        });
        it('should return a string without new lines', function() {
            assert.equal(utils.stripString("string\n\r"), "string");
        });
        it('should return a string without tabs', function() {
            assert.equal(utils.stripString("string\t"), "string");
        });
        it('should return false when value is undefined', function() {
            assert.equal(utils.stripString(), undefined);
        });
    });
});
