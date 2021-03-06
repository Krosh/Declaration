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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var getHidedElementCodes_1 = require("./getHidedElementCodes");
var page_keeper_1 = __importDefault(require("./page-keeper"));
var touch_keeper_1 = __importDefault(require("./touch-keeper"));
var address_1 = require("./types/address");
var validate_keeper_1 = __importDefault(require("./validate-keeper"));
var values_keeper_1 = __importDefault(require("./values-keeper"));
var visibility_keeper_1 = require("./visibility-keeper");
var deduction_buy_property_1 = require("./deduction-buy-property");
var Declaration = /** @class */ (function () {
    function Declaration(schema, initialValues, dataProvider) {
        var _this = this;
        this.getStatistics = function () { return _this.statistics; };
        this.loadStatistics = function () {
            return _this.dataProvider.getStatistics().then(function (data) {
                _this.statistics = data;
                _this.pagesKeeper.processStatistics(data);
                _this.rerenderCallback && _this.rerenderCallback();
            });
        };
        this.goToNextPage = function () {
            var page = _this.pagesKeeper.getNextPage();
            if (undefined === page) {
                return;
            }
            _this.setActivePage(page);
        };
        this.goToPrevPage = function () {
            var page = _this.pagesKeeper.getPrevPage();
            if (undefined === page) {
                return;
            }
            _this.setActivePage(page);
        };
        this.getPages = function () { return _this.pagesKeeper.pages; };
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
        this.calculateProgress = function () {
            var questions = _this.getVisiblePages()
                .filter(function (item) { return item.type !== 'statement'; })
                .filter(function (item) { return item.type !== 'total'; })
                .filter(function (item) { return item.type !== 'files'; })
                .flatMap(function (item) { return _this.getVisibleQuestionFromPage(item); })
                .reduce(function (tot, item) {
                var questionProps = _this.getQuestionProps(item, 0, false);
                if (questionProps.question.type === 'multiple') {
                    var props_1 = questionProps;
                    return tot.concat(props_1.ids.flatMap(function (id) {
                        return props_1
                            .filterMultipleChilds(props_1.question, id)
                            .map(function (question) {
                            return props_1.getQuestionProps(question, id, false);
                        });
                    }));
                }
                return tot.concat([questionProps]);
            }, [])
                .filter(function (item) {
                if (item.question.type === 'info' ||
                    item.question.type === 'checkbox') {
                    return false;
                }
                if (item.value === '' &&
                    item.question.validation &&
                    item.question.validation.canBeSkipped) {
                    return false;
                }
                return true;
            });
            var answeredQuestions = questions.filter(function (questionProps) {
                if (questionProps.question.type === 'address') {
                    var isShort = !!questionProps.question.validation &&
                        !!questionProps.question.validation.shortAnswer;
                    return (Object.values(address_1.AddressModel.validate(questionProps.value, function () { return true; }, isShort, true, isShort)).flat().length == 0);
                }
                return 0 === questionProps.errors.length;
            });
            _this.progress = Math.floor((answeredQuestions.length * 100) / questions.length);
        };
        this.progress = 0;
        this.getProgress = function () { return _this.progress; };
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
        this.getDefaultCheckboxQuestion = function (page) {
            return Object.values(_this.questionsMap).find(function (item) {
                return item.type === 'checkbox' &&
                    !!item.action &&
                    item.action.type === 'show_pages' &&
                    item.action.codes.includes(page.code);
            });
        };
        this.isPageEmpty = function (page) {
            var defaultQuestion = _this.getDefaultMutlipleQuestion(page);
            if (defaultQuestion) {
                var ids = _this.getMultipleIds(defaultQuestion.code);
                return ids.length === 0;
            }
            var checkboxQuestion = _this.getDefaultCheckboxQuestion(page);
            if (checkboxQuestion) {
                var value = _this.valuesKeeper.getValue(checkboxQuestion.code);
                return value !== '1';
            }
            return false;
        };
        /**
         * Вызывать, когда меняем чекбокс,
         * если ставим чекбокс, который показывает страницу, и у этой страницы
         * есть multipleQuestion, и в нем нет вариантов, то добавляем вариант
         */
        this.processCheckboxChange = function (question) {
            if (question.action &&
                question.action.type === 'show_pages' &&
                question.action.codes.length) {
                var pageCode_1 = question.action.codes[0];
                var page = _this.pagesKeeper.pages.find(function (item) { return item.code === pageCode_1; });
                if (!page) {
                    return;
                }
                var defaultQuestion = _this.getDefaultMutlipleQuestion(page);
                if (!defaultQuestion) {
                    return;
                }
                var ids = _this.getMultipleIds(defaultQuestion.code);
                if (!ids.length) {
                    _this.valuesKeeper.addMultiple(defaultQuestion.code, new Date().valueOf());
                }
            }
        };
        this.getQuestionProps = function (question, id, checkTouch) {
            if (checkTouch === void 0) { checkTouch = true; }
            if (question.type === 'address') {
                var isShort = !!question.validation && !!question.validation.shortAnswer;
                var t = {
                    question: question,
                    value: _this.valuesKeeper.getValue(question.code, id),
                    setValue: function (newValue) {
                        if (!_this.valuesKeeper.setValue(question.code, id, newValue)) {
                            return;
                        }
                        _this.statistics = undefined;
                        _this.pagesKeeper.needDownload = false;
                        _this.pagesKeeper.processChangeValue(question.code, _this.valuesKeeper.getValue);
                        _this.touchKeeper.setTouch(question.code, id, true);
                        if (getHidedElementCodes_1.hasForceValueAction(question) ||
                            getHidedElementCodes_1.hasActions(question) ||
                            getHidedElementCodes_1.hasActionsOnChild(question) ||
                            getHidedElementCodes_1.isAutocompleteWithActions(question)) {
                            _this.visibilityKeeper.clearVisibility();
                        }
                        _this.visibilityKeeper.clearRequired();
                        _this.validateKeeper.refreshQuestionCache(question, id);
                        _this.calculateProgress();
                        _this.rerenderCallback && _this.rerenderCallback();
                    },
                    errors: address_1.AddressModel.validate(_this.valuesKeeper.getValue(question.code, id), function (name) {
                        return _this.touchKeeper.getTouch(address_1.AddressModel.getFullCodeName(question, name), id);
                    }, isShort, true, isShort),
                    setTouched: function (name) {
                        if (!_this.touchKeeper.setTouch(address_1.AddressModel.getFullCodeName(question, name), id, true)) {
                            return;
                        }
                        _this.validateKeeper.refreshQuestionCache(question, id);
                        _this.rerenderCallback && _this.rerenderCallback();
                    },
                    declaration: _this,
                };
                return t;
            }
            else if (question.type !== 'multiple') {
                var t = {
                    question: question,
                    value: _this.valuesKeeper.getValue(question.code, id),
                    setActive: function () {
                        if (_this.pagesKeeper.getActiveQuestion() === question) {
                            return;
                        }
                        _this.pagesKeeper.setActiveQuestion(question);
                        _this.rerenderCallback && _this.rerenderCallback();
                    },
                    setValue: function (newValue) {
                        if (!_this.valuesKeeper.setValue(question.code, id, newValue)) {
                            return;
                        }
                        if (question.page.type !== 'statement') {
                            _this.statistics = undefined;
                            _this.pagesKeeper.needDownload = false;
                            _this.pagesKeeper.processChangeValue(question.code, _this.valuesKeeper.getValue);
                        }
                        if (newValue === '1' && question.type === 'checkbox') {
                            _this.processCheckboxChange(question);
                        }
                        _this.touchKeeper.setTouch(question.code, id, true);
                        if (getHidedElementCodes_1.hasForceValueAction(question) ||
                            getHidedElementCodes_1.hasActions(question) ||
                            getHidedElementCodes_1.hasActionsOnChild(question) ||
                            getHidedElementCodes_1.isAutocompleteWithActions(question)) {
                            _this.visibilityKeeper.clearVisibility();
                        }
                        _this.visibilityKeeper.clearRequired();
                        _this.validateKeeper.refreshQuestionCache(question, id);
                        if (question.page.type !== 'statement') {
                            _this.calculateProgress();
                        }
                        _this.rerenderCallback && _this.rerenderCallback();
                    },
                    errors: _this.validateKeeper.validateQuestion(question, id, checkTouch),
                    getTouched: function () {
                        return _this.touchKeeper.getTouch(question.code, id);
                    },
                    setTouched: function () {
                        if (!_this.touchKeeper.setTouch(question.code, id, true)) {
                            return;
                        }
                        _this.validateKeeper.refreshQuestionCache(question, id);
                        _this.rerenderCallback && _this.rerenderCallback();
                    },
                    setAutocompleteActionIndex: function (actionIndex) {
                        return _this.valuesKeeper.processAutocompleteWithActions(question, id, actionIndex);
                    },
                    declaration: _this,
                };
                return t;
            }
            else {
                var changedProps = new deduction_buy_property_1.DeductionBuyProperty(question, _this.valuesKeeper).init();
                return __assign({ getTitle: function (id) {
                        return (_this.filterMutlipleQuestionChilds(question, id)
                            .filter(function (item) { return !!item.title_type; })
                            .map(function (item) { return _this.valuesKeeper.getValue(item.code, id); })
                            .filter(function (item) { return !!item; })
                            .join(', ') || undefined);
                    }, question: question, ids: _this.valuesKeeper.getMultipleIds(question.code), getQuestionProps: _this.getQuestionProps, addMultiple: function (code, timestamp) {
                        _this.valuesKeeper.addMultiple(code, timestamp);
                        _this.validateKeeper.refreshQuestionCache(question, 0);
                        _this.rerenderCallback && _this.rerenderCallback();
                    }, deleteMultiple: function (code, timestamp) {
                        _this.valuesKeeper.deleteMultiple(code, timestamp);
                        _this.validateKeeper.refreshQuestionCache(question, 0);
                        _this.rerenderCallback && _this.rerenderCallback();
                    }, copyMultiple: function (code, id) {
                        _this.valuesKeeper.copyMultiple(code, id);
                        _this.rerenderCallback && _this.rerenderCallback();
                    }, isShowAddMultiple: function () { return true; }, isShowCopyMultiple: function () { return true; }, getHidedChildrenQuestions: function () { return []; }, filterMultipleChilds: _this.filterMutlipleQuestionChilds }, changedProps);
            }
        };
        this.schema = schema;
        this.dataProvider = dataProvider;
        this.questionsMap = this.calculateQuestionsMap(schema);
        this.processShowInputsActions(this.schema);
        var questionsWithForceValuesAction = Object.keys(this.questionsMap).reduce(function (tot, cur) {
            var question = _this.questionsMap[cur];
            if (question.type === 'radio' && question.action) {
                tot[cur] = question;
            }
            return tot;
        }, {});
        this.valuesKeeper = new values_keeper_1.default(initialValues, dataProvider, questionsWithForceValuesAction);
        this.visibilityKeeper = new visibility_keeper_1.VisibilityKeeper(this.valuesKeeper, questionsWithForceValuesAction);
        this.pagesKeeper = new page_keeper_1.default(schema, this.valuesKeeper.getValue);
        this.touchKeeper = new touch_keeper_1.default(this.valuesKeeper);
        this.validateKeeper = new validate_keeper_1.default(this.valuesKeeper, this.touchKeeper, this.visibilityKeeper);
        this.touchAll = function () {
            _this.touchKeeper.touchAll();
            _this.validateKeeper.refreshQuestionCache(null, 0);
            _this.rerenderCallback && _this.rerenderCallback();
        };
        this.canGoToNextPage = this.pagesKeeper.canGoToNextPage;
        this.canGoToPrevPage = this.pagesKeeper.canGoToPrevPage;
        this.isActiveTab = this.pagesKeeper.isActiveTab;
        this.isActivePage = this.pagesKeeper.isActivePage;
        this.getTitlePage = this.pagesKeeper.getTitlePage;
        this.getActiveTab = this.pagesKeeper.getActiveTab;
        this.getActivePage = this.pagesKeeper.getActivePage;
        this.getActiveQuestion = this.pagesKeeper.getActiveQuestion;
        this.getVisibleTabs = function () { return _this.pagesKeeper.tabs; };
        this.getVisiblePages = function () { return _this.pagesKeeper.visiblePages; };
        this.getMultipleIds = this.valuesKeeper.getMultipleIds;
        this.validatePage = this.validateKeeper.validatePage;
        this.calculateProgress();
    }
    return Declaration;
}());
exports.default = Declaration;
