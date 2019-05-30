import { Question } from './types/declaration';
import ValuesKeeper from './src/values-keeper';
export declare class VisibilityKeeper {
    private cache;
    private valuesKeeper;
    constructor(valuesKeeper: ValuesKeeper);
    clear(): void;
    getList(name: string, filteredItems: Question[], id: number): Question[];
    getRequiredList(name: string, filteredItems: Question[], id: number): Question[];
}
