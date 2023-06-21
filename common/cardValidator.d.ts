declare class Validator {
    canValidate: boolean;
    validate: Function;
    condition: string;
    constructor(store: string);
}
export default Validator;
