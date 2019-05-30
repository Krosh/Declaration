import { Question } from './types/declaration';
export declare const getVisibleQuestions: (questions: Question[], getValue: (code: string, id: number) => string, getCurrencyNeedHideValue: (quesiton: Question, id: number) => boolean, id: number) => Question[];
export declare const getRequiredQuestions: (questions: Question[], getValue: (code: string, id: number) => string, getCurrencyNeedHideValue: (quesiton: Question, id: number) => boolean, id: number) => Question[];
