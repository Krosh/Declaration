import { AddressQuestion } from './declaration';
export interface FiasElement {
    id: string;
    name: string;
    type: string;
    description: string;
}
export interface FiasFullAddress {
    region: FiasElement;
    area: FiasElement;
    city: FiasElement;
    street: FiasElement;
    house: FiasElement;
    housing: FiasElement;
    flat: FiasElement;
}
export interface Address {
    fullAddressString: string;
    region: FiasElement;
    area: FiasElement;
    city: FiasElement;
    street: FiasElement;
    house: FiasElement;
    housing: FiasElement;
    flat: FiasElement;
    ifnsfl: string;
    ifnsflName: string;
    oktmo: string;
    postal: string;
    description: string;
    userEdited: boolean;
}
export declare type FiasElements = 'region' | 'area' | 'city' | 'street' | 'house' | 'housing' | 'flat';
export declare type ClearableElements = FiasElements;
export declare const AddressModel: {
    create: (jsonValue: string | null) => Address;
    serialize: (value: Address) => string;
    changeFiasElement: (oldValue: Address, field: FiasElements, label: string, changeValue: any, isUserEdited: boolean) => {
        fullAddressString: string;
        region: FiasElement;
        area: FiasElement;
        city: FiasElement;
        street: FiasElement;
        house: FiasElement;
        housing: FiasElement;
        flat: FiasElement;
        ifnsfl: string;
        ifnsflName: string;
        oktmo: string;
        postal: string;
        description: string;
        userEdited: boolean;
    };
    getFullCodeName: (question: AddressQuestion, name: string) => string;
    skipDefault: string[];
    skipOnShort: string[];
    skipRegion: string[];
    skipWithoutIsfnl: string[];
    validate: (value: string, isTouched: (name: string) => boolean, short: boolean, skipRegion: boolean, onlyIfnsfl: boolean) => {
        fullAddressString: string[];
        region: string[];
        area: string[];
        city: string[];
        street: string[];
        house: string[];
        housing: string[];
        flat: string[];
        ifnsfl: string[];
        ifnsflName: string[];
        oktmo: string[];
        postal: string[];
        description: string[];
        userEdited: string[];
    };
};
