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
    var parseActions = function (item) {
        if (item.action) {
            item.action = JSON.parse(item.action);
        }
        if (item.answers) {
            item.answers.forEach(function (answer) {
                parseActions(answer);
            });
        }
    };
    data.pages.forEach(function (page) {
        page.questions.forEach(parseActions);
    });
    return data;
}
exports.processData = processData;
