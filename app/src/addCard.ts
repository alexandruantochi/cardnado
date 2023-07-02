import { validateStoreAndCard } from '../../common/cardValidator';
import { setInfo } from './utils';
import constants from './constants';
import { AddCardRequest } from '../../common/models';

export async function addCard() {
    const store = $(constants.store).val() as string;
    const cardNumber = $(constants.cardNumber).val() as string;
    const validationResult = validateStoreAndCard(store, cardNumber);
    if (validationResult.valid) {
        const addCardRequest: AddCardRequest = {
            store: store,
            cardNumber: cardNumber
        };
        $.post(constants.addCardUrl, JSON.stringify(addCardRequest))
            .done(function (data: any) {
                setInfo(data.message, 'success');
            })
            .fail(function (data: any) {
                setInfo(data.responseJSON.message, 'warning');
            })
    }
    else {
        setInfo(validationResult.msg, 'warning');
    }
}

