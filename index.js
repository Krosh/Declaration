"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var getHidedElementCodes_1 = require("./getHidedElementCodes");
var page_keeper_1 = __importDefault(require("./page-keeper"));
var touch_keeper_1 = __importDefault(require("./touch-keeper"));
var validate_keeper_1 = __importDefault(require("./validate-keeper"));
var values_keeper_1 = __importDefault(require("./values-keeper"));
var visibility_keeper_1 = require("./visibility-keeper");
var Declaration = /** @class */ (function () {
    function Declaration(schema, initialValues, dataProvider) {
        var _this = this;
        this.processShowInputsActions = function (schema) {
            var parseActions = function (item) {
                if (item.action && item.action.type === 'show_inputs') {
                    var nonProcessedCodes_1 = item.action.codes.slice();
                    var codes = [];
                    while (nonProcessedCodes_1.length) {
                        var curCode = nonProcessedCodes_1.pop();
                        if (!_this.questionsMap[curCode]) {
                            // Не нашли вопрос
                            continue;
                        }
                        codes.push(curCode);
                        var curQuestion = _this.questionsMap[curCode];
                        if (getHidedElementCodes_1.canHasActionsOnChild(curQuestion)) {
                            curQuestion.answers.forEach(function (answer) {
                                if (answer.action && answer.action.type === 'show_inputs') {
                                    nonProcessedCodes_1.push.apply(nonProcessedCodes_1, answer.action.codes);
                                }
                            });
                        }
                    }
                    item.action.codes = codes;
                }
                if (item.answers) {
                    item.answers.forEach(function (answer) {
                        parseActions(answer);
                    });
                }
            };
            schema.pages.forEach(function (page) {
                page.questions.forEach(parseActions);
            });
        };
        this.calculateQuestionsMap = function (schema) {
            var getQuestions = function (question) {
                if (question.answers) {
                    return [question].concat(question.answers.flatMap(getQuestions));
                }
                return [question];
            };
            return schema.pages.reduce(function (tot, cur) {
                cur.questions
                    .map(getQuestions)
                    .flat()
                    .forEach(function (item) { return (tot[item.code] = item); });
                return tot;
            }, {});
        };
        this.setRerenderCallback = function (cb) {
            _this.rerenderCallback = cb;
        };
        this.getVisibleQuestionFromPage = function (page) {
            return _this.visibilityKeeper.getList(page.code, page.questions, 0);
        };
        this.setActivePage = function (page) {
            if (_this.pagesKeeper.getActivePage() === page) {
                return;
            }
            _this.touchKeeper.touchAllFromPage(_this.pagesKeeper.getActivePage());
            _this.pagesKeeper.setActivePage(page);
            _this.validateKeeper.refreshQuestionCache({}, 0); // TODO::сделать нормальным методом
            _this.rerenderCallback && _this.rerenderCallback();
        };
        this.setActiveTab = function (tab) {
            _this.pagesKeeper.setActiveTab(tab);
            _this.rerenderCallback && _this.rerenderCallback();
        };
        this.filterMutlipleQuestionChilds = function (multipleQuestion, id) {
            return _this.visibilityKeeper.getList(multipleQuestion.code, multipleQuestion.answers, id);
        };
        this.getDefaultMutlipleQuestion = function (page) {
            return page.questions.find(function (item) { return item.type === 'multiple'; });
        };
        this.isPageEmpty = function (page) {
            var defaultQuestion = _this.getDefaultMutlipleQuestion(page);
            if (!defaultQuestion) {
                return false;
            }
            var ids = _this.getMultipleIds(defaultQuestion.code);
            return ids.length === 0;
        };
        this.getQuestionProps = function (question, id) {
            if (question.type !== 'multiple') {
                return {
                    question: question,
                    value: _this.valuesKeeper.getValue(question.code, id),
                    setValue: function (newValue) {
                        if (!_this.valuesKeeper.setValue(question.code, id, newValue)) {
                            return;
                        }
                        _this.pagesKeeper.processChangeValue(question.code, _this.valuesKeeper.getValue);
                        _this.touchKeeper.setTouch(question.code, id, true);
                        if (getHidedElementCodes_1.hasActions(question) ||
                            getHidedElementCodes_1.hasActionsOnChild(question) ||
                            getHidedElementCodes_1.canHasCurrencyActionsOnChild(question)) {
                            _this.visibilityKeeper.clearVisibility();
                        }
                        _this.visibilityKeeper.clearRequired();
                        _this.validateKeeper.refreshQuestionCache(question, id);
                        _this.rerenderCallback && _this.rerenderCallback();
                    },
                    errors: _this.validateKeeper.validateQuestion(question, id),
                    setTouched: function () {
                        if (!_this.touchKeeper.setTouch(question.code, id, true)) {
                            return;
                        }
                        _this.validateKeeper.refreshQuestionCache(question, id);
                        _this.rerenderCallback && _this.rerenderCallback();
                    },
                    setCourseInputVisibility: function (needHide) {
                        return _this.valuesKeeper.processCurrencyQuestion(question, id, needHide);
                    },
                    declaration: _this,
                };
            }
            else {
                return {
                    question: question,
                    ids: _this.valuesKeeper.getMultipleIds(question.code),
                    getQuestionProps: _this.getQuestionProps,
                    addMultiple: function (code, timestamp) {
                        _this.valuesKeeper.addMultiple(code, timestamp);
                        _this.validateKeeper.refreshQuestionCache(question, 0);
                        _this.rerenderCallback && _this.rerenderCallback();
                    },
                    deleteMultiple: function (code, timestamp) {
                        _this.valuesKeeper.deleteMultiple(code, timestamp);
                        _this.validateKeeper.refreshQuestionCache(question, 0);
                        _this.rerenderCallback && _this.rerenderCallback();
                    },
                    copyMultiple: function (code, id) {
                        _this.valuesKeeper.copyMultiple(code, id);
                        _this.rerenderCallback && _this.rerenderCallback();
                    },
                    filterMultipleChilds: _this.filterMutlipleQuestionChilds,
                };
            }
        };
        this.schema = schema;
        this.dataProvider = dataProvider;
        this.questionsMap = this.calculateQuestionsMap(schema);
        this.processShowInputsActions(this.schema);
        this.valuesKeeper = new values_keeper_1.default(initialValues, dataProvider);
        this.visibilityKeeper = new visibility_keeper_1.VisibilityKeeper(this.valuesKeeper);
        this.pagesKeeper = new page_keeper_1.default(schema, this.valuesKeeper.getValue);
        this.touchKeeper = new touch_keeper_1.default(this.valuesKeeper);
        this.validateKeeper = new validate_keeper_1.default(this.valuesKeeper, this.touchKeeper, this.visibilityKeeper);
        this.isActiveTab = this.pagesKeeper.isActiveTab;
        this.isActivePage = this.pagesKeeper.isActivePage;
        this.getActiveTab = this.pagesKeeper.getActiveTab;
        this.getActivePage = this.pagesKeeper.getActivePage;
        this.getVisibleTabs = function () { return _this.pagesKeeper.tabs; };
        this.getVisiblePages = function () { return _this.pagesKeeper.visiblePages; };
        this.getMultipleIds = this.valuesKeeper.getMultipleIds;
        this.validatePage = this.validateKeeper.validatePage;
    }
    return Declaration;
}());
exports.default = Declaration;
