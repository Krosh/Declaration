import { Values, Question, ForceValuesAction, QuestionHasAction } from './types/declaration';
import { DataProvider } from '.';
export default class ValuesKeeper {
    private values;
    private dataProvider;
    private questionsWithForceValues;
    private enabledCurrencies;
    questionsCanBeForced: string[];
    constructor(values: Values, dataProvider: DataProvider, questionsWithForceValues: {
        [key: string]: QuestionHasAction<ForceValuesAction>;
    });
    processCurrencyQuestion: (question: Question, id: number, showCourseInput: boolean) => boolean;
    getCurrencyQuestion: (question: Question, id: number) => boolean;
    setValue: (code: string, id: number, newValue: string) => boolean;
    getMultipleIds: (code: string) => number[];
    getValue: (code: string, id?: number | undefined) => string;
    addMultiple: (questionCode: string, timestamp: number) => void;
    deleteMultiple: (questionCode: string, id: number) => void;
    copyMultiple: (questionCode: string, id: number) => void;
}
