import ValuesKeeper from './values-keeper';
import { Question, Page } from './types/declaration';
import TouchKeeper from './touch-keeper';
import { VisibilityKeeper } from './visibility-keeper';
export default class ValidateKeeper {
    private valuesKeeper;
    private touchKeeper;
    private visibilityKeeper;
    private cache;
    constructor(valuesKeeper: ValuesKeeper, touchKeeper: TouchKeeper, visibilityKeeper: VisibilityKeeper);
    private getErrors;
    private getPageErrors;
    private getCacheName;
    refreshQuestionCache(question: Question, id: number): void;
    validateQuestion(question: Question, id: number): any;
    validatePage: (page: Page) => any[];
}
