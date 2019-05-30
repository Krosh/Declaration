"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var joi_1 = __importDefault(require("joi"));
var getQuestionValidator = function (question) {
    var _a;
    if (question.type === 'text') {
        return joi_1.default.string().required();
    }
    if (question.type === 'radio') {
        return (_a = joi_1.default.string()).only.apply(_a, question.answers.map(function (item) { return item.code; })).required();
    }
    if (question.type === 'multiple') {
        var innerValidator_1 = {};
        question.answers.forEach(function (firstLevelQuestion) {
            innerValidator_1[firstLevelQuestion.code] = getQuestionValidator(firstLevelQuestion);
        });
        return joi_1.default.object().keys(innerValidator_1);
    }
    return joi_1.default.any().optional();
};
var createValidator = function (questionsMap) {
    var questionsValidators = {};
    Object.values(questionsMap).forEach(function (question) {
        questionsValidators[question.code] = getQuestionValidator(question);
    });
    return questionsValidators;
};
exports.default = createValidator;
