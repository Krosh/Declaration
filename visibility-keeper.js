"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getVisibleQuestions_1 = require("./src/getVisibleQuestions");
var VisibilityKeeper = /** @class */ (function () {
    function VisibilityKeeper(valuesKeeper) {
        this.cache = {};
        this.valuesKeeper = valuesKeeper;
    }
    VisibilityKeeper.prototype.clear = function () {
        console.log('cache cleared');
        this.cache = {};
    };
    VisibilityKeeper.prototype.getList = function (name, filteredItems, id) {
        var cacheName = name + id.toString();
        if (this.cache[cacheName]) {
            return this.cache[cacheName];
        }
        this.cache[cacheName] = getVisibleQuestions_1.getVisibleQuestions(filteredItems, this.valuesKeeper.getValue, this.valuesKeeper.getCurrencyQuestion, id);
        return this.cache[cacheName];
    };
    VisibilityKeeper.prototype.getRequiredList = function (name, filteredItems, id) {
        var cacheName = name + id.toString() + '-required';
        if (this.cache[cacheName]) {
            return this.cache[cacheName];
        }
        var visibleQuestions = this.getList(name, filteredItems, id);
        this.cache[cacheName] = getVisibleQuestions_1.getRequiredQuestions(visibleQuestions, this.valuesKeeper.getValue, this.valuesKeeper.getCurrencyQuestion, id);
        return this.cache[cacheName];
    };
    return VisibilityKeeper;
}());
exports.VisibilityKeeper = VisibilityKeeper;
