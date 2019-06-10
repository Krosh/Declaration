import { Question } from './types/declaration';
import ValuesKeeper from './values-keeper';
export declare class VisibilityKeeper {
    private visibilityCache;
    private requiredCache;
    private valuesKeeper;
    constructor(valuesKeeper: ValuesKeeper);
    clearVisibility(): void;
    clearRequired(): void;
    getList(name: string, filteredItems: Question[], id: number): Question[];
    getRequiredList(name: string, filteredItems: Question[], id: number): Question[];
}
