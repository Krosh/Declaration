"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var deductionHomeGroup = 'deduction_home_group';
var codeBuyType = 'home_buy_type';
var codeBuyTypeInvestment = 'home_buy_type_investment';
var codeBuyTypeAnother = 'home_buy_type_another';
var codeDateAct = 'home_date_act';
var codeDateRegister = 'home_date_register';
var codeValue = 'home_value';
var codePercent = 'home_percents_before';
var limitByValue = 2000000;
var yearLimit = 2014;
var DeductionBuyProperty = /** @class */ (function () {
    function DeductionBuyProperty(question, valuesKeeper) {
        var _this = this;
        this.getBlockingObject = function () {
            return {
                addMultiple: function () { return false; },
                copyMultiple: function () { return false; },
                isShowAddMultiple: function () { return false; },
                isShowCopyMultiple: function () { return false; },
                getHidedChildrenQuestions: function () { return _this.hidedFields; },
            };
        };
        this.init = function () {
            if (!_this.checkHomeGroup()) {
                return {};
            }
            if (_this.checkDateActValuePercent()) {
                return _this.getBlockingObject();
            }
            else if (_this.checkDateActPercentWithLimit()) {
                return _this.getBlockingObject();
            }
            else if (_this.checkValueLimitAndOneOfPercent()) {
                return _this.getBlockingObject();
            }
            return {
                getHidedChildrenQuestions: function () { return _this.hidedFields; },
            };
        };
        this.getDateCode = function (id) {
            var type = _this.valuesKeeper.getValue(codeBuyType, id);
            switch (type) {
                case codeBuyTypeInvestment:
                    return codeDateAct;
                case codeBuyTypeAnother:
                    return codeDateRegister;
                default:
                    return '';
            }
        };
        /**
         * 1. Если дата приобретения (часть 1) по первому жилью ранее 2014 года
         * и внесены данные отличные от «0» по имуществу
         * и по процентам по ипотеке — кнопка не активна или ее вообще нет
         */
        this.checkDateActValuePercent = function () {
            return (new Date(_this.date).getFullYear() < yearLimit &&
                +_this.value > 0 &&
                +_this.percent > 0 &&
                _this.ids.length === 1);
        };
        /**
         * 2. Если дата приобретения (часть 1) по первому жилью ранее 2014 года
         * и не вводились данные по кредиту — кнопка активна для ввода второго объекта,
         * но есть ограничение - дата приобретения жилья начиная с 01.01.2014 года,
         * и можно внести только данные по кредиту.
         * Далее кнопка добавления объекта больше не появляется или не активна.
         */
        this.checkDateActPercentWithLimit = function () {
            var isFirst = new Date(_this.date).getFullYear() < yearLimit && +_this.percent == 0;
            var isSecond = false;
            var isDate = false;
            var i = 0;
            for (var _i = 0, _a = _this.ids; _i < _a.length; _i++) {
                var id = _a[_i];
                if (i === 1) {
                    var date = _this.valuesKeeper.getValue(_this.getDateCode(id), id);
                    var value = _this.valuesKeeper.getValue(codeValue, id);
                    var percent = _this.valuesKeeper.getValue(codePercent, id);
                    isDate = new Date(date).getFullYear() >= yearLimit;
                    isSecond = isDate || (!value.length && !percent.length);
                }
                i++;
            }
            var arrCodesForHide = isFirst && isSecond && isDate
                ? [codeValue]
                : isFirst && !isSecond && !isDate
                    ? [codeValue, codePercent]
                    : [];
            _this.hidedFields = arrCodesForHide.length
                ? _this.hideFieldsByCodesAfterFirst(arrCodesForHide)
                : [];
            return isFirst && isSecond;
        };
        /**
         * 3. Если дата приобретения  по первому и последующему жилью начиная с 01.01.2014 года.
         * Кнопка добавления нового объекта доступна до тех пор, пока общая стоимость жилья
         * (не достигнет 2 миллиона рублей и не будут внесены данные по кредиту).
         * ВАЖНО: нужно ограничение, что данные по кредиту можно внести только по одному жилью.
         * Как только они внесены у другого жилья эти данные внести нельзя.
         */
        this.checkValueLimitAndOneOfPercent = function () {
            var arDate = [];
            var arValueForHide = [];
            var totalValue = 0;
            var totalLimit = limitByValue;
            var hasOneEmpty = [];
            for (var _i = 0, _a = _this.ids; _i < _a.length; _i++) {
                var id = _a[_i];
                var date = _this.valuesKeeper.getValue(_this.getDateCode(id), id);
                arDate.push(new Date(date).getFullYear() >= yearLimit);
                var value = _this.valuesKeeper.getValue(codeValue, id);
                var percent = _this.valuesKeeper.getValue(codePercent, id);
                hasOneEmpty.push(!value.length && !percent.length);
                if (totalLimit >= +value || totalLimit > 0) {
                    totalLimit -= +value;
                }
                else {
                    arValueForHide.push(id);
                }
                totalValue += +value;
            }
            var isDate = !!arDate.filter(function (item) { return !item; }).length;
            var isHasEmpty = !!hasOneEmpty.filter(function (item) { return item; }).length;
            var isValue = totalValue >= limitByValue;
            if (isValue) {
                _this.processHideFieldsByValue(arValueForHide);
            }
            if (!isDate) {
                _this.processHideFieldsByPercent();
            }
            if (_this.ids.length === 1) {
                return !isDate && isValue && isHasEmpty;
            }
            return isDate || isValue || isHasEmpty;
        };
        this.hideFieldsByCodesAfterFirst = function (codes) {
            return _this.ids.slice(1).map(function (id) { return ({
                id: id,
                codes: codes,
            }); });
        };
        this.processHideFieldsByPercent = function () {
            var hasPercent = [];
            for (var _i = 0, _a = _this.ids; _i < _a.length; _i++) {
                var id = _a[_i];
                var percent = _this.valuesKeeper.getValue(codePercent, id);
                if (+percent > 0) {
                    hasPercent.push(+id);
                }
            }
            if (!!hasPercent.length) {
                var hidedFields = _this.ids
                    .filter(function (item) { return item !== hasPercent[0]; })
                    .map(function (item) { return ({ id: item, codes: [codePercent] }); });
                _this.hidedFields = _this.hidedFields.concat(hidedFields);
            }
        };
        this.processHideFieldsByValue = function (arValueForHide) {
            if (!!arValueForHide.length) {
                var hidedFields = arValueForHide.map(function (id) { return ({
                    id: id,
                    codes: [codeValue],
                }); });
                _this.hidedFields = _this.hidedFields.concat(hidedFields);
            }
        };
        this.checkHomeGroup = function () {
            return _this.question.code === deductionHomeGroup;
        };
        this.question = question;
        this.valuesKeeper = valuesKeeper;
        this.ids = this.valuesKeeper.getMultipleIds(this.question.code);
        var firstId = Object.values(this.ids).shift();
        this.date = this.valuesKeeper.getValue(this.getDateCode(firstId), firstId);
        this.value = this.valuesKeeper.getValue(codeValue, firstId);
        this.percent = this.valuesKeeper.getValue(codePercent, firstId);
        this.hidedFields = [];
    }
    return DeductionBuyProperty;
}());
exports.DeductionBuyProperty = DeductionBuyProperty;
