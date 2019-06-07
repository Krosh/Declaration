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
                return !!item.action && item.action.type === action
                    ? item.action.codes
                    : [];
            });
            var activeAnswer_1 = question.answers.find(function (item) { return item.code === getValue(question.code); });
            if (activeAnswer_1 &&
                activeAnswer_1.action &&
                activeAnswer_1.action.type === action) {
                currentHide = currentHide.filter(function (hide) {
                    return !activeAnswer_1.action.codes.includes(hide);
                });
            }
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
