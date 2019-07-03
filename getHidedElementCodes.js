"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function canHasActionsOnChild(question) {
    return question.type === 'radio' || question.type === 'select';
}
exports.canHasActionsOnChild = canHasActionsOnChild;
function hasActionsOnChild(question) {
    return (canHasActionsOnChild(question) &&
        !!question.answers.find(function (item) { return !!item.action; }));
}
exports.hasActionsOnChild = hasActionsOnChild;
function canHasCurrencyActionsOnChild(question) {
    return question.type === 'currency_autocomplete';
}
exports.canHasCurrencyActionsOnChild = canHasCurrencyActionsOnChild;
function hasActions(question) {
    return question.type === 'checkbox' && !!question.action;
}
exports.hasActions = hasActions;
function hasForceValueAction(question) {
    return question.type === 'radio' && !!question.action;
}
exports.hasForceValueAction = hasForceValueAction;
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
        if (canHasCurrencyActionsOnChild(question) &&
            question.action.value_action &&
            question.action.value_action.type === action &&
            getCurrencyNeedHideValue(question)) {
            hidedQuestions.push.apply(hidedQuestions, question.action.value_action.codes);
        }
    });
    return hidedQuestions;
}
exports.getHidedElementCodes = getHidedElementCodes;
