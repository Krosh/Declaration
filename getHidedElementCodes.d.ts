import { Question, RadioQuestion, SelectQuestion, CheckboxQuestion } from '../types/declaration';
export declare function canHasActionsOnChild(question: Question): question is RadioQuestion | SelectQuestion;
export declare function hasActions(question: Question): question is CheckboxQuestion;
export declare function getHidedElementCodes(questions: Question[], getValue: (code: string) => string, getCurrencyNeedHideValue: (question: Question) => boolean, action: string): string[];
