"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function canHasActionsOnChild(question) {
    return question.type === 'radio' || question.type === 'select';
}
exports.canHasActionsOnChild = canHasActionsOnChild;
function hasActions(question) {
    return question.type === 'checkbox' && !!question.action;
}
exports.hasActions = hasActions;
function getHidedElementCodes(questions, getValue, getCurrencyNeedHideValue, action) {
    var hidedQuestions = [];
    questions.forEach(function (question) {
        if (hasActions(question) && getValue(question.code) !== '1') {
            if (question.action && question.action.type === action) {
                hidedQuestions.push.apply(hidedQuestions, question.action.codes);
            }
        }
        // TODO:: tests
        if (canHasActionsOnChild(question)) {
            var currentHide = question.answers.flatMap(function (item) {
                return !!item.action &&
                    item.action.type === action &&
                    item.code !== getValue(question.code)
                    ? item.action.codes
                    : [];
            });
            hidedQuestions.push.apply(hidedQuestions, currentHide);
        }
        // TODO:: tests
        if (question.type === 'currency_autocomplete' &&
            question.action.value_action &&
            question.action.value_action.type === action &&
            getCurrencyNeedHideValue(question)) {
            hidedQuestions.push.apply(hidedQuestions, question.action.value_action.codes);
        }
    });
    return hidedQuestions;
}
exports.getHidedElementCodes = getHidedElementCodes;
