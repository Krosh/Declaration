import { Page } from './types/declaration';
import ValuesKeeper from './values-keeper';
export default class TouchKeeper {
    private values;
    valuesKeeper: ValuesKeeper;
    constructor(valuesKeeper: ValuesKeeper);
    touchAllFromPage: (page: Page) => void;
    setTouch: (code: string, id: number, newValue: boolean) => boolean;
    getTouch: (code: string, id?: number | undefined) => boolean;
}
