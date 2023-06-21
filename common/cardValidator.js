"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function validateTesco(cardNumber) {
    return cardNumber.length === 18 && /^\d+$/.test(cardNumber);
}
const validators = new Map([
    ['tesco', { validate: validateTesco, condition: 'Card nubmer must be 18 digits.' }],
]);
class Validator {
    constructor(store) {
        const validator = validators.get(store);
        this.canValidate = !!validator;
        if (this.canValidate) {
            this.validate = validator.validate;
            this.condition = validator.condition;
        }
        else {
            this.validate = () => false;
            this.condition = 'Store name not recognized';
        }
    }
}
exports.default = Validator;
//# sourceMappingURL=cardValidator.js.map