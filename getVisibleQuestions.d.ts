import { Question } from './types/declaration';
export declare const getVisibleQuestions: (questions: Question[], getValue: (code: string, id: number) => string, getNeedHideValue: (question: Question, id: number) => string | undefined, id: number) => Question[];
export declare const getRequiredQuestions: (questions: Question[], getValue: (code: string, id: number) => string, getNeedHideValue: (question: Question, id: number) => string | undefined, id: number) => Question[];
