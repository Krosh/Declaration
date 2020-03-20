import { FullyLoadedDeclaration, MultipleQuestion, Page, Question, SingleQuestion, Values, AddressQuestion, CheckboxQuestion } from './types/declaration';
import { Address } from './types/address';
declare type QuestionsMap = {
    [key: string]: Question;
};
export interface Statistics {
    incomes: Array<{
        name: string;
        value: number;
    }>;
    deductions: Array<{
        name: string;
        value: number;
    }>;
    payments_or_compensations: [{
        to: number;
        from: number;
    }];
}
export interface DataProvider {
    saveAnswer: (questionCode: string, id: number, value: string) => void;
    deleteMultiple: (questionCode: string, id: number) => void;
    copyMultiple: (questionCode: string, id: number, newId: number) => void;
    getStatistics: () => Promise<Statistics>;
}
export interface SingleQuestionProps {
    question: SingleQuestion;
    value: string;
    setActive: () => void;
    setValue: (newValue: string) => void;
    errors: string[];
    getTouched: () => void;
    setTouched: () => void;
    declaration: Declaration;
    setAutocompleteActionIndex: (value: string) => boolean;
}
export interface AddressQuestionProps {
    question: AddressQuestion;
    value: string;
    setValue: (newValue: string) => void;
    errors: {
        [key in keyof Address]: string[];
    };
    setTouched: (name: keyof Address) => void;
    declaration: Declaration;
}
export interface MultipleQuestionProps {
    question: MultipleQuestion;
    ids: number[];
    getTitle: (id: number) => string | undefined;
    getQuestionProps: (question: Question, id: number, checkTouch: boolean) => QuestionProps;
    addMultiple: (questionCode: string, timestamp: number) => void;
    deleteMultiple: (questionCode: string, id: number) => void;
    copyMultiple: (questionCode: string, id: number) => void;
    filterMultipleChilds: (question: MultipleQuestion, id: number) => SingleQuestion[];
}
export declare type QuestionProps = AddressQuestionProps | SingleQuestionProps | MultipleQuestionProps;
export default class Declaration {
    private schema;
    private valuesKeeper;
    private pagesKeeper;
    private dataProvider;
    private validateKeeper;
    isActiveTab: (tab: string) => boolean;
    isActivePage: (page: Page) => boolean;
    getActiveTab: () => string;
    getActivePage: () => Page;
    getVisibleTabs: () => string[];
    getVisiblePages: () => Page[];
    private rerenderCallback?;
    private questionsMap;
    private visibilityKeeper;
    validatePage: (page: Page, checkTouch?: boolean) => string[];
    private touchKeeper;
    getMultipleIds: (code: string) => number[];
    getTitlePage: (tab: string) => Page | undefined;
    getActiveQuestion: () => Question | undefined;
    private statistics;
    getStatistics: () => Statistics | undefined;
    loadStatistics: () => Promise<void>;
    canGoToNextPage: () => boolean;
    canGoToPrevPage: () => boolean;
    goToNextPage: () => void;
    goToPrevPage: () => void;
    getPages: () => Page[];
    touchAll: () => void;
    constructor(schema: FullyLoadedDeclaration, initialValues: Values, dataProvider: DataProvider);
    processShowInputsActions: (schema: FullyLoadedDeclaration) => void;
    private calculateProgress;
    private progress;
    getProgress: () => number;
    calculateQuestionsMap: (schema: FullyLoadedDeclaration) => QuestionsMap;
    setRerenderCallback: (cb: () => void) => void;
    getVisibleQuestionFromPage: (page: Page) => Question[];
    setActivePage: (page: Page) => void;
    setActiveTab: (tab: string) => void;
    filterMutlipleQuestionChilds: (multipleQuestion: MultipleQuestion, id: number) => SingleQuestion[];
    getDefaultMutlipleQuestion: (page: Page) => import("./types/declaration").TextQuestion | import("./types/declaration").AutocompleteQuestion | import("./types/declaration").AutocompleteWithActions | AddressQuestion | import("./types/declaration").InfoQuestion | import("./types/declaration").DateQuestion | import("./types/declaration").PhoneQuestion | import("./types/declaration").OkvedQuestion | import("./types/declaration").PassportQuestion | MultipleQuestion | import("./types/declaration").NumberQuestion | import("./types/declaration").RadioQuestion | import("./types/declaration").SelectQuestion | CheckboxQuestion | import("./types/declaration").MoneyQuestion | import("./types/declaration").MoneyAbroadQuestion | import("./types/declaration").MoneyCourseQuestion | import("./types/declaration").MoneyIntegerQuestion | import("./types/declaration").SharesQuestion | undefined;
    getDefaultCheckboxQuestion: (page: Page) => CheckboxQuestion | undefined;
    isPageEmpty: (page: Page) => boolean;
    /**
     * Вызывать, когда меняем чекбокс,
     * если ставим чекбокс, который показывает страницу, и у этой страницы
     * есть multipleQuestion, и в нем нет вариантов, то добавляем вариант
     */
    private processCheckboxChange;
    getQuestionProps: (question: Question, id: number, checkTouch?: boolean) => QuestionProps;
}
export {};
