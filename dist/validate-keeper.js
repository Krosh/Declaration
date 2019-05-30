"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ValidateKeeper = /** @class */ (function () {
    function ValidateKeeper(valuesKeeper, touchKeeper, visibilityKeeper) {
        var _this = this;
        this.cache = {};
        this.getErrors = function (question, id) {
            if (question.type === 'multiple') {
                var requiredList = _this.visibilityKeeper.getRequiredList(question.code, question.answers, id);
                var ids = _this.valuesKeeper.getMultipleIds(question.code);
                return ids.flatMap(function (id) {
                    return _this.visibilityKeeper
                        .getRequiredList(question.code, question.answers, id)
                        .flatMap(function (item) { return _this.validateQuestion(item, id); });
                });
            }
            if (!_this.touchKeeper.getTouch(question.code, id)) {
                return [];
            }
            if (question.parent_code &&
                !_this.visibilityKeeper
                    .getRequiredList(question.parent_code, [], id)
                    .includes(question)) {
                console.log(question.code, question.parent_code);
                return [];
            }
            if (question.type === 'text') {
                return _this.valuesKeeper.getValue(question.code, id) !== ''
                    ? []
                    : ['Не должен быть пустым'];
            }
            return [];
        };
        this.getPageErrors = function (page) {
            return _this.visibilityKeeper
                .getList(page.code, page.questions, 0)
                .flatMap(function (item) { return _this.validateQuestion(item, 0); });
        };
        this.getCacheName = function (questionCode, id) {
            return questionCode + id.toString();
        };
        this.validatePage = function (page) {
            // TODO:: cache it!
            return _this.getPageErrors(page);
        };
        this.valuesKeeper = valuesKeeper;
        this.touchKeeper = touchKeeper;
        this.visibilityKeeper = visibilityKeeper;
    }
    ValidateKeeper.prototype.refreshQuestionCache = function (question, id) {
        this.cache = {};
        // delete this.cache[this.getCacheName(question.code, id)]
        // if (question.parent_code) {
        //   delete this.cache[this.getCacheName(question.parent_code, 0)]
        // }
    };
    ValidateKeeper.prototype.validateQuestion = function (question, id) {
        var cacheName = this.getCacheName(question.code, id);
        if (this.cache[cacheName]) {
            return this.cache[cacheName];
        }
        this.cache[cacheName] = this.getErrors(question, id);
        return this.cache[cacheName];
    };
    return ValidateKeeper;
}());
exports.default = ValidateKeeper;
