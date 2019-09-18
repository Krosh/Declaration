"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
function processAnswers(answers) {
    return Object.keys(answers).reduce(function (tot, key) {
        tot[key] = __assign({}, answers[key]);
        return tot;
    }, {});
}
exports.processAnswers = processAnswers;
function processData(data) {
    var parseActions = function (item, page) {
        item.page = page;
        if (item.action && typeof item.action === 'string') {
            item.action = JSON.parse(item.action);
        }
        if (item.validation && typeof item.validation === 'string') {
            item.validation = JSON.parse(item.validation);
        }
        if (item.answers) {
            item.answers.forEach(function (answer) {
                parseActions(answer, page);
            });
        }
    };
    data.pages.forEach(function (page) {
        page.questions.forEach(function (item) { return parseActions(item, page); });
    });
    return data;
}
exports.processData = processData;
