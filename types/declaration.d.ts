export interface Validation {
    shortAnswer?: boolean;
    maxLength?: number;
    canBeSkipped?: boolean;
    oneOf?: string[];
    bikName?: string;
    type?: 'inn' | 'kpp' | 'oktmo' | 'year' | 'phone' | 'okved' | 'bik' | 'correspondent_account' | 'client_account';
}
export declare type Action = ShowInputsAction | ShowPagesAction | EnableRequiredAction | ForceValuesAction;
export declare type ShowInputsAction = {
    type: 'show_inputs';
    codes: string[];
};
export declare type ForceValuesAction = {
    type: 'force_values';
    value: string;
    data: {
        [questionCode: string]: string;
    };
};
export declare type ShowPagesAction = {
    type: 'show_pages';
    codes: string[];
};
export declare type EnableRequiredAction = {
    type: 'enable_required';
    codes: string[];
};
export declare type AutocompleteAction = {
    action_type: string;
    url: string;
};
export declare type CurrencyAutocompleteAction = AutocompleteAction & {
    value_action: {
        [key: string]: Action;
    };
};
interface BaseQuestion {
    name: string;
    hint: string;
    code: string;
    page: Page;
    parent_code?: string | null;
    validation?: Validation;
}
export interface TextQuestion extends BaseQuestion {
    type: 'text';
}
export interface AutocompleteQuestion extends BaseQuestion {
    type: 'autocomplete';
    action: AutocompleteAction;
}
export interface AutocompleteWithActions extends BaseQuestion {
    type: 'autocomplete_with_actions';
    action: CurrencyAutocompleteAction;
    activeValueAction?: string;
}
export interface AddressQuestion extends BaseQuestion {
    type: 'address';
    validation?: Validation;
}
export interface InfoQuestion extends BaseQuestion {
    type: 'info';
}
export interface DateQuestion extends BaseQuestion {
    type: 'date';
}
export interface PhoneQuestion extends BaseQuestion {
    type: 'phone';
}
export interface OkvedQuestion extends BaseQuestion {
    type: 'okved';
}
export interface AnswerQuestion extends BaseQuestion {
    action?: Action;
}
export interface MultipleQuestion extends BaseQuestion {
    type: 'multiple';
    answers: SingleQuestion[];
}
export interface RadioQuestion extends BaseQuestion {
    type: 'radio';
    answers: AnswerQuestion[];
    action?: ForceValuesAction;
}
export interface CheckboxQuestion extends BaseQuestion {
    type: 'checkbox';
    action?: Action;
}
export interface SelectQuestion extends BaseQuestion {
    type: 'select';
    answers: AnswerQuestion[];
}
export interface NumberQuestion extends BaseQuestion {
    type: 'number';
}
export interface MoneyQuestion extends BaseQuestion {
    type: 'money';
}
export interface MoneyAbroadQuestion extends BaseQuestion {
    type: 'money_abroad';
}
export interface MoneyCourseQuestion extends BaseQuestion {
    type: 'money_course';
}
export interface SharesQuestion extends BaseQuestion {
    type: 'shares';
}
export interface MoneyIntegerQuestion extends BaseQuestion {
    type: 'money_integer';
}
export declare type SingleQuestion = TextQuestion | AutocompleteQuestion | AutocompleteWithActions | AddressQuestion | PhoneQuestion | NumberQuestion | RadioQuestion | DateQuestion | SelectQuestion | CheckboxQuestion | MoneyQuestion | OkvedQuestion | MoneyAbroadQuestion | MoneyCourseQuestion | MoneyIntegerQuestion | SharesQuestion | InfoQuestion;
export declare type Question = SingleQuestion | MultipleQuestion;
export declare type QuestionHasAction<A extends Action> = Question & {
    action: A;
};
export declare type QuestionWithAction = {
    action?: Action;
    code: string;
};
export interface Page {
    name: string;
    code: string;
    tab: string;
    type?: 'income' | 'deduction' | 'statement' | 'total' | 'files';
    id: number;
    questions: Question[];
    is_title: boolean;
}
export interface Declaration {
    name: string;
    id: number;
    code: string;
}
export interface FullyLoadedDeclaration extends Declaration {
    pages: Page[];
}
export declare function processAnswers(answers: any): any;
export declare function processData(data: any): any;
export declare type Values = {
    [key: string]: {
        [id: number]: string;
    };
};
export {};
