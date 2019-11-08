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
    flat: string;
}
export interface Address {
    region: FiasElement;
    area: FiasElement;
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
export declare type FiasElements = 'region' | 'area' | 'city' | 'street' | 'house';
export declare type ClearableElements = FiasElements | 'flat';
export declare const AddressModel: {
    create: (jsonValue: string | null) => Address;
    serialize: (value: Address) => string;
    changeFiasElement: (oldValue: Address, field: FiasElements, label: string, changeValue: any, isUserEdited: boolean) => {
        region: FiasElement;
        area: FiasElement;
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
