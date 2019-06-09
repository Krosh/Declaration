export interface Validation {
    maxLength?: number;
    canBeSkipped?: boolean;
    oneOf?: string[];
    type?: 'inn' | 'kpp' | 'oktmo';
}
export declare type Action = ShowInputsAction | ShowPagesAction | EnableRequiredAction;
export declare type ShowInputsAction = {
    type: 'show_inputs';
    codes: string[];
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
    value_action: Action;
};
interface BaseQuestion {
    name: string;
    hint: string;
    code: string;
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
export interface CurrencyAutocompleteQuestion extends BaseQuestion {
    type: 'currency_autocomplete';
    action: CurrencyAutocompleteAction;
    needHideElements?: boolean;
}
export interface AddressQuestion extends BaseQuestion {
    type: 'address';
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
export interface SharesQuestion extends BaseQuestion {
    type: 'shares';
}
export interface MoneyIntegerQuestion extends BaseQuestion {
    type: 'money_integer';
}
export declare type SingleQuestion = TextQuestion | AutocompleteQuestion | CurrencyAutocompleteQuestion | AddressQuestion | PhoneQuestion | NumberQuestion | RadioQuestion | DateQuestion | SelectQuestion | CheckboxQuestion | MoneyQuestion | MoneyIntegerQuestion | SharesQuestion | InfoQuestion;
export declare type Question = SingleQuestion | MultipleQuestion;
export declare type QuestionWithAction = {
    action?: Action;
    code: string;
};
export interface Page {
    name: string;
    code: string;
    tab: string;
    id: number;
    questions: Question[];
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
