"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getVisibleQuestions_1 = require("./getVisibleQuestions");
var VisibilityKeeper = /** @class */ (function () {
    function VisibilityKeeper(valuesKeeper) {
        this.visibilityCache = {};
        this.requiredCache = {};
        this.valuesKeeper = valuesKeeper;
    }
    VisibilityKeeper.prototype.clearVisibility = function () {
        console.log('visibility cache cleared');
        this.visibilityCache = {};
    };
    VisibilityKeeper.prototype.clearRequired = function () {
        console.log('required cache cleared');
        this.requiredCache = {};
    };
    VisibilityKeeper.prototype.getList = function (name, filteredItems, id) {
        var cacheName = name + id.toString();
        if (this.visibilityCache[cacheName]) {
            return this.visibilityCache[cacheName];
        }
        this.visibilityCache[cacheName] = getVisibleQuestions_1.getVisibleQuestions(filteredItems, this.valuesKeeper.getValue, this.valuesKeeper.getCurrencyQuestion, id);
        return this.visibilityCache[cacheName];
    };
    VisibilityKeeper.prototype.getRequiredList = function (name, filteredItems, id) {
        var cacheName = name + id.toString() + '-required';
        if (this.requiredCache[cacheName]) {
            return this.requiredCache[cacheName];
        }
        var requiredQuestions = this.getList(name, filteredItems, id);
        this.requiredCache[cacheName] = getVisibleQuestions_1.getRequiredQuestions(requiredQuestions, this.valuesKeeper.getValue, this.valuesKeeper.getCurrencyQuestion, id);
        return this.requiredCache[cacheName];
    };
    return VisibilityKeeper;
}());
exports.VisibilityKeeper = VisibilityKeeper;
