import { Question } from './declaration';
declare const createValidator: (questionsMap: {
    [key: string]: Question;
}) => {
    [key: string]: any;
};
export default createValidator;
