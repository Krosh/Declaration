"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getHidedElementCodes_1 = require("./getHidedElementCodes");
var PageKeeper = /** @class */ (function () {
    function PageKeeper(schema, getValue) {
        var _this = this;
        this.setActiveQuestion = function (question) {
            _this.activeQuestion = question;
        };
        this.getActiveQuestion = function () { return _this.activeQuestion; };
        this.setActivePage = function (page) {
            if (_this.activePage === page) {
                return;
            }
            _this.activeQuestion = undefined;
            _this.activePage = page;
            _this.activeTab = page.tab;
        };
        this.setActiveTab = function (tab) {
            _this.activeTab = tab;
            var titlePage = _this.getTitlePage(tab);
            if (titlePage && titlePage !== _this.activePage) {
                _this.activePage = titlePage;
                _this.activeQuestion = undefined;
            }
        };
        this.getTitlePage = function (tab) {
            return _this.pages.find(function (item) { return item.tab === tab && item.is_title; });
        };
        this.isActiveTab = function (tab) { return _this.activeTab === tab; };
        this.isActivePage = function (page) { return _this.activePage.id === page.id; };
        this.getActiveTab = function () { return _this.activeTab; };
        this.getActivePage = function () { return _this.activePage; };
        this.canGoToNextPage = function () {
            return (_this.visiblePages.indexOf(_this.activePage) !==
                _this.visiblePages.length - 1);
        };
        this.canGoToPrevPage = function () {
            return _this.visiblePages.indexOf(_this.activePage) !== 0;
        };
        this.getNextPage = function () {
            if (!_this.canGoToNextPage()) {
                return undefined;
            }
            var currentIndex = _this.visiblePages.indexOf(_this.activePage);
            return _this.visiblePages[currentIndex + 1];
        };
        this.getPrevPage = function () {
            if (!_this.canGoToPrevPage()) {
                return undefined;
            }
            var currentIndex = _this.visiblePages.indexOf(_this.activePage);
            return _this.visiblePages[currentIndex - 1];
        };
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
        this.activeQuestion = undefined;
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
