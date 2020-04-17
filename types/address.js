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
// const relatedFields: { [key in FiasElements]: ClearableElements[] } = {
//   region: ['area'],
//   area: ['city'],
//   city: ['street', 'house', 'flat'],
//   street: ['house', 'flat'],
//   house: ['flat'],
// }
var relatedFields = {
    region: [],
    area: [],
    city: [],
    street: [],
    house: [],
    housing: [],
    flat: [],
};
// const checkParentFields: { [key in FiasElements]: FiasElements[] } = {
//   region: [],
//   area: ['region'],
//   city: ['area'],
//   street: ['city'],
//   house: ['street', 'city'],
// }
var checkParentFields = {
    region: [],
    area: [],
    city: [],
    street: [],
    house: [],
    housing: [],
    flat: [],
};
var defaultFiasElement = {
    id: '',
    name: '',
    type: '',
    description: '',
};
var defaultFields = {
    fullAddressString: '',
    ifnsfl: '',
    ifnsflName: '',
    oktmo: '',
    postal: '',
    description: '',
    userEdited: false,
};
var getAdditionalFields = function (address) {
    return {
        ifnsfl: address.ifnsfl ? address.ifnsfl : '',
        ifnsflName: address.ifnsflName
            ? address.ifnsflName
            : address.ifnsfl_name
                ? address.ifnsfl_name
                : '',
        oktmo: address.oktmo ? address.oktmo : '',
        postal: address.postal ? address.postal : '',
    };
};
exports.AddressModel = {
    create: function (jsonValue) {
        var value = JSON.parse(jsonValue || '{}');
        return __assign({}, defaultFields, value, { region: __assign({}, defaultFiasElement, (value.region ? value.region : {})), area: __assign({}, defaultFiasElement, (value.area ? value.area : {})), city: __assign({}, defaultFiasElement, (value.city ? value.city : {})), street: __assign({}, defaultFiasElement, (value.street ? value.street : {})), house: __assign({}, defaultFiasElement, (value.house ? value.house : {})), housing: typeof value.housing === 'string' ?
                {
                    name: value.housing
                } : value.housing, flat: typeof value.flat === 'string' ?
                {
                    name: value.flat
                } : value.flat }, getAdditionalFields(__assign({}, value, (value.house ? value.house : {}))));
    },
    serialize: function (value) { return JSON.stringify(value); },
    changeFiasElement: function (oldValue, field, label, changeValue, isUserEdited) {
        var _a;
        var newFiasElementValue = __assign({}, oldValue[field]);
        newFiasElementValue.name = label;
        newFiasElementValue.id = isUserEdited ? '' : changeValue.id;
        newFiasElementValue.type = isUserEdited ? '' : changeValue.type;
        newFiasElementValue.description = isUserEdited
            ? ''
            : changeValue.description;
        var newAddress = __assign({}, oldValue, (_a = {}, _a[field] = newFiasElementValue, _a));
        var relations = relatedFields[field];
        relations.forEach(function (item) {
            newAddress[item] = __assign({}, defaultFiasElement);
        });
        var isParent = true;
        if (isUserEdited) {
            var check = checkParentFields[field];
            var parent_1 = check.map(function (item) {
                return oldValue[field].id === oldValue[item].id;
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
    skipDefault: ['fullAddressString', 'street', 'housing', 'flat', 'area', 'description'],
    skipOnShort: ['oktmo', 'ifnsfl', 'ifnsflName'],
    skipRegion: ['region'],
    skipWithoutIsfnl: ['oktmo', 'ifnsflName'],
    validate: function (value, isTouched, short, skipRegion, onlyIfnsfl) {
        var address = JSON.parse(value || '{}');
        var emptyAddress = exports.AddressModel.create('{}');
        var result = {};
        var skip = exports.AddressModel.skipDefault.slice();
        if (short) {
            skip.push.apply(skip, exports.AddressModel.skipOnShort);
        }
        if (skipRegion) {
            skip.push.apply(skip, exports.AddressModel.skipRegion);
        }
        if (onlyIfnsfl) {
            skip.push.apply(skip, exports.AddressModel.skipWithoutIsfnl);
        }
        for (var key in emptyAddress) {
            if (!isTouched(key)) {
                result[key] = [];
                continue;
            }
            if (skip.includes(key)) {
                result[key] = [];
                continue;
            }
            if (address[key] === '' ||
                address[key] === undefined ||
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
