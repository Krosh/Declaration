import { FullyLoadedDeclaration, Page, Question } from './types/declaration';
export default class PageKeeper {
    tabs: string[];
    pages: Page[];
    activePage: Page;
    activeTab: string;
    hidedPagesCodes: string[];
    visiblePages: Page[];
    activeQuestion: Question | undefined;
    constructor(schema: FullyLoadedDeclaration, getValue: (code: string) => string);
    setActiveQuestion: (question: Question) => void;
    getActiveQuestion: () => import("./types/declaration").TextQuestion | import("./types/declaration").AutocompleteQuestion | import("./types/declaration").AutocompleteWithActions | import("./types/declaration").AddressQuestion | import("./types/declaration").InfoQuestion | import("./types/declaration").DateQuestion | import("./types/declaration").PhoneQuestion | import("./types/declaration").OkvedQuestion | import("./types/declaration").MultipleQuestion | import("./types/declaration").NumberQuestion | import("./types/declaration").RadioQuestion | import("./types/declaration").SelectQuestion | import("./types/declaration").CheckboxQuestion | import("./types/declaration").MoneyQuestion | import("./types/declaration").MoneyAbroadQuestion | import("./types/declaration").MoneyCourseQuestion | import("./types/declaration").MoneyIntegerQuestion | import("./types/declaration").SharesQuestion | undefined;
    setActivePage: (page: Page) => void;
    setActiveTab: (tab: string) => void;
    getTitlePage: (tab: string) => Page | undefined;
    isActiveTab: (tab: string) => boolean;
    isActivePage: (page: Page) => boolean;
    getActiveTab: () => string;
    getActivePage: () => Page;
    canGoToNextPage: () => boolean;
    canGoToPrevPage: () => boolean;
    getNextPage: () => Page | undefined;
    getPrevPage: () => Page | undefined;
    private getVisiblePages;
    processChangeValue: (questionCode: string, getValue: (code: string) => string) => void;
    private getHidedPagesCodes;
}
