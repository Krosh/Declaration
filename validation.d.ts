import { Validation } from './types/declaration';
declare const validate: (questionCode: string, qValidation: Validation | undefined, getValue: (questionCode: string) => string, requiredFromAction: boolean) => string[];
export default validate;
