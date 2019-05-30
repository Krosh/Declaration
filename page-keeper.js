"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getHidedElementCodes_1 = require("./src/getHidedElementCodes");
var PageKeeper = /** @class */ (function () {
    function PageKeeper(schema, getValue) {
        var _this = this;
        this.setActivePage = function (page) {
            _this.activePage = page;
        };
        this.setActiveTab = function (tab) {
            _this.activeTab = tab;
        };
        this.isActiveTab = function (tab) { return _this.activeTab === tab; };
        this.isActivePage = function (page) { return _this.activePage.id === page.id; };
        this.getActiveTab = function () { return _this.activeTab; };
        this.getActivePage = function () { return _this.activePage; };
        this.getVisiblePages = function () {
            return _this.pages.filter(function (item) { return !_this.hidedPagesCodes.includes(item.code); });
        };
        this.processChangeValue = function (questionCode, getValue) {
            // TODO:: проверить, нужно ли пересчитывать табы в зависимости от изменившегося вопроса
            _this.hidedPagesCodes = _this.getHidedPagesCodes(getValue);
            _this.visiblePages = _this.getVisiblePages();
        };
        this.getHidedPagesCodes = function (getValue) {
            return _this.pages.flatMap(function (page) {
                return getHidedElementCodes_1.getHidedElementCodes(page.questions, getValue, function () { return false; }, 'show_pages');
            });
        };
        this.pages = schema.pages;
        this.tabs = schema.pages
            .map(function (item) { return item.tab; })
            .filter(function (value, index, arr) { return arr.indexOf(value) === index; });
        this.activePage = this.pages[0];
        this.activeTab = this.activePage.tab;
        this.hidedPagesCodes = this.getHidedPagesCodes(getValue);
        this.visiblePages = this.getVisiblePages();
    }
    return PageKeeper;
}());
exports.default = PageKeeper;
