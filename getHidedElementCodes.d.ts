import { Question, RadioQuestion, SelectQuestion, CheckboxQuestion, AutocompleteWithActions } from './types/declaration';
export declare function canHasActionsOnChild(question: Question): question is RadioQuestion | SelectQuestion;
export declare function hasActionsOnChild(question: Question): boolean;
export declare function isAutocompleteWithActions(question: Question): question is AutocompleteWithActions;
export declare function hasActions(question: Question): question is CheckboxQuestion;
export declare function hasForceValueAction(question: Question): question is RadioQuestion;
export declare function getHidedElementCodes(questions: Question[], getValue: (code: string) => string, getAutocompleteValueActionIndex: (question: Question) => string | undefined, action: 'show_inputs' | 'show_pages' | 'enable_required'): string[];
