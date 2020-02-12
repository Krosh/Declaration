"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var validation_1 = __importDefault(require("./validation"));
var address_1 = require("./types/address");
var ValidateKeeper = /** @class */ (function () {
    function ValidateKeeper(valuesKeeper, touchKeeper, visibilityKeeper) {
        var _this = this;
        this.cache = {};
        this.getErrors = function (question, id, checkTouch) {
            if (checkTouch === void 0) { checkTouch = true; }
            if (question.type === 'info') {
                return [];
            }
            if (question.type === 'multiple') {
                var ids = _this.valuesKeeper.getMultipleIds(question.code);
                return ids.flatMap(function (id) {
                    return _this.visibilityKeeper
                        .getRequiredList(question.code, question.answers, id)
                        .flatMap(function (item) { return _this.validateQuestion(item, id, checkTouch); });
                });
            }
            if (question.type === 'address') {
                var isShort = !!question.validation && !!question.validation.shortAnswer;
                return Object.values(address_1.AddressModel.validate(_this.valuesKeeper.getValue(question.code, id), function (code) { return _this.touchKeeper.getTouch(question.code + code, id); }, isShort, true, isShort)).flat();
            }
            if (checkTouch && !_this.touchKeeper.getTouch(question.code, id)) {
                return [];
            }
            var isRequiredFromAction = !!question.parent_code
                ? _this.visibilityKeeper
                    .getRequiredList(question.parent_code, [], id)
                    .includes(question)
                : _this.visibilityKeeper
                    .getRequiredList(question.page.code, question.page.questions, 0)
                    .includes(question);
            return validation_1.default(question.code, question.validation, function (code) { return _this.valuesKeeper.getValue(code, id); }, isRequiredFromAction);
        };
        this.getPageErrors = function (page, checkTouch) {
            if (checkTouch === void 0) { checkTouch = true; }
            return _this.visibilityKeeper
                .getList(page.code, page.questions, 0)
                .flatMap(function (item) { return _this.validateQuestion(item, 0, checkTouch); });
        };
        this.getCacheName = function (questionCode, id, checkTouch) { return questionCode + id.toString() + '---' + checkTouch.toString(); };
        this.validatePage = function (page, checkTouch) {
            if (checkTouch === void 0) { checkTouch = true; }
            // TODO:: cache it!
            return _this.getPageErrors(page, checkTouch);
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
    ValidateKeeper.prototype.validateQuestion = function (question, id, checkTouch) {
        if (checkTouch === void 0) { checkTouch = true; }
        var cacheName = this.getCacheName(question.code, id, checkTouch);
        if (this.cache[cacheName]) {
            return this.cache[cacheName];
        }
        this.cache[cacheName] = this.getErrors(question, id, checkTouch);
        return this.cache[cacheName];
    };
    return ValidateKeeper;
}());
exports.default = ValidateKeeper;
