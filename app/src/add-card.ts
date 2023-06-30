import { validateStoreAndCard } from '../../common/cardValidator';
import constants from './constants';
import { AddCardReply, AddCardRequest } from '../../common/models';

const alert = '#alert';
const store = '#store';
const cardNumber = '#card-number';

type infoType = 'warning' | 'success' | 'default';
type alertClasses = "alert alert-warning" | "alert alert-success" | "alert";


const alertClassMapping = new Map<infoType, alertClasses>([
    ['warning', 'alert alert-warning'],
    ['success', 'alert alert-success'],
    ['default', 'alert']
]);


function setInfo(text: string, infoType: infoType) {
    const infoElement = $(alert);
    infoElement.text(text);
    infoElement.removeClass().addClass(alertClassMapping.get(infoType));
}

export async function addCard() {
    const store = $('#store').val() as string;
    const cardNumber = $('#card-number').val() as string;
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

