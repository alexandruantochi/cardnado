type CardValidator = {
    validate: Function,
    condition: string
}

type ValidationOutput = {
    valid: boolean,
    msg: string
}

type availableStore = 'tesco' | 'supervalu';

function allDigits(cardNumber: string): boolean {
    return /^\d+$/.test(cardNumber);
}

function validateTesco(cardNumber: string): boolean {
    const mandatoryFirstDigits = '63400002';
    return cardNumber.startsWith(mandatoryFirstDigits) && cardNumber.length === 18 && allDigits(cardNumber);
}

function validateSuperValu(cardNumber: string): boolean {
    const mandatoryFirstDigits = '982616';
    return cardNumber.startsWith(mandatoryFirstDigits) && cardNumber.length === 19 && allDigits(cardNumber);
}

const validators = new Map<availableStore, CardValidator>(
    [
        ['tesco', { validate: validateTesco, condition: '18 digits required. Should start with 63400002' }],
        ['supervalu', { validate: validateSuperValu, condition: '19 digits required. Should start with 982616.' }],
    ]);

function getAvailableStores() : availableStore[] {
    return Array.from(validators.keys());
}

function validateStore(store: availableStore) : boolean {
    return !!validators.get(store);
}

function validateStoreAndCard(store: availableStore, cardNumber: string): ValidationOutput {
    if (!validateStore(store)) {
        return { valid: false, msg: `Store ${store} not recognized.` };
    }
    const storeCondition = validators.get(store);
    if (!storeCondition.validate(cardNumber)) {
        return { valid: false, msg: `Invalid card number. ${storeCondition.condition}` };
    }
    return { valid: true, msg: 'Card valid.' };
}

export { validateStore, validateStoreAndCard, getAvailableStores, availableStore };