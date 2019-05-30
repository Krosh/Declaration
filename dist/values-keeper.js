"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var ValuesKeeper = /** @class */ (function () {
    function ValuesKeeper(initialValues, dataProvider) {
        var _this = this;
        this.processCurrencyQuestion = function (question, id, showCourseInput) {
            _this.enabledCurrencies[question.code] =
                _this.enabledCurrencies[question.code] || {};
            _this.enabledCurrencies[question.code][id] = showCourseInput;
        };
        this.getCurrencyQuestion = function (question, id) {
            return _this.enabledCurrencies[question.code]
                ? _this.enabledCurrencies[question.code][id]
                : true;
        };
        this.setValue = function (code, id, newValue) {
            if (_this.getValue(code, id) === newValue) {
                return false;
            }
            _this.values[code] = _this.values[code] || {};
            _this.values[code][id] = newValue;
            _this.dataProvider.saveAnswer(code, id, newValue);
            return true;
        };
        this.getMultipleIds = function (code) {
            if (!_this.values[code]) {
                return [];
            }
            return Object.keys(_this.values[code]).map(function (key) { return parseInt(key, 10); });
        };
        this.getValue = function (code, id) {
            if (!id) {
                id = 0;
            }
            if (!_this.values[code] || !_this.values[code][id]) {
                return '';
            }
            return _this.values[code][id];
        };
        this.addMultiple = function (questionCode, timestamp) {
            _this.setValue(questionCode, timestamp, timestamp.toString());
        };
        this.deleteMultiple = function (questionCode, id) {
            delete _this.values[questionCode][id];
            _this.dataProvider.deleteMultiple(questionCode, id);
            // this.props.deleteMultiple(questionCode, id)
        };
        this.copyMultiple = function (questionCode, id) {
            var newId = new Date().valueOf();
            var newValues = __assign({}, _this.values);
            Object.keys(newValues).forEach(function (key) {
                if (newValues[key] && undefined !== newValues[key][id]) {
                    newValues[key][newId] = newValues[key][id];
                    if (key === questionCode) {
                        newValues[key][newId] = newId.toString();
                    }
                }
            });
            _this.values = newValues;
            _this.dataProvider.copyMultiple(questionCode, id, newId);
            // this.props.copyMultiple(questionCode, id, newId)
        };
        this.values = initialValues;
        this.dataProvider = dataProvider;
        this.enabledCurrencies = {};
    }
    return ValuesKeeper;
}());
exports.default = ValuesKeeper;
