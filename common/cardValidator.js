function allDigits(cardNumber) {
    return /^\d+$/.test(cardNumber);
}
function validateTesco(cardNumber) {
    const mandatoryFirstDigits = '63400002';
    return cardNumber.startsWith(mandatoryFirstDigits) && cardNumber.length === 18 && allDigits(cardNumber);
}
function validateSuperValu(cardNumber) {
    const mandatoryFirstDigits = '982616';
    return cardNumber.startsWith(mandatoryFirstDigits) && cardNumber.length === 19 && allDigits(cardNumber);
}
const validators = new Map([
    ['tesco', { validate: validateTesco, condition: '18 digits required. Should start with 63400002' }],
    ['supervalu', { validate: validateSuperValu, condition: '19 digits required. Should start with 982616.' }],
]);
function getAvailableStores() {
    return Array.from(validators.keys());
}
function validateStore(store) {
    return !!validators.get(store);
}
function validateStoreAndCard(store, cardNumber) {
    if (!validateStore(store)) {
        return { valid: false, msg: `Store ${store} not recognized.` };
    }
    const storeCondition = validators.get(store);
    if (!storeCondition.validate(cardNumber)) {
        return { valid: false, msg: `Invalid card number. ${storeCondition.condition}` };
    }
    return { valid: true, msg: 'Card valid.' };
}
export { validateStore, validateStoreAndCard, getAvailableStores };
//# sourceMappingURL=cardValidator.js.map