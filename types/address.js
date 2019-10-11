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
    region: ['area'],
    area: ['city'],
    city: ['street', 'house'],
    street: ['house'],
    house: [],
};
var checkParentFields = {
    region: [],
    area: ['region'],
    city: ['area'],
    street: ['city'],
    house: ['street', 'city'],
};
var defaultFiasElement = {
    name: '',
    code: '',
    type: '',
    description: '',
};
var defaultFields = {
    housing: '',
    flat: '',
    ifnsfl: '',
    ifnsflName: '',
    oktmo: '',
    postal: '',
    description: '',
    userEdited: false,
};
exports.AddressModel = {
    create: function (jsonValue) {
        var value = JSON.parse(jsonValue || '{}');
        return __assign(__assign(__assign({}, defaultFields), value), { fullAddress: {
                region: __assign(__assign({}, defaultFiasElement), (value.region ? value.region : {})),
                area: __assign(__assign({}, defaultFiasElement), (value.area ? value.area : {})),
                city: __assign(__assign({}, defaultFiasElement), (value.city ? value.city : {})),
                street: __assign(__assign({}, defaultFiasElement), (value.street ? value.street : {})),
                house: __assign(__assign({}, defaultFiasElement), (value.house ? value.house : {})),
            }, region: __assign(__assign({}, defaultFiasElement), (value.region ? value.region : {})), area: __assign(__assign({}, defaultFiasElement), (value.area ? value.area : {})), city: __assign(__assign({}, defaultFiasElement), (value.city ? value.city : {})), street: __assign(__assign({}, defaultFiasElement), (value.street ? value.street : {})), house: __assign(__assign({}, defaultFiasElement), (value.house ? value.house : {})) });
    },
    serialize: function (value) { return JSON.stringify(value); },
    changeFiasElement: function (oldValue, field, label, changeValue, isUserEdited) {
        var _a;
        var newFiasElementValue = __assign({}, oldValue[field]);
        newFiasElementValue.name = label;
        newFiasElementValue.code = isUserEdited ? '' : changeValue.id;
        newFiasElementValue.type = isUserEdited ? '' : changeValue.type;
        newFiasElementValue.description = isUserEdited
            ? ''
            : changeValue.description;
        var newAddress = __assign(__assign({}, oldValue), (_a = {}, _a[field] = newFiasElementValue, _a));
        var relations = relatedFields[field];
        relations.forEach(function (item) { return (newAddress[item] = __assign({}, defaultFiasElement)); });
        var isParent = true;
        if (isUserEdited) {
            var check = checkParentFields[field];
            var parent_1 = check.map(function (item) {
                return oldValue[field].code === oldValue[item].code;
            });
            if (parent_1.length) {
                isParent = parent_1.reduce(function (item) { return item; });
            }
        }
        if (changeValue.ifnsfl) {
            newAddress.ifnsfl = changeValue.ifnsfl;
        }
        else if (oldValue.ifnsfl) {
            newAddress.ifnsfl = !isParent ? '' : oldValue.ifnsfl;
        }
        if (changeValue.ifnsfl_name) {
            newAddress.ifnsflName = changeValue.ifnsfl_name;
        }
        else if (oldValue.ifnsflName) {
            newAddress.ifnsflName = !isParent ? '' : oldValue.ifnsflName;
        }
        if (changeValue.oktmo) {
            newAddress.oktmo = changeValue.oktmo;
        }
        else if (oldValue.oktmo) {
            newAddress.oktmo = !isParent ? '' : oldValue.oktmo;
        }
        if (changeValue.postal) {
            newAddress.postal = changeValue.postal;
        }
        else if (oldValue.postal) {
            newAddress.postal = !isParent ? '' : oldValue.postal;
        }
        newAddress.userEdited = isUserEdited;
        return newAddress;
    },
    getFullCodeName: function (question, name) {
        return question.code + name;
    },
    skipDefault: ['housing', 'flat'],
    skipOnShort: ['oktmo', 'ifnsfl', 'ifnsflName'],
    validate: function (value, isTouched, short) {
        var address = exports.AddressModel.create(value);
        var result = {};
        for (var key in address) {
            if (!isTouched(key)) {
                result[key] = [];
                continue;
            }
            var skip = short
                ? exports.AddressModel.skipOnShort.concat(exports.AddressModel.skipDefault)
                : exports.AddressModel.skipDefault;
            if (skip.includes(key)) {
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
