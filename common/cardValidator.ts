type CardValidator = {
    validate: Function,
    condition: string
}

type ValidationOutput = {
    valid: boolean,
    msg: string
}

function validateTesco(cardNumber: string): boolean {
    return cardNumber.length === 18 && /^\d+$/.test(cardNumber);
}

const validators = new Map<string, CardValidator>(
    [
        ['tesco', { validate: validateTesco, condition: 'Card number must be 18 digits.' }],
    ]);

function validateStore(store: string) {
    return !!validators.get(store);
}

function validateStoreAndCard(store: string, cardNumber: string): ValidationOutput {
    if (!validateStore(store)) {
        return { valid: false, msg: `Store ${store} not recognized.` };
    }
    const storeCondition = validators.get(store);
    if (!storeCondition.validate(cardNumber)) {
        return { valid: false, msg: `Invalid card number. ${storeCondition.condition}` };
    }
    return { valid: true, msg: 'Card valid' };
}

export { validateStore, validateStoreAndCard };