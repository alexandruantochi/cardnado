import { validateStoreAndCard, availableStore } from '../../../common/cardValidator';
import { getDomElement, setInfo } from './lib/utils';
import constants from './lib/constants';
import { CardDetails } from '../../../common/models';

const checkboxId = '#accept-checkbox';
const checkboxLabelId = '#checkbox-label';
var storeSelector : HTMLSelectElement;
var cardNumberInput: HTMLInputElement;
var addCardButton : HTMLButtonElement;

export async function addCard() {
    const store = storeSelector.value as availableStore;
    const cardNumber = cardNumberInput.value as string;
    const validationResult = validateStoreAndCard(store, cardNumber);
    const checkbox = getDomElement(checkboxId) as HTMLInputElement;
    const checkboxLabel = getDomElement(checkboxLabelId) as HTMLLabelElement;
    checkboxLabel.classList.remove('text-danger');

    if (validationResult.valid) {
        const addCardRequest: CardDetails = {
            store: store,
            cardNumber: cardNumber
        };

        if (checkbox.checked) {
            fetch(constants.addCardUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(addCardRequest),
            })
                .then(response => response.json())
                .then((data: any) => {
                    setInfo(data.message, 'success');
                })
                .catch((error: any) => {
                    setInfo(error.responseJSON?.message || 'An error occurred', 'warning');
                });
        } else {
            setInfo('Please accept sharing this.', 'warning');
            checkboxLabel.classList.add('text-danger');
        }

    }
    else {
        setInfo(validationResult.msg, 'warning');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    storeSelector = getDomElement('#store-selector') as HTMLSelectElement;
    cardNumberInput = getDomElement('#card-number') as HTMLInputElement;
    addCardButton = getDomElement('#add-card') as HTMLButtonElement;

    addCardButton.addEventListener('click', () => {
        addCard();
    });
});