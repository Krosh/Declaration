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
var relatedFields = {
    city: ['street', 'house'],
    street: ['house'],
    house: [],
};
var defaultFiasElement = {
    name: '',
    code: '',
    type: '',
};
var defaultFields = {
    housing: '',
    flat: '',
    ifnsfl: '',
    ifnsflName: '',
    oktmo: '',
    postal: '',
    userEdited: false,
};
exports.AddressModel = {
    create: function (jsonValue) {
        var value = JSON.parse(jsonValue || '{}');
        return __assign({}, defaultFields, value, { city: __assign({}, defaultFiasElement, (value.city ? value.city : {})), street: __assign({}, defaultFiasElement, (value.street ? value.street : {})), house: __assign({}, defaultFiasElement, (value.house ? value.house : {})) });
    },
    serialize: function (value) { return JSON.stringify(value); },
    changeFiasElement: function (oldValue, field, label, changeValue, isUserEdited) {
        var _a;
        var newFiasElementValue = __assign({}, oldValue[field]);
        newFiasElementValue.name = label;
        newFiasElementValue.code = isUserEdited ? '' : changeValue.id;
        newFiasElementValue.type = isUserEdited ? '' : changeValue.type;
        var newAddress = __assign({}, oldValue, (_a = {}, _a[field] = newFiasElementValue, _a));
        var relations = relatedFields[field];
        relations.forEach(function (item) { return (newAddress[item] = __assign({}, defaultFiasElement)); });
        newAddress.ifnsfl = isUserEdited ? '' : changeValue.ifnsfl;
        newAddress.ifnsflName = isUserEdited ? '' : changeValue.ifnsfl_name;
        newAddress.oktmo = isUserEdited ? '' : changeValue.oktmo;
        newAddress.postal = isUserEdited ? '' : changeValue.postal;
        newAddress.userEdited = isUserEdited;
        return newAddress;
    },
    getFullCodeName: function (question, name) {
        return question.code + name;
    },
    validate: function (value, isTouched) {
        var address = exports.AddressModel.create(value);
        var result = {};
        for (var key in address) {
            if (!isTouched(key)) {
                result[key] = [];
                continue;
            }
            if (address[key] === '' ||
                (address[key] &&
                    address[key].name === '')) {
                result[key] = ['Не заполнено поле'];
                continue;
            }
            result[key] = [];
        }
        return result;
    },
};
