import { FullyLoadedDeclaration, Page } from './types/declaration';
export default class PageKeeper {
    tabs: string[];
    pages: Page[];
    activePage: Page;
    activeTab: string;
    hidedPagesCodes: string[];
    visiblePages: Page[];
    constructor(schema: FullyLoadedDeclaration, getValue: (code: string) => string);
    setActivePage: (page: Page) => void;
    setActiveTab: (tab: string) => void;
    isActiveTab: (tab: string) => boolean;
    isActivePage: (page: Page) => boolean;
    getActiveTab: () => string;
    getActivePage: () => Page;
    getVisiblePages: () => Page[];
    processChangeValue: (questionCode: string, getValue: (code: string) => string) => void;
    getHidedPagesCodes: (getValue: (code: string) => string) => string[];
}
