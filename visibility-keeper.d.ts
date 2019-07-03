import { Question, QuestionHasAction, ForceValuesAction } from './types/declaration';
import ValuesKeeper from './values-keeper';
export declare class VisibilityKeeper {
    private valuesKeeper;
    private questionsWithForceValues;
    private visibilityCache;
    private requiredCache;
    private questionsCanBeForced;
    constructor(valuesKeeper: ValuesKeeper, questionsWithForceValues: {
        [key: string]: QuestionHasAction<ForceValuesAction>;
    });
    clearVisibility(): void;
    clearRequired(): void;
    getList(name: string, filteredItems: Question[], id: number): Question[];
    getRequiredList(name: string, filteredItems: Question[], id: number): Question[];
}
