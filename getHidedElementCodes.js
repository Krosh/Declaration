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
function isAutocompleteWithActions(question) {
    return question.type === 'autocomplete_with_actions';
}
exports.isAutocompleteWithActions = isAutocompleteWithActions;
function hasActions(question) {
    return question.type === 'checkbox' && !!question.action;
}
exports.hasActions = hasActions;
function hasForceValueAction(question) {
    return question.type === 'radio' && !!question.action;
}
exports.hasForceValueAction = hasForceValueAction;
function getHidedElementCodes(questions, getValue, getAutocompleteValueActionIndex, action) {
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
        if (isAutocompleteWithActions(question) && question.action.value_action) {
            var actions = Object.values(question.action.value_action);
            var currentHide = actions.flatMap(function (item) {
                return item.type === action ? item.codes : [];
            });
            var activeValueAction = getAutocompleteValueActionIndex(question);
            if (undefined !== activeValueAction) {
                var valueAction_1 = question.action.value_action[activeValueAction];
                if (undefined !== valueAction_1 && valueAction_1.type === action) {
                    currentHide = currentHide.filter(function (hide) {
                        return !valueAction_1.codes.includes(hide);
                    });
                }
            }
            hidedQuestions.push.apply(hidedQuestions, currentHide);
        }
    });
    return hidedQuestions;
}
exports.getHidedElementCodes = getHidedElementCodes;
