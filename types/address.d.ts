import { AddressQuestion } from './declaration';
export interface FiasElement {
    name: string;
    code: string;
    type: string;
}
export interface Address {
    city: FiasElement;
    street: FiasElement;
    house: FiasElement;
    housing: string;
    flat: string;
    ifnsfl: string;
    ifnsflName: string;
    okato: string;
    oktmo: string;
    postal: string;
    userEdited: boolean;
}
export declare type FiasElements = 'city' | 'street' | 'house';
export declare const AddressModel: {
    create: (jsonValue: string | null) => Address;
    serialize: (value: Address) => string;
    changeFiasElement: (oldValue: Address, field: FiasElements, label: string, changeValue: any, isUserEdited: boolean) => {
        city: FiasElement;
        street: FiasElement;
        house: FiasElement;
        housing: string;
        flat: string;
        ifnsfl: string;
        ifnsflName: string;
        okato: string;
        oktmo: string;
        postal: string;
        userEdited: boolean;
    };
    getFullCodeName: (question: AddressQuestion, name: string) => string;
    validate: (value: string, isTouched: (name: string) => boolean) => {
        city: string[];
        street: string[];
        house: string[];
        housing: string[];
        flat: string[];
        ifnsfl: string[];
        ifnsflName: string[];
        okato: string[];
        oktmo: string[];
        postal: string[];
        userEdited: string[];
    };
};
