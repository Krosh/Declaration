"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getHidedElementCodes_1 = require("./getHidedElementCodes");
var getValue = function (obj) { return function (code) { return (obj[code] ? obj[code] : ''); }; };
test('simple select with action', function () {
    var mock = [
        {
            type: 'select',
            name: '',
            code: 'q',
            hint: '',
            answers: [
                {
                    name: '',
                    code: 'a1',
                    hint: '',
                    action: {
                        codes: ['2'],
                        type: 'show_inputs',
                    },
                },
                {
                    name: '',
                    code: 'a2',
                    hint: '',
                    action: {
                        codes: ['3'],
                        type: 'show_inputs',
                    },
                },
            ],
        },
        {
            type: 'text',
            name: '',
            code: '2',
            hint: '',
        },
        {
            type: 'text',
            name: '',
            code: '3',
            hint: '',
        },
    ];
    var filteredQuestionsWithA1 = getHidedElementCodes_1.getHidedElementCodes(mock, getValue({ q: 'a1' }), function () { return false; }, 'show_inputs');
    expect(filteredQuestionsWithA1).toHaveLength(1);
    expect(filteredQuestionsWithA1[0]).toBe('3');
    var filteredQuestionsWithA2 = getHidedElementCodes_1.getHidedElementCodes(mock, getValue({ q: 'a2' }), function () { return false; }, 'show_inputs');
    expect(filteredQuestionsWithA2).toHaveLength(1);
    expect(filteredQuestionsWithA2[0]).toBe('2');
    var filteredQuestionsWithoutAnswer = getHidedElementCodes_1.getHidedElementCodes(mock, getValue({}), function () { return false; }, 'show_inputs');
    expect(filteredQuestionsWithoutAnswer).toHaveLength(2);
    expect(filteredQuestionsWithoutAnswer[0]).toBe('2');
    expect(filteredQuestionsWithoutAnswer[1]).toBe('3');
});
