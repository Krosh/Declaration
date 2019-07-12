"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getVisibleQuestions_1 = require("./getVisibleQuestions");
var VisibilityKeeper = /** @class */ (function () {
    function VisibilityKeeper(valuesKeeper, questionsWithForceValues) {
        this.valuesKeeper = valuesKeeper;
        this.questionsWithForceValues = questionsWithForceValues;
        this.visibilityCache = {};
        this.requiredCache = {};
        this.questionsCanBeForced = Object.values(questionsWithForceValues).flatMap(function (item) { return Object.keys(item.action.data); });
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
        var _this = this;
        var cacheName = name + id.toString();
        if (this.visibilityCache[cacheName]) {
            return this.visibilityCache[cacheName];
        }
        this.visibilityCache[cacheName] = getVisibleQuestions_1.getVisibleQuestions(filteredItems, this.valuesKeeper.getValue, this.valuesKeeper.getValueActionIndex, id).filter(function (item) {
            if (!_this.questionsCanBeForced.includes(item.code)) {
                return true;
            }
            return !Object.values(_this.questionsWithForceValues).some(function (questionsWithForce) {
                return _this.valuesKeeper.getValue(questionsWithForce.code) ===
                    questionsWithForce.action.value &&
                    Object.keys(questionsWithForce.action.data).includes(item.code);
            });
        });
        return this.visibilityCache[cacheName];
    };
    VisibilityKeeper.prototype.getRequiredList = function (name, filteredItems, id) {
        var cacheName = name + id.toString() + '-required';
        if (this.requiredCache[cacheName]) {
            return this.requiredCache[cacheName];
        }
        var requiredQuestions = this.getList(name, filteredItems, id);
        this.requiredCache[cacheName] = getVisibleQuestions_1.getRequiredQuestions(requiredQuestions, this.valuesKeeper.getValue, this.valuesKeeper.getValueActionIndex, id);
        return this.requiredCache[cacheName];
    };
    return VisibilityKeeper;
}());
exports.VisibilityKeeper = VisibilityKeeper;
