function validateTesco(cardNumber: string): boolean {
    return cardNumber.length === 18 && /^\d+$/.test(cardNumber);
}

type CardValidator = {
    validate: Function,
    condition: string
}

const validators = new Map<string, CardValidator>(
    [
        ['tesco', { validate: validateTesco, condition: 'Card nubmer must be 18 digits.'}],
    ]);


class Validator {
    
    canValidate : boolean
    validate : Function;
    condition : string;

    constructor(store: string) {
        const validator = validators.get(store);
        this.canValidate = !!validator;
        if(this.canValidate) {
            this.validate = validator.validate;
            this.condition = validator.condition;
        } else {
            this.validate = () => false;
            this.condition = 'Store name not recognized';
        }
    }
}

export default Validator;