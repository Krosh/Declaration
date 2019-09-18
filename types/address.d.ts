import { AddressQuestion } from './declaration';
export interface FiasElement {
    name: string;
    code: string;
    type: string;
    description: string;
}
export interface FiasFullAddress {
    city: FiasElement;
    street: FiasElement;
    house: FiasElement;
}
export interface Address {
    fullAddress: FiasFullAddress;
    city: FiasElement;
    street: FiasElement;
    house: FiasElement;
    housing: string;
    flat: string;
    ifnsfl: string;
    ifnsflName: string;
    oktmo: string;
    postal: string;
    description: string;
    userEdited: boolean;
}
export declare type FiasElements = 'city' | 'street' | 'house';
export declare const AddressModel: {
    create: (jsonValue: string | null) => Address;
    serialize: (value: Address) => string;
    changeFiasElement: (oldValue: Address, field: FiasElements, label: string, changeValue: any, isUserEdited: boolean) => {
        fullAddress: FiasFullAddress;
        city: FiasElement;
        street: FiasElement;
        house: FiasElement;
        housing: string;
        flat: string;
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
    validate: (value: string, isTouched: (name: string) => boolean, short: boolean) => {
        fullAddress: string[];
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
