import { validateStoreAndCard, availableStore } from '../../../common/cardValidator';
import { setInfo } from './lib/utils';
import constants from './lib/constants';
import { CardDetails } from '../../../common/models';

const checkboxId = '#accept-checkbox';
const checkboxLabelId = '#checkbox-label';
var storeSelector;
var cardNumberInput;
var addCardButton;

export async function addCard() {
    const store = storeSelector.val() as availableStore;
    const cardNumber = cardNumberInput.val() as string;
    const validationResult = validateStoreAndCard(store, cardNumber);
    const checkbox = $(checkboxId);
    const checkboxLabel = $(checkboxLabelId);
    checkboxLabel.removeClass('text-danger');

    if (validationResult.valid) {
        const addCardRequest: CardDetails = {
            store: store,
            cardNumber: cardNumber
        };
        if (checkbox.is(':checked')) {
            $.post(constants.addCardUrl, JSON.stringify(addCardRequest))
                .done(function (data: any) {
                    setInfo(data.message, 'success');
                })
                .fail(function (data: any) {
                    setInfo(data.responseJSON.message, 'warning');
                });
        } else {
            setInfo('Please accept sharing this.', 'warning');
            checkboxLabel.addClass('text-danger');
        }

    }
    else {
        setInfo(validationResult.msg, 'warning');
    }
}

$(function () {
    storeSelector = $('#store-selector');
    cardNumberInput = $('#card-number');
    addCardButton = $('#add-card');
    addCardButton.on('click', () => {
        addCard();
    })
})